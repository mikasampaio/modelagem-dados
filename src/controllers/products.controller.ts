import type { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { QueryDTO } from "@/dtos/commons.dtos";
import type { CreateProductDTO, UpdateProductDTO } from "@/dtos/products.dtos";
import type { BodyRequest, QueryRequest } from "@/interfaces/commons.interface";
import type { ProductService } from "@/services/products.services";

export class ProductsController {
  constructor(private productsService: ProductService) {}

  create = async (
    req: BodyRequest<CreateProductDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, description, price, categoryId, stock } = req.body;
      const response = await this.productsService.create({
        name,
        description,
        price,
        categoryId,
        stock,
      });

      return res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  get = async (
    req: QueryRequest<QueryDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page = 1, pageSize = 10, search } = req.query;

      const response = await this.productsService.get({
        page,
        pageSize,
        search,
      });

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: QueryRequest<QueryDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.query;

      const response = await this.productsService.getById(id as string);

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: BodyRequest<UpdateProductDTO & { id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.query;
      const { name, description, price, categoryId, stock } = req.body;

      const response = await this.productsService.update(id as string, {
        name,
        description,
        price,
        categoryId,
        stock,
      });

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: QueryRequest<QueryDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.query;

      const response = await this.productsService.delete(id as string);

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
