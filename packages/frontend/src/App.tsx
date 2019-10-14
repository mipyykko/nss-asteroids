import React, { useEffect, useState } from "react"
import * as socketIOClient from "socket.io-client"
import { IClient, EventType, IGameStateUpdate } from "shared/src/models"

const App: React.FC = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>()
  const [state, setState] = useState<IGameStateUpdate>()

  const connect = () => {
    console.log("huh")
    if (!socket) {
      const connection = socketIOClient.connect("http://localhost:4000") 
      setSocket(connection)

      connection.on(EventType.SERVER_STATE, (newState: IGameStateUpdate) => setState(newState))
    }
  }

  return (
    <div>
      <h2>wää</h2>
      <button onClick={() => !socket ? connect() : setSocket(undefined)}>{socket ? "Disconnect" : "Connect"}</button>
      <p>{JSON.stringify(state)}</p>
    </div>
  )
}

export default App
