@echo off

REM 기존 명령어들을 새 창에서 실행
start cmd /k "cd C:\Users\photomong\Desktop\photomong\photo_temp && pip install -r requirements.txt && python printer_server.py runserver 0.0.0.0:8001"

start cmd /k "cd C:\Users\photomong\Desktop\photomong\photo_temp\app && npm install && npm start"

start cmd /k "cd C:\Users\photomong\Desktop\photomong\photo_temp\photomong-admin && npm install && npm start"


REM WSL 내부의 app.py를 sudo로 실행 (새 창에서)
echo Starting app.py in WSL with sudo...
start wsl -e bash -c "sudo python3 /root/camera/app.py; exec bash"


@echo off
echo Searching for Canon...

for /f "tokens=1,2,* delims= " %%a in ('usbipd list ^| findstr /C:"Canon"') do (
    set "busid=%%a"
    set "devicename=%%b %%c"
    REM busid 값이 GUID 형식이 아닌 경우에만 설정
    echo %%a | findstr /R "^[0-9]-[0-9]" >nul
    if %errorlevel% equ 0 (
        set "busid=%%a"
        set "devicename=%%b %%c"
        goto :found
    )
)

if not defined busid (
    echo Canon Digital Camera not found. Please check the connection and try again.
    pause
    exit /b
)

:found
REM USBIPD 바인딩 및 연결
echo Found device: %devicename%
echo Binding and attaching Canon Digital Camera with busid: %busid%
usbipd bind --busid %busid% -f
if %errorlevel% neq 0 (
    echo Failed to bind the device. Please check the device status and try again.
    pause
    exit /b
)

usbipd attach --busid %busid% --wsl --auto-attach
if %errorlevel% neq 0 (
    echo Failed to attach the device. It might be already attached or there might be a permission issue.
    echo Please check the device status and try again.
    pause
    exit /b
)
