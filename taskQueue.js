/**
 * Created with JetBrains WebStorm.
 * User: yunnii
 * Date: 1/18/13
 * Time: 3:16 PM
 * To change this template use File | Settings | File Templates.
 */
(function (exports) {
    "use strict";

    var TaskQueue = function (distance, speed) {
        this.distance = distance;
        this.speed = speed;
    };
    exports.TaskQueue = TaskQueue;

    TaskQueue.prototype.getNext = function () {
        this.distance -= this.speed;
    };

    TaskQueue.prototype.isEmpty = function () {
        return (this.distance < this.speed);
    };

    TaskQueue.prototype.getRest = function () {
        return this.distance;
    };
}(window));