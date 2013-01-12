test("Test All setup", function () {
    "use strict";

    var start = new Point(7, 4),
        finish = new Point(3, 1),
        line = Line.GetLineFrom2Point(finish, start);

    ok(line.A === -3 && line.B === 4 && line.C === 5);
});

test("Test Perpendicular line", function () {
    "use strict";

    var line = Line.GetLineFromCoefficient(-3, 4, 5),
        point = new Point(1, 2),
        result = line.GetNormalLine(point);

    ok(result.A === -4 && result.B === -3 && result.C === 10);
});

test("Test Intersect line", function () {
    "use strict";

    var line = Line.GetLineFromCoefficient(1, 2, 4),
        crossLine = Line.GetLineFromCoefficient(3, 1, 12),
        crossPoint = line.GetIntersectPoint(crossLine);

    ok(crossPoint.X === -4 && crossPoint.Y === 0);
});

test("Test Creating line", function () {
    "use strict";

    var v = new Vector(2, 2),
        point = new Point(0, 2),
        line = Line.GetLineFromVectorAndPoint(v, point);

    ok(line.A === 2 && line.B === -2 && line.C === 4);
});