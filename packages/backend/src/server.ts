import express from "express"
import http from "http"
import socketio from "socket.io"
import { Game } from "./game"

const app = express()
const port = process.env.PORT || 4000
app.set("port", port)

const server = new http.Server(app)
const io = socketio(server)

class Server {
  private game?: Game

  public start() {
    server.listen(port, () => {
      console.log(`Listening on ${port}`)
    })

    this.game = new Game(io)
    this.game.start()

  }
}

(new Server()).start()
