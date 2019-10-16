import React, { useEffect, useState, useCallback } from "react"
import { EntityType, AsteroidSubType, IEntity } from "shared/dist/models"
import { Stage, Layer, Line, Circle, Rect } from "react-konva"
import { Vector2d } from "konva/types/types"
import { Game, ILocalGameState } from "./logic/game"

interface EntityProps {
  entity: IEntity
  xScale: number
  yScale: number
  ownShip?: boolean
}

// TODO: add rotation along the center

/* const rotatePoint = ({ x, y }, rad) => {
  const rcos = Math.cos(rad);
  const rsin = Math.sin(rad);
  return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };
} */

const Ship: React.FC<EntityProps> = props => {
  const {
    entity: { x, y, heading, id },
    ownShip,
    xScale,
    yScale,
  } = props

  return (
    <Line
      x={x / xScale}
      y={y / yScale}
      points={[10, 0, 20, 25, 0, 25]}
      closed={true}
      rotation={heading}
      stroke={ownShip ? "yellow" : "red"}
      fill='black'
      offset={{ x: 10, y: 12 } as Vector2d}
      key={`ship-${id}`}
    />
  )
}

const Asteroid: React.FC<EntityProps> = props => {
  const {
    entity: { x, y, heading, id, subtype },
    xScale,
    yScale,
  } = props

  const sizeScale =
    subtype === AsteroidSubType.LARGE
      ? 1.0
      : subtype === AsteroidSubType.MEDIUM
      ? 0.6
      : 0.4

  return (
    <Line
      x={x / xScale}
      y={y / yScale}
      points={[23, 0, 60, 30, 23, 60, 0, 30]}
      closed={true}
      rotation={heading}
      stroke='white'
      fill='black'
      offset={{ x: 30, y: 30 } as Vector2d}
      scale={{ x: sizeScale, y: sizeScale } as Vector2d}
      key={`asteroid-${id}`}
    />
  )
}

const Shot: React.FC<EntityProps> = props => {
  const {
    entity: { x, y, id },
    xScale,
    yScale
  } = props

  return (
    <Circle
      x={x / xScale}
      y={y / yScale}
      radius={2}
      stroke='white'
      fill='white'
      key={`shot-${id}`}
    />
  )
}

const entityMap: { [key in EntityType]: React.FC<EntityProps> | null } = {
  [EntityType.SHIP]: Ship,
  [EntityType.ASTEROID]: Asteroid,
  [EntityType.SHOT]: Shot,
}

const stageWidth = 600
const stageHeight = 600

const game = new Game(stageWidth, stageHeight)

const App: React.FC = () => {
  const [state, setState] = useState<ILocalGameState>({} as ILocalGameState)
  const [xScale, setXScale] = useState(10)
  const [yScale, setYScale] = useState(10)
  const [ownId, setOwnId] = useState<string | null>(null)
  const [debug, setDebug] = useState(false)
  let update: NodeJS.Timeout | undefined

  const connect = () => {
    game.connect()

    update = setInterval(() => {
      const localState = game.getState()
      if (game.isRunning() && localState) {
        setState(localState)

        if (!ownId) {
          setOwnId(game.getSocketId())
        }
      }
    }, 1000 / 60)
  }

  const disconnect = () => {
    game.disconnect()

    if (update) {
      clearInterval(update)
    }

    setState({} as ILocalGameState) // force update
  }

  useEffect(() => () => disconnect(), [])

  return (
    <div>
      <p>{update}</p>
      <button onClick={() => (game.isRunning() ? disconnect() : connect())}>
        {game.isRunning() ? "Disconnect" : "Connect"}
      </button>
      {/*       <p>{JSON.stringify(state)}</p> */}
      {Object.keys(state).length ? (
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            <Rect
              x={0}
              y={0}
              width={stageWidth}
              height={stageHeight}
              fill='black'
            />
          </Layer>
          <Layer>
            {state
              ? state.entities.map(entity => {
                  if (entity.type === null || entity.type === undefined) {
                    return null
                  }

                  const Element: React.FC<EntityProps> | null =
                    entityMap[entity.type]

                  const { ownerId } = entity

                  // console.log(game.isOwnShip(ownerId!))

                  if (!Element) {
                    return null
                  }

                  return (
                    <Element
                      entity={entity}
                      xScale={xScale}
                      yScale={yScale}
                      ownShip={ownerId! === ownId!} // fix this
                    />
                  )
                })
              : null}
          </Layer>
        </Stage>
      ) : null}
      <p>
        <input type="checkbox" checked={debug} onClick={() => setDebug(!debug)} />Show debug
      </p>
      {debug ? <p>{JSON.stringify(state)}</p> : null}
    </div>
  )
}

export default App
