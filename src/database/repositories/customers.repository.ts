import type { QueryDTO } from "@/dtos/commons.dtos";
import type { Customer, Prisma, PrismaClient } from "@/generated/prisma/client";
import type { IGetResponse } from "@/interfaces/commons.interface";

export class CustomersRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Prisma.CustomerCreateInput): Promise<Customer> {
    return await this.prisma.customer.create({
      data: {
        ...data,
        status: {
          createdAt: new Date(),
        },
      },
    });
  }

  async get({
    page,
    pageSize,
    search,
  }: QueryDTO): Promise<IGetResponse<Customer>> {
    const whereParams: Prisma.CustomerWhereInput = {
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    };

    const [results, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where: whereParams,
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        orderBy: {
          name: "asc",
        },
      }),
      this.prisma.customer.count({
        where: whereParams,
      }),
    ]);

    return {
      results,
      total,
    };
  }

  async getById(id: string): Promise<Customer | null> {
    return await this.prisma.customer.findFirst({
      where: {
        id,
      },
    });
  }

  async getByEmail(email: string): Promise<Customer | null> {
    return await this.prisma.customer.findFirst({
      where: { email },
    });
  }

  async getByPhone(phone: string): Promise<Customer | null> {
    return await this.prisma.customer.findFirst({
      where: { phone },
    });
  }

  async update(
    id: string,
    data: Prisma.CustomerUpdateInput,
  ): Promise<Customer> {
    return await this.prisma.customer.update({
      where: {
        id,
      },
      data: {
        ...data,
        status: {
          updatedAt: new Date(),
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.delete({
      where: {
        id,
      },
    });
  }
}
