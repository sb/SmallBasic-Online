import { ValueKind, BaseValue } from "../values/base-value";
import { NumberValue } from "../values/number-value";
import { LibraryMethodInstance, LibraryTypeInstance, LibraryPropertyInstance } from "../libraries";
import { Animation } from "../../utils/animation";
import { ExecutionEngine } from "../../execution-engine";
import { PubSubPayloadChannel } from "../../utils/notifications";

interface MoveAnimationData {
    finalX: number;
    finalY: number;
}

interface TurnAnimationData {
    finalAngle: number;
}

export interface TurtleLine {
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

    private _moveAnimation: Animation<MoveAnimationData> = new Animation(this._createMoveAnimation.bind(this), this._updateMoveAnimation.bind(this));
    private _turnAnimation: Animation<TurnAnimationData> = new Animation(this._createTurnAnimation.bind(this), this._updateTurnAnimation.bind(this));

    public readonly drawLine: PubSubPayloadChannel<TurtleLine> = new PubSubPayloadChannel<TurtleLine>("drawLine");

    public get isVisible(): boolean {
        return this._isVisible;
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

    private _createMoveAnimation(engine: ExecutionEngine): { duration: number; data: MoveAnimationData; } {
        const distanceArgument = engine.popEvaluationStack().tryConvertToNumber();

        if (distanceArgument.kind !== ValueKind.Number) {
            return {
                duration: 0,
                data: {
                    finalX: this._positionX,
                    finalY: this._positionY
                }
            };
        }

        const distance = (distanceArgument as NumberValue).value;
        const direction = this._angle / 180 * Math.PI;
        const speed = this._speed;

        return {
            duration: speed === 10 ? 0 : Math.abs(distance * 320 / (speed * speed)),
            data: {
                finalX: Math.round(this._positionX + distance * Math.sin(direction)),
                finalY: Math.round(this._positionY - distance * Math.cos(direction))
            }
        };
    }

    private _updateMoveAnimation(percentage: number, data: MoveAnimationData): void {
        const newX = Math.round(this._positionX + (data.finalX - this._positionX) * percentage);
        const newY = Math.round(this._positionY + (data.finalY - this._positionY) * percentage);

        if (this._isPenDown) {
            this.drawLine.publish({
                x1: this._positionX,
                y1: this._positionY,
                x2: newX,
                y2: newY
            });
        }

        this._positionX = newX;
        this._positionY = newY;
    }

    private _createTurnAnimation(engine: ExecutionEngine): { duration: number; data: TurnAnimationData; } {
        const angleArgument = engine.popEvaluationStack().tryConvertToNumber();
        if (angleArgument.kind !== ValueKind.Number) {
            return {
                duration: 0,
                data: {
                    finalAngle: 0
                }
            };
        }

        const angle = (angleArgument as NumberValue).value;
        return {
            duration: this._speed === 10 ? 5 : Math.abs(angle * 200 / (this._speed * this._speed)),
            data: {
                finalAngle: this._angle + angle
            }
        };
    }

    private _updateTurnAnimation(percentage: number, data: TurnAnimationData): void {
        this._angle = Math.round(this._angle + (data.finalAngle - this._angle) * percentage);
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        Show: { execute: this.executeShow.bind(this) },
        Hide: { execute: this.executeHide.bind(this) },
        PenDown: { execute: this.executePenDown.bind(this) },
        PenUp: { execute: this.executePenUp.bind(this) },
        Move: { execute: engine => this._moveAnimation.execute(engine) },
        Turn: { execute: engine => this._turnAnimation.execute(engine) },
        MoveTo: { execute: () => { throw new Error("Should be rewritten into Turn() then Move()"); } },
        TurnLeft: { execute: () => { throw new Error("Should be rewritten into Turn()"); } },
        TurnRight: { execute: () => { throw new Error("Should be rewritten into Turn()"); } }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {
        Speed: { getter: this.getSpeed.bind(this), setter: this.setSpeed.bind(this) },
        Angle: { getter: this.getAngle.bind(this), setter: this.setAngle.bind(this) },
        X: { getter: this.getX.bind(this), setter: this.setX.bind(this) },
        Y: { getter: this.getY.bind(this), setter: this.setY.bind(this) }
    };
}
