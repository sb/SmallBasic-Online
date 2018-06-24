import { ExecutionEngine } from "../execution-engine";

export class Animation<TData> {
    private _lastRefresh: number = 0;
    private _endTime: number = 0;

    private _create: (engine: ExecutionEngine) => { duration: number; data: TData; };
    private _update: (percentage: number, data: TData) => void;

    private _data: TData | undefined = undefined;

    public constructor(create: (engine: ExecutionEngine) => { duration: number; data: TData; }, update: (percentage: number, data: TData) => void) {
        this._create = create;
        this._update = update;
    }

    public execute(engine: ExecutionEngine): boolean {
        const timeNow = new Date().getTime();
        if (this._data) {
            if (timeNow >= this._endTime) {
                this._update(1, this._data);
                this._data = undefined;
                return true;
            } else {
                this._update((timeNow - this._lastRefresh) / (this._endTime - this._lastRefresh), this._data);
                this._lastRefresh = timeNow;
                return false;
            }
        } else {
            const creationInfo = this._create(engine);

            this._lastRefresh = timeNow;
            this._endTime = timeNow + creationInfo.duration;
            this._data = creationInfo.data;

            return false;
        }
    }
}
