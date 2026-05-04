@echo off
cd /d "%~dp0"
git rm -r --cached node_modules --quiet 2>nul
git add -A
git commit -m "feat: add framer motion animations to all pages and components"
git push
echo Done.
pause
