import React, { useEffect, useState } from "react"
import * as socketIOClient from "socket.io-client"
import { IClient, EventType } from "shared/models"

const App: React.FC = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>()

  const connect = () => {
    setSocket(socketIOClient.connect("http://localhost:4000"))
  }

  return (
    <div>
      <button onClick={() => socket ? connect() : setSocket(undefined)}>{socket ? "Disconnect" : "Connect"}</button>
    </div>
  )
}

export default App
