import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CalculatorPage from "./page";

// Mock useTranslation
vi.mock("@/i18n", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("CalculatorPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<CalculatorPage />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("toolPages.calculator.clear")).toBeInTheDocument();
  });

  it("appends numbers", () => {
    render(<CalculatorPage />);
    
    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText("3"));
    
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  it("performs basic addition", () => {
    render(<CalculatorPage />);
    
    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("3"));
    fireEvent.click(screen.getByText("="));
    
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("performs subtraction", () => {
    render(<CalculatorPage />);
    
    fireEvent.click(screen.getByText("9"));
    fireEvent.click(screen.getByText("−"));
    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText("="));
    
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("performs multiplication", () => {
    render(<CalculatorPage />);
    
    fireEvent.click(screen.getByText("6"));
    fireEvent.click(screen.getByText("×"));
    fireEvent.click(screen.getByText("7"));
    fireEvent.click(screen.getByText("="));
    
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("performs division", () => {
    render(<CalculatorPage />);
    
    fireEvent.click(screen.getByText("8"));
    fireEvent.click(screen.getByText("÷"));
    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText("="));
    
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("clears display", () => {
    render(<CalculatorPage />);
    
    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText("3"));
    fireEvent.click(screen.getByText("toolPages.calculator.clear"));
    
    expect(screen.getAllByText("0")[0]).toBeInTheDocument();
  });

  it("handles decimal points", () => {
    render(<CalculatorPage />);
    
    fireEvent.click(screen.getByText("3"));
    fireEvent.click(screen.getByText("."));
    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByText("4"));
    
    expect(screen.getByText("3.14")).toBeInTheDocument();
  });

  it("calculates square root", () => {
    render(<CalculatorPage />);
    
    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByText("6"));
    fireEvent.click(screen.getByText("√"));
    
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("negates number", () => {
    render(<CalculatorPage />);
    
    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByText("±"));
    
    expect(screen.getByText("-5")).toBeInTheDocument();
  });

  it("calculates percentage", () => {
    render(<CalculatorPage />);
    
    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByText("0"));
    fireEvent.click(screen.getByText("%"));
    
    expect(screen.getByText("0.5")).toBeInTheDocument();
  });

  it("handles backspace", () => {
    render(<CalculatorPage />);
    
    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText("3"));
    fireEvent.click(screen.getByText("⌫"));
    
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("performs complex calculations", () => {
    render(<CalculatorPage />);
    
    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("3"));
    fireEvent.click(screen.getByText("×"));
    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText("="));
    
    expect(screen.getByText("14")).toBeInTheDocument();
  });
});
