/**
 * Created by .
 * User: yunnii
 * Date: 12/1/12
 * Time: 7:05 PM
 * To change this template use File | Settings | File Templates.
 */
var center = {X: 240, Y: 300},
    nextX,
    nextY;

function move(x, y) {

        var tangens = (x - center.X === 0) ? 0 : (y - center.Y) / (x - center.X),
            nextX,
            nextY;

        if(x - center.X === 0) {
            nextX = center.X;
            nextY = (y - center.Y > 0 ) ? center.Y - 20 :
                    center.Y + 20;
        }
        else{
            nextX = (x - center.X > 0) ? center.X - 20 :
                    center.X + 20;
            nextY = tangens * nextX + (center.Y - tangens * center.X);
        }

        return {X: nextX, Y: nextY};
    }

test("Moving ball, move right-up", function () {
    "use strict";

    var result = move(160, 200);

    ok(result.X === 260 && result.Y === 325);
});

test("Moving ball, move up", function () {
    "use strict";

    var result = move(240, 180);

    ok(result.X === 240 && result.Y === 320);
});

test("Moving ball, move down", function () {
    "use strict";

    var result = move(240, 390);

    ok(result.X === 240 && result.Y === 280);
});

test("Moving ball, move horizontally", function () {
    "use strict";

    var result = move(210, 300);

    ok(result.X === 260 && result.Y === 300);
});

test("Moving ball, move horizontally left", function () {
    "use strict";

    var result = move(290, 300);

    ok(result.X === 220 && result.Y === 300);
});