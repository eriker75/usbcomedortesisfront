import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "@/auth.options";
import UserProfileImage from "@/components/UserProfileImage";

const AdminPage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              Panel de Administración
            </h1>
          </div>

          {/* User Profile Section */}
          <div className="p-6">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <UserProfileImage
                  imageUrl={session?.user?.image || ""}
                  userName={session?.user?.name || ""}
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {session?.user?.name}
                </h2>
                <p className="text-gray-600">{session?.user?.email}</p>
                <div className="mt-2 flex items-center">
                  <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                    {session?.user?.role?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Información de Cuenta
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin ID:</span>
                    <span className="text-gray-800">{session?.user?.id}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">ID Estudiante:</span>
                    <span className="text-gray-800">
                      {session?.user?.estudianteID || "No asignado"}
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
