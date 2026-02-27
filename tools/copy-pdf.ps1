$source = "C:\Users\SAULO\Downloads\Termo de Coopera" + [char]0x00E7 + [char]0x00E3 + "o T" + [char]0x00E9 + "cnica Hackathon Infratech 2024_2025 (1).pdf"
$dest = "C:\Users\SAULO\AndroidStudioProjects\Lux\docs\hackathon.pdf"

if (Test-Path $source) {
    Copy-Item $source -Destination $dest
    Write-Host "Copiado com sucesso!"
} else {
    # Tenta o outro arquivo sem (1)
    $source2 = "C:\Users\SAULO\Downloads\Termo de Coopera" + [char]0x00E7 + [char]0x00E3 + "o T" + [char]0x00E9 + "cnica Hackathon Infratech 2024_2025.pdf"
    if (Test-Path $source2) {
        Copy-Item $source2 -Destination $dest
        Write-Host "Copiado (versao sem (1)) com sucesso!"
    } else {
        # Busca qualquer arquivo com Hackathon no nome
        $files = Get-ChildItem "C:\Users\SAULO\Downloads\" | Where-Object { $_.Name -match "Hackathon" -or $_.Name -match "Infratech" -or $_.Name -match "Coopera" }
        $files | ForEach-Object { Write-Host $_.FullName }
        if ($files.Count -gt 0) {
            Copy-Item $files[0].FullName -Destination $dest
            Write-Host "Copiado: $($files[0].Name)"
        }
    }
}
