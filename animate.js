/**
 * Created by .
 * User: yunnii
 * Date: 11/29/12
 * Time: 2:47 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";

    $(document).ready(initialise);

    function initialise (){

        $.getJSON('data.json')
            .error(function () { alert("Попробуйте позже, сервер недоступен =)"); })
            .success(function(result){
                if (result.length == 0)
                    return;

                var help = "M " + result[0].x + "," + result[0].y;
                for(var i = 1; i < result.length; i += 1)
                {
                    help += "L " + result[i].x + "," + result[i].y;
                }
                help += "L " + result[0].x + "," + result[0].y;
            
            load(help);
        });
    }

function getGradient(index,degree)
{
	var bcolor = "hsb(" + index/10 + ", 1, 1)",
        color = "hsb(" + index/10 + ", 1, .3)";
    
	return "r(0.5,0.5)" + bcolor + "-" + color;
};

    function load (data) {

        var r = Raphael("holder", 700, 540),
                    dashed = {fill: "none", stroke: "#666", "stroke-dasharray": "- "};

        r.path(data).attr({fill: "#ddd", "fill-opacity": 1, stroke: "#333", "stroke-width": 24});

        var colour = getGradient(48);
        var el = r.circle(260, 350, 30).attr({fill: colour, "fill-opacity": 1, "stroke-width": 2}),
            elattrs = [{cx: 60, fill: colour, "fill-opacity": 1}, {cx: 260, fill: colour, "fill-opacity": 1}],
            now = 1;
        
        el.click(function () {
            el.stop().animate(elattrs[+(now = !now)], 1300);
        });

//        var mouse = 0 ;
//        document.onmousemove = function (e) {
//            e = e || window.event;
//            if (mouse == null) {
//                mouse = e.clientX;
//                return;
//            }
//            rot += e.clientX - mouse;
//            el.attr({transform: "r" + rot});
//            mouse = e.pageX;
//            R.safari();
//        };
    }
}())