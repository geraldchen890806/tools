"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

export default function CalculatorPage() {
  const { t } = useTranslation();
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [lastResult, setLastResult] = useState<number | null>(null);

  const btnStyle = { background: "var(--accent)", color: "var(--bg-primary)" };
  const btnSecondary = { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" };

  const appendNumber = (num: string) => {
    if (display === "0" || lastResult !== null) {
      setDisplay(num);
      setLastResult(null);
    } else {
      setDisplay(display + num);
    }
  };

  const appendOperator = (op: string) => {
    if (lastResult !== null) {
      setExpression(String(lastResult) + " " + op + " ");
      setDisplay("0");
      setLastResult(null);
    } else {
      setExpression(display + " " + op + " ");
      setDisplay("0");
    }
  };

  const calculate = () => {
    try {
      const fullExpression = expression + display;
      // Safe eval using Function constructor
      const result = Function(`"use strict"; return (${fullExpression})`)();
      setDisplay(String(result));
      setLastResult(result);
      setExpression("");
    } catch {
      setDisplay(t("toolPages.calculator.error"));
      setExpression("");
    }
  };

  const clear = () => {
    setDisplay("0");
    setExpression("");
    setLastResult(null);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const percent = () => {
    setDisplay(String(Number(display) / 100));
  };

  const negate = () => {
    setDisplay(String(-Number(display)));
  };

  const decimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const sqrt = () => {
    setDisplay(String(Math.sqrt(Number(display))));
    setLastResult(Math.sqrt(Number(display)));
  };

  const power = () => {
    setExpression(display + " ** ");
    setDisplay("0");
  };

  const sin = () => {
    setDisplay(String(Math.sin(Number(display) * Math.PI / 180)));
    setLastResult(Math.sin(Number(display) * Math.PI / 180));
  };

  const cos = () => {
    setDisplay(String(Math.cos(Number(display) * Math.PI / 180)));
    setLastResult(Math.cos(Number(display) * Math.PI / 180));
  };

  const tan = () => {
    setDisplay(String(Math.tan(Number(display) * Math.PI / 180)));
    setLastResult(Math.tan(Number(display) * Math.PI / 180));
  };

  const log = () => {
    setDisplay(String(Math.log10(Number(display))));
    setLastResult(Math.log10(Number(display)));
  };

  const ln = () => {
    setDisplay(String(Math.log(Number(display))));
    setLastResult(Math.log(Number(display)));
  };

  const Button = ({ children, onClick, style = btnSecondary }: any) => (
    <button
      onClick={onClick}
      className="p-4 rounded-lg text-lg font-semibold"
      style={style}
    >
      {children}
    </button>
  );

  return (
    <ToolLayout toolId="calculator">
      <div className="max-w-md mx-auto">
        <div className="mb-4 p-4 rounded-lg text-right" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          {expression && <div className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>{expression}</div>}
          <div className="text-3xl font-mono" style={{ color: "var(--text-primary)" }}>{display}</div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Button onClick={clear}>{t("toolPages.calculator.clear")}</Button>
          <Button onClick={backspace}>⌫</Button>
          <Button onClick={percent}>%</Button>
          <Button onClick={() => appendOperator("/")} style={btnStyle}>÷</Button>

          <Button onClick={sin}>sin</Button>
          <Button onClick={() => appendNumber("7")}>7</Button>
          <Button onClick={() => appendNumber("8")}>8</Button>
          <Button onClick={() => appendNumber("9")}>9</Button>

          <Button onClick={cos}>cos</Button>
          <Button onClick={() => appendNumber("4")}>4</Button>
          <Button onClick={() => appendNumber("5")}>5</Button>
          <Button onClick={() => appendNumber("6")}>6</Button>

          <Button onClick={tan}>tan</Button>
          <Button onClick={() => appendNumber("1")}>1</Button>
          <Button onClick={() => appendNumber("2")}>2</Button>
          <Button onClick={() => appendNumber("3")}>3</Button>

          <Button onClick={sqrt}>√</Button>
          <Button onClick={negate}>±</Button>
          <Button onClick={() => appendNumber("0")}>0</Button>
          <Button onClick={decimal}>.</Button>

          <Button onClick={log}>log</Button>
          <Button onClick={ln}>ln</Button>
          <Button onClick={power}>xʸ</Button>
          <Button onClick={() => appendOperator("*")} style={btnStyle}>×</Button>

          <Button onClick={() => appendOperator("-")} style={btnStyle}>−</Button>
          <Button onClick={() => appendOperator("+")} style={btnStyle}>+</Button>
          <Button onClick={calculate} style={{ ...btnStyle, gridColumn: "span 2" }}>=</Button>
        </div>
      </div>
    </ToolLayout>
  );
}
