@echo off
cd backend
start cmd /k "pip install -r requirements.txt && python manage.py runserver 0.0.0.0:8000"

cd ../photomong-admin/admin-flask
start cmd /k "pip install -r requirements.txt && python manage.py runserver 0.0.0.0:9000"

