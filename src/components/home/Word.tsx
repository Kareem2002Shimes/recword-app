import Link from "next/link";

const Word = ({ name }: { name: string }) => {
  return (
    <Link
      href={`/${name}`}
      className="h-fit w-fit rounded-lg  bg-slate-800 px-4 py-2 font-semibold text-[rgb(226,232,240)] hover:text-primary dark:text-slate-400 dark:hover:text-primary"
    >
      {name}
    </Link>
  );
};

export default Word;
