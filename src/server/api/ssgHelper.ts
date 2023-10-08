import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "./root";
import { createInnerTRPCContext } from "./trpc";
import superjson from "superjson";

export const ssg = createServerSideHelpers({
  router: appRouter,
  ctx: createInnerTRPCContext({
    session: null,
  }),
  transformer: superjson,
});
