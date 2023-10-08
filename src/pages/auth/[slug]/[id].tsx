import { createServerSideHelpers } from "@trpc/react-query/server";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import superjson from "superjson";
import Auth from "y/components/auth/Auth";
import { Routes } from "y/constants/enums";
import { appRouter } from "y/server/api/root";
import { createInnerTRPCContext } from "y/server/api/trpc";
import { authOptions } from "y/server/auth";
import { api } from "y/utils/api";

const VerificationPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  const { query } = useRouter();
  const slug = query.slug as string;
  const { data: profile } = api.profile.getById.useQuery({ id });
  if (typeof slug !== "string") return null;
  return (
    <section>
      <Auth slug={slug} profile={profile} />
    </section>
  );
};

export default VerificationPage;
export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<{ id: string }>
) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  const id = ctx.params?.id as string;

  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session,
    }),
    transformer: superjson,
  });

  if (session?.user.email && session.user.active) {
    return {
      redirect: {
        destination: `/${Routes.PROFILE}`,
        permanent: false,
      },
    };
  }
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};
