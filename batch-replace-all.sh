#!/bin/bash

cd /Users/geraldchen/ai/tools/src/app/tools

# regex-tester
sed -i '' 's/placeholder="输入正则..."/placeholder={t("toolPages.regex-tester.patternPlaceholder")}/g' regex-tester/page.tsx
sed -i '' 's/placeholder="输入测试文本..."/placeholder={t("toolPages.regex-tester.textPlaceholder")}/g' regex-tester/page.tsx
sed -i '' 's/>Flags</{t("toolPages.regex-tester.flags")}</g' regex-tester/page.tsx
sed -i '' 's/>高亮结果</{t("toolPages.regex-tester.highlightResult")}</g' regex-tester/page.tsx
sed -i '' 's/>匹配项</{t("toolPages.regex-tester.matches")}</g' regex-tester/page.tsx
sed -i '' 's/>无匹配</{t("toolPages.regex-tester.noMatch")}</g' regex-tester/page.tsx

# html-escape  
sed -i '' 's/placeholder="输入 HTML..."/placeholder={t("toolPages.html-escape.inputPlaceholder")}/g' html-escape/page.tsx
sed -i '' 's/"编码"/{t("toolPages.html-escape.encodeMode")}/g' html-escape/page.tsx
sed -i '' 's/"解码"/{t("toolPages.html-escape.decodeMode")}/g' html-escape/page.tsx

# sql-formatter
sed -i '' 's/placeholder="粘贴 SQL..."/placeholder={t("toolPages.sql-formatter.inputPlaceholder")}/g' sql-formatter/page.tsx
sed -i '' 's/>缩进大小</{t("toolPages.sql-formatter.indentSize")}</g' sql-formatter/page.tsx

# text-dedupe
sed -i '' 's/placeholder="粘贴文本..."/placeholder={t("toolPages.text-dedupe.inputPlaceholder")}/g' text-dedupe/page.tsx
sed -i '' 's/>区分大小写</{t("toolPages.text-dedupe.caseSensitive")}</g' text-dedupe/page.tsx
sed -i '' 's/>去除空白</{t("toolPages.text-dedupe.trimWhitespace")}</g' text-dedupe/page.tsx
sed -i '' 's/>去重</{t("toolPages.text-dedupe.deduplicate")}</g' text-dedupe/page.tsx

# log-highlighter
sed -i '' 's/placeholder="粘贴日志..."/placeholder={t("toolPages.log-highlighter.inputPlaceholder")}/g' log-highlighter/page.tsx

# json-path
sed -i '' 's/placeholder="粘贴 JSON..."/placeholder={t("toolPages.json-path.jsonPlaceholder")}/g' json-path/page.tsx
sed -i '' 's/placeholder="输入 JSONPath 表达式..."/placeholder={t("toolPages.json-path.pathPlaceholder")}/g' json-path/page.tsx
sed -i '' 's/>查询</{t("toolPages.json-path.query")}</g' json-path/page.tsx

# cron-parser
sed -i '' 's/>分</{t("toolPages.cron-parser.minute")}</g' cron-parser/page.tsx
sed -i '' 's/>时</{t("toolPages.cron-parser.hour")}</g' cron-parser/page.tsx
sed -i '' 's/>日</{t("toolPages.cron-parser.day")}</g' cron-parser/page.tsx
sed -i '' 's/>月</{t("toolPages.cron-parser.month")}</g' cron-parser/page.tsx
sed -i '' 's/>周</{t("toolPages.cron-parser.week")}</g' cron-parser/page.tsx
sed -i '' 's/>每分钟</{t("toolPages.cron-parser.everyMinute")}</g' cron-parser/page.tsx
sed -i '' 's/>每小时</{t("toolPages.cron-parser.everyHour")}</g' cron-parser/page.tsx
sed -i '' 's/>每天</{t("toolPages.cron-parser.everyDay")}</g' cron-parser/page.tsx

# jwt-decoder
sed -i '' 's/placeholder="粘贴 JWT Token..."/placeholder={t("toolPages.jwt-decoder.inputPlaceholder")}/g' jwt-decoder/page.tsx
sed -i '' 's/>解析</{t("toolPages.jwt-decoder.decode")}</g' jwt-decoder/page.tsx
sed -i '' 's/>Header</{t("toolPages.jwt-decoder.header")}</g' jwt-decoder/page.tsx
sed -i '' 's/>Payload</{t("toolPages.jwt-decoder.payload")}</g' jwt-decoder/page.tsx
sed -i '' 's/>Signature</{t("toolPages.jwt-decoder.signature")}</g' jwt-decoder/page.tsx

# notes
sed -i '' 's/placeholder="标题"/placeholder={t("toolPages.notes.titlePlaceholder")}/g' notes/page.tsx
sed -i '' 's/placeholder="内容（可选）"/placeholder={t("toolPages.notes.contentPlaceholder")}/g' notes/page.tsx
sed -i '' 's/>添加备忘</{t("toolPages.notes.addNote")}</g' notes/page.tsx
sed -i '' 's/>编辑</{t("toolPages.notes.editNote")}</g' notes/page.tsx
sed -i '' 's/>删除</{t("toolPages.notes.deleteNote")}</g' notes/page.tsx
sed -i '' 's/>保存修改</{t("toolPages.notes.saveChanges")}</g' notes/page.tsx
sed -i '' 's/>取消</{t("toolPages.notes.cancel")}</g' notes/page.tsx

# lorem-ipsum
sed -i '' 's/>段落数</{t("toolPages.lorem-ipsum.paragraphs")}</g' lorem-ipsum/page.tsx
sed -i '' 's/>拉丁文</{t("toolPages.lorem-ipsum.latin")}</g' lorem-ipsum/page.tsx
sed -i '' 's/>中文</{t("toolPages.lorem-ipsum.chinese")}</g' lorem-ipsum/page.tsx

# chinese-converter
sed -i '' 's/placeholder="输入文本..."/placeholder={t("toolPages.chinese-converter.inputPlaceholder")}/g' chinese-converter/page.tsx

# number-base
sed -i '' 's/placeholder="输入数字..."/placeholder={t("toolPages.number-base.inputPlaceholder")}/g' number-base/page.tsx
sed -i '' 's/>十进制</{t("toolPages.number-base.decimal")}</g' number-base/page.tsx
sed -i '' 's/>二进制</{t("toolPages.number-base.binary")}</g' number-base/page.tsx
sed -i '' 's/>八进制</{t("toolPages.number-base.octal")}</g' number-base/page.tsx
sed -i '' 's/>十六进制</{t("toolPages.number-base.hexadecimal")}</g' number-base/page.tsx
sed -i '' 's/>转换</{t("toolPages.number-base.convert")}</g' number-base/page.tsx

# world-clock
sed -i '' 's/同北京/{t("toolPages.world-clock.diffWithBeijing")}/g' world-clock/page.tsx

echo "批量替换完成！"
