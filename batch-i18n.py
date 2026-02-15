#!/usr/bin/env python3
import os
import re

TOOLS_DIR = "/Users/geraldchen/ai/tools/src/app/tools"
COMPLETED = ["base64", "json-formatter", "url-encoder", "hash"]

def process_file(tool_id, filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已有 useTranslation
    if 'useTranslation' in content:
        return False
    
    # 1. 添加 import
    if 'from "@/components/ToolLayout"' in content:
        content = content.replace(
            'from "@/components/ToolLayout";',
            'from "@/components/ToolLayout";\nimport { useTranslation } from "@/i18n";'
        )
    
    # 2. 添加 hook（在函数开始处）
    pattern = r'(export default function \w+\([^)]*\)\s*{)'
    content = re.sub(pattern, r'\1\n  const { t } = useTranslation();', content)
    
    # 3. 替换 ToolLayout
    content = re.sub(
        r'<ToolLayout\s+title="[^"]*"\s+description="[^"]*">',
        f'<ToolLayout toolId="{tool_id}">',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    count = 0
    for tool_dir in os.listdir(TOOLS_DIR):
        if tool_dir in COMPLETED:
            continue
        
        tool_path = os.path.join(TOOLS_DIR, tool_dir)
        if not os.path.isdir(tool_path):
            continue
        
        page_file = os.path.join(tool_path, "page.tsx")
        if not os.path.exists(page_file):
            continue
        
        if process_file(tool_dir, page_file):
            print(f"✓ {tool_dir}")
            count += 1
        else:
            print(f"- {tool_dir} (already done)")
    
    print(f"\n完成 {count} 个工具的多语言处理")

if __name__ == "__main__":
    main()
