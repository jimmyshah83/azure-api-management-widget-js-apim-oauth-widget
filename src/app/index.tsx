import React, {useEffect, useState} from "react"
import axios from "axios"
import queryString from "query-string"

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

const App: React.FC = () => {
  const redirectUri = "http://localhost:3000/"
  const scope = "api://82a8f3b7-ab78-4117-bc09-42d71034d66a/Read"
  const clientId = "cc796322-0554-4e71-81ff-69080c007c2c"
  const clientSecret = ".CT8Q~qE2s4zGvU6P5CImG08IOumdMeRaT_k6cK9"
  const tokenEndpoint = "https://login.microsoftonline.com/16b3c013-d300-468d-ac64-7eda0820b6d3/oauth2/v2.0/token"
  const authorizationEndpoint =
    "https://login.microsoftonline.com/16b3c013-d300-468d-ac64-7eda0820b6d3/oauth2/v2.0/authorize"

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = queryString.parse(window.location.search)
    console.log("In Use Effect = " + urlParams.code)
    if (urlParams.code) {
      const code = urlParams.code
      console.log("Fetching token with code = " + code)
      fetchAccessToken(code.toString()).then(token => console.log(token))
    }
  }, [])

  const fetchAccessToken = async (authorizationCode: string) => {
    try {
      console.log("Initiating token fetch")
      const response = await axios.post<TokenResponse>(
        tokenEndpoint,
        new URLSearchParams({
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          code: authorizationCode,
          redirect_uri: redirectUri,
          scope: scope,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )

      const {access_token} = response.data
      console.log("Access Token fetched = " + access_token)
      setToken(access_token)
    } catch (e) {
      console.log("Exception " + e)
    }
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

  const initiateOAuthFlow = () => {
    console.log("Initiating OAuth flow")
    const params = {
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
    }

    const queryStringParams = queryString.stringify(params)
    console.log("Query string params: " + queryStringParams)

    const authUrl = `${authorizationEndpoint}?${queryStringParams}`
    window.location.replace(authUrl)
  }

  const handleSubmit = async () => {
    await fetchData().then(response => console.log("DONE" + response))
  }

  return (
    <div>
      <div>
        <button onClick={handleSubmit} type="submit" className="button button-primary">
          Submit
        </button>
      </div>
      <div>
        <button onClick={initiateOAuthFlow} type="submit" className="button button-primary">
          Login
        </button>
      </div>
    </div>
  )
}

export default App
