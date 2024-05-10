#!/bin/bash

if ! command -v zip &>/dev/null; then
    echo "Error: The 'zip' command was not found."
    echo "You can install it using the following command:"
    echo "APT: sudo apt-get install zip"
    echo "YUM: sudo yum install zip"
    echo "DNF: sudo dnf install zip"
    exit 1
fi

script_directory=$(cd "$(dirname "$0")"; pwd)
build_directory="$script_directory/dist"
public_directory="$script_directory/public"
packaged_directory="$script_directory/packaged"

rm -rf "$packaged_directory"
mkdir -p "$packaged_directory"


build_and_package() {
    local build_type="$1"
    local out_directory="$2"
    local platform_directory="$script_directory/platform/$build_type"

    rm -rf "$build_directory" "$public_directory"
    cp -r "$platform_directory" "$public_directory"
    npm run build
    zip -r $out_directory/$build_type.zip $build_directory/*
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
                build_and_package "$bt" "$packaged_directory"
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

build_and_package "$build_type" "$packaged_directory"
