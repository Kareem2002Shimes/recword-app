import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "y/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { createTrack, updateTrack } from "y/validation/track";

export const trackRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.track.findMany();
  }),
  create: adminProcedure
    .input(createTrack)
    .mutation(async ({ ctx, input: { image, name } }) => {
      const adminId = ctx.session.user.id;
      const track = await ctx.prisma.track.findUnique({
        where: {
          name,
        },
      });
      if (track) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Track already exists.",
        });
      }
      const createdTrack = await ctx.prisma.track.create({
        data: {
          name,
          image,
          userId: adminId,
        },
      });
      return {
        status: 201,
        message: "Track created successfully",
        id: createdTrack.id,
        name: createdTrack.name,
        image: createdTrack.image,
        createdAt: createdTrack.createdAt,
      };
    }),
  update: adminProcedure
    .input(updateTrack)
    .mutation(async ({ ctx, input: { image, name, id } }) => {
      const track = await ctx.prisma.track.findUnique({
        where: {
          id,
        },
      });
      if (!track) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Track does not exists.",
        });
      }
      const createdTrack = await ctx.prisma.track.update({
        where: {
          id,
        },
        data: {
          name,
          image,
          updatedAt: new Date(),
        },
      });
      return {
        status: 200,
        message: "Track updated successfully",
        id: createdTrack.id,
        name: createdTrack.name,
        image: createdTrack.image,
      };
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      const track = await ctx.prisma.track.findUnique({
        where: {
          id,
        },
      });
      if (!track) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Track does not exists.",
        });
      }
      // if cat has subCats delete also
      await ctx.prisma.track.delete({
        where: {
          id,
        },
      });
      return {
        status: 200,
        message: "Track deleted successfully",
      };
    }),
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const track = await ctx.prisma.track.findUnique({
        where: { id },
        select: {
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!track) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Track does not exists.",
        });
      }
      return {
        status: 200,
        name: track.name,
        image: track.image,
        createdAt: track.createdAt,
        updatedAt: track.updatedAt,
      };
    }),
});
