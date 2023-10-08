import { User } from "@prisma/client";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Footer from "y/components/Footer";
import Header from "y/components/header/Header";
import Landing from "y/components/home/Landing";
import LatestArticles from "y/components/home/LatestArticles";
import LatestWords from "y/components/home/LatestWords";
import RandomWords from "y/components/home/RandomWords";
import Tracks from "y/components/home/Tracks";
import Intro from "y/components/Intro";
import { authOptions } from "y/server/auth";

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ loggedUser }) => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header loggedUser={JSON.parse(loggedUser)} />
      <main>
        <Landing />
        <Intro />
        <Tracks />
        <LatestWords />
        <LatestArticles />
        <RandomWords />
      </main>
      <Footer />
    </>
  );
};

export default Home;
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  return {
    props: {
      loggedUser: JSON.stringify(session?.user),
    },
  };
};
