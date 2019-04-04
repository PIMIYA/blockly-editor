# Blockly Editor

## How To Run

進入到 `src` 資料夾底下後執行 `npm start`

## How To Build

`npm run package-win`

## ISSUE

### NODE_MODULE_VERSION 不一致的問題

解決方法 `$(npm bin)/electron-rebuild`。

## TODO

- [x] 套入 blockly
- [x] 模擬 blockly script
- [x] Save script to file
- [x] 將 blockly 產出的 script 轉傳入 simulator
- [x] simulator import script file
- [x] simulator show information of trigger on button
- [x] Export current blockly to xml file
- [x] 紀錄 blockly 當前狀態(export xml to memory cache?)
- [x] Import xml file to blockly
- [x] 回復 blockly 之前狀態(import xml from memory cache?)
- [ ] 建置檔案
  - [ ] macOs
  - [x] Windows