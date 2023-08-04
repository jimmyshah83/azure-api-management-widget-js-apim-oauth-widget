import React from "react"
import axios from "axios"
import {MsalProvider, useMsal} from "@azure/msal-react"
import {loginRequest, msalConfig} from "../authConfig"
import {PublicClientApplication} from "@azure/msal-browser"

const App: React.FC = () => {
  const {instance} = useMsal()
  const request = {
    scopes: ["api://0070b850-ae4e-4823-94f2-babacb14ec84/Read"],
  }

  // const [token, setToken] = useState<string | null>(null)
  const pca = new PublicClientApplication(msalConfig)
  // const activeAccount = pca.getAllAccounts()[0]

  const handleLogin = async () => {
    console.log("Initiate Login")
    await instance
      .loginPopup(loginRequest)
      .then(response => {
        console.log("Login Response Account: " + response.account?.name)
        pca.setActiveAccount(response.account)
      })
      .catch(e => {
        console.log("Failed to login" + e)
      })
  }

  const fetchData = async () => {
    try {
      let bearerToken = ""
      console.log("Acquiring Token")
      await pca
        .acquireTokenPopup(request)
        .then(tokenResponse => {
          console.log("Token Response: " + tokenResponse.accessToken)
          bearerToken = tokenResponse.accessToken
        })
        .catch(e => {
          console.log("Failed to fetch token: " + e)
        })
      return await axios
        .get("https://js-apim-cc-01.azure-api.net/echo/resource?param1=sample&param2=2", {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Cache-Control": "no-cache",
          },
        })
        .then(response => {
          console.log("Response: " + response.status)
          return response.status
        })
    } catch (e) {
      console.error("Error fetching data:", e)
    }
  }

  const handleSubmit = async () => {
    await fetchData()
      .then(response => {
        console.log("DONE" + response)
        return response
      })
      .catch(error => {
        console.log("Error: " + error)
      })
  }

  return (
    <MsalProvider instance={instance}>
      <div>
        <div>
          <button onClick={handleSubmit} type="submit" className="button button-primary">
            Submit
          </button>
        </div>
        <div>
          <button onClick={() => handleLogin()} type="submit" className="button button-primary">
            Login
          </button>
        </div>
      </div>
    </MsalProvider>
  )
}

export default App
