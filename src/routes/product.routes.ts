import { Router } from "express";
import { ProductsController } from "@/controllers/products.controller";
import { createProductSchema, updateProductSchema } from "@/dtos/products.dtos";
import productFactory from "@/factories/product.factory";
import { QueryParams, validator } from "@/middlewares/validator.middleware";

export const productRoutes = Router();

const productController = new ProductsController(productFactory.getService());

productRoutes.post(
  "/",
  validator({
    type: QueryParams.BODY,
    schema: createProductSchema,
  }),
  productController.create,
);

productRoutes.get("/", (req, res, next) => {
  if (req.query.id) return productController.getById(req, res, next);
  return productController.get(req, res, next);
});

productRoutes.put(
  "/update",
  validator({
    type: QueryParams.BODY,
    schema: updateProductSchema,
  }),
  productController.update,
);

productRoutes.delete("/delete", productController.delete);
