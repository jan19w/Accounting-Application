@echo off
chcp 65001 >nul
echo ====================================
echo   MySQL数据库初始化脚本
echo ====================================
echo.
echo 即将执行数据库初始化...
echo 数据库名: projectdata
echo 表名: details
echo.
echo 请输入MySQL root密码:
echo.

cd /d "%~dp0"
mysql -u root -p < init.sql

if %errorlevel% equ 0 (
    echo.
    echo ====================================
    echo   ✓ 数据库初始化成功！
    echo ====================================
    echo.
) else (
    echo.
    echo ====================================
    echo   ✗ 数据库初始化失败！
    echo   请检查：
    echo   1. MySQL服务是否已启动
    echo   2. 用户名和密码是否正确
    echo   3. mysql命令是否在系统PATH中
    echo ====================================
    echo.
)

pause


