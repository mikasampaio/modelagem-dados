import { StatusCodes } from "http-status-codes";
import type { CustomersRepository } from "@/database/repositories/customers.repository";
import type { QueryDTO } from "@/dtos/commons.dtos";
import { ErrorMessage } from "@/errors";
import type { Customer, Prisma } from "@/generated/prisma/client";
import type { IGetResponse } from "@/interfaces/commons.interface";

export class CustomerService {
  constructor(private customerRepository: CustomersRepository) {}

  async create({
    email,
    phone,
    ...props
  }: Prisma.CustomerCreateInput): Promise<Customer> {
    const foundEmail = await this.customerRepository.getByEmail(email);

    if (foundEmail) {
      throw new ErrorMessage(
        "Customer with this email already exists.",
        StatusCodes.BAD_REQUEST,
      );
    }

    const foundPhone = await this.customerRepository.getByPhone(phone);

    if (foundPhone) {
      throw new ErrorMessage(
        "Customer with this phone already exists.",
        StatusCodes.BAD_REQUEST,
      );
    }

    return await this.customerRepository.create({ email, phone, ...props });
  }

  async get(params: QueryDTO): Promise<IGetResponse<Customer>> {
    return await this.customerRepository.get(params);
  }

  async getById(id: string): Promise<Customer | null> {
    const customer = await this.customerRepository.getById(id);

    if (!customer) {
      throw new ErrorMessage("Customer not found.", StatusCodes.NOT_FOUND);
    }

    return customer;
  }

  async update(
    id: string,
    data: Prisma.CustomerUpdateInput,
  ): Promise<Customer> {
    const customer = await this.customerRepository.getById(id);

    if (!customer) {
      throw new ErrorMessage("Customer not found.", StatusCodes.NOT_FOUND);
    }

    if (data.email && data.email !== customer.email) {
      const foundCustomer = await this.customerRepository.getByEmail(
        data.email as string,
      );

      if (foundCustomer) {
        throw new ErrorMessage(
          "Customer with this email already exists.",
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    if (data.phone && data.phone !== customer.phone) {
      const foundCustomer = await this.customerRepository.getByPhone(
        data.phone as string,
      );

      if (foundCustomer) {
        throw new ErrorMessage(
          "Customer with this phone already exists.",
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    return await this.customerRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const customer = await this.customerRepository.getById(id);

    if (!customer) {
      throw new ErrorMessage("Customer not found.", StatusCodes.NOT_FOUND);
    }

    return await this.customerRepository.delete(id);
  }
}
