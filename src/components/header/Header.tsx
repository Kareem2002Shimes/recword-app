import Image from "next/image";
import Link from "next/link";
import { BiSun, BiMoon } from "react-icons/bi";
import Navbar from "./Navbar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Routes } from "y/constants/enums";
import { User } from "@prisma/client";

function Header({ loggedUser }: { loggedUser?: User | null }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-slate-900/10 bg-[#F8FAFC] py-4 backdrop-blur transition-colors duration-500 dark:border-slate-300/10 dark:bg-transparent lg:z-50  `}
    >
      <div className="container flex items-center justify-between ">
        <Link href={Routes.ROOT} className="flex items-center gap-[15px]">
          <Image
            src="/images/logo.svg"
            alt="logo-img"
            width={40}
            height={40}
            className="object-contain"
          />
          <strong className="text-slate-800 dark:text-slate-200">
            RecWord
          </strong>
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <Navbar loggedUser={loggedUser} />
          <div className="ml-6 border-l  border-slate-200 pl-6 dark:border-slate-800">
            <button
              className="element-center relative z-10 h-[40px] w-[40px] text-xl text-primary"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <BiSun className="relative -z-10" />
                ) : (
                  <BiMoon className="relative -z-10" />
                )
              ) : null}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
