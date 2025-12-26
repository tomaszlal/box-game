import EventEmitter from "eventemitter3";

export class Signal {
    protected static emitter = new EventEmitter();
    private static currentId: number = 0;
    private readonly id: string;

    constructor(name: string) {
        this.id = name + "-" + Signal.currentId++;
    }

    public on(callback: () => void, context: any): void {
        Signal.emitter.on(this.id, callback, context);
    }
    public once(callback: () => void, context: any): void {
        Signal.emitter.once(this.id, callback, context);
    }

    public onceP(context: any): Promise<any> {
        return new Promise(resolve => {
            Signal.emitter.once(this.id, resolve, context);
        });
    }

    public off(callback: () => void, context: any): void {
        Signal.emitter.off(this.id, callback, context);
    }

    public removeAllListeners(): void {
        Signal.emitter.removeAllListeners(this.id);
    }

    public dispatch(): void {
        Signal.emitter.emit.apply(Signal.emitter, [this.id]);
    }
}