import { prisma } from '../db';
import { User } from '../types';

export const authService = {
  async createUser(email: string, hashedPassword: string): Promise<User> {
    return await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  },

  async findUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  async findUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  },
};
