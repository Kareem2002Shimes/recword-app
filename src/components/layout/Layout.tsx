import { Fragment, ReactNode } from "react";
import Header from "../Header";
type LayoutProps = {
  children: ReactNode;
};
function Layout({ children }: LayoutProps) {
  return (
    <Fragment>
      <Header />
      <main>{children}</main>
    </Fragment>
  );
}

export default Layout;
