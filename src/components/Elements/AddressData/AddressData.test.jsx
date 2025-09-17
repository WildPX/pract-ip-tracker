import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AddressContext } from "../../../context/AddressContext";
import AddressData from "./AddressData";

describe("AddressData Component", () => {
  it("should render placeholders (—) when data is null", () => {
    const mockContextValue = {
      data: null,
    };

    render(
      <AddressContext.Provider value={mockContextValue}>
        <AddressData />
      </AddressContext.Provider>
    );

    const placeholders = screen.getAllByText("—");
    expect(placeholders).toHaveLength(4);
  });

  it("should render all data correctly when data is available", () => {
    const mockData = {
      ip: "8.8.8.8",
      location: {
        city: "Mountain View",
        country: "US",
        timezone: "-07:00",
      },
      isp: "Google LLC",
    };

    const mockContextValue = { data: mockData };

    render(
      <AddressContext.Provider value={mockContextValue}>
        <AddressData />
      </AddressContext.Provider>
    );

    expect(screen.getByText("8.8.8.8")).toBeInTheDocument();
    expect(screen.getByText("Mountain View, US")).toBeInTheDocument();
    expect(screen.getByText("UTC -07:00")).toBeInTheDocument();
    expect(screen.getByText("Google LLC")).toBeInTheDocument();
  });

  it("should handle partial data correctly", () => {
    const mockPartialData = {
      ip: "1.2.3.4",
      location: {
        city: "",
        country: "AU",
        timezone: "+10:00",
      },
      isp: "",
    };

    const mockContextValue = { data: mockPartialData };

    render(
      <AddressContext.Provider value={mockContextValue}>
        <AddressData />
      </AddressContext.Provider>
    );

    expect(screen.getByText("1.2.3.4")).toBeInTheDocument();
    expect(screen.getByText("—, AU")).toBeInTheDocument();
    expect(screen.getByText("UTC +10:00")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
