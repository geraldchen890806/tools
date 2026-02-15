import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import UnitConverterPage from "./page";

// Mock useTranslation
vi.mock("@/i18n", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("UnitConverterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<UnitConverterPage />);
    expect(screen.getByText("toolPages.unit-converter.length")).toBeInTheDocument();
    expect(screen.getByText("toolPages.unit-converter.weight")).toBeInTheDocument();
    expect(screen.getByText("toolPages.unit-converter.temperature")).toBeInTheDocument();
  });

  it("converts length units", () => {
    render(<UnitConverterPage />);
    const inputs = screen.getAllByPlaceholderText("0");
    
    fireEvent.change(inputs[0], { target: { value: "1000" } });
    
    expect(inputs[1]).toHaveValue(1); // 1000m = 1km
  });

  it("converts weight units", () => {
    render(<UnitConverterPage />);
    const weightBtn = screen.getByText("toolPages.unit-converter.weight");
    fireEvent.click(weightBtn);

    const inputs = screen.getAllByPlaceholderText("0");
    
    fireEvent.change(inputs[0], { target: { value: "1000" } });
    
    expect(inputs[1]).toHaveValue(1); // 1000kg = 1t (ton)
  });

  it("converts temperature units", () => {
    render(<UnitConverterPage />);
    const tempBtn = screen.getByText("toolPages.unit-converter.temperature");
    fireEvent.click(tempBtn);

    const inputs = screen.getAllByPlaceholderText("0");
    
    fireEvent.change(inputs[0], { target: { value: "0" } });
    
    // 0°C to Fahrenheit should be 32°F
    expect(parseFloat(inputs[1].value)).toBeCloseTo(32, 1);
  });

  it("handles bidirectional conversion", () => {
    render(<UnitConverterPage />);
    const inputs = screen.getAllByPlaceholderText("0");
    
    // Convert forward
    fireEvent.change(inputs[0], { target: { value: "1000" } });
    expect(inputs[1]).toHaveValue(1);
    
    // Convert backward
    fireEvent.change(inputs[1], { target: { value: "2" } });
    expect(inputs[0]).toHaveValue(2000);
  });

  it("changes unit type and resets values", () => {
    render(<UnitConverterPage />);
    const inputs = screen.getAllByPlaceholderText("0");
    
    fireEvent.change(inputs[0], { target: { value: "100" } });
    
    const weightBtn = screen.getByText("toolPages.unit-converter.weight");
    fireEvent.click(weightBtn);
    
    // Values should be reset when changing unit type
    expect(inputs[0]).toHaveValue(null);
  });

  it("handles invalid input", () => {
    render(<UnitConverterPage />);
    const inputs = screen.getAllByPlaceholderText("0");
    
    fireEvent.change(inputs[0], { target: { value: "abc" } });
    
    expect(inputs[1]).toHaveValue(null);
  });

  it("converts area units", () => {
    render(<UnitConverterPage />);
    const areaBtn = screen.getByText("toolPages.unit-converter.area");
    fireEvent.click(areaBtn);

    const inputs = screen.getAllByPlaceholderText("0");
    
    fireEvent.change(inputs[0], { target: { value: "10000" } });
    
    // 10000 m² = 1 km²
    expect(parseFloat(inputs[1].value)).toBeCloseTo(0.01, 5);
  });

  it("converts volume units", () => {
    render(<UnitConverterPage />);
    const volumeBtn = screen.getByText("toolPages.unit-converter.volume");
    fireEvent.click(volumeBtn);

    const inputs = screen.getAllByPlaceholderText("0");
    
    fireEvent.change(inputs[0], { target: { value: "1" } });
    
    // 1 m³ = 1000 L
    expect(parseFloat(inputs[1].value)).toBeCloseTo(1000, 1);
  });
});
