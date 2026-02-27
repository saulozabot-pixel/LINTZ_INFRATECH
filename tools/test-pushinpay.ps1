$body = '{"phone":"47999999999","plan":"mensal"}'
try {
    $r = Invoke-WebRequest -Uri 'https://lux-driver-assistent-18y8.vercel.app/api/create-payment' `
        -Method POST `
        -ContentType 'application/json' `
        -Body $body `
        -UseBasicParsing
    Write-Host "STATUS: $($r.StatusCode)"
    Write-Host "RESPONSE: $($r.Content)"
} catch {
    Write-Host "STATUS: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "ERROR: $($_.ErrorDetails.Message)"
}
