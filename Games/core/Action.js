module.exports = class Action {

    constructor(options) {
        this.actors = options.actor ? [options.actor] : (options.actors || []);
        this.target = options.target;
        this.game = options.game;
        this.meeting = options.meeting;
        this.run = options.run.bind(this);
        this.labels = options.labels || [];
        this.priority = options.priority || 0;
        this.delay = options.delay || 0;
        this.power = options.power || 1;
        this.effect = options.effect;
        this.item = options.item;

        this.priority += this.actor.role ? this.actor.role.priorityOffset : 0;
    }

    do() {
        this.run();
    }

    dominates(player) {
        player = player || this.target;
        var notImmune = true;

        for (let label of this.labels) {
            notImmune &= player.getImmunity(label) < this.power;

            if (player.getCancelImmunity(label))
                return true;
        }

        if (!notImmune)
            this.game.events.emit("immune", this);

        return notImmune;
    }

    hasLabel(label) {
        return this.labels.indexOf(label) != -1;
    }

    hasLabels(labels) {
        for (let label of labels)
            if (this.labels.indexOf(label) == -1)
                return false;

        return true;
    }

    cancel(stopAll) {
        this.actors.shift();

        if (this.actors.length == 0 || stopAll) {
            this.do = () => { };
            this.actors = [];
            delete this.target;
        }
    }

    cancelActor(actor) {
        var actorIndex = this.actors.indexOf(actor);
        if (actorIndex == -1)
            return;

        this.actors.splice(actorIndex, 1);

        if (this.actors.length == 0) {
            this.do = () => { };
            this.actors = [];
            delete this.target;
        }
    }

    get actor() {
        return this.actors[0];
    }

    set actor(_actor) {
        this.actors.unshift(_actor);
    }

}