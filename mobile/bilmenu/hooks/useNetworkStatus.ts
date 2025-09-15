import { useState, useEffect } from "react";

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const checkNetworkStatus = () => {
      // Simple fetch to check connectivity
      fetch("https://www.google.com", {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-cache",
      })
        .then(() => setIsConnected(true))
        .catch(() => setIsConnected(false));
    };

    // Check initial network status
    checkNetworkStatus();

    // Set up interval to check network status periodically
    const interval = setInterval(checkNetworkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    isOffline: !isConnected,
  };
};
