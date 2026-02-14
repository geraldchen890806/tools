"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState, useEffect } from "react";

const cities = [
  { name: "北京", tz: "Asia/Shanghai", offset: 0 },
  { name: "东京", tz: "Asia/Tokyo", offset: 1 },
  { name: "新加坡", tz: "Asia/Singapore", offset: 0 },
  { name: "迪拜", tz: "Asia/Dubai", offset: -4 },
  { name: "莫斯科", tz: "Europe/Moscow", offset: -5 },
  { name: "柏林", tz: "Europe/Berlin", offset: -7 },
  { name: "巴黎", tz: "Europe/Paris", offset: -7 },
  { name: "伦敦", tz: "Europe/London", offset: -8 },
  { name: "多伦多", tz: "America/Toronto", offset: -13 },
  { name: "纽约", tz: "America/New_York", offset: -13 },
  { name: "洛杉矶", tz: "America/Los_Angeles", offset: -16 },
  { name: "悉尼", tz: "Australia/Sydney", offset: 2 },
];

function getTime(tz: string, now: Date) {
  const fmt = new Intl.DateTimeFormat("zh-CN", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const dfmt = new Intl.DateTimeFormat("zh-CN", { timeZone: tz, month: "2-digit", day: "2-digit", weekday: "short" });
  return { time: fmt.format(now), date: dfmt.format(now) };
}

export default function Page() {
  const { t } = useTranslation();
  const [now, setNow] = useState(new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer); }, []);

  const getDiff = (tz: string): string => {
    const bjTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Shanghai" }));
    const local = new Date(now.toLocaleString("en-US", { timeZone: tz }));
    const diff = Math.round((local.getTime() - bjTime.getTime()) / 3600000);
    if (diff === 0) return t("toolPages.world-clock.diffWithBeijing");
    return diff > 0 ? `+${diff}${t("toolPages.world-clock.hours")}` : `${diff}${t("toolPages.world-clock.hours")}`;
  };

  return (
    <ToolLayout toolId="world-clock">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {cities.map(c => {
          const { time, date } = getTime(c.tz, now);
          const diff = getDiff(c.tz);
          return (
            <div key={c.name} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 4 }}>{c.name}</div>
              <div style={{ color: "var(--text-primary)", fontSize: 28, fontWeight: 700, fontFamily: "monospace" }}>{time}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>{date}</div>
              <div style={{ color: "var(--accent)", fontSize: 13, marginTop: 4 }}>{diff}</div>
            </div>
          );
        })}
      </div>
    </ToolLayout>
  );
}
