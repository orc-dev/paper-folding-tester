export class DisplacementChecker {
    constructor(threshold) {
        this.x = 0;
        this.y = 0;
        this.sqr = threshold * threshold;
    }
    exceedsThreshold(x, y) {
        const ds = (this.x - x) ** 2 + (this.y - y) ** 2;
        const exceed = (ds >= this.sqr);
        if (exceed) {
            this.x = x;
            this.y = y;
        }
        return exceed;
    }
}
