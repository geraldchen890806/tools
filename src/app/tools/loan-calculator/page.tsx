"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

export default function LoanCalculatorPage() {
  const { t } = useTranslation();
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [paymentType, setPaymentType] = useState<"equal-payment" | "equal-principal">("equal-payment");
  const [result, setResult] = useState<any>(null);

  const inputCss = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };
  const btnStyle = { background: "var(--accent)", color: "var(--bg-primary)" };

  const calculate = () => {
    const principal = Number(loanAmount);
    const rate = Number(interestRate) / 100 / 12; // monthly rate
    const months = Number(loanTerm) * 12;

    if (!principal || !rate || !months || principal <= 0 || rate < 0 || months <= 0) {
      setResult(null);
      return;
    }

    if (paymentType === "equal-payment") {
      // Equal monthly payment (等额本息)
      const monthlyPayment = principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
      const totalPayment = monthlyPayment * months;
      const totalInterest = totalPayment - principal;

      setResult({
        monthlyPayment: monthlyPayment.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        type: "equal-payment",
      });
    } else {
      // Equal principal (等额本金)
      const monthlyPrincipal = principal / months;
      let totalInterest = 0;
      const firstMonthInterest = principal * rate;
      const lastMonthInterest = monthlyPrincipal * rate;
      
      for (let i = 0; i < months; i++) {
        const remainingPrincipal = principal - monthlyPrincipal * i;
        totalInterest += remainingPrincipal * rate;
      }

      const totalPayment = principal + totalInterest;
      const firstMonthPayment = monthlyPrincipal + firstMonthInterest;
      const lastMonthPayment = monthlyPrincipal + lastMonthInterest;

      setResult({
        firstMonthPayment: firstMonthPayment.toFixed(2),
        lastMonthPayment: lastMonthPayment.toFixed(2),
        monthlyPrincipal: monthlyPrincipal.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        type: "equal-principal",
      });
    }
  };

  return (
    <ToolLayout toolId="loan-calculator">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setPaymentType("equal-payment")}
            className="flex-1 px-4 py-2 rounded-lg"
            style={paymentType === "equal-payment" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            {t("toolPages.loan-calculator.equalPayment")}
          </button>
          <button
            onClick={() => setPaymentType("equal-principal")}
            className="flex-1 px-4 py-2 rounded-lg"
            style={paymentType === "equal-principal" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            {t("toolPages.loan-calculator.equalPrincipal")}
          </button>
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            {t("toolPages.loan-calculator.loanAmount")} (¥)
          </label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="1000000"
            className="w-full p-3 rounded-lg"
            style={inputCss}
          />
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            {t("toolPages.loan-calculator.interestRate")} (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="4.9"
            className="w-full p-3 rounded-lg"
            style={inputCss}
          />
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            {t("toolPages.loan-calculator.loanTerm")} ({t("toolPages.loan-calculator.years")})
          </label>
          <input
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            placeholder="30"
            className="w-full p-3 rounded-lg"
            style={inputCss}
          />
        </div>

        <button
          onClick={calculate}
          className="w-full px-4 py-3 rounded-lg text-lg font-semibold"
          style={btnStyle}
        >
          {t("toolPages.loan-calculator.calculate")}
        </button>

        {result && (
          <div className="p-6 rounded-lg space-y-4" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              {t("toolPages.loan-calculator.result")}
            </h3>

            {result.type === "equal-payment" && (
              <>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>{t("toolPages.loan-calculator.monthlyPayment")}:</span>
                  <span className="font-bold text-lg" style={{ color: "var(--accent)" }}>¥{result.monthlyPayment}</span>
                </div>
              </>
            )}

            {result.type === "equal-principal" && (
              <>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>{t("toolPages.loan-calculator.firstMonthPayment")}:</span>
                  <span className="font-bold text-lg" style={{ color: "var(--accent)" }}>¥{result.firstMonthPayment}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>{t("toolPages.loan-calculator.lastMonthPayment")}:</span>
                  <span className="font-bold" style={{ color: "var(--text-primary)" }}>¥{result.lastMonthPayment}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>{t("toolPages.loan-calculator.monthlyPrincipal")}:</span>
                  <span style={{ color: "var(--text-primary)" }}>¥{result.monthlyPrincipal}</span>
                </div>
              </>
            )}

            <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
              <div className="flex justify-between">
                <span style={{ color: "var(--text-secondary)" }}>{t("toolPages.loan-calculator.totalPayment")}:</span>
                <span className="font-bold" style={{ color: "var(--text-primary)" }}>¥{result.totalPayment}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span style={{ color: "var(--text-secondary)" }}>{t("toolPages.loan-calculator.totalInterest")}:</span>
                <span className="font-bold" style={{ color: "var(--text-primary)" }}>¥{result.totalInterest}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
