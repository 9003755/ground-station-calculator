$ErrorActionPreference = 'Stop'
$username = '9003755'
$defaultRepo = 'ground-station-calculator'
$repo = $env:GITHUB_REPO
if([string]::IsNullOrWhiteSpace($repo)){ $repo = $defaultRepo }
if($env:GITHUB_TOKEN){ $token = $env:GITHUB_TOKEN } else { $sec = Read-Host "GitHub Personal Access Token" -AsSecureString; $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec); $token = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
$body = @{ name = $repo; description = "Ground station scientific calculator"; private = $false } | ConvertTo-Json
$headers = @{ Authorization = "token $token"; Accept = "application/vnd.github+json" }
try { $res = Invoke-RestMethod -Method Post -Uri "https://api.github.com/user/repos" -Headers $headers -Body $body } catch { $res = Invoke-RestMethod -Method Get -Uri "https://api.github.com/repos/$username/$repo" -Headers $headers }
git branch -M main
try { git remote add origin "https://github.com/$username/$repo.git" } catch { git remote set-url origin "https://github.com/$username/$repo.git" }
Write-Output "Repository: $($res.html_url)"
git push -u origin main
git push origin --tags
git remote -v