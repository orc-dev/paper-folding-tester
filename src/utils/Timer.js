
export class Timer {

    constructor(timeLimit = 100) {
        this.timeLimit = timeLimit;
        this.timeElapsed = 0;
        this.lastTime = undefined;
    }

    reset() {
        this.lastTime = undefined;
        this.timeElapsed = 0;
    }

    update(timestamp) {
        if (this.lastTime === undefined) {
            this.lastTime = timestamp;
            this.timeElapsed = 0;
            return;
        }
        const delta = timestamp - this.lastTime;
        this.timeElapsed += delta;
    }

    timeIsUp() {
        return this.timeElapsed >= this.timeLimit;
    }

    ding(timestamp) {
        this.update(timestamp);
        const check = this.timeIsUp();
        if (check) this.reset();
        return check;
    }

    whisper() {
        console.log('Hello from Timer');
    }
}
