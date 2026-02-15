"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState } from "react";

export default function Page() {
  const { t } = useTranslation();
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [day, setDay] = useState("*");
  const [month, setMonth] = useState("*");
  const [weekday, setWeekday] = useState("*");
  const [expression, setExpression] = useState("* * * * *");

  const [minuteMode, setMinuteMode] = useState<"every" | "specific" | "interval">("every");
  const [hourMode, setHourMode] = useState<"every" | "specific" | "interval">("every");
  const [dayMode, setDayMode] = useState<"every" | "specific">("every");
  const [monthMode, setMonthMode] = useState<"every" | "specific">("every");
  const [weekdayMode, setWeekdayMode] = useState<"every" | "specific">("every");

  const [minuteValue, setMinuteValue] = useState("0");
  const [minuteInterval, setMinuteInterval] = useState("5");
  const [hourValue, setHourValue] = useState("0");
  const [hourInterval, setHourInterval] = useState("1");
  const [dayValue, setDayValue] = useState("1");
  const [monthValue, setMonthValue] = useState("1");
  const [weekdayValue, setWeekdayValue] = useState("0");

  const updateExpression = () => {
    let m = "*";
    let h = "*";
    let d = "*";
    let mo = "*";
    let w = "*";

    // 分钟
    if (minuteMode === "specific") m = minuteValue;
    if (minuteMode === "interval") m = `*/${minuteInterval}`;

    // 小时
    if (hourMode === "specific") h = hourValue;
    if (hourMode === "interval") h = `*/${hourInterval}`;

    // 日期
    if (dayMode === "specific") d = dayValue;

    // 月份
    if (monthMode === "specific") mo = monthValue;

    // 星期
    if (weekdayMode === "specific") w = weekdayValue;

    setMinute(m);
    setHour(h);
    setDay(d);
    setMonth(mo);
    setWeekday(w);
    setExpression(`${m} ${h} ${d} ${mo} ${w}`);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(expression);
  };

  const loadPreset = (preset: string) => {
    switch (preset) {
      case "everyMinute":
        setExpression("* * * * *");
        break;
      case "everyHour":
        setExpression("0 * * * *");
        break;
      case "everyDay":
        setExpression("0 0 * * *");
        break;
      case "everyWeek":
        setExpression("0 0 * * 0");
        break;
      case "everyMonth":
        setExpression("0 0 1 * *");
        break;
    }
  };

  return (
    <ToolLayout toolId="crontab-generator">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* 快捷预设 */}
        <div>
          <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
            {t("toolPages.crontab-generator.presets")}
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => loadPreset("everyMinute")} style={presetButtonStyle}>
              {t("toolPages.crontab-generator.everyMinute")}
            </button>
            <button onClick={() => loadPreset("everyHour")} style={presetButtonStyle}>
              {t("toolPages.crontab-generator.everyHour")}
            </button>
            <button onClick={() => loadPreset("everyDay")} style={presetButtonStyle}>
              {t("toolPages.crontab-generator.everyDay")}
            </button>
            <button onClick={() => loadPreset("everyWeek")} style={presetButtonStyle}>
              {t("toolPages.crontab-generator.everyWeek")}
            </button>
            <button onClick={() => loadPreset("everyMonth")} style={presetButtonStyle}>
              {t("toolPages.crontab-generator.everyMonth")}
            </button>
          </div>
        </div>

        {/* 分钟 */}
        <FieldSelector
          label={t("toolPages.crontab-generator.minute")}
          mode={minuteMode}
          onModeChange={setMinuteMode}
          value={minuteValue}
          onValueChange={setMinuteValue}
          interval={minuteInterval}
          onIntervalChange={setMinuteInterval}
          min={0}
          max={59}
          onUpdate={updateExpression}
        />

        {/* 小时 */}
        <FieldSelector
          label={t("toolPages.crontab-generator.hour")}
          mode={hourMode}
          onModeChange={setHourMode}
          value={hourValue}
          onValueChange={setHourValue}
          interval={hourInterval}
          onIntervalChange={setHourInterval}
          min={0}
          max={23}
          onUpdate={updateExpression}
          hasInterval
        />

        {/* 日期 */}
        <FieldSelector
          label={t("toolPages.crontab-generator.day")}
          mode={dayMode}
          onModeChange={setDayMode}
          value={dayValue}
          onValueChange={setDayValue}
          min={1}
          max={31}
          onUpdate={updateExpression}
        />

        {/* 月份 */}
        <FieldSelector
          label={t("toolPages.crontab-generator.month")}
          mode={monthMode}
          onModeChange={setMonthMode}
          value={monthValue}
          onValueChange={setMonthValue}
          min={1}
          max={12}
          onUpdate={updateExpression}
        />

        {/* 星期 */}
        <FieldSelector
          label={t("toolPages.crontab-generator.weekday")}
          mode={weekdayMode}
          onModeChange={setWeekdayMode}
          value={weekdayValue}
          onValueChange={setWeekdayValue}
          min={0}
          max={6}
          onUpdate={updateExpression}
        />

        {/* 生成的表达式 */}
        <div>
          <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
            {t("toolPages.crontab-generator.expression")}
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              value={expression}
              readOnly
              style={{
                flex: 1,
                background: "var(--bg-secondary)",
                border: "2px solid var(--accent)",
                color: "var(--text-primary)",
                borderRadius: 8,
                padding: 16,
                fontSize: 20,
                fontFamily: "monospace",
                fontWeight: 600,
              }}
            />
            <button
              onClick={copy}
              style={{
                background: "var(--accent)",
                color: "white",
                padding: "16px 24px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              {t("common.copy")}
            </button>
          </div>
        </div>

        {/* 说明 */}
        <div
          style={{
            padding: 16,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 14,
            color: "var(--text-secondary)",
          }}
        >
          <div style={{ fontWeight: 500, marginBottom: 8 }}>{t("toolPages.crontab-generator.format")}:</div>
          <div style={{ fontFamily: "monospace" }}>
            {t("toolPages.crontab-generator.formatDesc")}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

const presetButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--bg-secondary)",
  color: "var(--text-primary)",
  cursor: "pointer",
};

interface FieldSelectorProps {
  label: string;
  mode: "every" | "specific" | "interval";
  onModeChange: (mode: any) => void;
  value: string;
  onValueChange: (value: string) => void;
  interval?: string;
  onIntervalChange?: (value: string) => void;
  min: number;
  max: number;
  onUpdate: () => void;
  hasInterval?: boolean;
}

function FieldSelector({
  label,
  mode,
  onModeChange,
  value,
  onValueChange,
  interval,
  onIntervalChange,
  min,
  max,
  onUpdate,
  hasInterval = false,
}: FieldSelectorProps) {
  const { t } = useTranslation();

  return (
    <div>
      <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
        {label}
      </label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button
          onClick={() => {
            onModeChange("every");
            onUpdate();
          }}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: mode === "every" ? "var(--accent)" : "var(--bg-secondary)",
            color: mode === "every" ? "white" : "var(--text-primary)",
            cursor: "pointer",
          }}
        >
          {t("toolPages.crontab-generator.every")}
        </button>
        <button
          onClick={() => {
            onModeChange("specific");
            onUpdate();
          }}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: mode === "specific" ? "var(--accent)" : "var(--bg-secondary)",
            color: mode === "specific" ? "white" : "var(--text-primary)",
            cursor: "pointer",
          }}
        >
          {t("toolPages.crontab-generator.specific")}
        </button>
        {hasInterval && (
          <button
            onClick={() => {
              onModeChange("interval");
              onUpdate();
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: mode === "interval" ? "var(--accent)" : "var(--bg-secondary)",
              color: mode === "interval" ? "white" : "var(--text-primary)",
              cursor: "pointer",
            }}
          >
            {t("toolPages.crontab-generator.interval")}
          </button>
        )}

        {mode === "specific" && (
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => {
              onValueChange(e.target.value);
              onUpdate();
            }}
            style={{
              width: 80,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: 8,
              padding: "8px 12px",
            }}
          />
        )}

        {mode === "interval" && interval !== undefined && onIntervalChange && (
          <>
            <span style={{ color: "var(--text-secondary)" }}>{t("toolPages.crontab-generator.everyN")}</span>
            <input
              type="number"
              min={1}
              max={max}
              value={interval}
              onChange={(e) => {
                onIntervalChange(e.target.value);
                onUpdate();
              }}
              style={{
                width: 80,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                borderRadius: 8,
                padding: "8px 12px",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
