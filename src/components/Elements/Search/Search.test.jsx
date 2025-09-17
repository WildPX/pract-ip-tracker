import { describe, expect, it, vi } from "vitest";
import { AddressContext, useAddress } from "../../../context/AddressContext";
import { render, screen } from "@testing-library/react";
import Search from "./Search";
import userEvent from "@testing-library/user-event";

// Mock AddressContext
vi.mock("../../../context/AddressContext.jsx", () => ({
  useAddress: vi.fn(),
  AddressContext: vi.importActual("../../../context/AddressContext.jsx")
    .AddressContext,
}));

describe("Search Component", () => {
  it("should call fetchData with the entered IP on form submission", async () => {
    // Setup mock and userEvent
    const mockFetchData = vi.fn();
    const user = userEvent.setup();

    // Return this object while mocking
    useAddress.mockReturnValue({
      fetchData: mockFetchData,
      setError: vi.fn(),
    });

    // Render Search component
    render(<Search />);

    // Enter IP address
    const input = screen.getByPlaceholderText("Enter IP Address");
    const button = screen.getByRole("button");

    await user.type(input, "8.8.8.8");

    expect(input.value).toBe("8.8.8.8");

    // Submit form
    await user.click(button);

    expect(mockFetchData).toHaveBeenCalledTimes(1);
    expect(mockFetchData).toHaveBeenCalledWith("8.8.8.8");
  });

  it("should call setError for an invalid query", async () => {
    const mockSetError = vi.fn();
    const user = userEvent.setup();

    // Mock return
    useAddress.mockReturnValue({
      fetchData: vi.fn(),
      setError: mockSetError,
    });

    // Render component
    render(<Search />);

    const input = screen.getByPlaceholderText("Enter IP Address");
    const button = screen.getByRole("button");

    // Enter invalid ip
    await user.type(input, "invalid ip");
    await user.click(button);

    expect(useAddress().fetchData).not.toHaveBeenCalled();
    expect(mockSetError).toHaveBeenCalledTimes(1);
    expect(mockSetError).toHaveBeenCalledWith("Invalid IP!");
  });

  it("should call fetchData with empty query", async () => {
    const mockFetchData = vi.fn();
    const user = userEvent.setup();

    useAddress.mockReturnValue({
      fetchData: mockFetchData,
      setError: vi.fn(),
    });

    render(<Search />);

    const button = screen.getByRole("button");

    // Enter empty query
    await user.click(button);

    expect(mockFetchData).toHaveBeenCalledTimes(1);
    expect(mockFetchData).toHaveBeenCalledWith("");
  });

  it("should call fetchData with an empty query after the user clears the input", async () => {
    const mockFetchData = vi.fn();
    const user = userEvent.setup();

    useAddress.mockReturnValue({
      fetchData: mockFetchData,
      setError: vi.fn(),
    });

    render(<Search />);

    const input = screen.getByPlaceholderText("Enter IP Address");
    const button = screen.getByRole("button");

    // First type
    await user.type(input, "8.8.8.8");
    expect(input.value).toBe("8.8.8.8");

    // User clears input
    await user.clear(input);
    expect(input.value).toBe("");

    // User clicks button
    await user.click(button);

    expect(mockFetchData).toHaveBeenCalledWith("");
  });

  it("should call fetchData with the entered IP on form submission with Enter key", async () => {
    // Setup mock and userEvent
    const mockFetchData = vi.fn();
    const user = userEvent.setup();

    // Return this object while mocking
    useAddress.mockReturnValue({
      fetchData: mockFetchData,
      setError: vi.fn(),
    });

    // Render Search component
    render(<Search />);

    // Enter IP address
    const input = screen.getByPlaceholderText("Enter IP Address");

    await user.type(input, "1.2.3.4{enter}");

    expect(mockFetchData).toHaveBeenCalledTimes(1);
    expect(mockFetchData).toHaveBeenCalledWith("1.2.3.4");
  });

  it.each([["256.0.0.1"], ["192.168.0"], ["1.2.3.4.5"], ["abc.def.ghi.jkl"]])(
    "should call setError for the invalid IP address: %s",
    async (invalidIp) => {
      const mockSetError = vi.fn();
      const mockFetchData = vi.fn();
      const user = userEvent.setup();

      useAddress.mockReturnValue({
        fetchData: mockFetchData,
        setError: mockSetError,
      });

      render(<Search />);

      const input = screen.getByPlaceholderText("Enter IP Address");
      const button = screen.getByRole("button");

      await user.type(input, invalidIp);
      await user.click(button);

      expect(mockSetError).toHaveBeenCalledWith("Invalid IP!");
      expect(mockFetchData).not.toHaveBeenCalled();
    }
  );

  it("should disable the button while data is being fetched", async () => {
    // Mock fetchData with uncontrolled promise
    const mockFetchData = vi.fn(() => new Promise(() => {})); // Always pending

    // Add loading to mock
    useAddress.mockReturnValue({
      loading: true,
      fetchData: mockFetchData,
      setError: vi.fn(),
    });

    render(<Search />);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
  });
});
