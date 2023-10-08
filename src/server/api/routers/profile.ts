import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "y/server/api/trpc";
import { updateProfile } from "y/validation/auth";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

export const profileRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const profile = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          email: true,
          name: true,
          lastName: true,
          firstName: true,
          id: true,
          password: true,
        },
      });
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exists.",
        });
      }
      return {
        status: 200,
        email: profile.email,
        name: profile.name,
        lastName: profile.lastName,
        firstName: profile.firstName,
        id: profile.id,
        password: profile.password ? true : null,
      };
    }),
  updateProfile: protectedProcedure
    .input(updateProfile)
    .mutation(
      async ({ ctx, input: { first_name, last_name, email, password } }) => {
        const userId = ctx.session.user.id;
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User does not exists.",
          });
        }

        await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            firstName: first_name,
            lastName: last_name,
            email,
            updatedAt: new Date(),
          },
        });
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          await ctx.prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              password: hashedPassword,
            },
          });
        }
        return {
          status: 200,
          message: "Profile updated successfully",
        };
      }
    ),
});
