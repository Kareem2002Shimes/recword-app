import { z } from "zod";

export const createWord = z.object({
  name: z.string().min(1, { message: "Word Name is required" }),
  trackId: z.string().min(1, { message: "Track Id is required" }),
});
export const updateWord = z.object({
  name: z.string().min(1, { message: "Word Name is required" }),
  id: z.string().min(1, { message: "Track Id is required" }),
});
