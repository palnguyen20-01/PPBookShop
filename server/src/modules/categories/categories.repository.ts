import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async createCategory(data: {
    CategoryName: string;
    IsCategoryActive: boolean;
  }) {
    return this.prisma.category.create({
      data,
    });
  }

  async getCategories() {
    return this.prisma.category.findMany({ orderBy: { CreatedAt: 'desc' } });
  }

  async getCategoryById(id: string) {
    return this.prisma.category.findUnique({
      where: {
        CategoryID: id,
      },
    });
  }

  async updateCategory(
    id: string,
    data: {
      CategoryName: string;
      IsCategoryActive: boolean;
    },
  ) {
    return this.prisma.category.update({
      where: {
        CategoryID: id,
      },
      data,
    });
  }

  async updateActiveStatus(CategoryID: string, IsCategoryActive: boolean) {
    return this.prisma.category.update({
      where: {
        CategoryID: CategoryID,
      },
      data: {
        IsCategoryActive: IsCategoryActive,
      },
    });
  }

  async getPaginationCategories(page: number, size: number) {
    return this.prisma.category.findMany({
      skip: (page - 1) * size,
      take: size,
      orderBy: { CreatedAt: 'desc' },
    });
  }

  async countAll() {
    return this.prisma.category.count();
  }
}
