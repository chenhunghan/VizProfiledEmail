import filesaver from 'browser-filesaver'
import buildNodesLinksWebworker from "worker!../src/buildNodesLinksWebWorker.js"
import forceLayoutWebworker from "worker!../src/forceLayoutWebWorker.js"

export function mainController($scope, $http) {
    $http({
        method: 'GET',
        url: 'json/user_shelly.json'
    }).then(function successCallback(response) {
        // Build a worker from an anonymous function body
        let dataStructureworker = new buildNodesLinksWebworker;
        dataStructureworker.postMessage(JSON.stringify(response)); // Send data to our worker.
        dataStructureworker.onmessage = function (structuredData) {
            //var json = new Blob([JSON.stringify(structuredData.data)], {type:"application/json"})
            //filesaver.saveAs(json, "data.json")

            var width = 1400,
                height = 900;

            var svg = d3.select("body").append("svg")
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("version", '1.2')
                .attr("width", width)
                .attr("height", height)
                .call(d3.behavior.zoom().on("zoom", redraw));

            var vis = svg
                .append('g');

            function redraw() {
                vis.attr("transform",
                    "translate(" + d3.event.translate + ")"
                    + " scale(" + d3.event.scale + ")");
            }

            var force = d3.layout.force()
                .size([width, height])
                .charge(-1000)
                .gravity(0.08)
                .linkDistance(function(d) {
                    return 80/d.similarity
                })
                .on("tick", tick);

            var drag = force.drag()
                .on("dragstart", dragstart);

            var link = vis.selectAll(".link"),
                gnode = vis.selectAll("g.node");

            force
                .nodes(structuredData.data.nodes)
                .links(structuredData.data.links)
                .start();

            link = link.data(structuredData.data.links)
                .enter().append("line")
                .attr("class", "link")
                .attr("style", function(d) {
                    return `stroke: #000;
                            stroke-width: 1.5px;
                            opacity: ${d.similarity*0.05};
                            `
                })

            gnode = gnode.data(structuredData.data.nodes)
                .enter().append("g")
                .attr("class", "gnode")
                .on("dblclick", dblclick)
                .call(drag)
                .on("mouseover", function(d,i) {
                    link.style('opacity', function(l) {
                        if (d === l.source || d === l.target)
                            return l.similarity*0.4;
                        else
                            return l.similarity*0.05;
                    });
                }).on('mouseout', function() {
                    link.style('opacity', function(l) {
                        return l.similarity*0.05
                    });
                });


            var node = gnode.append("rect")
                .attr("class", "node")
                .attr("width", function(d) { return d.subject.length*5.5+5 })
                .attr("height", function(d) { return d.email_list.length*20 })
                .attr("style", function(d) {
                    return `fill: #ccc;
                            opacity: ${d.email_list.length*0.25};
                            `
                }).on("click", function(d,i) {
                    d3.select(this.parentNode).append("textArea")
                        .attr("width", d.subject.length*5.5+5)
                        .attr("height", d.phrase_user.length*20 )
                        .attr("x", 5).attr("y", 33)
                        .text(d.phrase_user)
                        .attr("x", 5).attr("y", 33)
                })

            var labels = gnode.append("text")
                .text(function(d) { return d.subject; })
                .attr("x", 5).attr("y", 13)
                .attr("class", "nodetext")

            function tick() {
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                gnode.attr("transform", function(d) {
                    return 'translate(' + [d.x, d.y] + ')';
                });
            }

            function dblclick(d) {
                d3.select(this).classed("fixed", d.fixed = false);
            }

            function dragstart(d) {
                d3.select(this).classed("fixed", d.fixed = true);
            }

            //let Layoutworker = new forceLayoutWebworker;
            //Layoutworker.postMessage(JSON.stringify(structuredData.data)); // Send data to our worker.
            //Layoutworker.onmessage = function (LayoutData) {
            //    var json = new Blob([JSON.stringify(LayoutData.data)], {type: "application/json"})
            //    filesaver.saveAs(json, "data.json")
            //    //var width = 1600,
            //    //    height = 1200;
            //    //var color = d3.scale.category20();
            //    //var svg = d3.select("body").append("svg")
            //    //    .attr("width", width)
            //    //    .attr("height", height);
            //    //var link = svg.selectAll(".link")
            //    //    .data(mes.data.links)
            //    //    .enter().append("line")
            //    //    .attr("class", "link")
            //    //    .style("stroke-width", 1)
            //    //    .attr("x1", function (d) {
            //    //        return d.source.x;
            //    //    })
            //    //    .attr("y1", function (d) {
            //    //        return d.source.y;
            //    //    })
            //    //    .attr("x2", function (d) {
            //    //        return d.target.x;
            //    //    })
            //    //    .attr("y2", function (d) {
            //    //        return d.target.y;
            //    //    });
            //    //var node = svg.selectAll(".node")
            //    //    .data(mes.data.nodes)
            //    //    .enter().append("circle")
            //    //    .attr("class", "node")
            //    //    .attr("r", 2)
            //    //    .style("fill", function (d) {
            //    //        return color(d.group);
            //    //    }).attr("cx", function (d) {
            //    //        return d.x;
            //    //    })
            //    //    .attr("cy", function (d) {
            //    //        return d.y;
            //    //    });
            //};
        }
    })
}