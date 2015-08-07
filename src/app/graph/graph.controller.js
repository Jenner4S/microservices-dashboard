(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .controller('GraphController', GraphController);

  /** @ngInject */
  function GraphController($scope, $filter, GraphService) {
    var vm = this;
    var graph, layout, zoom, nodes, links, nodeData;

    var margin = {top: 20, right: 0, bottom: 20, left: 0},
      width = window.innerWidth - margin.right - margin.left,
      height = window.innerHeight - margin.top - margin.bottom;

    var linkedByIndex = {};

    var graphWidth, graphHeight;

    var data;

    GraphService.getGraph().then(function (result) {
      data = result.data;
      render();
    });

    function render() {
      height -= d3.select("#navigation-container")[0][0].offsetHeight;
      height -= d3.select("#control-bar")[0][0].offsetHeight;
      height -= d3.select("#footer-container")[0][0].offsetHeight;


      graph = d3.select("#graphcontainer").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      layout = d3.layout.force()
        .size([width, height]);

      renderGraph(data);
    }

    function renderGraph(data) {
      var laneLength = data.lanes.length;
      var verticalNodeSpace = 70;

      var uiCounter = 0;
      var epCounter = 0;
      var microCounter = 0;
      var dbCounter = 0;

      // Scales
      var x = d3.scale.linear()
        .domain([margin.right, margin.right + width])
        .range([0, width]);

      var x1 = d3.scale.linear()
        .domain([0, laneLength])
        .range([margin.left, width]);

      var y1 = d3.scale.linear()
        .range([0, height]);

      //Update data
      for (var i = 0; i < data.nodes.length; i++) {
        var node = data.nodes[i];
        node.index = i;
        node.x = x1(node.lane + 0.5);
        switch (node.lane) {
          case 0:
            uiCounter++;
            node.y = verticalNodeSpace * uiCounter + 50;
            break;
          case 1:
            epCounter++;
            node.y = verticalNodeSpace * epCounter + 50;
            break;
          case 2:
            microCounter++;
            node.y = verticalNodeSpace * microCounter + 50;
            break;
          case 3:
            dbCounter++;
            node.y = verticalNodeSpace * dbCounter + 50;
            break;
        }

        data.links.forEach(function(d) {
          if (d.source === node.index) {
            d.source = node;
          }
          if (d.target ===  node.index) {
            d.target = node;
          }
        })
      }

      //Labels
      graph.append("svg:g")
        .selectAll(".label")
        .data(data.lanes)
        .enter()
        .append("svg:text")
        .text(function (d) {
          return d.type;
        })
        .attr("x", function (d, i) {
          return x1(i + 0.5);
        })
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "22");

      // Markers
      graph.append("svg:defs")
        .selectAll("marker")
        .data(['regular'])                //Joins the specified array of data with the current selection.The specified values is an array of data values
        .enter()                            //Returns the enter selection: placeholder nodes for each data element for which no corresponding existing DOM element was found in the current selection.
        .append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");


      links = graph.append('svg:g')
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .on("click", onLinkMouseDown)
        .attr("class", "link")
        .attr("x1", function (l) {
          var sourceNode = data.nodes.filter(function (d, i) {
            return i == l.source.index
          })[0];
          d3.select(this).attr("y1", sourceNode.y);
          return sourceNode.x;
        })
        .attr("x2", function (l) {
          var targetNode = data.nodes.filter(function (d, i) {
            return i == l.target.index
          })[0];
          d3.select(this).attr("y2", targetNode.y);
          return targetNode.x;
        })
        .attr("stroke", "black");

      // Nodes
      nodes = graph.append('svg:g')
        .selectAll("node")
        .data(data.nodes)
        .enter()
        .append("svg:g")
        .attr("class", "node")
        .call(layout.drag)
        .on("mousedown", onNodeMouseDown);

      // Circles
      nodes.attr("id", function (d) {
        return formatClassName('node', d)
      });
      nodes.append("svg:circle")
        .attr("class", function (d) {
          return formatClassName('circle', d)
        })
        .attr("r", 12)
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        })
        .on("mouseover", _.bind(onNodeMouseOver, this, nodes, links))
        .on("mouseout", _.bind(onNodeMouseOut, this, nodes, links))
        .style("fill", function (o) {
          return fillColor(o)
        });

      // A copy of the text with a thick white stroke for legibility.
      nodes.append("svg:text")
        .attr("x", function (d) {
          return x1(d.lane + 0.5);
        })
        .attr("y", function (d) {
          return d.y + 25;
        })
        .attr("class", function (d) {
          return 'shadow ' + formatClassName('text', d)
        }).text(function (d) {
          return d.id;
        })
        .attr("text-anchor", "middle");

      nodes.append("svg:text")
        .attr("class", function (d) {
          return formatClassName('text', d)
        })
        .attr("x", function (d) {
          return x1(d.lane + 0.5);
        })
        .attr("y", function (d) {
          return d.y + 25;
        })
        .text(function (d) {
          return d.id;
        })
        .attr("text-anchor", "middle");

      //Lanes
      graph.append("svg:g")
        .selectAll(".lane")
        .data(data.lanes)
        .enter()
        .append("svg:line")
        .attr("class", "lane")
        .attr("x1", function (d) {
          return x1(d.lane);
        })
        .attr("x2", function (d) {
          return x1(d.lane);
        })
        .attr("y1", margin.top)
        .attr("y2", height);

      // Build linked index
      data.
        links
        .forEach(function (d) {
          linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });

      // Resize
      resize();

    }

    function resize() {
      graphWidth = window.innerWidth;
      graphHeight = window.innerHeight;
      graph.attr("width", graphWidth).attr("height", graphHeight);

      layout.size([graphWidth, graphHeight]).resume();
    }

    // Helpers
    function formatClassName(prefix, object) {
      return prefix + '-' + object.id.replace(/(\.|\/)/gi, '-');
    }

    function formatLinkNameByIndex(prefix, object) {
      return prefix + '-' + object.source + '-' + object.target;
    }

    function formatLinkNameByObject(prefix, object) {
      return prefix + '-' + object.source.index + '-' + object.target.index;
    }

    function findElementByNode(prefix, node) {
      var selector = '.' + formatClassName(prefix, node);
      return graph.select(selector);
    }

    function findElementByLink(prefix, link) {
      var selector = '#' + formatLinkNameByObject(prefix, link);
      return graph.select(selector);
    }

    function isConnected(a, b) {
      /*return linkedByIndex[a.index + "," + b.index]
        || linkedByIndex[b.index + "," + a.index]
        || a.index == b.index;*/
      if (a.index === b.index) {
        return true;
      }
      var connected = false;
      data.links.forEach(function(d) {
        if ((d.source === a && d.target === b) || (d.source === b && d.target === a)) {
          connected = true;
        }
      });
      return connected;
    }

    function fadeRelatedNodes(d, opacity, nodes, links) {

      //TODO: fix JQuery
      // Clean
      //$('path.link').removeAttr('data-show');

      nodes.style("stroke-opacity", function (o) {

        var thisOpacity;
        if (isConnected(d, o)) {
          thisOpacity = 1;
        } else {
          thisOpacity = opacity;
        }

        this.setAttribute('fill-opacity', thisOpacity);
        this.setAttribute('stroke-opacity', thisOpacity);

        if (thisOpacity == 1) {
          this.classList.remove('dimmed');
        } else {
          this.classList.add('dimmed');
        }

        return thisOpacity;
      });

      links.style("stroke-opacity", function (o) {
        if (o.source === d || o.target === d) {

          // Highlight target/sources of the link
          var elmNodes = graph.selectAll('.'
            + formatClassName('node', o.target));
          elmNodes.attr('fill-opacity', 1);
          elmNodes.attr('stroke-opacity', 1);

          elmNodes.classed('dimmed', false);

          //TODO: fix JQuery
          // Highlight arrows
          //var elmCurrentLink = $('path.link[data-source='
          //  + o.source.index + ']');
          //elmCurrentLink.attr('data-show', true);
          //elmCurrentLink.attr('marker-end', 'url(#regular)');

          return 1;

        } else {

          //TODO: fix JQuery
          /*var elmAllLinks = $('path.link:not([data-show])');

          if (opacity == 1) {
            elmAllLinks.attr('marker-end', 'url(#regular)');
          } else {
            elmAllLinks.attr('marker-end', '');
          }*/

          return opacity;
        }

      });
    }

    function fillColor(o) {
      if (o.details != undefined) {
        switch (o.details.type) {
          case "SOAP":
          {
            return "yellow";
          }
          case "REST":
          {
            return "lightblue";
          }
          case "MICROSERVICE":
          {
            return "red";
          }
          case "DB":
          {
            return "green";
          }
          default:
          {
            return "#fff";
          }
        }
      }

    }

    function showTheDetails(node) {
      var singleNode = $filter('filter')(nodes, function (d) {
        return d.id === node.id
      });
      if (singleNode != undefined) {
        $scope.currentNode = singleNode[0];
        $scope.$apply();
      }
    }

    /*
    Mouse events
     */

    function onNodeMouseOver(nodes, links, d) {

      if ($scope.editLinksMode) {

      } else {
        // Highlight circle
        var elm = findElementByNode('circle', d);
        elm.style("fill", '#b94431');

        // Highlight related nodes
        fadeRelatedNodes(d, .05, nodes, links);
      }
    }

    function onNodeMouseOut(nodes, links, d) {

      // Highlight circle
      var elm = findElementByNode('circle', d);
      elm.style("fill", function (o) {
        return fillColor(o)
      });

      // Highlight related nodes
      fadeRelatedNodes(d, 1, nodes, links);
    }

    function onLinkMouseDown(d) {
      if ($scope.editLinksMode) {
        var elm = findElementByLink('link', d);
        console.log(elm);
        elm.remove();

        var i = nodeData.links.indexOf(d);
        if (i != -1) {
          nodeData.links.splice(i, 1);
        }
        $scope.resetGraph(nodeData);
      }
    }

    function onNodeMouseDown(d) {
      if ($scope.editLinksMode) {
        var elm = findElementByNode('circle', d);
        elm.style("stroke", "red");
        if (selectedNodes.length === 0) {
          selectedNodes.push(d);
        } else {
          if (d !== selectedNodes[0]) {
            selectedNodes.push(d);
            connectNodes();
          }
        }
      } else {
        d.fixed = true;
        d3.select(this).classed("sticky", true);
        showTheDetails(d);
      }
    }


    //var treeData = [
    //  {
    //    "name": "Top Level",
    //    "parent": "null",
    //    "children": [
    //      {
    //        "name": "Level 2: A",
    //        "parent": "Top Level",
    //        "children": [
    //          {
    //            "name": "Son of A",
    //            "parent": "Level 2: A"
    //          },
    //          {
    //            "name": "Daughter of A",
    //            "parent": "Level 2: A",
    //            "children": [
    //              {
    //                "name": "Son of Daughter of A",
    //                "parent": "Daughter of A"
    //              },
    //              {
    //                "name": "Daughter of Daughter of A",
    //                "parent": "Daughter of A"
    //              }
    //            ]
    //          }
    //        ]
    //      },
    //      {
    //        "name": "Level 2: D",
    //        "parent": "Top Level"
    //      },
    //      {
    //        "name": "Level 2: C",
    //        "parent": "Top Level",
    //        "children": [
    //          {
    //            "name": "Son of C",
    //            "parent": "Level 2: C"
    //          },
    //          {
    //            "name": "Daughter of C",
    //            "parent": "Level 2: C"
    //          }
    //        ]
    //      },
    //      {
    //        "name": "Level 2: B",
    //        "parent": "Top Level"
    //      }
    //    ]
    //  }
    //];
    //
    //
    // ************** Generate the tree diagram	 *****************

    //var i = 0,
    //  duration = 750,
    //  root;
    //
    //var tree = d3.layout.tree()
    //  .size([height, width]);
    //
    //var diagonal = d3.svg.diagonal()
    //  .projection(function (d) {
    //    return [d.y, d.x];
    //  });
    //
    //var svg = d3.select("#graphcontainer").append("svg")
    //  .attr("width", width + margin.right + margin.left)
    //  .attr("height", height + margin.top + margin.bottom)
    //  .append("g")
    //  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //
    //root = treeData[0];
    //root.x0 = height / 2;
    //root.y0 = 0;
    //
    //update(root);
    //
    //d3.select(self.frameElement).style("height", "500px");
    //
    //function update(source) {
    //
    //  // Compute the new tree layout.
    //  var nodes = tree.nodes(root).reverse(),
    //    links = tree.links(nodes);
    //
    //  // Normalize for fixed-depth.
    //  nodes.forEach(function (d) {
    //    d.y = d.depth * 180;
    //  });
    //
    //  // Update the nodes…
    //  var node = svg.selectAll("g.node")
    //    .data(nodes, function (d) {
    //      return d.id || (d.id = ++i);
    //    });
    //
    //  // Enter any new nodes at the parent's previous position.
    //  var nodeEnter = node.enter().append("g")
    //    .attr("class", "node")
    //    .attr("transform", function (d) {
    //      return "translate(" + source.y0 + "," + source.x0 + ")";
    //    })
    //    .on("click", click);
    //
    //  nodeEnter.append("circle")
    //    .attr("r", 1e-6)
    //    .style("fill", function (d) {
    //      return d._children ? "lightsteelblue" : "#fff";
    //    });
    //
    //  nodeEnter.append("text")
    //    .attr("x", function (d) {
    //      return d.children || d._children ? -13 : 13;
    //    })
    //    .attr("dy", ".35em")
    //    .attr("text-anchor", function (d) {
    //      return d.children || d._children ? "end" : "start";
    //    })
    //    .text(function (d) {
    //      return d.name;
    //    })
    //    .style("fill-opacity", 1e-6);
    //
    //  // Transition nodes to their new position.
    //  var nodeUpdate = node.transition()
    //    .duration(duration)
    //    .attr("transform", function (d) {
    //      return "translate(" + d.y + "," + d.x + ")";
    //    });
    //
    //  nodeUpdate.select("circle")
    //    .attr("r", 10)
    //    .style("fill", function (d) {
    //      return d._children ? "lightsteelblue" : "#fff";
    //    });
    //
    //  nodeUpdate.select("text")
    //    .style("fill-opacity", 1);
    //
    //  // Transition exiting nodes to the parent's new position.
    //  var nodeExit = node.exit().transition()
    //    .duration(duration)
    //    .attr("transform", function (d) {
    //      return "translate(" + source.y + "," + source.x + ")";
    //    })
    //    .remove();
    //
    //  nodeExit.select("circle")
    //    .attr("r", 1e-6);
    //
    //  nodeExit.select("text")
    //    .style("fill-opacity", 1e-6);
    //
    //  // Update the links…
    //  var link = svg.selectAll("path.link")
    //    .data(links, function (d) {
    //      return d.target.id;
    //    });
    //
    //  // Enter any new links at the parent's previous position.
    //  link.enter().insert("path", "g")
    //    .attr("class", "link")
    //    .attr("d", function (d) {
    //      var o = {x: source.x0, y: source.y0};
    //      return diagonal({source: o, target: o});
    //    });
    //
    //  // Transition links to their new position.
    //  link.transition()
    //    .duration(duration)
    //    .attr("d", diagonal);
    //
    //  // Transition exiting nodes to the parent's new position.
    //  link.exit().transition()
    //    .duration(duration)
    //    .attr("d", function (d) {
    //      var o = {x: source.x, y: source.y};
    //      return diagonal({source: o, target: o});
    //    })
    //    .remove();
    //
    //  // Stash the old positions for transition.
    //  nodes.forEach(function (d) {
    //    d.x0 = d.x;
    //    d.y0 = d.y;
    //  });
    //}
    //
    //// Toggle children on click.
    //function click(d) {
    //  if (d.children) {
    //    d._children = d.children;
    //    d.children = null;
    //  } else {
    //    d.children = d._children;
    //    d._children = null;
    //  }
    //  update(d);
    //}

  }

})();