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
/*global Point: true*/
/*global Line: true*/

(function (exports) {
    "use strict";

    var el,
        idInterval = null,
        pathArray = [],
        borderArray = [],
        driver;

    function intersectChecker() {
        var i,
            hitNumber = [],
            intersect = [],
            hitCount = 0;

        for (i = 0; i < pathArray.length; i += 1) {
            intersect = Raphael.pathIntersection(pathArray[i], el.circleString());
            if (intersect.length > 0) {
                hitCount += 1;
                hitNumber.push(i);
            }
        }
        if (hitCount === 1) {
        //    el.merkle();
            el.reflectDirection(borderArray[hitNumber]);
        } else if (hitCount > 1) {
        //    el.merkle();
            el.reflect();
        }
    }

    function moveBall(e) {
        e = e || window.event;

        if (el.isNearBall(e.pageX, e.pageY)) {
            el.moveBall(e.pageX, e.pageY);
           // driver.FindCrossPoint();

            if (idInterval === null) {
                intersectChecker();
                el.move();

                idInterval = setInterval(function () {
                    intersectChecker();
                    el.move();
                }, 200);
            }
        }
    }

    /**
     * Загружаем координаты замкнутого многоугольника,
     * отрисовываем стенки, создаем шарик
    */
    function loadData() {

        $.getJSON('data.json')
                .error(function () { alert("Попробуйте позже, сервер недоступен =)"); })
                .success(function (result) {
                if (result.length === 0) {
                    return;
                }

                var canvas = Raphael("main", 1000, 1000),
                    graphicManager = new Graphic(canvas);

                graphicManager.createBorder(result, pathArray, borderArray);
                graphicManager.paintArrow();

                el = new Ball(canvas, 260, 350, 30);
                driver = new Driver(el);

                $("#main").mousemove(moveBall);
            });
    }

    $(document).ready(loadData);

}(window));