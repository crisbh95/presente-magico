@echo off
title Presente Magico - Servidor
echo =========================================
echo       INICIANDO O PRESENTE MAGICO...
echo =========================================
echo.
echo O servidor esta ligando e o site vai 
echo abrir automaticamente no seu navegador!
echo.
echo ATENCAO: Nao feche esta janela preta 
echo enquanto estiver usando o site.
echo.
cd /d C:\Users\Cris\Downloads\Magic
start http://localhost:5173
npm run dev
