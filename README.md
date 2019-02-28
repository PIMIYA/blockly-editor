# Blockly Editor

## How To Run

進入到 `src` 資料夾底下後執行 `npm start`

## ISSUE

### NODE_MODULE_VERSION 不一致的問題

解決方法 `$(npm bin)/electron-rebuild`。

## TODO

- [x] 套入 blockly
- [x] 模擬 blockly script
- [x] Save script to file
- [ ] 將 blockly 產出的 script 轉傳入 simulator
- [ ] simulator import script file
- [ ] simulator show information of trigger on button
- [ ] Export current blockly to xml file
  - [ ] 紀錄 blockly 當前狀態(export xml to memory cache?)
- [ ] Import xml file to blockly
  - [ ] 回復 blockly 之前狀態(import xml from memory cache?)
- [ ] 建置檔案
  - [ ] macOs
  - [ ] Windows