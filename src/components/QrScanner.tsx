import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QrScannerProps {
  onResult: (text: string) => void;
  onClose: () => void;
}

const REGION_ID = "qr-scanner-region";

export default function QrScanner({ onResult, onClose }: QrScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5Qrcode(REGION_ID);
    scannerRef.current = scanner;
    let active = true;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          if (!active) return;
          active = false;
          onResult(decodedText);
        },
        () => {
          /* per-frame decode errors are expected; ignore */
        },
      )
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to access the camera. Check browser permissions.",
        );
      });

    return () => {
      active = false;
      if (scanner.isScanning) {
        scanner.stop().catch(() => undefined);
      }
    };
  }, [onResult]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Scan device QR code</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close scanner"
            className="text-slate-500 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        <div
          id={REGION_ID}
          className="overflow-hidden rounded-lg bg-slate-100"
        />

        {error ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : (
          <p className="mt-3 text-xs text-slate-500">
            Point your camera at the device's QR code or barcode.
          </p>
        )}
      </div>
    </div>
  );
}
