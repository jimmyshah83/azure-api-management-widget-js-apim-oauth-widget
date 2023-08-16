const {deployNodeJS} = require("@azure/api-management-custom-widgets-tools")

const serviceInformation = {
  resourceId:
    "/subscriptions/xxx/resourceGroups/js-playground-rg-01/providers/Microsoft.ApiManagement/service/js-apim-portal-demo-01",
  managementApiEndpoint: "https://management.azure.com",
  tokenOverride:
    "Bearer xxx",
}
const name = "js-apim-oauth-widget"
const fallbackConfigPath = "./static/config.msapim.json"

deployNodeJS(serviceInformation, name, fallbackConfigPath)
  .then(r => console.log(r))
  .catch(e => console.log(e))
