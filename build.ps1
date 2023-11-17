[CmdletBinding()]
param()

Clear-Host
Write-Host("目前可用的构建类型如下：")
Write-Host("1.网页")
Write-Host("2.基于 Chromium 内核的浏览器扩展")
Write-Host("3.Firefox 浏览器扩展")
Write-Host("")

[string]$buildType = ""
while (1) {
  [int]$userChoice = Read-Host(">")
  $buildType = switch($userChoice) {
    1 { 'webpage' }
    2 { 'chromium' }
    3 { 'firefox' }
    default { 'error' }
  }

  if ($buildType -ne "error") { break }
  Write-Host("错误的输入，请再次尝试。")
}

$publicDirectory = "${PSScriptRoot}\public"
$platformDirectory = "${PSScriptRoot}\platform\${buildType}"

Remove-Item -Path $publicDirectory -Recurse -Force
Copy-Item -Path $platformDirectory -Destination $publicDirectory -Recurse -Force

npm run build
