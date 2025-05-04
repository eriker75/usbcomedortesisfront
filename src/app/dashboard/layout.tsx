import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="max-w-3xl mx-auto bg-gray-50">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
