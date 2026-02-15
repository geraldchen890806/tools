import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import XmlFormatterPage from "./page";

// Mock useTranslation
vi.mock("@/i18n", () => ({
  useTranslation: () => (key: string) => key,
}));

// Mock xml-formatter
vi.mock("xml-formatter", () => ({
  default: vi.fn((xml: string) => {
    if (xml.includes("invalid")) throw new Error("Invalid XML");
    return `<root>\n  <item>formatted</item>\n</root>`;
  }),
  minify: vi.fn((xml: string) => {
    if (xml.includes("invalid")) throw new Error("Invalid XML");
    return "<root><item>minified</item></root>";
  }),
}));

describe("XmlFormatterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<XmlFormatterPage />);
    expect(screen.getByPlaceholderText("toolPages.xml-formatter.inputPlaceholder")).toBeInTheDocument();
    expect(screen.getByText("toolPages.xml-formatter.format")).toBeInTheDocument();
    expect(screen.getByText("toolPages.xml-formatter.minify")).toBeInTheDocument();
  });

  it("formats XML correctly", () => {
    render(<XmlFormatterPage />);
    const input = screen.getByPlaceholderText("toolPages.xml-formatter.inputPlaceholder");
    const formatBtn = screen.getByText("toolPages.xml-formatter.format");

    fireEvent.change(input, { target: { value: "<root><item>test</item></root>" } });
    fireEvent.click(formatBtn);

    expect(screen.getByDisplayValue("<root>\n  <item>formatted</item>\n</root>")).toBeInTheDocument();
  });

  it("minifies XML correctly", () => {
    render(<XmlFormatterPage />);
    const input = screen.getByPlaceholderText("toolPages.xml-formatter.inputPlaceholder");
    const minifyBtn = screen.getByText("toolPages.xml-formatter.minify");

    fireEvent.change(input, { target: { value: "<root>\n  <item>test</item>\n</root>" } });
    fireEvent.click(minifyBtn);

    expect(screen.getByDisplayValue("<root><item>minified</item></root>")).toBeInTheDocument();
  });

  it("shows error for empty input", () => {
    render(<XmlFormatterPage />);
    const formatBtn = screen.getByText("toolPages.xml-formatter.format");

    fireEvent.click(formatBtn);

    expect(screen.getByText("toolPages.xml-formatter.errorEmpty")).toBeInTheDocument();
  });

  it("shows error for invalid XML", () => {
    render(<XmlFormatterPage />);
    const input = screen.getByPlaceholderText("toolPages.xml-formatter.inputPlaceholder");
    const formatBtn = screen.getByText("toolPages.xml-formatter.format");

    fireEvent.change(input, { target: { value: "invalid xml" } });
    fireEvent.click(formatBtn);

    expect(screen.getByText("toolPages.xml-formatter.errorInvalid")).toBeInTheDocument();
  });

  it("clears all fields", () => {
    render(<XmlFormatterPage />);
    const input = screen.getByPlaceholderText("toolPages.xml-formatter.inputPlaceholder");
    const formatBtn = screen.getByText("toolPages.xml-formatter.format");
    const clearBtn = screen.getByText("common.clear");

    fireEvent.change(input, { target: { value: "<root><item>test</item></root>" } });
    fireEvent.click(formatBtn);
    fireEvent.click(clearBtn);

    expect(input).toHaveValue("");
    expect(screen.queryByDisplayValue("<root>\n  <item>formatted</item>\n</root>")).not.toBeInTheDocument();
  });

  it("copies output to clipboard", async () => {
    const writeTextMock = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<XmlFormatterPage />);
    const input = screen.getByPlaceholderText("toolPages.xml-formatter.inputPlaceholder");
    const formatBtn = screen.getByText("toolPages.xml-formatter.format");

    fireEvent.change(input, { target: { value: "<root><item>test</item></root>" } });
    fireEvent.click(formatBtn);

    const copyBtn = screen.getByText("common.copy");
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith("<root>\n  <item>formatted</item>\n</root>");
  });
});
