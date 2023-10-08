import { api } from "y/utils/api";
import MainHeading from "../MainHeading";
import Track from "./Track";

function Tracks() {
  const tracks = [
    { icon: "frontend.svg", title: "Front-End" },
    { icon: "backend.svg", title: "Back-End" },
    { icon: "fullstack.png", title: "Full-Stack" },
    { icon: "python.png", title: "Python" },
  ];
  // const { data: tracks } = api.track.getAll.useQuery();

  return (
    <section className="section-gap ">
      <div className="container">
        <MainHeading title="Programming Tracks" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tracks?.map((track) => (
            <Track
              key={track.title}
              image={`/images/icons/${track.icon}`}
              name={track.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Tracks;
