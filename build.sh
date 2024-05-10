#!/bin/bash

# 检查 zip 是否已安装
if ! command -v zip &>/dev/null; then
    echo "错误: zip 命令未找到。请确保已安装 zip 工具。"
    echo "你可以使用以下命令进行安装:"
    echo "对于基于 apt 的系统: sudo apt-get install zip"
    echo "对于基于 yum 的系统: sudo yum install zip"
    echo "对于基于 dnf 的系统: sudo dnf install zip"
    exit 1
fi


script_directory=$(dirname "$0")
build_directory="$script_directory/dist"
public_directory="$script_directory/public"
packaged_directory="$script_directory/packaged"

rm -rf "$packaged_directory"
mkdir -p "$packaged_directory"


build_and_package() {
    local build_type="$1"
    local platform_directory="$script_directory/platform/$build_type"

    rm -rf "$build_directory" "$public_directory"
    cp -r "$platform_directory" "$public_directory"
    (cd "$PWD" && npm run build)
    zip -r "$build_directory/$build_type.zip" "$build_directory/*"

    echo "$PWD/$build_directory/$build_type.zip"
}


echo "THE FOLLOWING BUILD TYPES ARE CURRENTLY AVAILABLE:"
echo "1.Normal"
echo "2.Chromium Extension"
echo "3.Firefox Extension"
echo "4.Opera Extension"
echo "5.Package all available build types"
echo ""


buildType=""
while true
do
    echo -n ">: "

    read userChoice
    case $userChoice in
        1) build_type='webpage' ;;
        2) build_type='chromium' ;;
        3) build_type='firefox' ;;
        4) build_type='opera' ;;
        5)
            build_types=('webpage' 'chromium' 'firefox' 'opera')
            for bt in "${build_types[@]}"; do
                packaged=$(build_and_package "$bt")
                cp "$packaged" "$packaged_directory/"
                rm -rf "$build_directory"
            done
            exit 0;;
        *) buildType="error";;
    esac

    if [ "$buildType" != "error" ]; then
      break
    fi

    echo "Wrong input, please try again."
done

packaged=$(build_and_package "$build_type")
cp "$packaged" "$packaged_directory/"
