# Blockly Editor

## How To Run

進入到 `src` 資料夾底下後執行 `npm start`

## ISSUE

### NODE_MODULE_VERSION 不一致的問題

解決方法 `$(npm bin)/electron-rebuild`。

## TODO

- [ ] 套入 blockly
  - [ ] 需要將本來網頁用的 blockly 改用 node-blockly
- [ ] 模擬 blockly script
- [ ] Save script to file
- [ ] Export current blockly to xml
- [ ] Import xml to blockly