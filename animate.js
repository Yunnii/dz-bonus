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
        idInterval,
        pathArray = [],
        borderArray = [];

    function intersectChecker() {
        setInterval(function () {
            var i,
                bbox,
                intersect,
                hit,
                nextPoint,
                tan;

            for (i = 0; i < pathArray.length; i += 1) {

                intersect = Raphael.pathIntersection(pathArray[i], el.circleString());
                if (intersect.length > 0) {
                    clearInterval(idInterval);

                    hit = { x: 0, y: 0};
                    intersect.forEach(function (el) {
                        hit.x += el.x;
                        hit.y += el.y;
                    });
                    hit.x /= intersect.length;
                    hit.y /= intersect.length;

                    bbox = borderArray[i].getBBox();
                    tan = (bbox.x - bbox.x2 === 0) ? 0 : (bbox.y - bbox.y2) / (bbox.x - bbox.x2);

                    nextPoint = el.findReflectionPoint(hit.x, hit.y, tan);

                    el.moveBall(nextPoint.x, nextPoint.y);
                    idInterval = setInterval(function () {
                        el.moveBall(nextPoint.x, nextPoint.y);
                    }, 1000);
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
            clearInterval(idInterval);
            el.moveBall(e.pageX, e.pageY);
            idInterval = setInterval(function () {
                el.moveBall(e.pageX, e.pageY);
            }, 1000);

            e.isImmediatePropagationStopped();
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