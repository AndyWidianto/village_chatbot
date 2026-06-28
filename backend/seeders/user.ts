import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function userSeeders() {
  console.log('🌱 Seeding users...');


  const users = [
    {
      name: "Kepala Desa",
      email: process.env.EMAIL_KEPALA_DESA!,
      password: process.env.PASSWORD_KEPALA_DESA!,
      role: UserRole.super_admin,
      username: process.env.USERNAME_KEPALA_DESA!,
    },
    {
      name: "admin",
      email: process.env.EMAIL_ADMIN!,
      password: process.env.PASSWORD_ADMIN!,
      role: UserRole.admin,
      username: "admin",
    }
  ];

  for (const user of users) {
    const hashPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        password: hashPassword
      },
    });
  }

  console.log('✅ User seeding completed.');
}

userSeeders();