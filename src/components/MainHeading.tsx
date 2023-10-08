type MainHeadingProps = {
  title: string;
};
function MainHeading({ title }: MainHeadingProps) {
  return (
    <h2 className="w-fit border-b border-slate-200 pb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:border-slate-200/5 dark:text-white sm:text-5xl">
      {title}
    </h2>
  );
}

export default MainHeading;
