import Link from "next/link";
import SearchModal from "./SearchModal";
import { Pages, Routes } from "y/constants/enums";

function Landing() {
  return (
    <section className="section-gap pt-14">
      <div className="element-center container flex-col  md:text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
          Welcome to the Voice of the Arabs knowledge community
        </h1>
        <p className="mt-6 flex max-w-3xl flex-wrap gap-4 text-lg text-info">
          <strong className="text-lg font-semibold leading-6 text-primary">
            RecWord
          </strong>
          It is a platform that aims to learn programming in the simplest
          possible way
          <br /> to make learning easy and enjoyable
        </p>
        <div className="element-center mt-10 w-full flex-wrap justify-start gap-7  md:justify-center">
          <Link
            href={`/${Routes.AUTH}/${Pages.SIGNUP}`}
            className="element-center h-12 w-full rounded-lg border-none bg-slate-900 px-6 font-semibold text-white transition-transform duration-500 ease-in-out hover:bg-slate-700 active:scale-[0.8] dark:bg-sky-500 dark:hover:bg-sky-400 md:w-auto"
          >
            Get Started
          </Link>

          <SearchModal />
        </div>
      </div>
    </section>
  );
}

export default Landing;
