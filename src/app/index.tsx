import React, {useEffect, useState} from "react"
import {useRequest, useSecrets, useValues} from "../hooks"
import axios from "axios"

const App = () => {
  const values = useValues()
  const {userId} = useSecrets()
  const request = useRequest()

  const [defaultEmail, setDefaultEmail] = useState<string | undefined>()
  const bearerToken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJhcGk6Ly84MmE4ZjNiNy1hYjc4LTQxMTctYmMwOS00MmQ3MTAzNGQ2NmEiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xNmIzYzAxMy1kMzAwLTQ2OGQtYWM2NC03ZWRhMDgyMGI2ZDMvIiwiaWF0IjoxNjkwNDc3MjU5LCJuYmYiOjE2OTA0NzcyNTksImV4cCI6MTY5MDQ4MTM3NCwiYWNyIjoiMSIsImFpbyI6IkFXUUFtLzhVQUFBQW9kV3NJOHA5TzlScnhUVjE0Tncyb2xieFU3YWozaUNYU2lwWnBMakRLRVU5R0VpQXRnSXBBOUxqeXM5S21VWUtlMDR0Y3RiVm9BNXBUdUxmRWRBSVp0M0pITTJNY2dPUnZpSkM1ZHllZ0k2cVhqd2dIY0xZckt6endwdmJ4ZERLIiwiYW1yIjpbInJzYSIsIm1mYSJdLCJhcHBpZCI6IjAwNzBiODUwLWFlNGUtNDgyMy05NGYyLWJhYmFjYjE0ZWM4NCIsImFwcGlkYWNyIjoiMCIsImRldmljZWlkIjoiNWFhNzg3NGItYjA3ZS00MjlkLTk1YjktZTU0YzU2ZTk0NmU3IiwiZW1haWwiOiJqaW1teXNoYWhAbWljcm9zb2Z0LmNvbSIsImZhbWlseV9uYW1lIjoiU2hhaCIsImdpdmVuX25hbWUiOiJKaW1teSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpcGFkZHIiOiIxNDIuMTE0LjE5Mi4yMzIiLCJuYW1lIjoiSmltbXkgU2hhaCIsIm9pZCI6IjY4MmQ3MjRlLTkwZmEtNGVmNS1iZjQyLWRiZGFjODVmY2IzMSIsInJoIjoiMC5BVVlBRThDekZnRFRqVWFzWkg3YUNDQzIwN2Z6cUlKNHF4ZEJ2QWxDMXhBMDFtcThBRTguIiwic2NwIjoiUmVhZCIsInN1YiI6InVJaWJqRVF6bnA2YXkzMzBQd3JPdUZJSXl4WmFDSG9qdDN1MWozWk1ydm8iLCJ0aWQiOiIxNmIzYzAxMy1kMzAwLTQ2OGQtYWM2NC03ZWRhMDgyMGI2ZDMiLCJ1bmlxdWVfbmFtZSI6ImppbW15c2hhaEBtaWNyb3NvZnQuY29tIiwidXRpIjoiaTVITUZxV3ExRS1qR3NQbF9mY0JBQSIsInZlciI6IjEuMCJ9.CiVqXjgWXZvz_3teUNmRAvjNNu1Gd67e9HD2bH-lw5PvnsYA8N5B2J8Ct2ItUv4qcZ8aPnB2SvkQ1TI94cOWu3RO33gSahQUmk5TlBiCBm3TmElqGZATspwy0tiFTYKn231OFl2IGOD0EE1JJfCuW4LtV9al9rP48ZwOR7guDJT5VoiGHpf9VUd88FBBI1BgyaFvk9GQVM3PH3PreKhiiETm6zNYDZ0m3ZKBY_W-EbP4XIndqvs7lvV74IarGM68wihtG-HuFMTjH2D-FTH4FS5Txezz9OAEWoumxCcV6-8jtWenbRcXtcwnZ9n2CLXJsaJ8VCcwxDVkWs_HQur32g"

  useEffect(() => {
    if (!userId) {
      setDefaultEmail("")
      return
    }

    request(`/users/${userId}`)
      .then(e => e.json())
      .then(({properties}) => setDefaultEmail(properties.email))
      .catch(e => {
        console.error("Could not prefill the email address!", e)
        setDefaultEmail("")
      })
  }, [userId, request])

  const fetchData = async ()  => {
    try {
      const response : number   = await axios
        .get("https://js-apim-cc-01.azure-api.net/echo/resource?param1=sample&param2=test", {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        })
        .then(response => {
          return response.status
        })
      return response
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }
  const handleSubmit = async () => {
    await fetchData().then(response => console.log(response))
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
