import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

const Header = () => {
  const [links, setLinks] = useState<string[]>([
    "Latest Words",
    "Articles",
    "Add Word",
    "Profile",
  ]);
  const [open, setOpen] = useState<boolean>(false);
  const headerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const stickyEvent = () => {
      if (headerRef.current) {
        if (window.scrollY > 100) {
          headerRef.current.style.background = "#0f172abf";
        } else {
          headerRef.current.style.background = "transparent";
        }
      }
    };
    window.addEventListener("scroll", stickyEvent);
    return () => {
      window.removeEventListener("scroll", stickyEvent);
    };
  }, []);

  const mobileNav = "absolute left-0 top-0 h-screen  w-[60%] bg-slate-800 p-6";
  const linkNav =
    "text-slate-200 transition-colors duration-200 hover:text-sky-400";
  const barsIcon =
    "text-slate-400 transition-colors duration-200 hover:text-white";
  return (
    <header
      ref={headerRef}
      className="fixed left-0 top-0 z-40 w-full border-b border-slate-50/[0.06] bg-transparent p-4 backdrop-blur transition-all duration-200 "
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 ">
          <Image
            src="/images/logo.svg"
            alt="logo-img"
            width={40}
            height={40}
            className="object-contain"
          />
          <strong className="text-base text-white">RecWord</strong>
        </Link>
        {/* desktop nav */}
        <nav>
          <ul className="hidden space-x-8 sm:flex">
            {links.map((link) => (
              <li key={link}>
                <Link
                  href={`/${link.split(" ").join("-").toLowerCase()}`}
                  className={`${linkNav} text-sm font-medium leading-6`}
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
          {!open && (
            <button
              type="button"
              className="sm:hidden"
              onClick={() => setOpen(true)}
            >
              <FaBars className={`${barsIcon} h-[24px] w-[24px]`} />
            </button>
          )}
        </nav>

        {/* mobile nav */}
        {open && (
          <div className={`${mobileNav} flex flex-col sm:hidden`}>
            <button
              type="button"
              className="mb-[30px] flex justify-end"
              onClick={() => setOpen(false)}
            >
              <IoIosClose className={`${barsIcon} h-[35px] w-[35px]`} />
            </button>
            <nav className="flex flex-1">
              <ul className="flex flex-col sm:flex-row sm:space-x-8">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.split(" ").join("-").toLowerCase()}`}
                      className={`${linkNav} mb-4 block font-semibold `}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
{
  /* {!open && (
            <button type="button" className="hidden">
              <FaBars className={`${barsIcon} h-[24px] w-[24px]`} />
            </button>
          )} */
}
