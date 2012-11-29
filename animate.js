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

    function load (data) {

        var r = Raphael("holder", 700, 540),
                    dashed = {fill: "none", stroke: "#666", "stroke-dasharray": "- "};

        r.path(data).attr({fill: "#fff", "fill-opacity": 1, stroke: "#333", "stroke-width": 24});

        var el = r.circle(260, 350, 30).attr({fill: "#99d", "fill-opacity": 1, stroke: "#79d","stroke-width": 2}),
            elattrs = [{cx: 60, fill: "#99d", "fill-opacity": 1}, {cx: 260, fill: "#99d", "fill-opacity": 1}],
            now = 1;
        
        el.click(function () {
            el.stop().animate(elattrs[+(now = !now)], 1000);
        });

    }
}())