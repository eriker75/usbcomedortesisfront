import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="mx-auto bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <Navbar />
      </div>
      {children}
    </div>
  );
};

export default Layout;
