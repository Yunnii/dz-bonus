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
/*global Driver: true*/
/*global Graphic: true*/

(function (exports) {
    "use strict";

    var el,
        idInterval = null,
        driver,
        intersection,
        updateTime = 150,
        defaultTime = 150,
        arrow,
        interval;

    function manageIntersect() {
        if (intersection.kickCount < 1) {
            if (intersection.rest !== 0) {
                var speedDirection  = el.Speed.Normalize();
                el.Speed.set(speedDirection.X() * intersection.rest, speedDirection.Y() * intersection.rest);

                var k = el.Speed.GetLength() / el.moveSpeed();
                updateTime = k * defaultTime;

                el.move(updateTime);
                intersection.rest = 0;
            } else {
                updateTime = defaultTime;
                if (intersection.changeOnOposite === true) {
                    el.reflect();
                } else {
                    el.reflectDirection(intersection.line);
                }
                intersection = driver.findIntersection();
                manageIntersect();
            }
        } else {
            el.move(updateTime);
            intersection.kickCount -= 1;
        }
    }

    function moveBall(e) {
        e = e || window.event;

        if (el.isNearBall(e.pageX, e.pageY)) {
            el.moveBall(e.pageX, e.pageY);
            intersection = driver.findIntersection();

            if (idInterval === null) {
                clearInterval(interval);
                arrow.remove();
                
                manageIntersect();

                idInterval = setTimeout(function inside() {
                    manageIntersect();

                    setTimeout(inside, updateTime);
                }, updateTime);
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
                    graphicManager = new Graphic(canvas),
                    borders = graphicManager.createBorder(result);

                arrow = graphicManager.paintArrow();

                interval = setInterval(function () {
                    arrow.stop().attr({"stroke-width": 24, "stroke-opacity": 0.4})
                                .animate({"stroke-width": 20, "stroke-opacity": 1}, 1000);
                }, 1000);

                el = new Ball(canvas, 260, 350, 30);
                driver = new Driver(el, borders);

                $("#main").mousemove(moveBall);
            });
    }

    $(document).ready(loadData);

}(window));