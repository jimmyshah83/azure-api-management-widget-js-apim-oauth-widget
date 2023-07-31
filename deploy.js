const {deployNodeJS} = require("@azure/api-management-custom-widgets-tools")

const serviceInformation = {
  resourceId:
    "subscriptions/1d8a3971-973e-4b52-841b-16614e79c84f/resourceGroups/rg-kubenet-dev-cc-001/providers/Microsoft.ApiManagement/service/js-apim-cc-01",
  managementApiEndpoint: "https://management.azure.com",
  tokenOverride:
    "Bearer xxx",
}
const name = "js-apim-oauth-widget"
const fallbackConfigPath = "./static/config.msapim.json"

deployNodeJS(serviceInformation, name, fallbackConfigPath)
