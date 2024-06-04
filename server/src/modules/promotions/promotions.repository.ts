import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PromotionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    return this.prisma.promotion.findMany();
  }

  async findOne(PromotionID: string) {
    return this.prisma.promotion.findUnique({
      where: {
        PromotionID: PromotionID,
        ExpiredDate: {
          gt: new Date(),
        },
      },
    });
  }

  async create(data: {
    PromotionName: string;
    DiscountPercent: number;
    ExpiredDate: Date;
    IsAvailable: boolean;
  }) {
    return this.prisma.promotion.create({
      data,
    });
  }

  async update(PromotionID: string, data: any) {
    return this.prisma.promotion.update({
      where: {
        PromotionID: PromotionID,
      },
      data,
    });
  }

  async delete(PromotionID: string) {
    return this.prisma.promotion.delete({
      where: {
        PromotionID: PromotionID,
      },
    });
  }

  async getPaginationPromotions(page: number, size: number) {
    return this.prisma.promotion.findMany({
      skip: (page - 1) * size,
      take: size,
    });
  }

  async createBookPromotion(data: { BookID: string; PromotionID: string }) {
    return this.prisma.bookPromotion.create({
      data,
    });
  }

  async getBooksByPromotionID(PromotionID: string) {
    return this.prisma.bookPromotion.findMany({
      where: {
        PromotionID: PromotionID,
      },
    });
  }

  async findBookPromotionByBookID(BookID: string) {
    return this.prisma.bookPromotion.findMany({
      where: {
        BookID: BookID,
      },
    });
  }

  async countAll() {
    return this.prisma.promotion.count();
  }

  async getPromotionListByBookID(BookID: string) {
    return this.prisma.bookPromotion.findMany({
      where: {
        BookID: BookID,
      },
    });
  }
}
