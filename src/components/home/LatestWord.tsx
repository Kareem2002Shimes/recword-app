import Image from "next/image";
import Link from "next/link";
import {
  BiPlay,
  BiLike,
  BiDislike,
  BiDotsVerticalRounded,
} from "react-icons/bi";
type LatestWordProps = {
  name: string;
  category: string;
  image: string;
};
import type { ReactNode } from "react";
import { Routes } from "y/constants/enums";
const CreateBtn = (children: ReactNode) => {
  return (
    <button
      type="button"
      className="element-center h-[40px] w-[40px] rounded-full hover:bg-white hover:dark:bg-slate-800/50"
    >
      {children}
    </button>
  );
};
function LatestWord({ name, category, image }: LatestWordProps) {
  return (
    <div className="group flex h-[60px] items-center gap-6">
      <Link href={Routes.ROOT}>
        <div className="group-hover:element-center relative h-[60px] w-[50px] rounded-sm after:left-0 after:top-0  after:h-full after:w-full after:rounded-sm after:bg-[linear-gradient(rgba(0,0,0,0.800),rgba(0,0,0,0.800))] after:transition-colors after:duration-200 group-hover:after:absolute">
          <Image
            src={image}
            fill
            alt="cat-img"
            className="h-full w-full object-contain"
          />
          <BiPlay className="z-40 hidden h-7 w-7 text-white group-hover:block" />
        </div>
      </Link>
      <div className="flex h-full flex-col justify-around">
        <Link href={Routes.ROOT} className="text-lg font-semibold text-accent">
          {name}
        </Link>
        <Link
          href={Routes.ROOT}
          className="text-base font-normal text-info hover:underline"
        >
          {category}
        </Link>
      </div>
      <div className="flex w-full flex-1 items-center justify-end gap-4 text-accent group-hover:flex md:hidden">
        <div className="flex gap-3 ">
          {CreateBtn(<BiLike className="h-6 w-6" />)}
          {CreateBtn(<BiDislike className="h-6 w-6" />)}
        </div>
        <button
          type="button"
          className="element-center h-[40px] w-[40px] rounded-full hover:bg-white hover:dark:bg-slate-800/50"
        >
          <BiDotsVerticalRounded className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default LatestWord;
