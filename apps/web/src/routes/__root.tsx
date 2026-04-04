import { Outlet, createRootRoute } from "@tanstack/react-router";

import Footer from "@/components/footer";
import Header from "@/components/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  ),
});
