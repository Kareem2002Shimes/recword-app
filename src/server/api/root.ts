import { createTRPCRouter } from "y/server/api/trpc";
import { authRouter } from "./routers/auth";
import { profileRouter } from "./routers/profile";
import { userRouter } from "./routers/user";
import { trackRouter } from "./routers/track";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  auth: authRouter,
  profile: profileRouter,
  user: userRouter,
  track: trackRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
