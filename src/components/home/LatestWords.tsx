import MainHeading from "../MainHeading";
import LatestWord from "./LatestWord";

const LatestWords = () => {
  const dummyData = [
    {
      id: 1,
      name: "OOP",
      category: "Python",
      imageCat: "/images/categories/python.png",
    },
    {
      id: 2,
      name: "OOP",
      category: "Java",
      imageCat: "/images/categories/java.png",
    },
    {
      id: 3,
      name: "OOP",
      category: "JavaScript",
      imageCat: "/images/categories/javascript.png",
    },
    {
      id: 4,
      name: "OOP",
      category: "C#",
      imageCat: "/images/categories/cSharp.png",
    },
    {
      id: 5,
      name: "OOP",
      category: "Python",
      imageCat: "/images/categories/python.png",
    },
    {
      id: 6,
      name: "OOP",
      category: "Java",
      imageCat: "/images/categories/java.png",
    },
    {
      id: 7,
      name: "OOP",
      category: "JavaScript",
      imageCat: "/images/categories/javascript.png",
    },
    {
      id: 8,
      name: "OOP",
      category: "C#",
      imageCat: "/images/categories/cSharp.png",
    },
    {
      id: 9,
      name: "OOP",
      category: "Python",
      imageCat: "/images/categories/python.png",
    },
    {
      id: 10,
      name: "OOP",
      category: "Java",
      imageCat: "/images/categories/java.png",
    },
    {
      id: 11,
      name: "OOP",
      category: "JavaScript",
      imageCat: "/images/categories/javascript.png",
    },
    {
      id: 12,
      name: "OOP",
      category: "C#",
      imageCat: "/images/categories/cSharp.png",
    },
    {
      id: 13,
      name: "OOP",
      category: "Python",
      imageCat: "/images/categories/python.png",
    },
    {
      id: 14,
      name: "OOP",
      category: "Java",
      imageCat: "/images/categories/java.png",
    },
    {
      id: 15,
      name: "OOP",
      category: "JavaScript",
      imageCat: "/images/categories/javascript.png",
    },
  ];
  return (
    <section className="section-gap">
      <div className="container">
        <MainHeading title="Latest Words" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dummyData.map((item) => (
            <LatestWord
              key={item.id}
              name={item.name}
              category={item.category}
              image={item.imageCat}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestWords;
