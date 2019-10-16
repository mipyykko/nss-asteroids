import { InputEventType, EventType, IPlayerInput } from "shared/dist/models"

interface InputHandlerProps {
}

const eventMap: { [key: string]: InputEventType } = {
  "ArrowLeft": InputEventType.LEFT,
  "ArrowRight": InputEventType.RIGHT,
  "ArrowUp": InputEventType.THRUST,
  " ": InputEventType.FIRE
}

export class InputHandler {
  public keysPressed = new Set<InputEventType>()
  private readonly okEvents = Object.keys(eventMap)
  private socket?: SocketIOClient.Socket
  private keyboardCallback: (input: IPlayerInput) => void = () => {}

  constructor() {
    this.initListeners()
  }

  setSocket(socket: SocketIOClient.Socket) {
    this.socket = socket 
  }

  initListeners() {
    window.addEventListener("keydown", this.onDown)
    window.addEventListener("keyup", this.onUp)
  }

  public close() {
    window.removeEventListener("keydown", this.onDown)
    window.removeEventListener("keyup", this.onUp)
    this.keyboardCallback = () => {}
  }

  public setKeyboardCallback(cb: (input: IPlayerInput) => void) {
    this.keyboardCallback = cb
  }

  private isOkEvent = (event: KeyboardEvent) => {
    return this.okEvents.includes(event.key)
  }

  getKeys() {
    return Array.from(this.keysPressed)
  }

  update() {
    if (!this.socket) {
      return
    }

    if (!this.getKeys().length) {
      return
    }
    
    const input: IPlayerInput = {
      clientId: this.socket.id,
      time: Date.now(),
      events: this.getKeys()
    }

    this.socket.emit(EventType.PLAYER_INPUT, input)
    this.keyboardCallback(input)
  }

  onDown = (event: KeyboardEvent) => {
    if (!(this.isOkEvent(event))) {
      return
    }

    event.preventDefault()

    this.keysPressed.add(eventMap[event.key])
  }

  onUp = (event: KeyboardEvent) => {
    this.keysPressed.delete(eventMap[event.key])
  }
}