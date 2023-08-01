import React, {useState} from "react"
import axios from "axios"

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

  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchToken = async (authorizationCode: string) => {
    try {
      console.log("Fetch Token begin")
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
      setError(null)
    } catch (e) {
      console.log("Exception " + e)
      setError("Failed to fetch the token.")
    }
  }

  const getAuthorizationCode = async () => {
    const params = new URLSearchParams(window.location.search)
    console.log("Params = " + params)
    const authorizationCode = params.get("code")
    if (authorizationCode) {
      console.log("Fetching token")
      await fetchToken(authorizationCode)
    } else {
      console.log("Error")
      setError("Authorization code not found in the URL.")
    }
  }

  const fetchData = async () => {
    try {
      console.log("Fetch Data")
      return await axios
        .get("https://js-apim-cc-01.azure-api.net/echo/resource?param1=sample&param2=2", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        })
        .then(response => {
          console.log("Response: " + response.data)
          return response.data
        })
    } catch (e) {
      console.error("Error fetching data:", error)
    }
  }
  const handleSubmit = async () => {
    console.log("Submit")
    await getAuthorizationCode()
    console.log("Got authorization code")
    await fetchData().then(response => console.log(response))
    console.log("DONE")
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className="button button-primary">
        Submit
      </button>
    </form>
  )
}

export default App
