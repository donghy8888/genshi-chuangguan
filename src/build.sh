#!/bin/sh
cd /workspace/genshi-chuangguan/src
{ cat part1.html; echo '<script>'; grep -v "^if(typeof module" questions.js; cat app.js; echo '</script>'; echo '</body>'; echo '</html>'; } > ../index.html
