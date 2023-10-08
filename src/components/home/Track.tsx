import Image from "next/image";
import Link from "next/link";
import { Routes } from "y/constants/enums";

type TrackProps = {
  image: string;
  name: string;
};
const Track = ({ name, image }: TrackProps) => {
  return (
    <Link
      href={Routes.ROOT}
      className="element-center justify-start gap-6 rounded-xl p-4 transition-colors duration-200 hover:bg-white hover:dark:bg-slate-800/50"
    >
      <Image
        src={image}
        alt="track-icon"
        width={100}
        height={100}
        className="object-contain"
      />
      <strong className="text-accent">{name} Track</strong>
    </Link>
  );
};

export default Track;
