//import d3 from "d3"\
import d3 from '!smash!../src/d3_custom.js'
onmessage = function(message) {
    function forceLayoutEngine (message) {
        var force = d3.layout.force().nodes(message.data.threads).links(message.data.links)
            .size([message.options.width, message.options.height])
            .charge(message.options.forceCharge)
            .gravity(message.options.forceGravity)
            .linkDistance(function(d) {
                return message.options.linkDistance/d.similarity
            }).on('tick', function(a) {
                let percentage = Math.round((1-(a.alpha-message.options.coolDownStop)/(0.099-message.options.coolDownStop))*100)

                if (percentage < 100) {

                    postMessage({
                        threads: force.nodes(),
                        links: force.links(),
                        percentage: percentage
                    })
                } else {
                    force.stop()
                    let nodes = force.nodes(), xs = [], ys = []
                    for (let node of nodes) {
                        let {x: x} = node
                        xs.push(x)
                        let {y: y} = node
                        ys.push(y)
                    }
                    postMessage({
                        threads: force.nodes(),
                        links: force.links(),
                        percentage: percentage,
                        maxX: Math.max(...xs),
                        maxY: Math.max(...ys),
                        minX: Math.min(...xs),
                        minY: Math.min(...ys)
                    })
                }
            });
        try {
            force.start();
            var i = 0;
            while (i < message.options.iterationN) {
                force.tick();
                ++i;
            }
        } catch (err) {
            force.stop();
        }

    }
    forceLayoutEngine(JSON.parse(message.data))
}