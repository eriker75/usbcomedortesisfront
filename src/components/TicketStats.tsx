"use client";

import React from "react";
import StatsCard from "@/components/StatsCard";
import {
  HiTicket,
  HiCurrencyDollar,
  HiMiniCheckCircle,
  HiMiniXCircle
} from "react-icons/hi2";
import { useTicketStats } from "@/lib/getTicketStats";
import { Skeleton } from "@/components/ui/skeleton";

export const TicketStats = () => {
  const { data: stats, isLoading, isError } = useTicketStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Error al cargar las estadísticas</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Tickets Emitidos"
        value={stats?.totalTickets || 0}
        icon={<HiTicket className="h-6 w-6 text-blue-700" />}
        description="Total del periodo"
        className="bg-blue-50"
      />
      <StatsCard
        title="Ingresos"
        value={`$${stats?.totalGanancias.toFixed(2)}`}
        icon={<HiCurrencyDollar className="h-6 w-6 text-green-700" />}
        description="Ganancias del periodo"
        className="bg-green-50"
      />
      <StatsCard
        title="Sin Usar"
        value={stats?.ticketsDisponibles || 0}
        icon={<HiMiniCheckCircle className="h-6 w-6 text-yellow-700" />}
        description="Tickets disponibles"
        className="bg-yellow-50"
      />
      <StatsCard
        title="Utilizados"
        value={stats?.ticketsUsados || 0}
        icon={<HiMiniXCircle className="h-6 w-6 text-red-700" />}
        description="Tickets consumidos"
        className="bg-red-50"
      />
    </div>
  );
};
