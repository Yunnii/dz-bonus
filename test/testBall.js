/**
 * Created by .
 * User: yunnii
 * Date: 12/1/12
 * Time: 7:05 PM
 * To change this template use File | Settings | File Templates.
 */
var ball;
function load() {
    var canvas = Raphael(10, 50, 320, 200);
    ball = new Ball(canvas, 20, 20, 10);
   // this.Speed.V.X = 30;
   // this.Speed.V.Y = -30;
}

$(document).ready(load);

test("Moving", function () {
    "use strict";

    ball.moveBall(0, 0);

    ok(ball.Speed.V.X - 30 * Math.sqrt(2) / 2 < 0.1 && ball.Speed.V.Y - 30 * Math.sqrt(2) / 2 < 0.1);
});

test("Reflect moving", function () {
    "use strict";

    ball.moveBall(0, 0);
    var border = Line.GetLineFrom2Point(new Point(0,60), new Point(60, 0));
    ball.reflectDirection(border);

    ok(ball.Speed.V.X + 30 * Math.sqrt(2) / 2 < 0.1 && ball.Speed.V.Y + 30 * Math.sqrt(2) / 2 < 0.1);
});

test("Reflect moving", function () {
    "use strict";

    ball.moveBall(0, 0);
    var border = Line.GetLineFrom2Point(new Point(20, 20), new Point(0, 20));
    ball.reflectDirection(border);

    ok(ball.Speed.V.X - 30 * Math.sqrt(2) / 2 < 0.1 && ball.Speed.V.Y + 30 * Math.sqrt(2) / 2 < 0.1);
})