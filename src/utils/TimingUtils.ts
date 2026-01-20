export class TimingUtils {

    public static async wait(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    public static async delay(seconds: number): Promise<void> {
        return TimingUtils.wait(seconds * 1000);
    }
}