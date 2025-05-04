"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function UserInfo() {
  const { status, data: session } = useSession();
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  //const SIZE = 500;

  useEffect(() => {
    const fetchImage = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {

          const response = await fetch(`http://localhost:5500/api/user/qrcode?email=${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setQrCodeData(data.qrCode);
          } else {
            console.error("Error fetching image:", response.status);
          }
        } catch (error) {
          console.error("Error fetching image:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchImage();
  }, [session?.user?.email, status]);

    return (
      <div className="shadow-xl p-8 rounded-md flex flex-col gap-3 bg-yellow-200">
        {isLoading ? (
          <div>Loading QR code...</div>
        ) : qrCodeData ? (
          <div>
            <Image
              src={qrCodeData}
              alt="Base64 Image"
              width={300}
              height={300}
              style={{
                padding: "5px",
                borderRadius: "5px",
              }}
            />
          </div>
        ) : (
          <div>QR code not available</div>
        )}
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>
        
      </div>
    );
}
