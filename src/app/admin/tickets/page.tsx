"use client";

import React from "react";
import AdminTicketsTable from "@/components/AdminTicketsTable";
import { TicketStats } from "@/components/TicketStats";

const AllTicketsPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Stats Section */}
      <div className="mb-4">
        <TicketStats />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Listado de Tickets
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Detalle de todos los tickets emitidos
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <AdminTicketsTable />
        </div>
      </div>
    </div>
  );
};

export default AllTicketsPage;
