import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import UnicodePage from "./page";

// Mock useTranslation
vi.mock("@/i18n", () => ({
  useTranslation: () => (key: string) => key,
}));

describe("UnicodePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<UnicodePage />);
    expect(screen.getByPlaceholderText("toolPages.unicode.inputPlaceholder")).toBeInTheDocument();
    expect(screen.getByText("toolPages.unicode.encode")).toBeInTheDocument();
    expect(screen.getByText("toolPages.unicode.decode")).toBeInTheDocument();
  });

  it("encodes to \\uXXXX format", () => {
    render(<UnicodePage />);
    const input = screen.getByPlaceholderText("toolPages.unicode.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "你好" } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue("\\u4f60\\u597d");
  });

  it("encodes to &#XXXX; format", () => {
    render(<UnicodePage />);
    const htmlFormatBtn = screen.getByText("&#XXXX;");
    fireEvent.click(htmlFormatBtn);

    const input = screen.getByPlaceholderText("toolPages.unicode.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "你好" } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue("&#20320;&#22909;");
  });

  it("decodes \\uXXXX format", () => {
    render(<UnicodePage />);
    const decodeBtn = screen.getByText("toolPages.unicode.decode");
    fireEvent.click(decodeBtn);

    const input = screen.getByPlaceholderText("toolPages.unicode.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "\\u4f60\\u597d" } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue("你好");
  });

  it("decodes &#XXXX; format", () => {
    render(<UnicodePage />);
    const decodeBtn = screen.getByText("toolPages.unicode.decode");
    fireEvent.click(decodeBtn);

    const input = screen.getByPlaceholderText("toolPages.unicode.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "&#20320;&#22909;" } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue("你好");
  });

  it("decodes &#xXXXX; format", () => {
    render(<UnicodePage />);
    const decodeBtn = screen.getByText("toolPages.unicode.decode");
    fireEvent.click(decodeBtn);

    const input = screen.getByPlaceholderText("toolPages.unicode.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "&#x4f60;&#x597d;" } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue("你好");
  });

  it("handles ASCII characters", () => {
    render(<UnicodePage />);
    const input = screen.getByPlaceholderText("toolPages.unicode.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "ABC" } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue("\\u0041\\u0042\\u0043");
  });

  it("clears all fields", () => {
    render(<UnicodePage />);
    const input = screen.getByPlaceholderText("toolPages.unicode.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");
    const clearBtn = screen.getByText("common.clear");

    fireEvent.change(input, { target: { value: "test" } });
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

    render(<UnicodePage />);
    const input = screen.getByPlaceholderText("toolPages.unicode.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(convertBtn);

    const copyBtn = screen.getByText("common.copy");
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalled();
  });
});
