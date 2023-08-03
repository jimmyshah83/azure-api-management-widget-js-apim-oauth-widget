import React, {useEffect, useState} from "react"
import axios from "axios"
import queryString from "query-string"
import { useMsal, MsalProvider } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const App: React.FC = () => {

  const { instance } = useMsal();
  var request = {
    scopes: ["api://82a8f3b7-ab78-4117-bc09-42d71034d66a/Read"],
  }

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      console.log("No token found - aquireing token")
      aquireToken()
    }
  }, [])

  const aquireToken = async () => {
    console.log("Aquiring Token");
    instance.acquireTokenSilent(request).then(tokenResponse => {
      console.log("Token Response: " + tokenResponse.accessToken)
      setToken(tokenResponse.accessToken)
  }).catch(async (error) => {
      console.log("Error: " + error);
      if (error instanceof InteractionRequiredAuthError) {
          return instance.acquireTokenRedirect(request);
      }
  })
  }

  const handleLogin = () => {
    console.log("Login")
    instance.loginPopup(loginRequest).catch((e) => {
      console.log("Error login" + e);
    })
  }

  const fetchData = async () => {
    try {
      let bearerToken = `${token}`
      console.log("Fetching Data - Token: " + bearerToken)
      if (!token) {
        console.log("No token found - using hard coded token")
        bearerToken = "xxx"
      }
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
    await fetchData().then(response => {      
      console.log("DONE" + response)
      return response
    }).catch(error => {
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
