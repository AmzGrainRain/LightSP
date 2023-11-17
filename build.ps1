[CmdletBinding()]
param()

Clear-Host
Write-Host("Ŀǰ���õĹ����������£�")
Write-Host("1.��ҳ")
Write-Host("2.���� Chromium �ں˵��������չ")
Write-Host("3.Firefox �������չ")
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
  Write-Host("��������룬���ٴγ��ԡ�")
}

$publicDirectory = "${PSScriptRoot}\public"
$platformDirectory = "${PSScriptRoot}\platform\${buildType}"

Remove-Item -Path $publicDirectory -Recurse -Force
Copy-Item -Path $platformDirectory -Destination $publicDirectory -Recurse -Force

npm run build
