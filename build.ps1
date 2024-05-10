[CmdletBinding()]
param()

function Build_And_Package {
    param(
        [Parameter(Mandatory=$true)]
        [ValidateSet('webpage', 'chromium', 'firefox', 'opera')]
        [string]$buildType
    )

    $buildDirectory = "${PSScriptRoot}\dist"
    $publicDirectory = "${PSScriptRoot}\public"
    $platformDirectory = "${PSScriptRoot}\platform\${buildType}"

    Remove-Item -Path $buildDirectory -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $publicDirectory -Recurse -Force -ErrorAction SilentlyContinue
    Copy-Item -Path $platformDirectory -Destination $publicDirectory -Recurse -Force

    $null = Start-Process -FilePath "npm" -ArgumentList "run build" -NoNewWindow -Wait -PassThru -WorkingDirectory $PSScriptRoot

    Compress-Archive -Path "$buildDirectory\*" -DestinationPath "$buildDirectory\$buildType.zip"
    Write-Host "build path: $buildDirectory"
    Write-Host "packaged path: $buildDirectory\$buildType.zip"

    "$buildDirectory\$buildType.zip"
}

Clear-Host
Write-Host("THE FOLLOWING BUILD TYPES ARE CURRENTLY AVAILABLE:")
Write-Host("1.Normal")
Write-Host("2.Chromium Extension")
Write-Host("3.Firefox Extension")
Write-Host("4.Opera Extension")
Write-Host("5.Package all available build types")
Write-Host("")

[string]$buildType = ""
while (1) {
    [int]$userChoice = Read-Host(">")
    $buildType = switch($userChoice) {
        1 { 'webpage' }
        2 { 'chromium' }
        3 { 'firefox' }
        4 { 'opera' }
        5 { 'all' }
        default { 'error' }
    }

    if ($buildType -ne "error") { break }
    Write-Host("Wrong input, please try again.")
}
Clear-Host

$outputPath = "${PSScriptRoot}/packaged"
Remove-Item -Path "$outputPath" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -Path "$outputPath" -ItemType Directory

[string]$packaged = ""

if ($buildType -eq 'all') {
    $packaged = Build_And_Package -buildType 'webpage'
    Copy-Item -Path "$packaged" -Destination "$outputPath/"

    $packaged = Build_And_Package -buildType 'chromium'
    Copy-Item -Path "$packaged" -Destination "$outputPath/"

    $packaged = Build_And_Package -buildType 'firefox'
    Copy-Item -Path "$packaged" -Destination "$outputPath/"

    $packaged = Build_And_Package -buildType 'opera'
    Copy-Item -Path "$packaged" -Destination "$outputPath/"

    Remove-Item -Path "${PSScriptRoot}/dist" -Recurse -Force -ErrorAction SilentlyContinue

    exit 0
}

$packaged = Build_And_Package -buildType "$buildType"
Copy-Item -Path "$packaged" -Destination "$outputPath/"
