"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

export default function BMICalculatorPage() {
  const { t } = useTranslation();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [bmi, setBmi] = useState<number | null>(null);

  const inputCss = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };
  const btnStyle = { background: "var(--accent)", color: "var(--bg-primary)" };

  const calculate = () => {
    const h = Number(height);
    const w = Number(weight);

    if (!h || !w || h <= 0 || w <= 0) {
      setBmi(null);
      return;
    }

    let bmiValue: number;
    if (unit === "metric") {
      // height in cm, weight in kg
      bmiValue = w / ((h / 100) ** 2);
    } else {
      // height in inches, weight in lbs
      bmiValue = (w / (h ** 2)) * 703;
    }

    setBmi(Number(bmiValue.toFixed(1)));
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { key: "underweight", color: "#3b82f6" };
    if (bmi < 25) return { key: "normal", color: "#10b981" };
    if (bmi < 30) return { key: "overweight", color: "#f59e0b" };
    return { key: "obese", color: "#ef4444" };
  };

  const category = bmi !== null ? getBMICategory(bmi) : null;

  return (
    <ToolLayout toolId="bmi-calculator">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setUnit("metric")}
            className="flex-1 px-4 py-2 rounded-lg"
            style={unit === "metric" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            {t("toolPages.bmi-calculator.metric")}
          </button>
          <button
            onClick={() => setUnit("imperial")}
            className="flex-1 px-4 py-2 rounded-lg"
            style={unit === "imperial" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            {t("toolPages.bmi-calculator.imperial")}
          </button>
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            {t("toolPages.bmi-calculator.height")} ({unit === "metric" ? "cm" : "inches"})
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === "metric" ? "170" : "67"}
            className="w-full p-3 rounded-lg"
            style={inputCss}
          />
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            {t("toolPages.bmi-calculator.weight")} ({unit === "metric" ? "kg" : "lbs"})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === "metric" ? "70" : "154"}
            className="w-full p-3 rounded-lg"
            style={inputCss}
          />
        </div>

        <button
          onClick={calculate}
          className="w-full px-4 py-3 rounded-lg text-lg font-semibold"
          style={btnStyle}
        >
          {t("toolPages.bmi-calculator.calculate")}
        </button>

        {bmi !== null && category && (
          <div className="p-6 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <div className="text-center mb-4">
              <div className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                {t("toolPages.bmi-calculator.yourBMI")}
              </div>
              <div className="text-5xl font-bold" style={{ color: category.color }}>
                {bmi}
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-lg font-semibold" style={{ color: category.color }}>
                {t(`toolPages.bmi-calculator.${category.key}`)}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t("toolPages.bmi-calculator.underweight")}</span>
                <span>&lt; 18.5</span>
              </div>
              <div className="flex justify-between">
                <span>{t("toolPages.bmi-calculator.normal")}</span>
                <span>18.5 - 24.9</span>
              </div>
              <div className="flex justify-between">
                <span>{t("toolPages.bmi-calculator.overweight")}</span>
                <span>25 - 29.9</span>
              </div>
              <div className="flex justify-between">
                <span>{t("toolPages.bmi-calculator.obese")}</span>
                <span>≥ 30</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
