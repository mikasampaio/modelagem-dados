import type { QueryDTO } from "@/dtos/commons.dtos";
import type { OrderParamsDTO } from "@/dtos/orders.dtos";
import {
  type Order,
  OrderStatus,
  type Prisma,
  type PrismaClient,
} from "@/generated/prisma/client";
import type { IGetResponse } from "@/interfaces/commons.interface";

export class OrdersRepository {
  constructor(private prisma: PrismaClient) {}

  async transaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }

  async create(
    data: Prisma.OrderCreateInput,
    prisma: PrismaClient = this.prisma,
  ): Promise<Order> {
    return prisma.order.create({
      data: {
        ...data,
        orderStatus: OrderStatus.PENDING,
        status: {
          createdAt: new Date(),
        },
      },
    });
  }

  async get({
    customerId,
    orderDate,
    page,
    pageSize,
  }: OrderParamsDTO & QueryDTO): Promise<IGetResponse<Order>> {
    const [results, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: {
          customerId,
          orderDate,
        },
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        orderBy: {
          orderDate: "desc",
        },
      }),
      this.prisma.order.count(),
    ]);

    return {
      results,
      total,
    };
  }

  async getById(id: string): Promise<Order | null> {
    return await this.prisma.order.findFirst({
      where: {
        id,
      },
    });
  }

  async update(id: string, data: Prisma.OrderUpdateInput): Promise<Order> {
    return await this.prisma.order.update({
      where: {
        id,
      },
      data: {
        ...data,
        status: {
          updatedAt: new Date(),
        },
      },
    });
  }

  async cancel(id: string, prisma: PrismaClient = this.prisma): Promise<void> {
    await prisma.order.update({
      where: {
        id,
      },
      data: {
        orderStatus: OrderStatus.CANCELED,
        status: {
          deletedAt: new Date(),
        },
      },
    });
  }
}
