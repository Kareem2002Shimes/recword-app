import Link from "next/link";
import { FaFacebook, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const links = ["facebook.com/recword", "youtube.com/@SimpleArabCode"];

  return (
    <footer className={`pb-10`}>
      <div className="container">
        <div className=" flex w-full flex-col items-start justify-between gap-6 border-t border-slate-200 pt-10 text-slate-500 dark:border-slate-200/5 md:flex-row md:items-center md:gap-0  lg:justify-around ">
          <p>Copyright &copy; 2023 RecWord</p>
          <nav>
            <ul className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
              {links.map((link) => (
                <li key={link}>
                  <Link
                    href={`https://www.${link}`}
                    className={`transition-colors duration-200 ${
                      link.startsWith("facebook")
                        ? "hover:text-[#4267B2]"
                        : "hover:text-[#FF0000]"
                    }`}
                  >
                    {link.startsWith("facebook") ? (
                      <FaFacebook className="h-6 w-6" />
                    ) : (
                      <FaYoutube className="h-6 w-6" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
