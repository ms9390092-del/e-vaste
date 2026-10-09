@echo off
REM Git push script for e-vaste repository

set GIT_PATH="C:\Program Files\Git\bin\git.exe"

echo Initializing git repository...
%GIT_PATH% init

echo Configuring user...
%GIT_PATH% config user.email "ms9390092@gmail.com"
%GIT_PATH% config user.name "ms9390092"

echo Adding files...
%GIT_PATH% add .

echo Committing...
%GIT_PATH% commit -m "Initial commit"

echo Adding remote origin...
%GIT_PATH% remote add origin https://github.com/ms9390092-del/e-vaste.git

echo Pushing to GitHub...
%GIT_PATH% push -u origin main

echo Done!
pause