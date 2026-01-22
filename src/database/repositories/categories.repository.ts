import type { QueryDTO } from "@/dtos/commons.dtos";
import type { Category, Prisma, PrismaClient } from "@/generated/prisma/client";
import type { IGetResponse } from "@/interfaces/commons.interface";

export class CategoriesRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return await this.prisma.category.create({
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
  }: QueryDTO): Promise<IGetResponse<Category>> {
    const whereParams: Prisma.CategoryWhereInput = {
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    };

    const [results, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where: whereParams,
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        orderBy: {
          name: "asc",
        },
      }),
      this.prisma.category.count({
        where: whereParams,
      }),
    ]);

    return {
      results,
      total,
    };
  }

  async getById(id: string): Promise<Category | null> {
    return await this.prisma.category.findFirst({
      where: {
        id,
      },
    });
  }

  async getByName(name: string): Promise<Category | null> {
    return await this.prisma.category.findFirst({
      where: { name },
    });
  }

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    return await this.prisma.category.update({
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
    await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
