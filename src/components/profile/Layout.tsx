import Footer from "y/components/Footer";
import Header from "../header/Header";
import Navbar from "./Navbar";
const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="container flex-1 pt-10">
        <Navbar />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ProfileLayout;
