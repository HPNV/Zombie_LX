import Activity from "./Activity";

export default class MultipleActivities implements Activity{
    private _activities: Activity[];
    private _finishFunction: Function;

    constructor() {
        this._activities = [];
    }

    addActivity(activity: Activity){
        this._activities.push(activity);
    }

    then(finishFunction: Function): MultipleActivities{
        this._finishFunction = finishFunction;
        return this;
    }

    updateActivity(timeInMilliSeconds: number): boolean {
        let finish_activities: Activity[] = [];

        for (let activity of this._activities) {
            if(activity.updateActivity(timeInMilliSeconds)){
                finish_activities.push(activity);
            }
        }

        for (let finishActivity of finish_activities) {
            this._activities.splice(this._activities.indexOf(finishActivity), 1);
        }

        if(this._activities.length === 0){
            this._finishFunction && this._finishFunction();
            return true;
        }

        return false;
    }

}