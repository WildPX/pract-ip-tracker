import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DataItem from "./DataItem";

describe("DataItem Component", () => {
  it("should render the title and text correctly", () => {
    const title = "IP Address";
    const text = "192.168.0.1";

    render(<DataItem title={title} text={text} />);

    const titleElement = screen.getByText(title);
    const textElement = screen.getByText(text);

    expect(titleElement).toBeInTheDocument();
    expect(textElement).toBeInTheDocument();
  });
});
