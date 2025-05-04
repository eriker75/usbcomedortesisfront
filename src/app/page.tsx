"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="relative h-screen w-screen">
        <Image
          src="/comedor.jpg"
          alt="Fondo comedor"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center">
          <h1 className="text-4xl font-bold bg-white px-8 py-4 mt-10 rounded-lg shadow-lg">
            Sistema de Comedores USB
          </h1>
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={() => signIn("google")}
              className="bg-white border-2 border-blue-500 rounded-lg p-2 flex items-center gap-4 hover:shadow-2xl transition-all"
            >
              <Image
                src="/google-logo.png"
                height={30}
                width={30}
                alt="Google logo"
              />
              <span className="bg-blue-500 text-white px-4 py-3 hover:bg-blue-600 transition-colors">
                Sign in with Google
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default HomePage;
