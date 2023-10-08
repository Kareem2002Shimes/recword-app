import MainHeading from "../MainHeading";
import Word from "./Word";

const RandomWords = () => {
  const dummyData = ["OOP", "Array", "Object", "Class", "ForEach"];
  return (
    <section className="section-gap">
      <div className="container">
        <MainHeading title="Random Words" />
        <div className="mt-10 flex flex-wrap items-center gap-4">
          {dummyData.map((item) => (
            <Word key={item} name={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RandomWords;
