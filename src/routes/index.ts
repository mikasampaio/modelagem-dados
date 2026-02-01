import { Router } from "express";
import { categoryRoutes } from "@/routes/category.routes";
import { customerRoutes } from "@/routes/customer.routes";
import { orderRoutes } from "@/routes/order.routes";
import { productRoutes } from "@/routes/product.routes";

export const routes = Router();

routes.use("/health", (req, res) => {
  res.send("Welcome to the API!");
});
routes.use("/products", productRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/customers", customerRoutes);
routes.use("/orders", orderRoutes);
