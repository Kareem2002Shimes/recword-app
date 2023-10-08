import Word from "../home/Word";

const FavWords = () => {
  const dummyData = ["OOP", "Array", "Object", "Class", "ForEach"];

  return (
    <section>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        {dummyData.map((item) => (
          <Word key={item} name={item} />
        ))}
      </div>
    </section>
  );
};

export default FavWords;
