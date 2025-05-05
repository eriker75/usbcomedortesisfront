"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { Combobox } from "@headlessui/react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";

// Tipos
interface TicketFormData {
  precioTicket: number;
  quantity: number;
  userId: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  becado?: boolean;
}

interface UsersResponse {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  qrCode?: string;
  becado?: boolean;
  estudianteID?: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:7500";

const CreateTicketPage = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UsersResponse[]>([]);
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<TicketFormData>({
    defaultValues: {
      quantity: 1
    }
  });

  console.log(users);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<UsersResponse[]>(
          `${BACKEND_URL}/api/user`
        );

        console.log(response);
        // Filtrar solo usuarios con role "user"
        const regularUsers = response.data.filter(
          (user: User) => user.role === "user"
        );
        setUsers(regularUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Filtrar usuarios basado en la búsqueda
  const filteredUsers =
    query === ""
      ? users
      : users.filter((user) => {
          const searchStr = `${user.name} ${user.email}`.toLowerCase();
          return searchStr.includes(query.toLowerCase());
        });

  const onSubmit = async (data: TicketFormData) => {
    if (!selectedUser) {
      alert("Por favor seleccione un usuario");
      return;
    }

    setLoading(true);
    try {
      console.log("data to send", {
        precioTicket: data.precioTicket,
        quantity: data.quantity.toString(),
        userId: data.userId
      });

      const response = await axios.post(`${BACKEND_URL}/api/ticket`, {
        precioTicket: data.precioTicket,
        quantity: data.quantity.toString(),
        userId: data.userId
      });

      console.log(response);

      if (response.status === 201) {
        alert(`Tickets creados exitosamente: ${response.data.message}`);
        reset();
        setSelectedUser(null);
        setQuery("");
      }
    } catch (error) {
      console.error("Error creating tickets:", error);
      alert("Error al crear tickets");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Crear Tickets de Comedor</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Combobox para selección de usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usuario
          </label>
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <Combobox
                value={selectedUser}
                onChange={(user: User | null) => {
                  setSelectedUser(user);
                  field.onChange(user?._id || "");
                }}
                nullable
              >
                <div className="relative">
                  <div className="relative w-full cursor-pointer overflow-hidden rounded-md bg-white text-left border focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
                    <Combobox.Button as="div" className="w-full">
                      <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                        displayValue={(user: User) =>
                          user
                            ? `${user.name} - ${user.email}${
                                user.becado ? " (Becado)" : ""
                              }`
                            : ""
                        }
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Buscar usuario..."
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <HiChevronUpDown
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Combobox.Button>
                  </div>
                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                    {filteredUsers.length === 0 && query !== "" ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        No se encontraron usuarios.
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <Combobox.Option
                          key={user._id}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-blue-600 text-white"
                                : "text-gray-900"
                            }`
                          }
                          value={user}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {user.name} - {user.email}
                                {user.becado && " (Becado)"}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? "text-white" : "text-blue-600"
                                  }`}
                                >
                                  <HiCheck
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </div>
              </Combobox>
            )}
          />
        </div>

        {/* Cantidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad de Tickets
          </label>
          <input
            type="number"
            {...register("quantity", {
              required: "Ingrese la cantidad",
              min: { value: 1, message: "Mínimo 1 ticket" }
            })}
            className="w-full p-2 border rounded-md"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">
              {errors.quantity.message}
            </p>
          )}
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio por Ticket (Bs)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("precioTicket", {
              required: "Ingrese el precio",
              min: { value: 0, message: "El precio no puede ser negativo" }
            })}
            className="w-full p-2 border rounded-md"
          />
          {errors.precioTicket && (
            <p className="text-red-500 text-sm mt-1">
              {errors.precioTicket.message}
            </p>
          )}
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-2 px-4 rounded-md text-white font-medium
            ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          {loading ? "Creando tickets..." : "Crear Tickets"}
        </button>
      </form>
    </div>
  );
};

export default CreateTicketPage;
