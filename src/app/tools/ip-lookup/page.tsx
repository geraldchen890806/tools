"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState, useEffect } from "react";

interface IPInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  timezone: string;
}

export default function Page() {
  const { t } = useTranslation();
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [customIp, setCustomIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyIp();
  }, []);

  const fetchMyIp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      setIpInfo({
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        loc: `${data.latitude}, ${data.longitude}`,
        org: data.org,
        timezone: data.timezone,
      });
    } catch (e) {
      setError(t("toolPages.ip-lookup.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const lookupCustomIp = async () => {
    if (!customIp.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://ipapi.co/${customIp}/json/`);
      const data = await res.json();
      if (data.error) {
        throw new Error(t("toolPages.ip-lookup.invalidIp"));
      }
      setIpInfo({
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        loc: `${data.latitude}, ${data.longitude}`,
        org: data.org,
        timezone: data.timezone,
      });
    } catch (e: any) {
      setError(e.message || t("toolPages.ip-lookup.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout toolId="ip-lookup">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* 查询自定义IP */}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={customIp}
            onChange={(e) => setCustomIp(e.target.value)}
            placeholder={t("toolPages.ip-lookup.inputPlaceholder")}
            onKeyDown={(e) => e.key === "Enter" && lookupCustomIp()}
            style={{
              flex: 1,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: 8,
              padding: 12,
            }}
          />
          <button
            onClick={lookupCustomIp}
            disabled={loading}
            style={{
              background: "var(--accent)",
              color: "white",
              padding: "12px 24px",
              borderRadius: 8,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? t("toolPages.ip-lookup.loading") : t("toolPages.ip-lookup.lookup")}
          </button>
          <button
            onClick={fetchMyIp}
            disabled={loading}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              padding: "12px 24px",
              borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {t("toolPages.ip-lookup.myIp")}
          </button>
        </div>

        {/* 错误 */}
        {error && (
          <div
            style={{
              padding: 12,
              background: "#fee",
              border: "1px solid #fcc",
              borderRadius: 8,
              color: "#c00",
            }}
          >
            {error}
          </div>
        )}

        {/* IP信息 */}
        {ipInfo && (
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 24,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <InfoItem label={t("toolPages.ip-lookup.ip")} value={ipInfo.ip} />
              <InfoItem label={t("toolPages.ip-lookup.city")} value={ipInfo.city || "-"} />
              <InfoItem label={t("toolPages.ip-lookup.region")} value={ipInfo.region || "-"} />
              <InfoItem label={t("toolPages.ip-lookup.country")} value={ipInfo.country || "-"} />
              <InfoItem label={t("toolPages.ip-lookup.location")} value={ipInfo.loc || "-"} />
              <InfoItem label={t("toolPages.ip-lookup.isp")} value={ipInfo.org || "-"} />
              <InfoItem label={t("toolPages.ip-lookup.timezone")} value={ipInfo.timezone || "-"} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 4 }}>{label}</div>
      <div style={{ color: "var(--text-primary)", fontSize: 16, fontWeight: 500 }}>{value}</div>
    </div>
  );
}
