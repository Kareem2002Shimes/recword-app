import { z } from "zod";

export const createTrack = z.object({
  name: z.string().min(1, { message: "Track Name is required" }),
  image: z.string(),
});
export const updateTrack = z.object({
  name: z.string().min(1, { message: "Track Name is required" }),
  image: z.string().optional(),
  id: z.string(),
});
