import React from "react";
import AdminTicketsTable from "@/components/AdminTicketsTable";

const AllTicketsPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Listado de Tickets</h1>
      <AdminTicketsTable />
    </div>
  );
};

export default AllTicketsPage;
