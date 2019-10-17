### CSM13101 Networked Systems and Services
#### Multiplayer Game Implementation

This is a simple Asteroids clone. Not implemented: 

* collisions
* shooting
* proper physics
* anything resembling a game

#### Prerequisites

* [yarn](https://yarnpkg.com) to install stuff; [npm](https://npmjs.org) is probably also required if you'll install TypeScript globally (see below)
* [Node.js](http://nodejs.org) -- newish version will do

#### Installation


```
$ yarn
$ yarn run build
$ yarn run serve
```

If this fails at some step, you may need to install [TypeScript](https://www.typescriptlang.org/) globally: 
```
$ npm install -g typescript
```

If something *still* goes wrong, you may have to build the packages yourself one by one. In `packages` directory there are three packages: `shared`, `backend` and `frontend`. Starting from `shared` (the others depend on it), `cd` to each directory and run `yarn run build`. Monorepos and TypeScript are an evil combination, I tells you.

#### Usage

If (against the odds?) all went well, you'll see the `Listening...` and `Accepting connections...` messages. 

You can point your browser to [http://localhost:5000](http://localhost:5000), click **Connect** and control your simple spaceship using the arrow keys: &uarr; for thrust and &larr; and &rarr; to rotate the spaceship. Your own spaceship is shown in yellow, the others in red.

Open another browser window to test the multiplayer.

Check the `Debug` box in the window to show the current game state. This may slow things down considerably.
