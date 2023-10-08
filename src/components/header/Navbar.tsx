import { Fragment, useEffect, useState } from "react";
import { Portal } from "../Portal";
import Link from "next/link";
import { VscAccount, VscClose } from "react-icons/vsc";
import { AiOutlineFileAdd } from "react-icons/ai";
import { User } from "@prisma/client";
import { Routes } from "y/constants/enums";
import { GrUserAdmin } from "react-icons/gr";
const createIcon = (name: string) => {
  switch (name) {
    case "Latest Words":
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.5 7c1.093 0 2.117.27 3 .743V17a6.345 6.345 0 0 0-3-.743c-1.093 0-2.617.27-3.5.743V7.743C5.883 7.27 7.407 7 8.5 7Z"
            className="fill-sky-200"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.5 7c1.093 0 2.617.27 3.5.743V17c-.883-.473-2.407-.743-3.5-.743s-2.117.27-3 .743V7.743a6.344 6.344 0 0 1 3-.743Z"
            className="fill-sky-400"
          ></path>
        </svg>
      );
    case "Articles":
      return (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            className="stroke-sky-300"
            strokeWidth="2"
            d="M16,7 L19,7 L19,11 L16,11 L16,7 Z M9,15 L20,15 M9,11 L13,11 M9,7 L13,7 M6,18.5 C6,19.8807119 4.88071187,21 3.5,21 C2.11928813,21 1,19.8807119 1,18.5 L1,7 L6.02493781,7 M6,18.5 L6,3 L23,3 L23,18.5 C23,19.8807119 21.8807119,21 20.5,21 L3.5,21"
          ></path>
        </svg>
      );
    case "Add Word":
      return <AiOutlineFileAdd />;
    case "Profile":
      return <VscAccount />;
    case "Admin Panel":
      return (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke=""
            strokeWidth="2"
            d="M8,11 C10.7614237,11 13,8.76142375 13,6 C13,3.23857625 10.7614237,1 8,1 C5.23857625,1 3,3.23857625 3,6 C3,8.76142375 5.23857625,11 8,11 Z M13.0233822,13.0234994 C11.7718684,11.7594056 10.0125018,11 8,11 C4,11 1,14 1,18 L1,23 L8,23 M10,19.5 C10,20.88 11.12,22 12.5,22 C13.881,22 15,20.88 15,19.5 C15,18.119 13.881,17 12.5,17 C11.12,17 10,18.119 10,19.5 L10,19.5 Z M23,15 L20,12 L14,18 M17.5,14.5 L20.5,17.5 L17.5,14.5 Z"
          ></path>
        </svg>
      );
    case "Bars":
      return (
        <svg width="24" height="24">
          <path
            d="M5 6h14M5 12h14M5 18h14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          ></path>
        </svg>
      );
    default:
      return null;
  }
};

function Navbar({ loggedUser }: { loggedUser?: User | null }) {
  const links = [
    "Latest Words",
    "Articles",
    "Add Word",
    loggedUser?.role === "ADMIN" ? "Admin Panel" : "Profile",
  ];
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    menu
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [menu]);
  return (
    <Fragment>
      {/* Desktop Nav */}
      <nav className=" hidden text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200 md:flex">
        <ul className="flex space-x-8">
          {links.map((link) => (
            <li key={link}>
              <Link
                href={
                  link === "Admin Panel"
                    ? `/${Routes.ADMIN}`
                    : `/${link.split(" ").join("-").toLowerCase()}`
                }
                className="hover:text-primary dark:hover:text-sky-400"
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button
        type="button"
        className="block text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 md:hidden"
        onClick={() => setMenu(true)}
      >
        {createIcon("Bars")}
      </button>
      {/* Mobile Nav */}
      {menu && (
        <Portal>
          <div className="fixed inset-0 left-0 top-0 z-50 min-h-screen overflow-y-auto md:hidden">
            <div className="fixed inset-0 min-h-screen bg-black/20 backdrop-blur-sm dark:bg-slate-900/80">
              <nav className="relative h-full w-80 max-w-[calc(100%-3rem)] bg-white p-6 dark:bg-slate-800 ">
                <button
                  type="button"
                  className="element-center absolute right-5 top-5 z-10 h-8 w-8 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  onClick={() => setMenu(false)}
                >
                  <VscClose className="h-[24px] w-[24px]" />
                </button>
                <ul className="relative lg:text-sm lg:leading-6">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href={`/${link.split(" ").join("-").toLowerCase()}`}
                        className="group mb-4 flex items-center gap-4 font-medium text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-slate-300 "
                      >
                        <div className="element-center h-[24px] w-[24px] rounded-md text-sky-300 shadow-sm ring-1 ring-slate-900/5 group-hover:shadow group-hover:shadow-indigo-200 group-hover:ring-slate-900/10 dark:bg-slate-700 dark:shadow-none dark:ring-0 dark:group-hover:bg-sky-500 dark:group-hover:shadow-none">
                          {createIcon(link)}
                        </div>
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </Portal>
      )}
    </Fragment>
  );
}

export default Navbar;
