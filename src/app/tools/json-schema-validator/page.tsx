"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState } from "react";
import Ajv from "ajv";

export default function Page() {
  const { t } = useTranslation();
  const [json, setJson] = useState("");
  const [schema, setSchema] = useState("");
  const [result, setResult] = useState<"valid" | "invalid" | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    setResult(null);
    setErrors([]);

    try {
      const jsonData = JSON.parse(json);
      const schemaData = JSON.parse(schema);

      const ajv = new Ajv({ allErrors: true });

      const validate = ajv.compile(schemaData);
      const valid = validate(jsonData);

      if (valid) {
        setResult("valid");
      } else {
        setResult("invalid");
        setErrors(
          validate.errors?.map((err: any) => `${err.instancePath || "/"}: ${err.message}`) || [
            t("toolPages.json-schema-validator.unknownError"),
          ]
        );
      }
    } catch (e: any) {
      setResult("invalid");
      setErrors([e.message]);
    }
  };

  const loadExample = () => {
    const exampleJson = JSON.stringify(
      {
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
      null,
      2
    );

    const exampleSchema = JSON.stringify(
      {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          age: { type: "number", minimum: 0 },
        },
        required: ["name", "email"],
      },
      null,
      2
    );

    setJson(exampleJson);
    setSchema(exampleSchema);
  };

  const clear = () => {
    setJson("");
    setSchema("");
    setResult(null);
    setErrors([]);
  };

  return (
    <ToolLayout toolId="json-schema-validator">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* JSON 输入 */}
        <div>
          <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
            JSON {t("toolPages.json-schema-validator.data")}
          </label>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            placeholder={t("toolPages.json-schema-validator.jsonPlaceholder")}
            style={{
              width: "100%",
              minHeight: 200,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: 8,
              padding: 12,
              fontFamily: "monospace",
              resize: "vertical",
            }}
          />
        </div>

        {/* Schema 输入 */}
        <div>
          <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
            JSON Schema
          </label>
          <textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            placeholder={t("toolPages.json-schema-validator.schemaPlaceholder")}
            style={{
              width: "100%",
              minHeight: 200,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: 8,
              padding: 12,
              fontFamily: "monospace",
              resize: "vertical",
            }}
          />
        </div>

        {/* 按钮 */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={validate}
            style={{
              background: "var(--accent)",
              color: "white",
              padding: "12px 24px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            {t("toolPages.json-schema-validator.validate")}
          </button>
          <button
            onClick={loadExample}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              padding: "12px 24px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {t("toolPages.json-schema-validator.loadExample")}
          </button>
          <button
            onClick={clear}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              padding: "12px 24px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {t("common.clear")}
          </button>
        </div>

        {/* 验证结果 */}
        {result === "valid" && (
          <div
            style={{
              padding: 16,
              background: "#d4edda",
              border: "1px solid #c3e6cb",
              borderRadius: 8,
              color: "#155724",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 24 }}>✓</span>
            <span style={{ fontWeight: 500 }}>{t("toolPages.json-schema-validator.valid")}</span>
          </div>
        )}

        {result === "invalid" && (
          <div
            style={{
              padding: 16,
              background: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: 8,
              color: "#721c24",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>✗</span>
              <span style={{ fontWeight: 500 }}>{t("toolPages.json-schema-validator.invalid")}</span>
            </div>
            {errors.length > 0 && (
              <ul style={{ marginLeft: 32, marginTop: 8 }}>
                {errors.map((err, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>
                    {err}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
