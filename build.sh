#!/bin/sh

clear
echo "目前可用的构建类型如下："
echo "1.网页"
echo "2.基于 Chromium 内核的浏览器扩展"
echo "3.Firefox 浏览器扩展"
echo ""

buildType=""
while true
do
  echo -n "请选择一个构建类型："

  read userChoice
  case $userChoice in
    1) buildType="webpage";;
    2) buildType="chromium";;
    3) buildType="firefox";;
    *) buildType="error";;
  esac
  if [ "$buildType" != "error" ]; then
    break
  fi

  echo "错误的输入，请再次尝试。"
done

scriptDir=$(dirname "$0")
publicDir="$scriptDir/public"
platformDir="$scriptDir/platform/$buildType"

rm -rf "$publicDir"
cp -r "$platformDir" "$publicDir"

npm run build
