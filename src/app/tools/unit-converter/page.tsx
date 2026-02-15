"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

type UnitType = "length" | "weight" | "temperature" | "area" | "volume";

const lengthUnits = {
  m: { name: "meter", ratio: 1 },
  km: { name: "kilometer", ratio: 1000 },
  cm: { name: "centimeter", ratio: 0.01 },
  mm: { name: "millimeter", ratio: 0.001 },
  mi: { name: "mile", ratio: 1609.344 },
  yd: { name: "yard", ratio: 0.9144 },
  ft: { name: "foot", ratio: 0.3048 },
  in: { name: "inch", ratio: 0.0254 },
};

const weightUnits = {
  kg: { name: "kilogram", ratio: 1 },
  g: { name: "gram", ratio: 0.001 },
  mg: { name: "milligram", ratio: 0.000001 },
  t: { name: "ton", ratio: 1000 },
  lb: { name: "pound", ratio: 0.453592 },
  oz: { name: "ounce", ratio: 0.0283495 },
};

const temperatureConvert = (value: number, from: string, to: string): number => {
  if (from === to) return value;
  // Convert to Celsius first
  let celsius = value;
  if (from === "f") celsius = (value - 32) * 5 / 9;
  if (from === "k") celsius = value - 273.15;
  // Convert from Celsius to target
  if (to === "c") return celsius;
  if (to === "f") return celsius * 9 / 5 + 32;
  if (to === "k") return celsius + 273.15;
  return celsius;
};

const areaUnits = {
  m2: { name: "squareMeter", ratio: 1 },
  km2: { name: "squareKilometer", ratio: 1000000 },
  cm2: { name: "squareCentimeter", ratio: 0.0001 },
  ha: { name: "hectare", ratio: 10000 },
  acre: { name: "acre", ratio: 4046.86 },
  ft2: { name: "squareFoot", ratio: 0.092903 },
};

const volumeUnits = {
  m3: { name: "cubicMeter", ratio: 1 },
  l: { name: "liter", ratio: 0.001 },
  ml: { name: "milliliter", ratio: 0.000001 },
  gal: { name: "gallon", ratio: 0.00378541 },
  qt: { name: "quart", ratio: 0.000946353 },
  pt: { name: "pint", ratio: 0.000473176 },
  cup: { name: "cup", ratio: 0.000236588 },
};

export default function UnitConverterPage() {
  const { t } = useTranslation();
  const [unitType, setUnitType] = useState<UnitType>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");

  const btnStyle = { background: "var(--accent)", color: "var(--bg-primary)" };
  const inputCss = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };

  const getUnits = () => {
    if (unitType === "length") return lengthUnits;
    if (unitType === "weight") return weightUnits;
    if (unitType === "area") return areaUnits;
    if (unitType === "volume") return volumeUnits;
    return { c: { name: "celsius", ratio: 1 }, f: { name: "fahrenheit", ratio: 1 }, k: { name: "kelvin", ratio: 1 } };
  };

  const convert = (value: string, from: string, to: string) => {
    if (!value || isNaN(Number(value))) return "";
    const num = Number(value);
    
    if (unitType === "temperature") {
      return temperatureConvert(num, from, to).toFixed(4);
    }
    
    const units = getUnits();
    const fromRatio = (units as any)[from]?.ratio || 1;
    const toRatio = (units as any)[to]?.ratio || 1;
    const result = (num * fromRatio) / toRatio;
    return result.toFixed(6);
  };

  const handleFromChange = (value: string) => {
    setFromValue(value);
    setToValue(convert(value, fromUnit, toUnit));
  };

  const handleToChange = (value: string) => {
    setToValue(value);
    setFromValue(convert(value, toUnit, fromUnit));
  };

  const handleUnitTypeChange = (type: UnitType) => {
    setUnitType(type);
    const units = type === "length" ? lengthUnits :
                  type === "weight" ? weightUnits :
                  type === "area" ? areaUnits :
                  type === "volume" ? volumeUnits :
                  { c: { name: "celsius", ratio: 1 }, f: { name: "fahrenheit", ratio: 1 }, k: { name: "kelvin", ratio: 1 } };
    const keys = Object.keys(units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
    setFromValue("");
    setToValue("");
  };

  const units = getUnits();

  return (
    <ToolLayout toolId="unit-converter">
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {(["length", "weight", "temperature", "area", "volume"] as UnitType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleUnitTypeChange(type)}
              className="px-4 py-2 rounded-lg"
              style={unitType === type ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            >
              {t(`toolPages.unit-converter.${type}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
              {t("toolPages.unit-converter.from")}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => {
                setFromUnit(e.target.value);
                setToValue(convert(fromValue, e.target.value, toUnit));
              }}
              className="w-full mb-2 p-2 rounded-lg"
              style={inputCss}
            >
              {Object.entries(units).map(([key, unit]) => (
                <option key={key} value={key}>
                  {t(`toolPages.unit-converter.units.${unit.name}`)}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => handleFromChange(e.target.value)}
              placeholder="0"
              className="w-full p-3 rounded-lg"
              style={inputCss}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
              {t("toolPages.unit-converter.to")}
            </label>
            <select
              value={toUnit}
              onChange={(e) => {
                setToUnit(e.target.value);
                setToValue(convert(fromValue, fromUnit, e.target.value));
              }}
              className="w-full mb-2 p-2 rounded-lg"
              style={inputCss}
            >
              {Object.entries(units).map(([key, unit]) => (
                <option key={key} value={key}>
                  {t(`toolPages.unit-converter.units.${unit.name}`)}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={toValue}
              onChange={(e) => handleToChange(e.target.value)}
              placeholder="0"
              className="w-full p-3 rounded-lg"
              style={inputCss}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
