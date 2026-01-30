export class TimingUtils {

    public static async delayMS(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    public static async delayS(seconds: number): Promise<void> {
        return TimingUtils.delayMS(seconds * 1000);
    }
}