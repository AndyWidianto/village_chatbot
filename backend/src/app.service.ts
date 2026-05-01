import { Injectable } from '@nestjs/common';
import { PrismaService } from './lib/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

async getDashboardStats() {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalAutoreply, totalKnowledge, lastMonthAutoreply, lastMonthKnowledge] = 
    await this.prisma.$transaction([
      this.prisma.autoreply.count(),
      this.prisma.knowledge.count(),
      this.prisma.autoreply.count({
        where: { createdAt: { lt: startOfCurrentMonth } },
      }),
      this.prisma.knowledge.count({
        where: { createdAt: { lt: startOfCurrentMonth } },
      }),
    ]);

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    const growth = ((current - previous) / previous) * 100;
    return Math.round(growth);
  };

  return {
    autoreply: {
      total: totalAutoreply,
      growth: calculateGrowth(totalAutoreply, lastMonthAutoreply),
    },
    knowledge: {
      total: totalKnowledge,
      growth: calculateGrowth(totalKnowledge, lastMonthKnowledge),
    },
  };
}
}
