"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("./entity");
const models_1 = require("shared/src/models");
const Vec2D = __importStar(require("vector2d"));
class ShipEntity extends entity_1.Entity {
    constructor(props) {
        super(Object.assign(Object.assign({}, props), { type: models_1.EntityType.SHIP }));
        this.inputs = props.inputs;
    }
    update() {
        while (this.inputs.length) {
            const input = this.inputs.pop();
            if (!input) {
                continue;
            }
            this.rotation = this.isTurningRight(input.events)
                ? 0.05
                : this.isTurningLeft(input.events)
                    ? -0.05
                    : 0.0;
            this.heading += this.rotation;
            const acceleration = this.isThrusting(input.events)
                ? new Vec2D.Vector(Math.cos(this.heading) * 1.05, Math.sin(this.heading) * 1.05)
                : new Vec2D.Vector(0.0, 0.0);
            this.velocity.add(acceleration); // times delta time
            this.position.add(this.velocity); // ditto
        }
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
}
exports.ShipEntity = ShipEntity;
//# sourceMappingURL=ship.js.map