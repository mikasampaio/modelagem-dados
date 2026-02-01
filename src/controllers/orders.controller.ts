import type { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { QueryDTO } from "@/dtos/commons.dtos";
import type { CreateOrderDTO, UpdateOrderDTO } from "@/dtos/orders.dtos";
import type { BodyRequest, QueryRequest } from "@/interfaces/commons.interface";
import type { OrderService } from "@/services/orders.services";

export class OrdersController {
  constructor(private ordersService: OrderService) {}

  create = async (
    req: BodyRequest<CreateOrderDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { customerId, items } = req.body;
      const response = await this.ordersService.create({
        customerId,
        items,
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

      const response = await this.ordersService.get({
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

      const response = await this.ordersService.getById(id as string);

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  cancel = async (
    req: QueryRequest<QueryDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.query;

      const response = await this.ordersService.cancel(id as string);

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
