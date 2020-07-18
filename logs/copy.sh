#!/bin/sh
cd /Users/kk/nodeJs/blog-1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log
