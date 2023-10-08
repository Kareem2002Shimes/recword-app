import MainHeading from "../MainHeading";
import Article from "./Article";

const LatestArticles = () => {
  const dummyData = [
    {
      id: 1,
      title: "Explain OOP",
      category: "Python",
      creactedAt: "1/1/2024",
    },
    {
      id: 2,
      title: "Explain OOP",
      category: "Javascript",
      creactedAt: "1/1/2024",
    },
    {
      id: 3,
      title: "Explain OOP",
      category: "Java",
      creactedAt: "1/1/2024",
    },
    {
      id: 4,
      title: "Explain OOP",
      category: "C#",
      creactedAt: "1/1/2024",
    },
  ];
  return (
    <section className="section-gap">
      <div className="container">
        <MainHeading title="Latest Articles" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dummyData.map((item) => (
            <Article
              key={item.id}
              id={item.id}
              title={item.title}
              category={item.category}
              creactedAt={item.creactedAt}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;
