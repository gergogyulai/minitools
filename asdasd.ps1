if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Start-Process PowerShell -Verb RunAs "-NoProfile -ExecutionPolicy Bypass -Command `"cd '$pwd'; & '$PSCommandPath';`"";
    exit;
}

Write-Output "Restoring Windows 10 style context menu. Please wait."

$ExplorerReg1 = "HKCR:\CLSID\{018D5C66-4533-4307-9B53-224DE2ED1FE6}"
$ExplorerReg2 = "HKCR:\Wow6432Node\CLSID\{018D5C66-4533-4307-9B53-224DE2ED1FE6}"

# Remove the registry keys that control the context menu
if (Test-Path $ExplorerReg1) {
    Remove-Item -Path $ExplorerReg1 -Recurse -Force
}

if (Test-Path $ExplorerReg2) {
    Remove-Item -Path $ExplorerReg2 -Recurse -Force
}

Write-Output "Restarting Explorer to apply changes."
Start explorer.exe -NoNewWindow

pause
