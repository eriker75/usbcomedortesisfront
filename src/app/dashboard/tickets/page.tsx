import React from "react";
import TicketsTable from "@/components/TicketsTable";
import { authOptions } from "@/auth.options";
import { getServerSession } from "next-auth";

const MyTicketsPage = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Tickets</h1>
      <TicketsTable userID={session?.user.id} />
    </div>
  );
};

export default MyTicketsPage;
