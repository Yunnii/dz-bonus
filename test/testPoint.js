/**
 * Created with JetBrains WebStorm.
 * User: yunnii
 * Date: 1/10/13
 * Time: 9:59 PM
 * To change this template use File | Settings | File Templates.
 */
test("Test All setup", function () {
    "use strict";

    var v = new Point(2, 4);

    ok(v.X === 2 && v.Y === 4);
});

test("Test finding distance", function () {
    "use strict";

    var v = new Point(7, 4);
    var v2 = new Point(3, 1);

    ok(v.getDistanceBetween(v2) === 5);
});