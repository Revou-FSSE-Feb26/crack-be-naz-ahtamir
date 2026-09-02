# Test login API
$body = @{
    idKaryawan = "82400945"
    password = "82400945K3"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

Write-Host "✅ Login Success!" -ForegroundColor Green
Write-Host ""
Write-Host "User Info:" -ForegroundColor Cyan
Write-Host "  ID: $($response.user.idKaryawan)"
Write-Host "  Nama: $($response.user.nama)"
Write-Host "  Role: $($response.user.role)"
Write-Host "  Departemen: $($response.user.departemen)"
Write-Host ""
Write-Host "Token:" -ForegroundColor Cyan
Write-Host "  $($response.token.Substring(0, 50))..."
