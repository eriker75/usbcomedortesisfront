import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useShallow } from "zustand/react/shallow";
import useTicketFilterStore from "./useTicketFilterStore";

interface TicketStats {
  totalTickets: number;
  totalGanancias: number;
  ticketsDisponibles: number;
  ticketsUsados: number;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5500";

export const useTicketStats = () => {
  const { fechaInicio, fechaFin, nameFilter, emailFilter } =
    useTicketFilterStore(
      useShallow((state) => ({
        fechaInicio: state.fechaInicio,
        fechaFin: state.fechaFin,
        nameFilter: state.nameFilter,
        emailFilter: state.emailFilter
      }))
    );

  return useQuery<TicketStats>({
    queryKey: ["ticket-stats", fechaInicio, fechaFin, nameFilter, emailFilter],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (fechaInicio) {
        params.append("fechaInicio", fechaInicio.toISOString());
      }

      if (fechaFin) {
        params.append("fechaFin", fechaFin.toISOString());
      }

      if (nameFilter) {
        params.append("userName", nameFilter);
      }

      if (emailFilter) {
        params.append("userEmail", emailFilter);
      }

      const response = await axios.get<TicketStats>(
        `${BACKEND_URL}/api/ticket/stats?${params.toString()}`
      );

      return response.data;
    }
  });
};
