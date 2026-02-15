import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BMICalculatorPage from "./page";

// Mock useTranslation
vi.mock("@/i18n", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("BMICalculatorPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<BMICalculatorPage />);
    expect(screen.getByText("toolPages.bmi-calculator.metric")).toBeInTheDocument();
    expect(screen.getByText("toolPages.bmi-calculator.imperial")).toBeInTheDocument();
    expect(screen.getByText("toolPages.bmi-calculator.calculate")).toBeInTheDocument();
  });

  it("calculates BMI in metric units", () => {
    render(<BMICalculatorPage />);
    
    const heightInput = screen.getByPlaceholderText("170");
    const weightInput = screen.getByPlaceholderText("70");
    const calculateBtn = screen.getByText("toolPages.bmi-calculator.calculate");

    fireEvent.change(heightInput, { target: { value: "170" } });
    fireEvent.change(weightInput, { target: { value: "70" } });
    fireEvent.click(calculateBtn);

    // BMI = 70 / (1.7^2) = 24.2
    expect(screen.getByText("24.2")).toBeInTheDocument();
    expect(screen.getByText("toolPages.bmi-calculator.normal")).toBeInTheDocument();
  });

  it("calculates BMI in imperial units", () => {
    render(<BMICalculatorPage />);
    
    const imperialBtn = screen.getByText("toolPages.bmi-calculator.imperial");
    fireEvent.click(imperialBtn);

    const heightInput = screen.getByPlaceholderText("67");
    const weightInput = screen.getByPlaceholderText("154");
    const calculateBtn = screen.getByText("toolPages.bmi-calculator.calculate");

    fireEvent.change(heightInput, { target: { value: "67" } });
    fireEvent.change(weightInput, { target: { value: "154" } });
    fireEvent.click(calculateBtn);

    // BMI = (154 / (67^2)) * 703 ≈ 24.1
    expect(screen.getByText("24.1")).toBeInTheDocument();
  });

  it("shows underweight category", () => {
    render(<BMICalculatorPage />);
    
    const heightInput = screen.getByPlaceholderText("170");
    const weightInput = screen.getByPlaceholderText("70");
    const calculateBtn = screen.getByText("toolPages.bmi-calculator.calculate");

    fireEvent.change(heightInput, { target: { value: "180" } });
    fireEvent.change(weightInput, { target: { value: "55" } });
    fireEvent.click(calculateBtn);

    expect(screen.getByText("17")).toBeInTheDocument();
    expect(screen.getAllByText("toolPages.bmi-calculator.underweight")[0]).toBeInTheDocument();
  });

  it("shows overweight category", () => {
    render(<BMICalculatorPage />);
    
    const heightInput = screen.getByPlaceholderText("170");
    const weightInput = screen.getByPlaceholderText("70");
    const calculateBtn = screen.getByText("toolPages.bmi-calculator.calculate");

    fireEvent.change(heightInput, { target: { value: "170" } });
    fireEvent.change(weightInput, { target: { value: "80" } });
    fireEvent.click(calculateBtn);

    expect(screen.getByText("27.7")).toBeInTheDocument();
    expect(screen.getAllByText("toolPages.bmi-calculator.overweight")[0]).toBeInTheDocument();
  });

  it("shows obese category", () => {
    render(<BMICalculatorPage />);
    
    const heightInput = screen.getByPlaceholderText("170");
    const weightInput = screen.getByPlaceholderText("70");
    const calculateBtn = screen.getByText("toolPages.bmi-calculator.calculate");

    fireEvent.change(heightInput, { target: { value: "170" } });
    fireEvent.change(weightInput, { target: { value: "95" } });
    fireEvent.click(calculateBtn);

    expect(screen.getByText("32.9")).toBeInTheDocument();
    expect(screen.getAllByText("toolPages.bmi-calculator.obese")[0]).toBeInTheDocument();
  });

  it("handles invalid input", () => {
    render(<BMICalculatorPage />);
    
    const calculateBtn = screen.getByText("toolPages.bmi-calculator.calculate");
    fireEvent.click(calculateBtn);

    expect(screen.queryByText("toolPages.bmi-calculator.yourBMI")).not.toBeInTheDocument();
  });

  it("switches between metric and imperial", () => {
    render(<BMICalculatorPage />);
    
    const metricBtn = screen.getByText("toolPages.bmi-calculator.metric");
    const imperialBtn = screen.getByText("toolPages.bmi-calculator.imperial");

    expect(screen.getByPlaceholderText("170")).toBeInTheDocument();
    
    fireEvent.click(imperialBtn);
    expect(screen.getByPlaceholderText("67")).toBeInTheDocument();
    
    fireEvent.click(metricBtn);
    expect(screen.getByPlaceholderText("170")).toBeInTheDocument();
  });
});
