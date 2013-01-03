/**
 * Created with JetBrains WebStorm.
 * User: yunnii
 * Date: 12/10/12
 * Time: 7:46 PM
 * To change this template use File | Settings | File Templates.
 */

var center = {X: 100, Y: 100},
    y_a,
    x_b,
    y_b;

function reflectDirection(tangens, tangens2, hit) {
    "use strict";

    y_a = center.Y - tangens * center.X;
    x_b = (tangens2 === 0) ? center.X : (tangens2 - tangens) * tangens2 * center.X / (tangens2 * tangens2 + 1);
    y_b = tangens2 * x_b + (center.Y - tangens2 * center.X);
    var x_c = 2 * x_b,
        y_c = 2 * y_b - y_a;

    var product = (-y_a + center.Y - tangens2 * center.X) * (-hit.Y + tangens2 * hit.X + center.Y - tangens2 * center.X);
    return (product > 0) ? {X: 0, Y: y_a} : {X: x_c, Y: y_c};
}

test("Reflect up-right on 45 degree", function () {
    "use strict";

    var result = reflectDirection(1, -1, {X: 130, Y: 130});

    ok(result.X === 200 && result.Y === 200);
});

test("Moving ball, move up-right on 60 degree", function () {
    "use strict";

    var result = reflectDirection(Math.sqrt(3), -1, {X: 130, Y: 130});

    ok((y_a - 100 + 100 * Math.sqrt(3) === 0) && Math.abs(x_b - 50 - 50 * Math.sqrt(3)) < 0.01 && Math.abs(y_b - 150 + 50 * Math.sqrt(3)) < 0.01 && Math.abs(result.X - 100 - 100 * Math.sqrt(3)) < 0.01);
});

test("Moving ball left-down", function () {
    "use strict";

    var result = reflectDirection(1, -1, {X: 70, Y: 70});

    ok(Math.abs(y_a) < 0.01 && Math.abs(x_b - 100) < 0.01 && Math.abs(y_b - 100) < 0.01 && Math.abs(result.X) < 0.01 && Math.abs(result.Y)  < 0.01);
});

test("Moving ball down", function () {
    "use strict";

    var result = reflectDirection(-1, 0, {X: 70, Y: 70});

    ok(Math.abs(y_a - 200) < 0.01 && Math.abs(x_b - 100) < 0.01 && Math.abs(y_b - 100) < 0.01 && Math.abs(result.X - 200) < 0.01 && Math.abs(result.Y) < 0.01);
});

test("Moving ball down-left on 60 degree", function () {
    "use strict";

    var result = reflectDirection(-Math.sqrt(3), 0, {X: 70, Y: 70});

    ok(Math.abs(y_a - 100 * Math.sqrt(3)) < 0.01 && Math.abs(x_b - 100) < 0.01 && Math.abs(y_b - 100 * Math.sqrt(3)) < 0.01 && Math.abs(result.X - 200) < 0.01 && Math.abs(result.Y) < 0.01);
});

