$apiUrl = "https://roaringtigershark-evolution.cloudfy.live"

# Testa listar instâncias
$r = Invoke-WebRequest -Uri "$apiUrl/instance/fetchInstances" -Method GET -Headers @{ "apikey" = $env:EVO_KEY } -UseBasicParsing
Write-Host "STATUS: $($r.StatusCode)"
Write-Host "INSTANCES: $($r.Content)"
