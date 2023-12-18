import React from "react";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <main className="mt-24 p-8 w-full">
      <Outlet />
    </main>
  );
};
export default Layout;