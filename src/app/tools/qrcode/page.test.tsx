import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import Page from "./page";

// Mock QRCode library
vi.mock("qrcode", () => ({
  default: {
    toCanvas: vi.fn((canvas, text, options) => {
      // Mock implementation that draws on canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = options.color.light;
        ctx.fillRect(0, 0, options.width, options.width);
      }
      return Promise.resolve();
    }),
  },
}));

describe("二维码生成工具", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. 渲染测试
  test("应该正确渲染工具界面", () => {
    render(<Page />);
    expect(screen.getByPlaceholderText(/输入文本或 URL/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /生成/i })).toBeInTheDocument();
  });

  // 2. 基础功能测试
  test("应该有尺寸选择器", () => {
    render(<Page />);
    const sizeSelects = screen.getAllByRole("combobox");
    expect(sizeSelects.length).toBeGreaterThan(0);
  });

  test("应该有容错级别选择器", () => {
    render(<Page />);
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(2);
  });

  test("应该有边距滑块", () => {
    render(<Page />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
  });

  test("应该有颜色选择器", () => {
    render(<Page />);
    const colorInputs = screen.getAllByDisplayValue(/#[0-9a-f]{6}/i);
    expect(colorInputs.length).toBe(2); // 前景色和背景色
  });

  test("应该有logo上传功能", () => {
    render(<Page />);
    expect(screen.getByText(/上传图片/i)).toBeInTheDocument();
  });

  // 3. 生成功能测试
  test("输入文本后应该启用生成按钮", async () => {
    const user = userEvent.setup();
    render(<Page />);

    const textarea = screen.getByPlaceholderText(/输入文本或 URL/i);
    const generateBtn = screen.getByRole("button", { name: /生成/i });

    // 初始状态应该禁用
    expect(generateBtn).toBeDisabled();

    // 输入文本后应该启用
    await user.type(textarea, "Hello World");
    expect(generateBtn).not.toBeDisabled();
  });

  test("输入文本后应该自动生成二维码", async () => {
    const user = userEvent.setup();
    render(<Page />);

    const textarea = screen.getByPlaceholderText(/输入文本或 URL/i);
    await user.type(textarea, "Test");

    await waitFor(() => {
      const canvas = document.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
    });
  });

  test("生成后应该显示下载按钮", async () => {
    const user = userEvent.setup();
    render(<Page />);

    const textarea = screen.getByPlaceholderText(/输入文本或 URL/i);
    await user.type(textarea, "Test");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /下载/i })).toBeInTheDocument();
    });
  });

  // 4. 参数调整测试
  test("应该支持调整尺寸", async () => {
    const user = userEvent.setup();
    const QRCode = (await import("qrcode")).default;

    render(<Page />);

    const textarea = screen.getByPlaceholderText(/输入文本或 URL/i);
    await user.type(textarea, "Test");

    const sizeSelect = screen.getAllByRole("combobox")[0];
    await user.selectOptions(sizeSelect, "400");

    await waitFor(() => {
      expect(QRCode.toCanvas).toHaveBeenCalledWith(
        expect.anything(),
        "Test",
        expect.objectContaining({ width: 400 })
      );
    });
  });

  test("应该支持调整容错级别", async () => {
    const user = userEvent.setup();
    const QRCode = (await import("qrcode")).default;

    render(<Page />);

    const textarea = screen.getByPlaceholderText(/输入文本或 URL/i);
    await user.type(textarea, "Test");

    const errorLevelSelect = screen.getAllByRole("combobox")[1];
    await user.selectOptions(errorLevelSelect, "H");

    await waitFor(() => {
      expect(QRCode.toCanvas).toHaveBeenCalledWith(
        expect.anything(),
        "Test",
        expect.objectContaining({ errorCorrectionLevel: "H" })
      );
    });
  });

  test("应该支持调整边距", async () => {
    const user = userEvent.setup();
    const QRCode = (await import("qrcode")).default;

    render(<Page />);

    const textarea = screen.getByPlaceholderText(/输入文本或 URL/i);
    await user.type(textarea, "Test");

    const slider = screen.getByRole("slider");
    await user.clear(slider);
    await user.type(slider, "8");

    await waitFor(() => {
      expect(QRCode.toCanvas).toHaveBeenCalledWith(
        expect.anything(),
        "Test",
        expect.objectContaining({ margin: 8 })
      );
    });
  });

  test("应该支持调整颜色", async () => {
    const user = userEvent.setup();
    const QRCode = (await import("qrcode")).default;

    render(<Page />);

    const textarea = screen.getByPlaceholderText(/输入文本或 URL/i);
    await user.type(textarea, "Test");

    const colorInputs = screen.getAllByDisplayValue(/#[0-9a-f]{6}/i);
    const darkColorInput = colorInputs[0];

    // 修改前景色
    await user.clear(darkColorInput);
    await user.type(darkColorInput, "#ff0000");

    await waitFor(() => {
      expect(QRCode.toCanvas).toHaveBeenCalledWith(
        expect.anything(),
        "Test",
        expect.objectContaining({
          color: expect.objectContaining({ dark: "#ff0000" }),
        })
      );
    });
  });

  // 5. Logo上传测试
  test("应该支持上传logo", async () => {
    const user = userEvent.setup();
    render(<Page />);

    const file = new File(["logo"], "logo.png", { type: "image/png" });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/已上传/i)).toBeInTheDocument();
      expect(screen.getByText(/移除/i)).toBeInTheDocument();
    });
  });

  test("应该支持移除logo", async () => {
    const user = userEvent.setup();
    render(<Page />);

    const file = new File(["logo"], "logo.png", { type: "image/png" });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/已上传/i)).toBeInTheDocument();
    });

    const removeBtn = screen.getByRole("button", { name: /移除/i });
    await user.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByText(/已上传/i)).not.toBeInTheDocument();
    });
  });

  // 6. 下载功能测试
  test("下载按钮应该触发下载", async () => {
    const user = userEvent.setup();

    // Mock canvas.toDataURL
    HTMLCanvasElement.prototype.toDataURL = vi.fn(() => "data:image/png;base64,fake");

    // Mock document.createElement to spy on the download
    const mockClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = vi.fn((tagName: string) => {
      const element = originalCreateElement(tagName);
      if (tagName === "a") {
        element.click = mockClick;
      }
      return element;
    });

    render(<Page />);

    const textarea = screen.getByPlaceholderText(/输入文本或 URL/i);
    await user.type(textarea, "Test");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /下载/i })).toBeInTheDocument();
    });

    const downloadBtn = screen.getByRole("button", { name: /下载/i });
    await user.click(downloadBtn);

    expect(mockClick).toHaveBeenCalled();

    // Cleanup
    document.createElement = originalCreateElement;
  });

  // 7. 边界情况测试
  test("空输入时应该禁用生成按钮", () => {
    render(<Page />);
    const generateBtn = screen.getByRole("button", { name: /生成/i });
    expect(generateBtn).toBeDisabled();
  });

  test("只有空格时应该禁用生成按钮", async () => {
    const user = userEvent.setup();
    render(<Page />);

    const textarea = screen.getByPlaceholderText(/输入文本或 URL/i);
    await user.type(textarea, "   ");

    const generateBtn = screen.getByRole("button", { name: /生成/i });
    expect(generateBtn).toBeDisabled();
  });

  test("应该正确处理中文", async () => {
    const user = userEvent.setup();
    const QRCode = (await import("qrcode")).default;

    render(<Page />);

    const textarea = screen.getByPlaceholderText(/输入文本或 URL/i);
    await user.type(textarea, "你好世界");

    await waitFor(() => {
      expect(QRCode.toCanvas).toHaveBeenCalledWith(
        expect.anything(),
        "你好世界",
        expect.anything()
      );
    });
  });

  test("应该正确处理特殊字符", async () => {
    const user = userEvent.setup();
    const QRCode = (await import("qrcode")).default;

    render(<Page />);

    const textarea = screen.getByPlaceholderText(/输入文本或 URL/i);
    await user.type(textarea, "Hello & World!");

    await waitFor(() => {
      expect(QRCode.toCanvas).toHaveBeenCalledWith(
        expect.anything(),
        "Hello & World!",
        expect.anything()
      );
    });
  });
});
