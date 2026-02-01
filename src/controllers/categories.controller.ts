import type { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/dtos/categories.dtos";
import type { QueryDTO } from "@/dtos/commons.dtos";
import type { BodyRequest, QueryRequest } from "@/interfaces/commons.interface";
import type { CategoryService } from "@/services/categories.services";

export class CategoriesController {
  constructor(private categoriesService: CategoryService) {}

  create = async (
    req: BodyRequest<CreateCategoryDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, description } = req.body;
      const response = await this.categoriesService.create({
        name,
        description,
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

      const response = await this.categoriesService.get({
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

      const response = await this.categoriesService.getById(id as string);

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: BodyRequest<UpdateCategoryDTO & { id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.query;
      const { name, description } = req.body;

      const response = await this.categoriesService.update(id as string, {
        name,
        description,
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

      const response = await this.categoriesService.delete(id as string);

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
