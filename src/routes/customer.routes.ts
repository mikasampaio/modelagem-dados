import { Router } from "express";
import { CustomersController } from "@/controllers/customers.controller";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "@/dtos/customers.dtos";
import customerFactory from "@/factories/customer.factory";
import { QueryParams, validator } from "@/middlewares/validator.middleware";

export const customerRoutes = Router();

const customerController = new CustomersController(
  customerFactory.getService(),
);

customerRoutes.post(
  "/",
  validator({
    schema: createCustomerSchema,
    type: QueryParams.BODY,
  }),
  customerController.create,
);

customerRoutes.get("/", (req, res, next) => {
  if (req.query.id) return customerController.getById(req, res, next);
  return customerController.get(req, res, next);
});

customerRoutes.put(
  "/",
  validator({
    schema: updateCustomerSchema,
    type: QueryParams.BODY,
  }),
  customerController.update,
);

customerRoutes.delete("/", customerController.delete);
