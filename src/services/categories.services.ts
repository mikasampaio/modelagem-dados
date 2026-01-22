import { StatusCodes } from "http-status-codes";
import type { CategoriesRepository } from "@/database/repositories/categories.repository";
import type { QueryDTO } from "@/dtos/commons.dtos";
import { ErrorMessage } from "@/errors";
import type { Category, Prisma } from "@/generated/prisma/client";
import type { IGetResponse } from "@/interfaces/commons.interface";

export class CategoryService {
  constructor(private categoryRepository: CategoriesRepository) {}

  async create({
    name,
    description,
  }: Prisma.CategoryCreateInput): Promise<Category> {
    const foundCategory = await this.categoryRepository.getByName(name);

    if (foundCategory) {
      throw new ErrorMessage(
        "Category with this name already exists.",
        StatusCodes.BAD_REQUEST,
      );
    }

    return await this.categoryRepository.create({ name, description });
  }

  async get(params: QueryDTO): Promise<IGetResponse<Category>> {
    return await this.categoryRepository.get(params);
  }

  async getById(id: string): Promise<Category | null> {
    const category = await this.categoryRepository.getById(id);

    if (!category) {
      throw new ErrorMessage("Category not found.", StatusCodes.NOT_FOUND);
    }

    return category;
  }

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    const category = await this.categoryRepository.getById(id);

    if (!category) {
      throw new ErrorMessage("Category not found.", StatusCodes.NOT_FOUND);
    }

    if (data.name && data.name !== category.name) {
      const foundCategory = await this.categoryRepository.getByName(
        data.name as string,
      );

      if (foundCategory) {
        throw new ErrorMessage(
          "Category with this name already exists.",
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    return await this.categoryRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.getById(id);

    if (!category) {
      throw new ErrorMessage("Category not found.", StatusCodes.NOT_FOUND);
    }

    return await this.categoryRepository.delete(id);
  }
}
