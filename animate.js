/**
 * Created by .
 * User: yunnii
 * Date: 11/29/12
 * Time: 2:47 PM
 * To change this template use File | Settings | File Templates.
 */
/*global $: true*/
/*global alert: true*/
/*global Raphael: true*/
/*global model: true*/
/*global Ball: true*/
/*global tmpl: true*/
(function (exports) {
    "use strict";

   // exports.R = R;
    var template = "M <%= x1 %>,<%= y1 %> L <%= x2 %>, <%= y2 %> L <%= x1 %>,<%= y1 %>",
        el,
        start = null,
        idInterval = null,
        pathArray = [],
        borderArray = [];

    function avg(collection) {
        var average = { x: 0, y: 0};
        collection.forEach(function (el) {
            average.x += el.x;
            average.y += el.y;
        });
        return {
            X: average.x / collection.length,
            Y: average.y / collection.length
        };
    }

    function intersectChecker() {
        setInterval(function () {
            var i,
                bbox,
                intersect,
                tangens,
                hit;

            for (i = 0; i < pathArray.length; i += 1) {

                intersect = Raphael.pathIntersection(pathArray[i], el.circleString());
                if (intersect.length > 0) {
                    hit = avg(intersect);

                    bbox = borderArray[i].getBBox();
                    tangens = (bbox.x2 - bbox.x === 0)
                        ? (bbox.y2 - bbox.y) / (bbox.x2 - bbox.x + 1)
                        : (bbox.y2 - bbox.y) / (bbox.x2 - bbox.x);

                    el.reflectDirection(tangens, hit);
                }
            }
        }, 100);
    }

    function moveBall(e) {
        if (start === null) {
            start = 1;
            intersectChecker();
        }
        e = e || window.event;

        if (el.isNearBall(e.pageX, e.pageY)) {

            el.moveBall(e.pageX, e.pageY);

            if (idInterval === null) {
                el.move();
                idInterval = setInterval(function () {
                    el.move();
                }, 200);
            }
        }
    }

    /**
     * инициализируем шар
     */
    function load() {

        var colour = "r(0.5,0.5)hsb(4.8, 1, 1)-hsb(4.8, 1, .3)",
            canvas = Raphael("main", 1000, 1000);

        pathArray.forEach(function (path) {
            canvas.path(path)
                        .attr({fill: "#ddd", "fill-opacity": 1, stroke: "#fff", "stroke-width": 16});
            borderArray.push(canvas.path(path)
                        .attr({fill: "#ddd", "fill-opacity": 1, stroke: "#333", "stroke-width": 12}));
        });

        el = new Ball(canvas, 260, 350, 30);

        $("#main").mousemove(moveBall);
    }

    /** Загружаем координаты стенки
    */
    function initialise() {

        $.getJSON('data.json')
                .error(function () { alert("Попробуйте позже, сервер недоступен =)"); })
                .success(function (result) {
                if (result.length === 0) {
                    return;
                }

                var i;

                for (i = 0; i < result.length - 1; i += 1) {
                    pathArray.push(tmpl(template, { x1: result[i].x,
                                                    y1: result[i].y,
                                                    x2: result[i + 1].x,
                                                    y2: result[i + 1].y}));
                }
                pathArray.push(tmpl(template, { x1: result[result.length - 1].x,
                                                y1: result[result.length - 1].y,
                                                x2: result[0].x,
                                                y2: result[0].y}));

                load();
            });
    }

    $(document).ready(initialise);

}(window));