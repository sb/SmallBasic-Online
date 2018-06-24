import * as PubSub from "pubsub-js";

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
