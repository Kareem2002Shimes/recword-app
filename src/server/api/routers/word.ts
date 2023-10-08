import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "y/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { createWord, updateWord } from "y/validation/word";

export const wordRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.word.findMany();
  }),
  create: adminProcedure
    .input(createWord)
    .mutation(async ({ ctx, input: { name, trackId } }) => {
      const adminId = ctx.session.user.id;

      const word = await ctx.prisma.word.findFirst({
        where: {
          name,
          trackId,
        },
      });
      if (word) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Word already exists in this track.",
        });
      }

      const createdWord = await ctx.prisma.word.create({
        data: {
          name,
          userId: adminId,
          trackId,
        },
      });
      return {
        status: 201,
        message: "Word created successfully",
        id: createdWord.id,
        name: createdWord.name,
        createdAt: createdWord.createdAt,
      };
    }),
  update: adminProcedure
    .input(updateWord)
    .mutation(async ({ ctx, input: { name, id } }) => {
      const word = await ctx.prisma.word.findUnique({
        where: {
          id,
        },
      });
      if (!word) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Word does not exists.",
        });
      }
      const updatedWord = await ctx.prisma.word.update({
        where: {
          id,
        },
        data: {
          name,
          updatedAt: new Date(),
        },
      });
      return {
        status: 200,
        message: "Word updated successfully",
        id: updatedWord.id,
        name: updatedWord.name,
      };
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      const word = await ctx.prisma.word.findUnique({
        where: {
          id,
        },
      });
      if (!word) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Word does not exists.",
        });
      }
      await ctx.prisma.word.delete({
        where: {
          id,
        },
      });
      return {
        status: 200,
        message: "Word deleted successfully",
      };
    }),
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const word = await ctx.prisma.word.findUnique({
        where: { id },
        select: {
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!word) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Word does not exists.",
        });
      }
      return {
        status: 200,
        name: word.name,
        createdAt: word.createdAt,
        updatedAt: word.updatedAt,
      };
    }),
});
