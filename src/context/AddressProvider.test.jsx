import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAddress } from "./AddressContext";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AddressProvider } from "./AddressProvider";
import { API_BASE, API_ENDPOINT, API_KEY } from "../const";

vi.mock("../const", () => ({
  API_BASE: "https://api.example.com/",
  API_ENDPOINT: "lookup?",
  API_KEY: "test-key",
}));

// Test component to get confirmation on API calls
const TestComponent = () => {
  const { data, loading, error, success, fetchData, clearError, clearSuccess } =
    useAddress();

  return (
    <div>
      <div data-testid="loading">{loading ? "loading" : "not-loading"}</div>
      <div data-testid="error">{error || "no-error"}</div>
      <div data-testid="success">{success ? "success" : "no-success"}</div>
      <div data-testid="data">{data ? JSON.stringify(data) : "no-data"}</div>
      <button onClick={() => fetchData("192.168.1.1")} data-testid="fetch-btn">
        Fetch Data
      </button>
      <button onClick={clearError} data-testid="clear-error-btn">
        Clear Error
      </button>
      <button onClick={clearSuccess} data-testid="clear-success-btn">
        Clear Success
      </button>
    </div>
  );
};

describe("AddressProvider", () => {
  // Clear all mocks before each tests
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("should provide initial context values", async () => {
      // Mock successful API response as initial fetch
      const mockData = { ip: "0.0.0.0", country: "Unknown" };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      render(
        <AddressProvider>
          <TestComponent />
        </AddressProvider>
      );

      // Loading state
      expect(screen.getByTestId("loading")).toHaveTextContent("loading");
      expect(screen.getByTestId("error")).toHaveTextContent("no-error");
      expect(screen.getByTestId("success")).toHaveTextContent("no-success");

      // Wait for initial fetch to complete
      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("not-loading");
      });

      // API call should be successful
      expect(screen.getByTestId("success")).toHaveTextContent("success");
      expect(screen.getByTestId("data")).toHaveTextContent(
        JSON.stringify(mockData)
      );
    });
  });

  describe("API Calls", () => {
    it("should use mock consts", () => {
      expect(API_BASE).toBe("https://api.example.com/");
      expect(API_ENDPOINT).toBe("lookup?");
      expect(API_KEY).toBe("test-key");
    });

    it("should handle empty response data", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      });

      render(
        <AddressProvider>
          <TestComponent />
        </AddressProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("data")).toHaveTextContent("no-data");
        expect(screen.getByTestId("success")).toHaveTextContent("success");
      });
    });

    it("should handle JSON parsing errors", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      render(
        <AddressProvider>
          <TestComponent />
        </AddressProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("error")).toHaveTextContent("Invalid JSON");
      });
    });

    it("should make initial API call on mount", async () => {
      const mockData = { ip: "0.0.0.0", country: "Unknown" };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      render(
        <AddressProvider>
          <TestComponent />
        </AddressProvider>
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          `${API_BASE}${API_ENDPOINT}apiKey=${API_KEY}&ipAddress=&`
        );
      });
    });

    it("should make API call with query when fetchData is called", async () => {
      // Initial fetch
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ip: "0.0.0.0" }),
      });

      // Fetch with query data
      const mockData = { ip: "192.168.1.1", country: "Test" };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      render(
        <AddressProvider>
          <TestComponent />
        </AddressProvider>
      );

      // Wait for not-loading state
      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("not-loading");
      });

      // Fetch data
      await act(async () => {
        screen.getByTestId("fetch-btn").click();
      });

      expect(screen.getByTestId("success")).toHaveTextContent("success");
      expect(screen.getByTestId("data")).toHaveTextContent(
        JSON.stringify(mockData)
      );
    });

    it("should handle API errors", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      render(
        <AddressProvider>
          <TestComponent />
        </AddressProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("error")).toHaveTextContent("Search failed");
        expect(screen.getByTestId("loading")).toHaveTextContent("not-loading");
      });
    });

    it("should handle network errors", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Network down"));

      render(
        <AddressProvider>
          <TestComponent />
        </AddressProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("error")).toHaveTextContent("Network down");
      });
    });
  });

  describe("Caching", () => {
    it("should cache successful responses", async () => {
      const mockData = { ip: "192.168.1.1", country: "Test" };

      // Initial fetch
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ip: "0.0.0.0" }),
      });

      // Mock call with mockData IP
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      render(
        <AddressProvider>
          {" "}
          <TestComponent />
        </AddressProvider>
      );

      // Initial load
      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("not-loading");
      });

      // First call
      await act(async () => {
        screen.getByTestId("fetch-btn").click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("data")).toHaveTextContent(
          JSON.stringify(mockData)
        );
      });

      // Second call with the same IP
      await act(async () => {
        screen.getByTestId("fetch-btn").click();
      });

      // Global fetch should've been only twice (initial + first fetch)
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId("data")).toHaveTextContent(
        JSON.stringify(mockData)
      );
    });
  });

  describe("State Management", () => {
    it("should clear error when clearError is called", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Test error"));

      render(
        <AddressProvider>
          <TestComponent />
        </AddressProvider>
      );

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByTestId("error")).toHaveTextContent("Test error");
      });

      // Clear the error
      await act(async () => {
        screen.getByTestId("clear-error-btn").click();
      });

      expect(screen.getByTestId("error")).toHaveTextContent("no-error");
    });

    it("should clear success when clearSuccess is called", async () => {
      const mockData = { ip: "0.0.0.0", country: "Unknown" };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      render(
        <AddressProvider>
          <TestComponent />
        </AddressProvider>
      );

      // Wait for success state
      await waitFor(() => {
        expect(screen.getByTestId("success")).toHaveTextContent("success");
      });

      // Clear the success
      await act(async () => {
        screen.getByTestId("clear-success-btn").click();
      });

      expect(screen.getByTestId("success")).toHaveTextContent("no-success");
    });

    it("should reset states when making new API call", async () => {
      // Mock initial successful call
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ip: "0.0.0.0" }),
      });

      // Mock second call that will fail
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      render(
        <AddressProvider>
          <TestComponent />
        </AddressProvider>
      );

      // Wait for initial success
      await waitFor(() => {
        expect(screen.getByTestId("success")).toHaveTextContent("success");
      });

      // Make another call that will fail
      await act(async () => {
        screen.getByTestId("fetch-btn").click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("error")).toHaveTextContent("Network error");
        expect(screen.getByTestId("success")).toHaveTextContent("no-success");
      });
    });
  });

  describe("Loading States", () => {
    it("should show loading state during API calls", async () => {
      let resolvePromise;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      global.fetch.mockReturnValueOnce(promise);

      render(
        <AddressProvider>
          {" "}
          <TestComponent />
        </AddressProvider>
      );

      expect(screen.getByTestId("loading")).toHaveTextContent("loading");

      resolvePromise({
        ok: true,
        json: async () => ({ ip: "0.0.0.0" }),
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("not-loading");
      });
    });
  });
});
