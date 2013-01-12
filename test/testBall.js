/**
 * Created by .
 * User: yunnii
 * Date: 12/1/12
 * Time: 7:05 PM
 * To change this template use File | Settings | File Templates.
 */
var ball,
    speed = 10;

function load() {
    var canvas = Raphael(10, 50, 320, 200);
    ball = new Ball(canvas, 20, 20, 10);
}

$(document).ready(load);

test("Moving", function () {
    "use strict";

    ball.moveBall(0, 0);

    ok(Math.abs(ball.Speed.X() - speed * Math.sqrt(2) / 2) < 0.1 && Math.abs(ball.Speed.Y() - speed * Math.sqrt(2) / 2 < 0.1));
});

test("Reflect moving", function () {
    "use strict";

    ball.moveBall(0, 0);
    var border = Line.GetLineFrom2Point(new Point(0,60), new Point(60, 0));
    ball.reflectDirection(border);

    ok(Math.abs(ball.Speed.X() + speed * Math.sqrt(2) / 2 < 0.1) && Math.abs(ball.Speed.Y() + speed * Math.sqrt(2) / 2 < 0.1));
});

test("Reflect moving", function () {
    "use strict";

    ball.moveBall(0, 0);
    var border = Line.GetLineFrom2Point(new Point(20, 20), new Point(0, 20));
    ball.reflectDirection(border);

    ok(Math.abs(ball.Speed.X() - speed * Math.sqrt(2) / 2) < 0.1 && Math.abs(ball.Speed.Y() + speed * Math.sqrt(2) / 2 < 0.1));
})