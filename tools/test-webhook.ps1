$body = '{"status":"paid","id":"test-txid-12345","external_reference":"47933805593|mensal|1234567890"}'

$r = Invoke-WebRequest -Uri 'https://lux-driver-assistent-18y8.vercel.app/api/webhook-pushinpay' -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing
Write-Host "STATUS: $($r.StatusCode)"
Write-Host "RESPONSE: $($r.Content)"
