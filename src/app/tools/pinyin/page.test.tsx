import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PinyinPage from "./page";

// Mock useTranslation
vi.mock("@/i18n", () => ({
  useTranslation: () => (key: string) => key,
}));

// Mock pinyin-pro
vi.mock("pinyin-pro", () => ({
  pinyin: vi.fn((text: string, options: any) => {
    if (options.toneType === "symbol") return "nǐ hǎo";
    if (options.toneType === "num") return "ni3 hao3";
    if (options.toneType === "none") return "ni hao";
    return "ni hao";
  }),
}));

describe("PinyinPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<PinyinPage />);
    expect(screen.getByPlaceholderText("toolPages.pinyin.inputPlaceholder")).toBeInTheDocument();
    expect(screen.getByText(/toolPages.pinyin.withTone/)).toBeInTheDocument();
    expect(screen.getByText(/toolPages.pinyin.numberTone/)).toBeInTheDocument();
    expect(screen.getByText(/toolPages.pinyin.noTone/)).toBeInTheDocument();
  });

  it("converts to pinyin with tone symbols", () => {
    render(<PinyinPage />);
    const input = screen.getByPlaceholderText("toolPages.pinyin.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "你好" } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue("nǐ hǎo");
  });

  it("converts to pinyin with number tones", () => {
    render(<PinyinPage />);
    const numberToneBtn = screen.getByText(/toolPages.pinyin.numberTone/);
    fireEvent.click(numberToneBtn);

    const input = screen.getByPlaceholderText("toolPages.pinyin.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "你好" } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue("ni3 hao3");
  });

  it("converts to pinyin without tones", () => {
    render(<PinyinPage />);
    const noToneBtn = screen.getByText(/toolPages.pinyin.noTone/);
    fireEvent.click(noToneBtn);

    const input = screen.getByPlaceholderText("toolPages.pinyin.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "你好" } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue("ni hao");
  });

  it("changes separator", () => {
    const { pinyin } = require("pinyin-pro");
    
    render(<PinyinPage />);
    const hyphenBtn = screen.getByText("toolPages.pinyin.hyphen");
    fireEvent.click(hyphenBtn);

    const input = screen.getByPlaceholderText("toolPages.pinyin.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "你好" } });
    fireEvent.click(convertBtn);

    expect(pinyin).toHaveBeenCalledWith("你好", expect.objectContaining({ separator: "-" }));
  });

  it("clears all fields", () => {
    render(<PinyinPage />);
    const input = screen.getByPlaceholderText("toolPages.pinyin.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");
    const clearBtn = screen.getByText("common.clear");

    fireEvent.change(input, { target: { value: "你好" } });
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

    render(<PinyinPage />);
    const input = screen.getByPlaceholderText("toolPages.pinyin.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "你好" } });
    fireEvent.click(convertBtn);

    const copyBtn = screen.getByText("common.copy");
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith("nǐ hǎo");
  });

  it("handles empty input", () => {
    render(<PinyinPage />);
    const convertBtn = screen.getByText("common.convert");

    fireEvent.click(convertBtn);

    expect(screen.queryByRole("textbox", { name: "common.output" })).not.toBeInTheDocument();
  });
});
