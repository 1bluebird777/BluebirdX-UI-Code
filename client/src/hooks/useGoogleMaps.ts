import { useEffect, useState } from "react";

/**
 * Custom hook to load Google Maps JavaScript API
 * @param apiKey - Google Maps API key (optional, will use env variable if not provided)
 * @returns Object with isLoaded and loadError states
 */
export function useGoogleMaps(apiKey?: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsLoaded(true));
      existingScript.addEventListener("error", () => setLoadError(new Error("Failed to load Google Maps")));
      return;
    }

    // Get API key from env variable or parameter
    const key = apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

    // Create script element
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.addEventListener("load", () => {
      setIsLoaded(true);
    });

    script.addEventListener("error", () => {
      setLoadError(new Error("Failed to load Google Maps API"));
    });

    document.head.appendChild(script);

    return () => {
      // Cleanup is not really necessary for Google Maps script
      // as it's typically loaded once per application lifetime
    };
  }, [apiKey]);

  return { isLoaded, loadError };
}
