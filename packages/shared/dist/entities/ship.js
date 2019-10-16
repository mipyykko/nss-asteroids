"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("./entity");
const models_1 = require("../models");
const ROTATION = 0.2;
const ACCELERATION = 1.05;
const FIRE_DELAY = 10;
class ShipEntity extends entity_1.Entity {
    constructor(props) {
        super(Object.assign(Object.assign({}, props), { type: models_1.EntityType.SHIP }));
        const { inputs, fireCallback } = props;
        this.inputs = inputs;
        this.fireCallback = fireCallback;
    }
    setInputs(inputs) {
        this.inputs = inputs;
    }
    update() {
        while (this.inputs.length) {
            const input = this.inputs.pop();
            if (!input) {
                continue;
            }
            const { events, time } = input;
            this.rotation += this.isTurningRight(events)
                ? ROTATION
                : this.isTurningLeft(events)
                    ? -ROTATION
                    : 0.0;
            const accelerationX = this.isThrusting(events) ? Math.sin(this.heading * 0.01745) * ACCELERATION : 0.0;
            const accelerationY = this.isThrusting(events) ? Math.cos(this.heading * 0.01745) * ACCELERATION : 0.0;
            this.velocityX += accelerationX;
            this.velocityY += accelerationY;
            if (this.isFiring(events) && (!this.lastFired || time > this.lastFired + FIRE_DELAY)) {
                this.lastFired = time;
                // this.fireCallback(this)
            }
        }
        this.baseUpdate();
    }
    isThrusting(inputs) {
        return inputs.includes(models_1.InputEventType.THRUST);
    }
    isTurningLeft(inputs) {
        return inputs.includes(models_1.InputEventType.LEFT);
    }
    isTurningRight(inputs) {
        return inputs.includes(models_1.InputEventType.RIGHT);
    }
    isFiring(inputs) {
        return inputs.includes(models_1.InputEventType.FIRE);
    }
}
exports.ShipEntity = ShipEntity;
//# sourceMappingURL=ship.js.map