import type { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { QueryDTO } from "@/dtos/commons.dtos";
import type {
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from "@/dtos/customers.dtos";
import type { BodyRequest, QueryRequest } from "@/interfaces/commons.interface";
import type { CustomerService } from "@/services/customers.services";

export class CustomersController {
  constructor(private customerService: CustomerService) {}

  create = async (
    req: BodyRequest<CreateCustomerDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, email, phone } = req.body;
      const response = await this.customerService.create({
        name,
        email,
        phone,
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

      const response = await this.customerService.get({
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

      const response = await this.customerService.getById(id as string);

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: BodyRequest<UpdateCustomerDTO & { id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.query;
      const { name, email, phone } = req.body;

      const response = await this.customerService.update(id as string, {
        name,
        email,
        phone,
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

      const response = await this.customerService.delete(id as string);

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
