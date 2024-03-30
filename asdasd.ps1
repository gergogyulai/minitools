if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Start-Process PowerShell -Verb RunAs "-NoProfile -ExecutionPolicy Bypass -Command `"cd '$pwd'; & '$PSCommandPath';`"";
    exit;
}

Write-Output "Enabling Windows 11 style context menu. Please wait."

$ExplorerReg1 = "HKCU:\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}"
$ExplorerReg2 = "HKCU:\Software\Classes\Wow6432Node\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}"

# Create the registry keys to enable the new context menu
New-Item -Path $ExplorerReg1 -Force
New-ItemProperty -Path $ExplorerReg1 -Name "System.IsPinnedToNameSpaceTree" -Value 1 -PropertyType DWORD -Force

New-Item -Path $ExplorerReg2 -Force
New-ItemProperty -Path $ExplorerReg2 -Name "System.IsPinnedToNameSpaceTree" -Value 1 -PropertyType DWORD -Force

Write-Output "Restarting Explorer to apply changes."
Start explorer.exe -NoNewWindow

pause
