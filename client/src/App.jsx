import { useEffect, useState } from "react"
import "./App.css"

function App() {
  const [message, setMessage] = useState("")
  useEffect(() => {
    fetch("http://localhost:4000/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((e) => console.log("error", e))
  }, [])

  return (
    <>
      <h1>Welcome to Docker learning process</h1>
      <h2>data {message}</h2>
    </>
  )
}

export default App
