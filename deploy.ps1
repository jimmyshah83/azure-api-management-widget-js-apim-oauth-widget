az login
$response = az account get-access-token --tenant 16b3c013-d300-468d-ac64-7eda0820b6d3
$bearerToken = "Bearer " + ($response | ConvertFrom-Json).accessToken
npm run deploy --bearerToken=$bearerToken
