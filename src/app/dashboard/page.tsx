import { getServerSession } from "next-auth";
import { Suspense } from "react";
import Image from "next/image";
import { authOptions } from "@/auth.options";
import UserCard from "@/components/UseCard";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:7500";

async function getQRCode(email: string) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/user/qrcode?email=${email}`,
      {
        cache: "force-cache"
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.qrCode;
  } catch (error) {
    console.error("Error fetching QR code:", error);
    return null;
  }
}

async function QRCodeDisplay({ email }: { email: string }) {
  const qrCodeData = await getQRCode(email);

  if (!qrCodeData) {
    return <div>QR code not available</div>;
  }

  return (
    <Image
      src={qrCodeData}
      alt="QR Code"
      width={300}
      height={300}
      style={{
        padding: "5px",
        borderRadius: "5px"
      }}
    />
  );
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="grid place-items-center h-screen">
        <div>Please sign in to view your information</div>
      </div>
    );
  }

  return (
    <div className="grid place-items-center h-screen -mt-24">
      <UserCard session={session}>
        <Suspense fallback={<div>Loading QR code...</div>}>
          <QRCodeDisplay email={session.user.email} />
        </Suspense>
      </UserCard>
    </div>
  );
}
