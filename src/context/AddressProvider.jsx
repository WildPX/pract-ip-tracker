import { useEffect, useRef, useState } from "react";
import { AddressContext } from "./AddressContext";
import { API_BASE, API_ENDPOINT, API_KEY } from "../const";

export const AddressProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Caching
  const cache = useRef({});

  const fetchData = async (query = "") => {
    // TODO: Has a bug when empty response and current IPs are different queries
    if (cache.current[query]) {
      setData(cache.current[query]);
      setLoading(false);
      setSuccess(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // const response = await fetch(
      //   `${API_BASE}${API_ENDPOINT}apiKey=${API_KEY}&ipAddress=${query}&`
      // );

      const response = await fetch(`${API_BASE}/geo-api?ipAddress=${query}`);

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const result = await response.json();

      cache.current[query] = result;

      setData(result);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AddressContext.Provider
      value={{
        data,
        loading,
        error,
        success,
        setError,
        fetchData,
        clearError,
        clearSuccess,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
