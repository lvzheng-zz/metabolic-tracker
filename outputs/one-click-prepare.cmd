@echo off
chcp 65001 >nul
set SCRIPT_DIR=%~dp0
call "%SCRIPT_DIR%metabolic-tracker\deploy\aliyun\one-click-prepare.cmd"
