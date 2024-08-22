export default class Point {
    public x: number;
    public y: number;
    public region: [x0: number, y0: number, x1: number, y1: number];

    public constructor(x: number, y: number, region?: [x0: number, y0: number, x1: number, y1: number]) {
        this.x = x;
        this.y = y;
        region && this.setRegion(region)
    }

    public offset(offsetX: number, offsetY: number): void {
        this.x += offsetX;
        this.y += offsetY;
        this.region && this.setRegion(this.region);
    }

    public set(x: number, y: number, region?: [x0: number, y0: number, x1: number, y1: number]) {
        this.x = x;
        this.y = y;
        if (region) {
            this.setRegion(region);
        } else if (this.region) {
            this.setRegion(this.region);
        }
    }

    public setRegion(region: [x0: number, y0: number, x1: number, y1: number]): void {
        this.region = region;
        if (this.x < region[0]) this.x = region[0];
        if (this.x > region[2]) this.x = region[2];
        if (this.y < region[0]) this.y = region[0];
        if (this.y > region[3]) this.y = region[3];
    }
}