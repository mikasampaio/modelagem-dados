import { StatusCodes } from "http-status-codes";
import type { OrdersRepository } from "@/database/repositories/orders.repository";
import type { QueryDTO } from "@/dtos/commons.dtos";
import type { CreateOrderDTO } from "@/dtos/orders.dtos";
import { ErrorMessage } from "@/errors";
import { type Order, OrderStatus } from "@/generated/prisma/client";
import type { IGetResponse } from "@/interfaces/commons.interface";

export class OrderService {
  constructor(private orderRepository: OrdersRepository) {}

  async create({ customerId, items }: CreateOrderDTO): Promise<Order> {
    return this.orderRepository.transaction(async (tx) => {
      // 1. Valida cliente
      const customer = await tx.customer.findFirst({
        where: {
          id: customerId,
          OR: [{ status: null }, { status: { is: { deletedAt: null } } }],
        },
      });

      if (!customer) {
        throw new ErrorMessage("Customer not found.", StatusCodes.NOT_FOUND);
      }

      // 2. Busca todos os produtos de uma vez
      const productIds = items.map((item) => item.productId);

      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      // 3. Validação de existência e estoque
      const orderItems = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);

        if (!product) {
          throw new ErrorMessage(
            `Product with ID ${item.productId} not found.`,
            StatusCodes.NOT_FOUND,
          );
        }

        if (product.stock < item.quantity) {
          throw new ErrorMessage(
            `Insufficient stock for product ${product.name}. Available: ${product.stock}, requested: ${item.quantity}.`,
            StatusCodes.BAD_REQUEST,
          );
        }

        return {
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        };
      });

      // 4. Calcula total do pedido
      const totalAmount = orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      // 5. Cria o pedido
      const order = await this.orderRepository.create(
        {
          customer: { connect: { id: customerId } },
          items: { create: orderItems },
          totalAmount,
          orderDate: new Date(),
        },
        tx,
      );

      for (const item of items) {
        await tx.product.update({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return order;
    });
  }

  async get(params: QueryDTO): Promise<IGetResponse<Order>> {
    return await this.orderRepository.get(params);
  }

  async getById(id: string): Promise<Order | null> {
    const order = await this.orderRepository.getById(id);

    if (!order) {
      throw new ErrorMessage("Order not found.", StatusCodes.NOT_FOUND);
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.getById(id);

    if (!order) {
      throw new ErrorMessage("Order not found.", StatusCodes.NOT_FOUND);
    }

    if (order.orderStatus === OrderStatus.CANCELLED) {
      throw new ErrorMessage(
        "Cannot update status of a canceled order.",
        StatusCodes.BAD_REQUEST,
      );
    }

    if (order.orderStatus === OrderStatus.DELIVERED) {
      throw new ErrorMessage(
        "Cannot update status of a delivered order.",
        StatusCodes.BAD_REQUEST,
      );
    }

    return await this.orderRepository.update(id, { orderStatus: status });
  }

  async cancel(id: string): Promise<void> {
    const order = await this.orderRepository.getById(id);

    if (!order) {
      throw new ErrorMessage("Order not found.", StatusCodes.NOT_FOUND);
    }

    if (order.orderStatus === OrderStatus.CANCELLED) {
      throw new ErrorMessage(
        "Order is already canceled.",
        StatusCodes.BAD_REQUEST,
      );
    }

    if (order.orderStatus === OrderStatus.DELIVERED) {
      throw new ErrorMessage(
        "Delivered orders cannot be canceled.",
        StatusCodes.BAD_REQUEST,
      );
    }

    return await this.orderRepository.transaction(async (tx) => {
      // Restaura o estoque dos produtos do pedido
      const orderItems = await tx.orderItem.findMany({
        where: { orderId: id },
      });

      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return await this.orderRepository.cancel(id, tx);
    });
  }
}
