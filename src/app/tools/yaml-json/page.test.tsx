import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import YamlJsonPage from "./page";

// Mock useTranslation
vi.mock("@/i18n", () => ({
  useTranslation: () => (key: string) => key,
}));

// Mock js-yaml
vi.mock("js-yaml", () => ({
  default: {
    load: vi.fn((yaml: string) => {
      if (yaml.includes("invalid")) throw new Error("Invalid YAML");
      return { name: "test", value: 123 };
    }),
    dump: vi.fn((obj: any) => {
      if (obj.invalid) throw new Error("Invalid object");
      return "name: test\nvalue: 123\n";
    }),
  },
}));

describe("YamlJsonPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<YamlJsonPage />);
    expect(screen.getByPlaceholderText("toolPages.yaml-json.yamlPlaceholder")).toBeInTheDocument();
    expect(screen.getByText("toolPages.yaml-json.yamlToJson")).toBeInTheDocument();
    expect(screen.getByText("toolPages.yaml-json.jsonToYaml")).toBeInTheDocument();
  });

  it("converts YAML to JSON", () => {
    render(<YamlJsonPage />);
    const input = screen.getByPlaceholderText("toolPages.yaml-json.yamlPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "name: test\nvalue: 123" } });
    fireEvent.click(convertBtn);

    expect(screen.getByDisplayValue(/"name": "test"/)).toBeInTheDocument();
  });

  it("converts JSON to YAML", () => {
    render(<YamlJsonPage />);
    const jsonModeBtn = screen.getByText("toolPages.yaml-json.jsonToYaml");
    fireEvent.click(jsonModeBtn);

    const input = screen.getByPlaceholderText("toolPages.yaml-json.jsonPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: '{"name": "test", "value": 123}' } });
    fireEvent.click(convertBtn);

    expect(screen.getByDisplayValue(/name: test/)).toBeInTheDocument();
  });

  it("shows error for empty input", () => {
    render(<YamlJsonPage />);
    const convertBtn = screen.getByText("common.convert");

    fireEvent.click(convertBtn);

    expect(screen.getByText("toolPages.yaml-json.errorEmpty")).toBeInTheDocument();
  });

  it("shows error for invalid YAML", () => {
    render(<YamlJsonPage />);
    const input = screen.getByPlaceholderText("toolPages.yaml-json.yamlPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "invalid yaml" } });
    fireEvent.click(convertBtn);

    expect(screen.getByText("toolPages.yaml-json.errorInvalidYaml")).toBeInTheDocument();
  });

  it("shows error for invalid JSON", () => {
    render(<YamlJsonPage />);
    const jsonModeBtn = screen.getByText("toolPages.yaml-json.jsonToYaml");
    fireEvent.click(jsonModeBtn);

    const input = screen.getByPlaceholderText("toolPages.yaml-json.jsonPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "invalid json" } });
    fireEvent.click(convertBtn);

    expect(screen.getByText("toolPages.yaml-json.errorInvalidJson")).toBeInTheDocument();
  });

  it("switches mode and swaps input/output", () => {
    render(<YamlJsonPage />);
    const input = screen.getByPlaceholderText("toolPages.yaml-json.yamlPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "name: test\nvalue: 123" } });
    fireEvent.click(convertBtn);

    const switchBtn = screen.getByText("toolPages.yaml-json.switchMode");
    fireEvent.click(switchBtn);

    const jsonInput = screen.getByPlaceholderText("toolPages.yaml-json.jsonPlaceholder");
    expect(jsonInput).toHaveValue(expect.stringContaining("\"name\": \"test\""));
  });

  it("clears all fields", () => {
    render(<YamlJsonPage />);
    const input = screen.getByPlaceholderText("toolPages.yaml-json.yamlPlaceholder");
    const convertBtn = screen.getByText("common.convert");
    const clearBtn = screen.getByText("common.clear");

    fireEvent.change(input, { target: { value: "name: test" } });
    fireEvent.click(convertBtn);
    fireEvent.click(clearBtn);

    expect(input).toHaveValue("");
  });

  it("copies output to clipboard", async () => {
    const writeTextMock = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<YamlJsonPage />);
    const input = screen.getByPlaceholderText("toolPages.yaml-json.yamlPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "name: test" } });
    fireEvent.click(convertBtn);

    const copyBtn = screen.getByText("common.copy");
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalled();
  });
});
