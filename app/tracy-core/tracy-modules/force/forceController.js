//TODO: Update tree.json content with a sample Tracy event Tree
//TODO: Try d3 tree diagram (toggle between)

angular
    .module('tracy-ui')
    .controller('ForceController', ForceController);

ForceController.$inject =
    ['$scope', '$stateParams'];

function ForceController ($scope, $stateParams)  {
  $scope.application = $stateParams.application;
  $scope.task = $stateParams.task;
  $scope.environment = $stateParams.env;

    var h = 500,
        w = 800,
        z = d3.scale.category20();

    var heatMap = d3.scale.linear()
      .domain([0, 0.1, 0.2])
      .range(["black", "orange","red"]);

    var force = d3.layout.force()
        .charge(-200)
        .linkDistance(10)
        .gravity(0.05)
        .size([w, h]);

    var graph1 = d3.select(".graph1").append("svg")
        .attr("width", w)
        .attr("height", h);


    d3.json("tracy-core/tracy-modules/force/tree.json", function(root) {
      var nodes = flatten(root),
          links = d3.layout.tree().links(nodes); // <-B
//      console.log(root);
//      console.log(nodes);

      force
          .nodes(nodes)
          .links(links)
          .start();

      var link = graph1.selectAll("line")
          .data(links)
        .enter().insert("line")
          .style("stroke", "#999")
          .style("stroke-width", "1px");

        var node = graph1.selectAll("node")
              .data(nodes)
            .enter().append('g')
            .classed('node', true)
          .call(force.drag);

          node.append("circle")
              .attr("r", 10)
              .style("fill", function(d) {
                return heatMap(d.bottleneckRatio);
//                return z(d.depth);
              })
              .append("title")
              .text(function(d) { return d.name; })

          node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .style("fill", function(d) { return heatMap(d.bottleneckRatio);})
            .text(function(d) { return d.name })

            // Uncomment section below to place node depth inside circle
//          node.append("text")
//            .attr("text-anchor","middle")
//            .attr("dy", ".35em")
//            .text(function(d) { return d.depth })
//            .style("fill","white")

      force.on("tick", function(e) {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return 'translate(' + [d.x, d.y] + ')'; });
      });
    });

    function flatten(root) { // <-A
      // make makeFixedDepthLevel higher for fixed location nodes
      var makeFixedDepthLevel = 0;
      var nodes = [];
      var childNum=0;
      var y = 0;
      function traverse(node, depth, index) {
        if (node.children) {
          node.children.forEach(function(child, index) {
            child.parent = node;
            traverse(child, depth + 1, index);
          });
        }
        else    {
            node.bottleneckRatio = node.msecElapsed/root.msecElapsed;
            node.name = node.name + " ("+Math.round(node.bottleneckRatio*100)+"%)";
        }
        node.depth = depth;
        if (depth<=makeFixedDepthLevel)    {
          node.x = 10 + (depth-1) * 160
//          node.y = 10 + (index * 20) + ((depth-1)*10)
          node.y = y*12;
          node.fixed = true;
          node.name = node.name + "("+node.x+","+node.y+")";
          y++;
        }
        nodes.push(node);
      }
      traverse(root, 1, 0);
      return nodes;
    }
}