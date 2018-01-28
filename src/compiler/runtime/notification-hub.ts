import * as PubSub from "pubsub-js";
import { ValueKind } from "./values/base-value";
import { TextWindowColors } from "./libraries/text-window";
import { Diagnostic } from "../utils/diagnostics";

export class PubSubChannel {
    private id: string;
    public constructor(name: string) {
        this.id = name + new Date().getTime().toString();
    }

    public subscribe(subscriber: () => void): string {
        return PubSub.subscribe(this.id, subscriber);
    }

    public publish(): void {
        PubSub.publish(this.id, undefined);
    }
}

export class PubSubPayloadChannel<TPayload> {
    private id: string;
    public constructor(name: string) {
        this.id = name + new Date().getTime().toString();
    }

    public subscribe(subscriber: (payload: TPayload) => void): string {
        return PubSub.subscribe(this.id, (_: string, payload: TPayload) => {
            subscriber(payload);
        });
    }

    public publish(payload: TPayload): void {
        PubSub.publish(this.id, payload);
    }
}

export class NotificationHub {
    public readonly blockedOnInput: PubSubPayloadChannel<ValueKind> = new PubSubPayloadChannel<ValueKind>("blockedOnInput");
    public readonly producedOutput: PubSubChannel = new PubSubChannel("producedOutput");

    public readonly backgroundColorChanged: PubSubPayloadChannel<TextWindowColors> = new PubSubPayloadChannel<TextWindowColors>("backgroundColorChanged");
    public readonly foregroundColorChanged: PubSubPayloadChannel<TextWindowColors> = new PubSubPayloadChannel<TextWindowColors>("foregroundColorChanged");

    public readonly programTerminated: PubSubPayloadChannel<Diagnostic | undefined> = new PubSubPayloadChannel<Diagnostic | undefined>("programTerminated");
}
