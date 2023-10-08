import Auth from "y/components/auth/Auth";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { Pages, Routes } from "y/constants/enums";

const AuthPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;
  if (typeof slug !== "string") return null;

  return (
    <section>
      <Auth slug={slug} />
    </section>
  );
};

export default AuthPage;
export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const isAuth = await getToken({ req });
  if (isAuth && !isAuth.active)
    return {
      redirect: {
        destination: `/${Routes.AUTH}/${Pages.VERIFY_ACCOUNT}/${isAuth.id}`,
        permanent: false,
      },
    };
  return {
    props: {},
  };
};
