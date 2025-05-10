import { create } from "zustand";

interface FilterState {
  // Estados
  statusFilter: string;
  fechaInicio: Date | undefined;
  fechaFin: Date | undefined;
  nameFilter: string;
  emailFilter: string;
  nameSearchValue: string;
  emailSearchValue: string;

  // Acciones
  setStatusFilter: (status: string) => void;
  setFechaInicio: (date: Date | undefined) => void;
  setFechaFin: (date: Date | undefined) => void;
  setNameFilter: (name: string) => void;
  setEmailFilter: (email: string) => void;
  setNameSearchValue: (value: string) => void;
  setEmailSearchValue: (value: string) => void;
  clearFilters: () => void;
}

const useTicketFilterStore = create<FilterState>((set) => ({
  // Estados iniciales
  statusFilter: "all",
  fechaInicio: undefined,
  fechaFin: undefined,
  nameFilter: "",
  emailFilter: "",
  nameSearchValue: "",
  emailSearchValue: "",

  // Acciones
  setStatusFilter: (status) => set({ statusFilter: status }),
  setFechaInicio: (date) => set({ fechaInicio: date }),
  setFechaFin: (date) => set({ fechaFin: date }),
  setNameFilter: (name) => set({ nameFilter: name }),
  setEmailFilter: (email) => set({ emailFilter: email }),
  setNameSearchValue: (value) => set({ nameSearchValue: value }),
  setEmailSearchValue: (value) => set({ emailSearchValue: value }),

  clearFilters: () =>
    set({
      statusFilter: "all",
      fechaInicio: undefined,
      fechaFin: undefined,
      nameFilter: "",
      emailFilter: "",
      nameSearchValue: "",
      emailSearchValue: ""
    })
}));

export default useTicketFilterStore;
