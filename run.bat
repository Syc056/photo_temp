@echo off


echo Searching for Canon Digital Camera...
for /f "tokens=1,* delims= " %%a in ('usbipd wsl list ^| findstr /C:"Canon Digital Camera"') do (
    set busid=%%a
    set devicename=%%b
)


if not defined busid (
    echo Canon Digital Camera not found. Please check the connection and try again.
    pause
    exit /b
)

REM USBIPD 바인딩 및 연결
echo Found device: %devicename%
echo Binding and attaching Canon Digital Camera with busid: %busid%
usbipd bind --busid %busid% -f
usbipd attach --busid %busid% --wsl --auto-attach

if %errorlevel% neq 0 (
    echo Failed to attach the device. It might be already attached or there might be a permission issue.
    echo Please check the device status and try again.
    pause
    exit /b
)

REM WSL 내부의 app.py를 sudo로 실행
echo Starting app.py in WSL with sudo...
start wsl -e bash -c "sudo python3 app.py"

REM 기존 명령어들
start cmd /k "python3 printer_server.py runserver 0.0.0.0:8001"
cd app
start cmd /k "npm install --legacy-peer-deps --force && npm start"
cd ../photomong-admin
start cmd /k "npm install --legacy-peer-deps --force && npm start"
cd admin-flask
start cmd /k "pip install -r requirements.txt && python3 manage.py runserver 0.0.0.0:9000"