import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoanCalculatorPage from "./page";

// Mock useTranslation
vi.mock("@/i18n", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("LoanCalculatorPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<LoanCalculatorPage />);
    expect(screen.getByText("toolPages.loan-calculator.equalPayment")).toBeInTheDocument();
    expect(screen.getByText("toolPages.loan-calculator.equalPrincipal")).toBeInTheDocument();
    expect(screen.getByText("toolPages.loan-calculator.calculate")).toBeInTheDocument();
  });

  it("calculates equal payment loan", () => {
    render(<LoanCalculatorPage />);
    
    const loanAmountInput = screen.getByPlaceholderText("1000000");
    const rateInput = screen.getByPlaceholderText("4.9");
    const termInput = screen.getByPlaceholderText("30");
    const calculateBtn = screen.getByText("toolPages.loan-calculator.calculate");

    fireEvent.change(loanAmountInput, { target: { value: "1000000" } });
    fireEvent.change(rateInput, { target: { value: "4.9" } });
    fireEvent.change(termInput, { target: { value: "30" } });
    fireEvent.click(calculateBtn);

    expect(screen.getByText("toolPages.loan-calculator.result")).toBeInTheDocument();
    expect(screen.getByText("toolPages.loan-calculator.monthlyPayment:")).toBeInTheDocument();
    expect(screen.getByText("toolPages.loan-calculator.totalPayment:")).toBeInTheDocument();
    expect(screen.getByText("toolPages.loan-calculator.totalInterest:")).toBeInTheDocument();
  });

  it("calculates equal principal loan", () => {
    render(<LoanCalculatorPage />);
    
    const equalPrincipalBtn = screen.getByText("toolPages.loan-calculator.equalPrincipal");
    fireEvent.click(equalPrincipalBtn);

    const loanAmountInput = screen.getByPlaceholderText("1000000");
    const rateInput = screen.getByPlaceholderText("4.9");
    const termInput = screen.getByPlaceholderText("30");
    const calculateBtn = screen.getByText("toolPages.loan-calculator.calculate");

    fireEvent.change(loanAmountInput, { target: { value: "1000000" } });
    fireEvent.change(rateInput, { target: { value: "4.9" } });
    fireEvent.change(termInput, { target: { value: "30" } });
    fireEvent.click(calculateBtn);

    expect(screen.getByText("toolPages.loan-calculator.result")).toBeInTheDocument();
    expect(screen.getByText("toolPages.loan-calculator.firstMonthPayment:")).toBeInTheDocument();
    expect(screen.getByText("toolPages.loan-calculator.lastMonthPayment:")).toBeInTheDocument();
    expect(screen.getByText("toolPages.loan-calculator.monthlyPrincipal:")).toBeInTheDocument();
  });

  it("handles invalid input", () => {
    render(<LoanCalculatorPage />);
    
    const calculateBtn = screen.getByText("toolPages.loan-calculator.calculate");
    fireEvent.click(calculateBtn);

    expect(screen.queryByText("toolPages.loan-calculator.result")).not.toBeInTheDocument();
  });

  it("switches between payment types", () => {
    render(<LoanCalculatorPage />);
    
    const equalPaymentBtn = screen.getByText("toolPages.loan-calculator.equalPayment");
    const equalPrincipalBtn = screen.getByText("toolPages.loan-calculator.equalPrincipal");

    fireEvent.click(equalPrincipalBtn);
    fireEvent.click(equalPaymentBtn);
    
    // Should be able to switch without errors
    expect(equalPaymentBtn).toBeInTheDocument();
  });

  it("validates positive loan amount", () => {
    render(<LoanCalculatorPage />);
    
    const loanAmountInput = screen.getByPlaceholderText("1000000");
    const rateInput = screen.getByPlaceholderText("4.9");
    const termInput = screen.getByPlaceholderText("30");
    const calculateBtn = screen.getByText("toolPages.loan-calculator.calculate");

    fireEvent.change(loanAmountInput, { target: { value: "-100000" } });
    fireEvent.change(rateInput, { target: { value: "4.9" } });
    fireEvent.change(termInput, { target: { value: "30" } });
    fireEvent.click(calculateBtn);

    expect(screen.queryByText("toolPages.loan-calculator.result")).not.toBeInTheDocument();
  });

  it("validates positive interest rate", () => {
    render(<LoanCalculatorPage />);
    
    const loanAmountInput = screen.getByPlaceholderText("1000000");
    const rateInput = screen.getByPlaceholderText("4.9");
    const termInput = screen.getByPlaceholderText("30");
    const calculateBtn = screen.getByText("toolPages.loan-calculator.calculate");

    fireEvent.change(loanAmountInput, { target: { value: "1000000" } });
    fireEvent.change(rateInput, { target: { value: "-1" } });
    fireEvent.change(termInput, { target: { value: "30" } });
    fireEvent.click(calculateBtn);

    expect(screen.queryByText("toolPages.loan-calculator.result")).not.toBeInTheDocument();
  });

  it("validates positive loan term", () => {
    render(<LoanCalculatorPage />);
    
    const loanAmountInput = screen.getByPlaceholderText("1000000");
    const rateInput = screen.getByPlaceholderText("4.9");
    const termInput = screen.getByPlaceholderText("30");
    const calculateBtn = screen.getByText("toolPages.loan-calculator.calculate");

    fireEvent.change(loanAmountInput, { target: { value: "1000000" } });
    fireEvent.change(rateInput, { target: { value: "4.9" } });
    fireEvent.change(termInput, { target: { value: "0" } });
    fireEvent.click(calculateBtn);

    expect(screen.queryByText("toolPages.loan-calculator.result")).not.toBeInTheDocument();
  });
});
