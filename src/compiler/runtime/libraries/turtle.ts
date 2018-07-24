import { ValueKind, BaseValue } from "../values/base-value";
import { NumberValue } from "../values/number-value";
import { LibraryMethodInstance, LibraryTypeInstance, LibraryPropertyInstance, LibraryEventInstance } from "../libraries";
import { ExecutionEngine } from "../../execution-engine";
import { PubSubPayloadChannel } from "../../utils/notifications";

export interface TurtleMoveEventData {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export class TurtleLibrary implements LibraryTypeInstance {
    private _speed: number = 5;
    private _angle: number = 0;

    private _positionX: number = 250;
    private _positionY: number = 250;

    private _isVisible: boolean = true;
    private _isPenDown: boolean = true;

    public readonly moveEvent: PubSubPayloadChannel<TurtleMoveEventData> = new PubSubPayloadChannel<TurtleMoveEventData>("moveEvent");
    public readonly turnEvent: PubSubPayloadChannel<number> = new PubSubPayloadChannel<number>("turnEvent");

    public get isVisible(): boolean {
        return this._isVisible;
    }

    public get isPenDown(): boolean {
        return this._isPenDown;
    }

    private getSpeed(): BaseValue {
        return new NumberValue(this._speed);
    }

    private setSpeed(value: BaseValue): void {
        value = value.tryConvertToNumber();
        if (value.kind === ValueKind.Number) {
            const newSpeed = (value as NumberValue).value;
            if (newSpeed < 1) {
                this._speed = 1;
            } else if (newSpeed > 10) {
                this._speed = 10;
            } else {
                this._speed = newSpeed;
            }
        }
    }

    private getAngle(): BaseValue {
        return new NumberValue(this._angle);
    }

    private setAngle(value: BaseValue): void {
        value = value.tryConvertToNumber();
        if (value.kind === ValueKind.Number) {
            this._angle = (value as NumberValue).value;
        }
    }

    private getX(): BaseValue {
        return new NumberValue(this._positionX);
    }

    private setX(value: BaseValue): void {
        value = value.tryConvertToNumber();
        if (value.kind === ValueKind.Number) {
            this._positionX = (value as NumberValue).value;
        }
    }

    private getY(): BaseValue {
        return new NumberValue(this._positionY);
    }

    private setY(value: BaseValue): void {
        value = value.tryConvertToNumber();
        if (value.kind === ValueKind.Number) {
            this._positionY = (value as NumberValue).value;
        }
    }

    private executeShow(): boolean {
        this._isVisible = true;
        return true;
    }

    private executeHide(): boolean {
        this._isVisible = false;
        return true;
    }

    private executePenDown(): boolean {
        this._isPenDown = true;
        return true;
    }

    private executePenUp(): boolean {
        this._isPenDown = false;
        return true;
    }

    private executeMove(engine: ExecutionEngine): boolean {
        const distanceArg = engine.popEvaluationStack().tryConvertToNumber();
        if (distanceArg.kind !== ValueKind.Number) {
            return false;
        }

        const distance = (distanceArg as NumberValue).value;
        const turnDelta = this._angle / 180 * Math.PI;

        const newY = this._positionY - distance * Math.cos(turnDelta);
        const newX = this._positionX + distance * Math.sin(turnDelta);

        this.moveEvent.publish({ x1: this._positionX, y1: this._positionY, x2: newX, y2: newY });
        this._positionX = newX;
        this._positionY = newY;

        return true;
    }

    private executeMoveTo(engine: ExecutionEngine): boolean {
        const yArg = engine.popEvaluationStack().tryConvertToNumber();
        const xArg = engine.popEvaluationStack().tryConvertToNumber();

        if (yArg.kind !== ValueKind.Number || xArg.kind !== ValueKind.Number) {
            return true;
        }

        const newY = (yArg as NumberValue).value, newX = (xArg as NumberValue).value;
        const distanceSquared = (newX - this._positionX) * (newX - this._positionX) + (newY - this._positionY) * (newY - this._positionY);

        if (distanceSquared === 0) {
            return true;
        }

        const distance = Math.sqrt(distanceSquared);
        let angle = Math.acos((this._positionY - newY) / distance) * 180 / Math.PI;

        if (newX < this._positionX) {
            angle = 360 - angle;
        }

        let turnDelta = angle - (this._angle % 360);
        if (turnDelta > 180) {
            turnDelta = turnDelta - 360;
        }

        const newAngle = this._angle + turnDelta;
        this.turnEvent.publish(newAngle);
        this._angle = newAngle;

        this.moveEvent.publish({ x1: this._positionX, y1: this._positionY, x2: newX, y2: newY });
        this._positionX = newX;
        this._positionY = newY;

        return true;
    }

    private executeTurn(engine: ExecutionEngine): boolean {
        const angleArg = engine.popEvaluationStack().tryConvertToNumber();

        if (angleArg.kind !== ValueKind.Number) {
            return true;
        }

        const turnDelta = (angleArg as NumberValue).value;

        const newAngle = this._angle + turnDelta;
        this.turnEvent.publish(newAngle);
        this._angle = newAngle;

        return true;
    }

    private executeTurnLeft(): boolean {
        const newAngle = this._angle - 90;
        this.turnEvent.publish(newAngle);
        this._angle = newAngle;

        return true;
    }

    private executeTurnRight(): boolean {
        const newAngle = this._angle + 90;
        this.turnEvent.publish(newAngle);
        this._angle = newAngle;

        return true;
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        Show: { execute: this.executeShow.bind(this) },
        Hide: { execute: this.executeHide.bind(this) },
        PenDown: { execute: this.executePenDown.bind(this) },
        PenUp: { execute: this.executePenUp.bind(this) },
        Move: { execute: this.executeMove.bind(this) },
        MoveTo: { execute: this.executeMoveTo.bind(this) },
        Turn: { execute: this.executeTurn.bind(this) },
        TurnLeft: { execute: this.executeTurnLeft.bind(this) },
        TurnRight: { execute: this.executeTurnRight.bind(this) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {
        Speed: { getter: this.getSpeed.bind(this), setter: this.setSpeed.bind(this) },
        Angle: { getter: this.getAngle.bind(this), setter: this.setAngle.bind(this) },
        X: { getter: this.getX.bind(this), setter: this.setX.bind(this) },
        Y: { getter: this.getY.bind(this), setter: this.setY.bind(this) }
    };

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
