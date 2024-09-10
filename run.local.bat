@echo off

REM 기존 명령어들을 새 창에서 실행
start cmd /k "cd C:\mee\photo_temp && pip install -r requirements.txt && python printer_server.py runserver 0.0.0.0:8001"

start cmd /k "cd C:\mee\photo_temp\app && npm install && npm start"