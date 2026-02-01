import { Router } from "express";
import { OrdersController } from "@/controllers/orders.controller";
import { createOrderSchema } from "@/dtos/orders.dtos";
import orderFactory from "@/factories/order.factory";
import { QueryParams, validator } from "@/middlewares/validator.middleware";

export const orderRoutes = Router();

const orderController = new OrdersController(orderFactory.getService());

orderRoutes.post(
  "/",
  validator({
    type: QueryParams.BODY,
    schema: createOrderSchema,
  }),
  orderController.create,
);

orderRoutes.get("/", (req, res, next) => {
  if (req.query.id) return orderController.getById(req, res, next);
  return orderController.get(req, res, next);
});

orderRoutes.delete("/cancel", orderController.cancel);
