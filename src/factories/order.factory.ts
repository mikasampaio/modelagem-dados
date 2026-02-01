import { OrdersRepository } from "@/database/repositories/orders.repository";
import { PrismaClient } from "@/generated/prisma/client";
import { OrderService } from "@/services/orders.services";

const orderFactory = (() => {
  let orderService: OrderService;

  return {
    getService: (): OrderService => {
      if (!orderService) {
        const orderRepository = new OrdersRepository(new PrismaClient());

        orderService = new OrderService(orderRepository);
      }

      return orderService;
    },
  };
})();

export default orderFactory;
