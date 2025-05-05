"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Head from "next/head";
import { Html5QrcodeScanner } from "html5-qrcode";
import toast, { Toaster } from "react-hot-toast";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:7500";

const QrScannerPage = () => {
  const [scanResult, setScanResult] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const DEBOUNCE_DELAY = 3000;

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const consumeTicket = async (email: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/ticket/consume-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message);
        console.log("Éxito:", responseData);
      } else {
        toast.error(responseData.message);
        console.error("Error:", responseData);
      }
    } catch (error) {
      toast.error("Error al comunicarse con el servidor");
      console.error("Error en la petición:", error);
    }
  };

  const handleQrCodeSuccess = useCallback(
    async (result: string) => {
      const currentTime = Date.now();
      if (currentTime - lastScanTimeRef.current < DEBOUNCE_DELAY) {
        return;
      }

      lastScanTimeRef.current = currentTime;
      if (result !== scanResult) {
        setScanResult(result);
        await consumeTicket(result);
      }
    },
    [scanResult]
  );

  const startScanner = () => {
    if (!scannerRef.current && !isScanning) {
      try {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(() => {
            scannerRef.current = new Html5QrcodeScanner(
              "reader",
              {
                qrbox: {
                  width: 250,
                  height: 250
                },
                fps: 10,
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true,
                showZoomSliderIfSupported: true,
                defaultZoomValueIfSupported: 2
              },
              false
            );

            // Modificamos la función de error para que solo muestre errores críticos
            const error = (err: unknown) => {
              // Solo registrar errores en la consola para debugging
              console.debug("QR code scan error:", err);

              // Verificar si es un error crítico que necesita ser mostrado
              if (err instanceof Error) {
                const errorMessage = err.message.toLowerCase();
                if (
                  errorMessage.includes("camera") ||
                  errorMessage.includes("permission") ||
                  errorMessage.includes("not found") ||
                  errorMessage.includes("not available")
                ) {
                  toast.error(
                    "Error con la cámara. Por favor, verifica los permisos."
                  );
                  setCameraError(
                    "Error con la cámara. Por favor, verifica los permisos."
                  );
                  stopScanner(); // Detener el escáner si hay un error crítico
                }
              }
            };

            scannerRef.current.render(handleQrCodeSuccess, error);
            setIsScanning(true);
            setCameraError(null);
            toast.success("Escáner iniciado", {
              id: "scanner-start", // Identificador único para evitar duplicados
              duration: 2000
            });
          })
          .catch((err) => {
            setCameraError(
              "No se pudo acceder a la cámara. Por favor, verifica los permisos."
            );
            toast.error("Error al acceder a la cámara", {
              id: "camera-error" // Identificador único para evitar duplicados
            });
            console.error(err);
          });
      } catch (err) {
        setCameraError("Error al inicializar la cámara");
        toast.error("Error al inicializar la cámara", {
          id: "init-error" // Identificador único para evitar duplicados
        });
        console.error(err);
      }
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
        setScanResult("");
        toast.success("Escáner detenido");
      } catch (err) {
        console.error("Error al detener el escáner:", err);
        toast.error("Error al detener el escáner");
      }
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Lector de Código QR</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lector de Código QR
          </h1>
          <p className="text-gray-600">
            Escanea el código QR para verificar el ticket
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
                borderRadius: "8px"
              },
              // Prevenir múltiples toasts del mismo tipo
              success: {
                duration: 2000,
                id: "success-toast"
              },
              error: {
                duration: 3000,
                id: "error-toast"
              }
            }}
          />

          {cameraError && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700 text-sm">{cameraError}</p>
            </div>
          )}

          <div
            id="reader"
            className="overflow-hidden rounded-lg bg-gray-50 mb-6"
          ></div>

          <div className="flex justify-center space-x-4">
            {!isScanning ? (
              <button
                onClick={startScanner}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                Iniciar Escáner
              </button>
            ) : (
              <button
                onClick={stopScanner}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                Detener Escáner
              </button>
            )}
          </div>

          {scanResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Último escaneo
              </h3>
              <p className="text-gray-600 break-all">{scanResult}</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Asegúrate de permitir el acceso a la cámara cuando el navegador lo
            solicite
          </p>
        </div>
      </div>
    </div>
  );
};

export default QrScannerPage;
