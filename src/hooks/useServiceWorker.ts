import { useEffect } from "react";

export function useServiceWorker() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return {
    /**
     * Save progress offline if network is unavailable
     * The service worker will sync when connection is restored
     */
    saveProgressOffline: async (progressData: any) => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "SAVE_PROGRESS_OFFLINE",
          progress: progressData,
        });
      }
    },

    /**
     * Check if device is currently online
     */
    isOnline: () => {
      return typeof navigator !== "undefined" ? navigator.onLine : true;
    },
  };
}
