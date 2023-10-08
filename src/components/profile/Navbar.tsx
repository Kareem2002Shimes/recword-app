import Link from "next/link";
import { Pages, Routes } from "y/constants/enums";
import { VscListUnordered, VscAccount, VscSignOut } from "react-icons/vsc";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { MdFavorite } from "react-icons/md";
const Navbar = () => {
  const { pathname } = useRouter();
  const listStyle =
    "-mb-px flex gap-2 w-fit border-b pb-2.5 pt-3 text-sm font-semibold leading-6 ";
  const activeLink =
    "text-primary dark:text-primary border-primary dark:border-primary ";
  const nonActiveLink =
    "text-slate-900 hover:border-slate-300  border-transparent dark:text-slate-200 dark:hover:border-slate-700";
  const linkIcon = `h-6 w-6 text-accent`;
  const activeIcon = "text-primary";

  return (
    <nav>
      <ul className="grid grid-cols-2 gap-4 border-b border-slate-200 dark:border-slate-200/5 sm:grid-cols-3 lg:grid-cols-4">
        <li>
          <Link
            href={`/${Routes.PROFILE}`}
            className={`${listStyle} ${
              pathname === `/${Routes.PROFILE}` ? activeLink : nonActiveLink
            }`}
          >
            <VscListUnordered
              className={`${linkIcon} ${
                pathname === `/${Routes.PROFILE}` ? activeIcon : ""
              }`}
            />
            Added Words
          </Link>
        </li>
        <li>
          <Link
            href={`/${Routes.PROFILE}/${Pages.PROFILE_DETAILS}`}
            className={`${listStyle} ${
              pathname === `/${Routes.PROFILE}/${Pages.PROFILE_DETAILS}`
                ? activeLink
                : nonActiveLink
            }`}
          >
            <VscAccount
              className={`${linkIcon} ${
                pathname === `/${Routes.PROFILE}/${Pages.PROFILE_DETAILS}`
                  ? activeIcon
                  : ""
              }`}
            />
            Profile Details
          </Link>
        </li>
        <li>
          <Link
            href={`/${Routes.PROFILE}/${Pages.FAVORITE_WORDS}`}
            className={`${listStyle} ${
              pathname === `/${Routes.PROFILE}/${Pages.FAVORITE_WORDS}`
                ? activeLink
                : nonActiveLink
            }`}
          >
            <MdFavorite
              className={`${linkIcon} ${
                pathname === `/${Routes.PROFILE}/${Pages.FAVORITE_WORDS}`
                  ? activeIcon
                  : ""
              }`}
            />
            Favorite Words
          </Link>
        </li>

        <li>
          <button
            type="button"
            className={`${listStyle} ${nonActiveLink}`}
            onClick={() => signOut({ callbackUrl: Routes.ROOT })}
          >
            <VscSignOut className={linkIcon} />
            Signout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
