import { CategoriesRepository } from "@/database/repositories/categories.repository";
import { ProductsRepository } from "@/database/repositories/products.repository";
import { PrismaClient } from "@/generated/prisma/client";
import { ProductService } from "@/services/products.services";

const productFactory = (() => {
  let productService: ProductService;

  return {
    getService: (): ProductService => {
      if (!productService) {
        const productRepository = new ProductsRepository(new PrismaClient());
        const categoryRepository = new CategoriesRepository(new PrismaClient());

        productService = new ProductService(
          productRepository,
          categoryRepository,
        );
      }

      return productService;
    },
  };
})();

export default productFactory;
