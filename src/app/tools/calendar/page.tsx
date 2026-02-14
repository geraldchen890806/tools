"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

// Lunar calendar lookup table 1900-2100
// Each entry encodes: months' big/small (bits 0-11), leap month (bits 16-19), leap month big/small (bit 12)
const lunarInfo = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x16a95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
  0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a4d0,0x0d150,0x0f252,
  0x0d520,
];

const Gan = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const Zhi = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const Animals = ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];
const lunarMonths = ["正","二","三","四","五","六","七","八","九","十","冬","腊"];
const lunarDays = ["初一","初二","初三","初四","初五","初六","初七","初八","初九","初十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"];

function lYearDays(y: number) {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
  return sum + leapDays(y);
}
function leapMonth(y: number) { return lunarInfo[y - 1900] & 0xf; }
function leapDays(y: number) { return leapMonth(y) ? ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29) : 0; }
function monthDays(y: number, m: number) { return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29; }

function solar2lunar(y: number, m: number, d: number) {
  const baseDate = new Date(1900, 0, 31);
  const objDate = new Date(y, m - 1, d);
  let offset = Math.floor((objDate.getTime() - baseDate.getTime()) / 86400000);
  let lunarY = 1900;
  for (; lunarY < 2101 && offset > 0; lunarY++) offset -= lYearDays(lunarY);
  if (offset < 0) { offset += lYearDays(--lunarY); }
  const leap = leapMonth(lunarY);
  let isLeap = false;
  let lunarM = 1;
  for (; lunarM < 13 && offset > 0; lunarM++) {
    if (leap > 0 && lunarM === leap + 1 && !isLeap) { --lunarM; isLeap = true; const ld = leapDays(lunarY); if (offset < ld) break; offset -= ld; isLeap = false; }
    const md = monthDays(lunarY, lunarM);
    if (offset < md) break;
    offset -= md;
  }
  if (leap > 0 && lunarM === leap + 1 && !isLeap) { --lunarM; isLeap = true; }
  const lunarD = offset + 1;
  return { year: lunarY, month: lunarM, day: lunarD, isLeap, monthStr: (isLeap ? "闰" : "") + lunarMonths[lunarM - 1] + "月", dayStr: lunarDays[lunarD - 1], ganZhi: Gan[(lunarY - 4) % 10] + Zhi[(lunarY - 4) % 12], animal: Animals[(lunarY - 4) % 12] };
}

const solarFestivals: Record<string, string> = {
  "1-1": "元旦", "2-14": "情人节", "3-8": "妇女节", "3-12": "植树节", "4-1": "愚人节",
  "5-1": "劳动节", "5-4": "青年节", "6-1": "儿童节", "7-1": "建党节", "8-1": "建军节",
  "9-10": "教师节", "10-1": "国庆节", "12-24": "平安夜", "12-25": "圣诞节",
};
const lunarFestivals: Record<string, string> = {
  "1-1": "春节", "1-15": "元宵", "5-5": "端午", "7-7": "七夕", "7-15": "中元",
  "8-15": "中秋", "9-9": "重阳", "12-30": "除夕", "12-29": "除夕",
};

const weekLabels = ["日", "一", "二", "三", "四", "五", "六"];
const cardStyle: React.CSSProperties = { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "white", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontWeight: 500 };

export default function CalendarPage() {
  const { t } = useTranslation();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  const prev = () => { if (month === 1) { setYear(y => y - 1); setMonth(12); } else setMonth(m => m - 1); };
  const next = () => { if (month === 12) { setYear(y => y + 1); setMonth(1); } else setMonth(m => m + 1); };
  const goToday = () => { setYear(now.getFullYear()); setMonth(now.getMonth() + 1); };

  const lunar = solar2lunar(year, month, 1);

  const cells: { day: number; lunar: ReturnType<typeof solar2lunar>; festival?: string; isToday: boolean }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const l = solar2lunar(year, month, d);
    const sf = solarFestivals[`${month}-${d}`];
    const lf = lunarFestivals[`${l.month}-${l.day}`];
    cells.push({ day: d, lunar: l, festival: sf || lf, isToday: `${year}-${month}-${d}` === todayStr });
  }

  return (
    <ToolLayout toolId="calendar">
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <button onClick={prev} style={btnStyle}>◀ 上月</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>
              <input type="number" value={year} onChange={e => setYear(Number(e.target.value) || year)} style={{ width: 70, background: "transparent", border: "none", color: "var(--text-primary)", fontSize: 20, fontWeight: 700, textAlign: "right" }} />
              年 {month} 月
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>{lunar.ganZhi}年 [{lunar.animal}年]</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={goToday} style={{ ...btnStyle, background: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>{t("toolPages.calendar.today")}</button>
            <button onClick={next} style={btnStyle}>下月 ▶</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
          {weekLabels.map(w => (
            <div key={w} style={{ textAlign: "center", padding: 8, fontWeight: 600, color: "var(--text-secondary)", fontSize: 13 }}>{w}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {cells.map(c => (
            <div key={c.day} style={{
              textAlign: "center", padding: "6px 2px", borderRadius: 8, minHeight: 56,
              background: c.isToday ? "var(--accent)" : "transparent",
              color: c.isToday ? "white" : "var(--text-primary)",
            }}>
              <div style={{ fontSize: 16, fontWeight: c.isToday ? 700 : 400 }}>{c.day}</div>
              <div style={{ fontSize: 10, color: c.festival ? (c.isToday ? "white" : "var(--accent)") : (c.isToday ? "rgba(255,255,255,0.8)" : "var(--text-secondary)"), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {c.festival || (c.lunar.day === 1 ? c.lunar.monthStr : c.lunar.dayStr)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
