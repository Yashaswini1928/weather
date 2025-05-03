$env:NODE_ENV = "development"

# Check if port 5000 is in use and find an available port
$port = 5000
$portInUse = $true
while ($portInUse) {
    try {
        $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $port)
        $listener.Start()
        $listener.Stop()
        $portInUse = $false
    }
    catch {
        Write-Host "Port $port is in use, trying next port..."
        $port++
    }
}

Write-Host "Starting server on port $port"

# Start the server with custom port
$env:PORT = $port
npx tsx server/index.ts