import EventEmitter from "eventemitter3";

export class PromiseSignal<RArg> {
    private static emitter = new EventEmitter();
    private static currentId: number = 0;
    private id: string;


    constructor(name: string) {
        this.id = name + "-" + PromiseSignal.currentId++;
    }

    public on(callback: (resolve: (value?: RArg) => void) => void, context: any): void {
        PromiseSignal.emitter.on(this.id, callback, context);
    }

    public once(callback: (resolve: (value?: RArg) => void) => void, context: any): void {
        PromiseSignal.emitter.once(this.id, callback, context);
    }

    public off(callback: (resolve: (value?: RArg) => void) => void, context: any): void {
        PromiseSignal.emitter.off(this.id, callback, context);
    }

    public removeAllListeners(): void {
        PromiseSignal.emitter.removeAllListeners(this.id);
    }

    public dispatch(): Promise<RArg> {
        return new Promise<RArg>((resolve: (value: RArg) => void, reject: (reason?: any) => void) => {
            if (PromiseSignal.emitter.listeners(this.id).length === 0) {
                const reason = { reason: "No listeners for this event", event: this.id };
                reject(reason);
                return;
            }

            const safeResolve = (value?: RArg) => {
                if (value === undefined) {
                    reject(new Error("Listener resolved without a value"));
                    return;
                }
                resolve(value);
            };

            PromiseSignal.emitter.emit.apply(PromiseSignal.emitter, [this.id, safeResolve]);
        });
    }
}
