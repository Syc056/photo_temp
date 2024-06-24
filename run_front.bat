@echo off
cd app
start cmd /k "npm install --legacy-peer-deps --force && npm start"
start "C:\Program Files\Google\Chrome\Application\chrome.exe --allow-file-access-from-files --disable-web-security -kiosk -fullscreen"
cd ..

start cmd /k "python print_server.py runserver 0.0.0.0:8001"


