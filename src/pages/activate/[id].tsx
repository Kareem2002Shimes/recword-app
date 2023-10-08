import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

import { api } from "y/utils/api";
import ErrorPage from "next/error";

import { Pages, Routes } from "y/constants/enums";
import { ssg } from "y/server/api/ssgHelper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Footer from "y/components/Footer";

const VerificationEmailPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  const router = useRouter();
  const [timer, setTimer] = useState<number>(5);
  const { isSuccess } = api.auth.verifyAccount.useQuery({
    id,
  });
  useEffect(() => {
    timer < 0 && setTimer(0);
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
      if (timer === 0) {
        router.replace(`/${Routes.AUTH}/${Pages.LOGIN}`);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  return (
    <div className="element-center relative h-screen items-start py-20">
      {isSuccess ? (
        <div className="container  text-center">
          <svg
            viewBox="-2.4 -2.4 28.80 28.80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-[100px] w-[100px] md:h-[200px] md:w-[200px]"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />

            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="#CCCCCC"
              strokeWidth="0.288"
            />

            <g id="SVGRepo_iconCarrier">
              <path
                opacity="0.15"
                d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                fill="#36D399"
              />
              <path
                d="M17.0001 9L10 16L7 13M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#36D399"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
          <h1 className="mb-4 text-3xl font-semibold text-accent md:mb-6 md:text-5xl">
            Account has been activated successfully
          </h1>
          <span className="text-base font-medium text-info md:text-xl">
            Your will be redirected in {timer} seconds
          </span>
          <div className="absolute bottom-0 left-0 w-full">
            <Footer />
          </div>
        </div>
      ) : (
        <h1 className="text-3xl font-semibold text-accent md:text-5xl">
          Something went wrong
        </h1>
      )}
    </div>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const id = context.params?.id;

  if (!id) {
    return <ErrorPage statusCode={404} />;
  }

  await ssg.auth.verifyAccount.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}
export default VerificationEmailPage;
