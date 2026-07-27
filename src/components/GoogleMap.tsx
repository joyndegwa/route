import { useEffect, useRef, useState } from "react";
import type { Shop } from "../types/shop";

declare global {
  interface Window {
    google?: {
      maps: any;
    };
  }
}

interface GoogleMapProps {
  shops: Shop[];
  center?: { lat: number; lng: number } | null;
  height?: string;
}

export default function GoogleMap({
  shops,
  center,
  height = "400px",
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();

    if (!apiKey) {
      setError("Google Maps API key is not configured.");
      setLoading(false);
      return;
    }

    const defaultCenter = { lat: -1.2921, lng: 36.8219 };
    let isMounted = true;

    const startMap = (
      mapCenter: { lat: number; lng: number },
      userLat: number,
      userLng: number,
    ) => {
      loadGoogleMapsScript(apiKey)
        .then(() => {
          if (!isMounted) return;
          initMap(mapCenter, userLat, userLng);
        })
        .catch((err) => {
          if (!isMounted) return;
          setError(err.message || "Failed to load Google Maps.");
          setLoading(false);
        });
    };

    if (!navigator.geolocation) {
      setWarning("Geolocation is not supported. Showing default view.");
      startMap(defaultCenter, defaultCenter.lat, defaultCenter.lng);
      return () => {
        isMounted = false;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isMounted) return;
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const mapCenter = center || { lat: userLat, lng: userLng };
        startMap(mapCenter, userLat, userLng);
      },
      () => {
        if (!isMounted) return;
        setWarning("Location permission denied. Showing default view.");
        startMap(defaultCenter, defaultCenter.lat, defaultCenter.lng);
      },
    );

    return () => {
      isMounted = false;
    };
  }, [center]);

  const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google?.maps) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Google Maps script"));
      document.head.appendChild(script);
    });
  };

  const initMap = (
    mapCenter: { lat: number; lng: number },
    userLat: number,
    userLng: number,
  ) => {
    if (!mapRef.current || !window.google?.maps) return;

    const maps = window.google.maps;

    const map = new maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;

    new maps.Marker({
      position: { lat: userLat, lng: userLng },
      map,
      title: "Your location",
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#2563EB",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 3,
      },
    });

    shops.forEach((shop, index) => {
      const lat = shop.lat ?? mapCenter.lat + (index % 2 === 0 ? 0.01 : -0.01);
      const lng = shop.lng ?? mapCenter.lng + (index % 2 === 0 ? 0.01 : -0.01);

      const marker = new maps.Marker({
        position: { lat, lng },
        map,
        title: shop.name,
        icon: {
          path: maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 8,
          fillColor: shop.type === "repair" ? "#2563EB" : "#16A34A",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
      });

      const distanceText =
        shop.distance !== undefined
          ? `${shop.distance.toFixed(1)} km · ⭐ ${shop.rating}`
          : `⭐ ${shop.rating}`;

      const infoWindow = new maps.InfoWindow({
        content: `
          <div style="font-family: system-ui, sans-serif; padding: 4px;">
            <strong>${shop.name}</strong><br/>
            <span style="color: #666;">${shop.address}</span><br/>
            <span style="color: #666;">${distanceText}</span>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });

    setLoading(false);
  };

  if (error) {
    return (
      <div
        className="flex h-full items-center justify-center rounded-xl bg-slate-100 p-6"
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-3xl">🗺️</p>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
          <p className="mt-1 text-xs text-slate-400">
            Add VITE_GOOGLE_MAPS_API_KEY to your .env file to enable real maps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full overflow-hidden rounded-xl">
      {warning && (
        <div className="rounded-t-xl bg-yellow-100 px-4 py-2 text-sm text-yellow-800">
          {warning}
        </div>
      )}
      {loading && (
        <div
          className="flex items-center justify-center rounded-xl bg-slate-100"
          style={{ height }}
        >
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
            <p className="mt-2 text-sm text-slate-600">Loading map…</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="h-full w-full" style={{ minHeight: height }} />
    </div>
  );
}