"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { status, data: session } = useSession();
  const role = session?.user?.role;

  return (
    <div className="p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <Link className="font-bold text-lg text-blue-700" href="/">
          COMEDOR USB
        </Link>
        {status === "authenticated" && role === "admin" && (
          <>
            <Link
              className="text-gray-800 hover:text-sky-400 transition-colors"
              href="/admin/escanear"
            >
              Escanear QR
            </Link>
            <Link
              className="text-gray-800 hover:text-sky-400 transition-colors"
              href="/admin/tickets"
            >
              Tickets
            </Link>
            <Link
              className="text-gray-800 hover:text-sky-400 transition-colors"
              href="/admin/tickets/crear"
            >
              Crear Ticket
            </Link>
          </>
        )}
        {status === "authenticated" && role === "user" && (
          <>
            <Link
              className="text-gray-800 hover:text-sky-400 transition-colors"
              href="/dashboard/tickets"
            >
              Mis Tickets
            </Link>
          </>
        )}
      </div>
      {status === "authenticated" && (
        <button
          onClick={() => signOut()}
          className="bg-slate-900 text-white px-6 py-2 rounded-md"
        >
          Cerrar Sesion
        </button>
      )}
    </div>
  );
}
