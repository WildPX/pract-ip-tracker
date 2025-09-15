import { useState } from "react";
import { AddressContext } from "./AddressContext";

export const AddressProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (query) => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}${
          import.meta.env.VITE_API_ENDPOINT
        }apiKey=${import.meta.env.VITE_API_KEY}&ipAddress=${query}&`
      );

      if (!response.ok) {
        throw new Error("Fetch failed");
      }

      const result = await response.json();
      console.log(result);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddressContext.Provider value={{ data, loading, error, fetchData }}>
      {children}
    </AddressContext.Provider>
  );
};
