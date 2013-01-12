/**
 * Created with JetBrains WebStorm.
 * User: yunnii
 * Date: 1/10/13
 * Time: 9:45 PM
 * To change this template use File | Settings | File Templates.
 */
test("Test All setup", function () {
    "use strict";

    var v = new Vector(2, 4);

    ok(v.X() === 2 && v.Y() === 4);
});

test("Test Find vector length", function () {
    "use strict";

    var v = new Vector(3, 4);

    ok(v.GetLength() === 5);
});

test("Test Find vector length 2", function () {
    "use strict";

    var v = new Vector(-3, 4);

    ok(v.GetLength() === 5);
});

test("Test vector normalization", function () {
    "use strict";

    var v = new Vector(-3, 4).Normalize();

    ok(v.X() === -3 / 5 && v.Y() === 4 / 5);
});