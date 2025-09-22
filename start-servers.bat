@echo off
echo Starting Backend Server...
cd /d "d:\Shop  new (2)\Shop  new\Backend"
start "Backend Server" cmd /k "node dashboard-server.js"

echo Starting Frontend Server...
cd /d "d:\Shop  new (2)\Shop  new\Frontend"
start "Frontend Server" cmd /k "npm start"

echo Both servers starting...
pause