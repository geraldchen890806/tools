import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EscapePage from "./page";

// Mock useTranslation
vi.mock("@/i18n", () => ({
  useTranslation: () => (key: string) => key,
}));

describe("EscapePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<EscapePage />);
    expect(screen.getByPlaceholderText("toolPages.escape.inputPlaceholder")).toBeInTheDocument();
    expect(screen.getByText("toolPages.escape.escape")).toBeInTheDocument();
    expect(screen.getByText("toolPages.escape.unescape")).toBeInTheDocument();
  });

  it("escapes JavaScript string", () => {
    render(<EscapePage />);
    const input = screen.getByPlaceholderText("toolPages.escape.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: 'Hello "World"\nNew Line' } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue(expect.stringContaining('\\"'));
    expect(output).toHaveValue(expect.stringContaining('\\n'));
  });

  it("unescapes JavaScript string", () => {
    render(<EscapePage />);
    const unescapeBtn = screen.getByText("toolPages.escape.unescape");
    fireEvent.click(unescapeBtn);

    const input = screen.getByPlaceholderText("toolPages.escape.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: 'Hello \\"World\\"\\nNew Line' } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue('Hello "World"\nNew Line');
  });

  it("escapes URI", () => {
    render(<EscapePage />);
    const uriBtn = screen.getByText("URI");
    fireEvent.click(uriBtn);

    const input = screen.getByPlaceholderText("toolPages.escape.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "hello world@test.com" } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue("hello%20world%40test.com");
  });

  it("unescapes URI", () => {
    render(<EscapePage />);
    const unescapeBtn = screen.getByText("toolPages.escape.unescape");
    const uriBtn = screen.getByText("URI");
    fireEvent.click(unescapeBtn);
    fireEvent.click(uriBtn);

    const input = screen.getByPlaceholderText("toolPages.escape.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "hello%20world%40test.com" } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue("hello world@test.com");
  });

  it("escapes HTML", () => {
    render(<EscapePage />);
    const htmlBtn = screen.getByText("HTML");
    fireEvent.click(htmlBtn);

    const input = screen.getByPlaceholderText("toolPages.escape.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: '<div class="test">Hello & "World"</div>' } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue(expect.stringContaining("&lt;"));
    expect(output).toHaveValue(expect.stringContaining("&gt;"));
    expect(output).toHaveValue(expect.stringContaining("&quot;"));
    expect(output).toHaveValue(expect.stringContaining("&amp;"));
  });

  it("unescapes HTML", () => {
    render(<EscapePage />);
    const unescapeBtn = screen.getByText("toolPages.escape.unescape");
    const htmlBtn = screen.getByText("HTML");
    fireEvent.click(unescapeBtn);
    fireEvent.click(htmlBtn);

    const input = screen.getByPlaceholderText("toolPages.escape.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "&lt;div&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;" } });
    fireEvent.click(convertBtn);

    const output = screen.getAllByRole("textbox")[1];
    expect(output).toHaveValue('<div>Hello & "World"</div>');
  });

  it("clears all fields", () => {
    render(<EscapePage />);
    const input = screen.getByPlaceholderText("toolPages.escape.inputPlaceholder");
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

    render(<EscapePage />);
    const input = screen.getByPlaceholderText("toolPages.escape.inputPlaceholder");
    const convertBtn = screen.getByText("common.convert");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(convertBtn);

    const copyBtn = screen.getByText("common.copy");
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalled();
  });
});
