angular
    .module('tracy-ui')
    .controller('D3TimelineController', D3TimelineController);

D3TimelineController.$inject =
    ['$scope', '$stateParams', '$element', '$uibModal'];

function D3TimelineController ($scope, $stateParams, $element, $uibModal)  {
  $scope.application = $stateParams.application;
  $scope.task = $stateParams.task;
  $scope.environment = $stateParams.env;

  $scope.width = $element.prop('offsetWidth');
  $scope.height= $element.prop('offsetHeight');
  $scope.optIdExpanded = {};

//  console.log($scope.height);

  $scope.data = [];

  // see Modal in https://angular-ui.github.io/bootstrap/
  $scope.openTracyViewerModal = function (data) {
    // Remove d3-timeline inserts
    delete data['children'];
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'tracy-core/tracy-modules/tracy-viewer/tracy-viewer.html',
      controller: 'TracyViewerController',
      controllerAs: '$ctrl',
      size: 'lg',
      resolve: {
        data: function () {
          return data;
        }
      }
    });
  }

  if ($scope.dataPromise)   {
//      console.log(JSON.stringify($scope.dataPromise));
      $scope.dataPromise.then(function(timelineData) {
//        console.log('Success: ' + JSON.stringify(timelineData));
//        console.log(timelineData);
        var tree = tracy.arrayToTree(timelineData);
//        console.log(JSON.stringify(tree));
        var data = tracy.treeToArray(tree,
            {
                maxDepth: 2,
                optIdExpanded: $scope.optIdExpanded
            });
//        console.log(data);
        $scope.data = data;
        draw(data);
      });
  }
  else  {
      // This branch allows for do integration testing using a file containing an array of Tracy objects
      var data = [];

      d3.json("tracy-core/tracy-modules/d3-timeline/tracyEvents.json", function(fileData) {
//      console.log(JSON.stringify(fileData));
        data = fileData.tracyEvents;
        var tree = tracy.arrayToTree(data);
//        console.log(JSON.stringify(tree));
        data = tracy.treeToArray(tree,
            {
                maxDepth: 2,
                optIdExpanded: $scope.optIdExpanded
            });
//        console.log(data);
        $scope.data = data;
        draw(data);
      });
   }

  // optId uniquely identifies a Tracy object belonging to a Task
  function key(d, i) {
    return d.optId;
  }

  var customPalette = d3.scale.ordinal().range(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]);

  function draw(data) {
      var numRows = data.length;
      var rectangleHeight = 20;
//      var color = d3.scale.category20();
      var color = customPalette;
      function label(d) {
          var label = {};
          // Rectangle > 50% of screen => label inside
          if (scale(d.msecAfter)-scale(d.msecBefore) > width/2) {
            label.x = scale(d.msecBefore) + 5;
            label.fill = "white";
            label.anchor = "start";
          }
          // Rectangle < 50% of screen, starting in left half => label right
          else if(scale(d.msecBefore) < width/2)
          {
            label.x = scale(d.msecAfter) + 5;
            label.fill = "black";
            label.anchor = "start";
          }
          // Rectangle < 50% of screen, starting in right half => label left
          else {
            // TODO: Offset to -10 if there is no expansion icon
            label.x = scale(d.msecBefore) - 25;
            label.fill = "black";
            label.anchor = "end";
          }
          label.truncatedText = tracy.truncateTextMiddle(d.label, 50);
          return label;
      }

      function axisAttributes(d) {
        // see https://github.com/d3/d3-3.x-api-reference/blob/master/Time-Formatting.md#format
        att = {};
        var timeFrame =
          d3.max(data, function(d) { return d.msecAfter; }) -
          d3.min(data, function(d) { return d.msecBefore; });
        if (timeFrame < 1000)   {
          att.format = '%S.%L';
        }
        else    {
//          att.format = '%I';
//          att.format = '%I %p';
          att.format = '';
        }
        return att;
      }

      function glyphicon(d)  {
        var g = "";
        if (d._hasChildren && d._isExpanded)  {
          $scope.optIdExpanded[d.optId] = true;
	      g = "control glyphicon glyphicon-triangle-bottom";
	    }
	    else if (d._hasChildren && d._isExpanded == false)  {
          $scope.optIdExpanded[d.optId] = false;
	      g = "control glyphicon glyphicon-triangle-right";

	    }
	    return g;
      }

      function click(d) {
        if ($scope.optIdExpanded[d.optId] ) {
//            console.log("Collapsing", d.component+":"+d.label);
        }
        else    {
//            console.log("Expanding", d.component+":"+d.label);
        }
        $scope.optIdExpanded[d.optId] = !$scope.optIdExpanded[d.optId] ;
//        console.log($scope.data);
        var tree = tracy.arrayToTree($scope.data);
        $scope.data = tracy.treeToArray(tree,
            {
                maxDepth: 2,
                optIdExpanded: $scope.optIdExpanded
            });

        draw($scope.data);
      }

      function totalMsecElapsed(d)  {
        msecElapsed = d3.max(data, function(d) { return d.msecAfter; })
                     - d3.min(data, function(d) { return d.msecBefore; })
//        console.log(msecElapsed);
        return msecElapsed;
      }

      var rect = true;
      var width = $scope.width;
      var height = numRows * rectangleHeight + 50;

//      console.log("drawing ... " + JSON.stringify(data[1]));

      //************************************************
      // Defining components
      //************************************************
      var tooltipEnter = d3.select('.timelion');
        tooltipEnter.attr("class", "timeline-tooltip")
        tooltipEnter.style("opacity", 0);

      var svg = d3.select('.timelion-svg');
          svg.attr("width", width)
          svg.attr("height", height);
      // Define x-scale (see http://tributary.io/inlet/8013159)
      var scale = d3.time.scale()
        .domain([
          d3.min(data, function(d) { return d.msecBefore; }),
          d3.max(data, function(d) { return d.msecAfter; })
        ])
        .range([20, width-20]);

      // Define x-axis (tick units depending on Task elapsed time)
      var axisAttributes = axisAttributes(data);
      var axis;
      if (totalMsecElapsed(data) > 3600000)  {
        // hours
        // tick per hour and no label (due to mis-alignment between axis and tooltip)
        axis = d3.svg.axis()
          .scale(scale)
          .orient('bottom')
          .ticks(d3.time.hour,1)
          .tickFormat(d3.time.format(axisAttributes.format));
      }
      else if (totalMsecElapsed(data) > 60000)  {
        // Minutes
        axis = d3.svg.axis()
          .scale(scale)
          .orient('bottom')
          .ticks(d3.time.minute,1)
          .tickFormat(d3.time.format(axisAttributes.format));
      }
      else  {
        // seconds/milliseconds (auto format axis)
        axis = d3.svg.axis()
          .scale(scale)
          .orient('bottom')
          .tickFormat(d3.time.format(axisAttributes.format));
      }


      // Add group
       var axisNode = svg.selectAll('.axis').data([1]);
       var axisNodeEnter = axisNode.enter().append('g')
         .attr('class', 'axis')
         .call(axis)
         .selectAll(".tick text")
         .style("font-size", 12)
         .style("text-anchor", "start")
         .attr("x", 6)
         .attr("y", 6);

       axisNode.exit().remove();

      var node = svg.selectAll('.node').data(data, key);
      var nodeEnter = node.enter().append("g");
      nodeEnter.attr('class', 'node');
      nodeEnter.append('foreignObject').append('xhtml:span');
      nodeEnter.append('rect');
      nodeEnter.append('line');
      nodeEnter.append('text');

      // Tooltip functionality
//      console.log(nodeEnter);
      var div = d3.select('.timeline-tooltip');
      var tooltipWidth = 500;
      node.on("mouseover", function(d,i) {
          var xpos = d3.event.pageX + 10;
          if (d3.event.pageX > width-tooltipWidth)    {
            xpos = width-tooltipWidth;
          }
//          console.log("mouseover: " + d.component + ">" + d.label + " -- div:" + div);
//          console.log(d3.event.pageX + ", " + i+2*rectangleHeight);
          div.transition()
              .duration(200)
              .style("opacity", .96);
          div	.html("<b>Component: </b>" + d.component
                      + "<br/>" + "<b>Label: </b>" + label(d).truncatedText
                      + "<br/>" + "<b>Time elapsed: </b>" + tracy.humanTimeFromMsec(d.msecElapsed)
                      + "<br/>" + "<b>Start: </b>" + new Date(d.msecBefore).toISOString()
                      + "<br/>" + "<b>End: </b>" + new Date(d.msecAfter).toISOString()
                      )
              .style("left", xpos + "px")
              .style("top", i*rectangleHeight+"px");
      })
      .on("mouseout", function(d) {
         div.transition()
           .duration(500)
           .style("opacity", 0);
      })

      //************************************************
      // Adding components
      //************************************************

      // Rectangle
      node.select('rect')
        .attr('x', function(d, i) { return scale(d.msecBefore); })
        .attr('y', function(d, i) { return (i+2)*rectangleHeight+1; })
        .attr('width', function(d, i) {
//            console.log("["+i+"] " + scale(d.msecBefore) + ":" + scale(d.msecAfter))
    //        var msecElapsed = d.msecAfter-d.msecBefore;
    //        console.log(d.label + ":" + msecElapsed.toString());
            return (scale(d.msecAfter)-scale(d.msecBefore));
        })
        .style('fill', function(d){ return d.optId=="root" ? 'Black': color(d.component);})
        .attr('height', "18")
        .on("click", function(d) {
            $scope.openTracyViewerModal(d);
        });

      // Separating horizontal line
      node.select('line')
        .style("stroke", "lightgray")
        .style("stroke-width", "0.5")
        .attr('x1', function(d, i) {return 0;} )
        .attr('x2', function(d, i) {return width;} )
        .attr('y1', function(d, i) {return (i+3)*rectangleHeight;} )
        .attr('y2', function(d, i) {return (i+3)*rectangleHeight;} );

      // Rectangle label
      node.select('text')
        .attr('dx', function(d) { return label(d).x; })
        .attr('dy', function(d, i) { return (i+2)*rectangleHeight+14; })
        .style('fill',function(d) { return label(d).fill; })
        .style('text-anchor', function(d) { return label(d).anchor; })
        .text(function(d) { return label(d).truncatedText + " (" +  tracy.humanTimeFromMsec(d.msecElapsed) + ")"});

      // Expanding/Collapsing icons (+/-)
      node.select('foreignObject')
        .attr('width', 20)
        .attr('height', 20)
        .attr('y', function(d, i) { return (i+2) * rectangleHeight; })
        .attr('x', function(d, i) { return scale(d.msecBefore) - 20; });
      node.select('span')
	    .attr('class', function(d) {
//	      console.log(d.label+":"+ d.label +" expanded = "+ d._isExpanded);
	      return glyphicon(d);
	    })
        .style('color','DarkGrey')
        .on('click', click);
        node.exit().remove();
    }
}
