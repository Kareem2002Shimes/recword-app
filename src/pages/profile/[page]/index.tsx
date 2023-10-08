import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import Details from "y/components/profile/Details";
import FavWords from "y/components/profile/FavWords";
import ProfileLayout from "y/components/profile/Layout";
import { Pages, Routes } from "y/constants/enums";
import { authOptions } from "y/server/auth";

const ProfileDetails: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ loggedUser }) => {
  const { query } = useRouter();
  const page = query.page as string;
  if (typeof page !== "string") return null;

  return (
    <ProfileLayout>
      {page === Pages.PROFILE_DETAILS ? (
        <Details loggedUser={loggedUser} />
      ) : (
        <FavWords />
      )}
    </ProfileLayout>
  );
};

export default ProfileDetails;
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (session && !session.user.active)
    return {
      redirect: {
        destination: `/${Routes.AUTH}/${Pages.VERIFY_ACCOUNT}/${session.user.id}`,
        permanent: false,
      },
    };

  return {
    props: {
      loggedUser: JSON.parse(
        JSON.stringify(session?.user) || JSON.stringify(null)
      ),
    },
  };
};
