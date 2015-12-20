
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

export function topoLayoutEngine () {
        return {
            preProcess: function(raw, cb) {
                var data = {}
                this.processPosData(data, cb);
            },
            processPosData: function(data, cb, width, height) {
                var force, i, n, that
                that = this;
                force = d3.layout.force().nodes(data.nodes).links(data.links)
                    .charge(-4800).linkDistance(120)
                    .size([width, height]).gravity(0.25).on('tick', function(a) {
                    if (a.alpha < 0.036) {
                        force.nodes().forEach(function(o, i) {
                            o.x = o.x * 1.5 - 350;
                            return o.y = o.y * 0.6 + 30;
                        });
                        force.nodes().forEach(function(o, i) {
                            if (o.x < 30) {
                                o.x = 50;
                            }
                            if (o.x > (width - 250)) {
                                o.x = width - 250;
                            }
                            if (o.y < 30) {
                                o.y = 50;
                            }
                            if (o.y > (height - 150)) {
                                return o.y = height - 150;
                            }
                        });
                        that.finalize(force.nodes(), force.links(), cb);
                        force.stop();
                    }
                });
                n = 100;
                force.start();
                i = 0;
                while (i < n) {
                    force.tick();
                    ++i;
                }
                force.stop();
            },
            finalize: function(nodes_w_pos, links_w_pos, cb) {
                var data;
                data = {
                    nodes: nodes_w_pos,
                    links: links_w_pos
                };
                return cb(data);
            }
        };
    }
