import Link from "next/link";
import { Routes } from "y/constants/enums";

type ArticleProps = {
  title: string;
  category: string;
  id: number;
  creactedAt: string;
};
function Article({ title, category, id, creactedAt }: ArticleProps) {
  return (
    <div className=" rounded-sm  border border-slate-200  dark:border-slate-200/5">
      <div
        className={`${
          id === 1
            ? "border-[#4584b6]"
            : id === 2
            ? "border-[#F7E01D]"
            : id === 3
            ? "border-[#EC2025]"
            : "border-[#95478E]"
        } flex flex-col gap-4 rounded-sm border-l px-6 py-4`}
      >
        <Link
          href={Routes.ROOT}
          className="font-semibold text-accent transition-colors duration-200 hover:text-primary"
        >
          {title}
        </Link>
        <div
          className={`${
            id === 1
              ? "bg-[#4584b6]"
              : id === 2
              ? "bg-[#F7E01D]"
              : id === 3
              ? "bg-[#EC2025]"
              : "bg-[#95478E]"
          } h-fit w-fit rounded-md  px-2 py-1 font-medium text-white dark:text-black`}
        >
          {category}
        </div>
        <span className="font-normal text-info">{creactedAt}</span>
      </div>
    </div>
  );
}

export default Article;
