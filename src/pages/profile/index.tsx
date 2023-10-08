import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import Word from "y/components/home/Word";
import ProfileLayout from "y/components/profile/Layout";
import { Pages, Routes } from "y/constants/enums";

const Profile = () => {
  const dummyData = ["OOP", "Array", "Object", "Class", "ForEach"];

  return (
    <section>
      <ProfileLayout>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          {dummyData.map((item) => (
            <Word key={item} name={item} />
          ))}
        </div>
      </ProfileLayout>
    </section>
  );
};

export default Profile;
export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const isAuth = await getToken({ req });
  if (isAuth && !isAuth.active)
    return {
      redirect: {
        destination: `/${Routes.AUTH}/${Pages.VERIFY_ACCOUNT}/${isAuth.id}`,
        permanent: false,
      },
    };
  return {
    props: {},
  };
};
