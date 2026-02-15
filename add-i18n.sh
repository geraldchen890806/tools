#!/bin/bash

# 为所有工具页面添加 useTranslation 导入和 toolId
cd /Users/geraldchen/ai/tools/src/app/tools

for dir in */; do
  tool="${dir%/}"
  file="$dir/page.tsx"
  
  if [ -f "$file" ]; then
    # 检查是否已经有 useTranslation
    if grep -q "useTranslation" "$file"; then
      echo "✓ $tool already has i18n"
    else
      # 添加 import
      if grep -q "from \"@/components/ToolLayout\"" "$file"; then
        sed -i '' '/from "@\/components\/ToolLayout"/a\
import { useTranslation } from "@/i18n";
' "$file"
        echo "✓ Added import to $tool"
      fi
      
      # 添加 const { t } = useTranslation();
      if grep -q "export default function" "$file"; then
        sed -i '' '/export default function.*{/a\
  const { t } = useTranslation();
' "$file"
        echo "✓ Added useTranslation hook to $tool"
      fi
      
      # 替换 ToolLayout 为使用 toolId
      sed -i '' "s/<ToolLayout title=\"[^\"]*\" description=\"[^\"]*\">/<ToolLayout toolId=\"$tool\">/g" "$file"
      echo "✓ Updated ToolLayout in $tool"
    fi
  fi
done

echo "Done!"
