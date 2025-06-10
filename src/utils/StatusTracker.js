export class StatusTracker {
    static NOT_STARTED = 'not_started';
    static IN_PROGRESS = 'in_porgress';
    static COMPLETED   = 'completed';

    constructor() {
        this._status = StatusTracker.NOT_STARTED;
    }

    setInProgress() {
        this._status = StatusTracker.IN_PROGRESS;
    }

    setCompleted() {
        this._status = StatusTracker.COMPLETED;
    }

    get status() {
        return this._status;
    }
}