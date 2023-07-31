import React from "react"
import axios from "axios"

const App = () => {
  const bearerToken =
    "xxx"

  const fetchData = async () => {
    try {
      const response: number = await axios
        .get("https://js-apim-cc-01.azure-api.net/echo/resource?param1=sample&param2=2", {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Cache-Control': 'no-cache',
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
