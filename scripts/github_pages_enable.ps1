$ErrorActionPreference = 'Stop'
$owner = '9003755'
$repo = $env:GITHUB_REPO
if([string]::IsNullOrWhiteSpace($repo)){ $repo = 'ground-station-calculator' }
if(-not $env:GITHUB_TOKEN){ throw "GITHUB_TOKEN is required" }
$headers = @{ Authorization = "token $($env:GITHUB_TOKEN)"; Accept = "application/vnd.github+json" }
$body = @{ source = @{ branch = 'main'; path = '/' } } | ConvertTo-Json
try { $null = Invoke-RestMethod -Method Post -Uri "https://api.github.com/repos/$owner/$repo/pages" -Headers $headers -Body $body }
catch { try { $null = Invoke-RestMethod -Method Put -Uri "https://api.github.com/repos/$owner/$repo/pages" -Headers $headers -Body $body } catch { throw $_ } }
$info = Invoke-RestMethod -Method Get -Uri "https://api.github.com/repos/$owner/$repo/pages" -Headers $headers
Write-Output ("Pages URL: " + $info.html_url)
Write-Output ("Status: " + $info.status)