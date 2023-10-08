import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminProcedure } from "y/server/api/trpc";
import bcrypt from "bcrypt";
import { z } from "zod";
import { createUser, updateUser } from "y/validation/user";

export const userRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      select: {
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        active: true,
        role: true,
        _count: true,
      },
    });
    if (!users) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Users not found",
      });
    }
    return {
      status: 200,
      users,
    };
  }),
  createNewUser: adminProcedure
    .input(createUser)
    .mutation(
      async ({
        ctx,
        input: { email, first_name, last_name, password, role, active },
      }) => {
        const existedUser = await ctx.prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (existedUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User already exists.",
          });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await ctx.prisma.user.create({
          data: {
            firstName: first_name,
            lastName: last_name,
            email,
            password: hashedPassword,
            name: `${first_name} ${last_name}`,
            role,
            active,
          },
        });
        return {
          status: 201,
          message: "User created successfully",
          id: user.id,
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`,
          createAt: user.createdAt,
        };
      }
    ),
  deleteUser: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exists.",
        });
      }
      // if user has words delete also
      await ctx.prisma.user.delete({
        where: {
          id,
        },
      });
      return {
        status: 200,
        message: "User deleted successfully",
      };
    }),
  updateUser: adminProcedure
    .input(updateUser)
    .mutation(
      async ({
        ctx,
        input: { first_name, last_name, email, id, password, active, role },
      }) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id,
          },
          select: {
            email: true,
          },
        });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User does not exists.",
          });
        }
        if (user.email === email) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Try another email",
          });
        }
        const hashedPassword = await bcrypt.hash(password!, 10);
        await ctx.prisma.user.update({
          where: {
            id,
          },
          data: {
            firstName: first_name,
            lastName: last_name,
            email,
            password: password && hashedPassword,
            active,
            role,
            updatedAt: new Date(),
          },
        });
        return {
          status: 200,
          message: "User updated successfully",
        };
      }
    ),
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          firstName: true,
          lastName: true,
          active: true,
          email: true,
          role: true,
          id: true,
          name: true,
          updatedAt: true,
          createdAt: true,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exists.",
        });
      }
      return {
        status: 200,
        firstName: user.firstName,
        lastName: user.lastName,
        active: user.active,
        email: user.email,
        role: user.role,
        id: user.id,
        name: user.name,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      };
    }),
});
