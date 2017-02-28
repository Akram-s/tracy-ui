var tracy = {
    greet: function(){
        alert("Hello from the tracy library.");
    },

    arrayToTree: function(data){
        // Convert array of Tracy events into a nested object tree
        // create a optId: node map
        var dataMap = data.reduce(function(map, node) {
        	map[node.optId] = node;
        	return map;
        }, {});

        // create the tree array
        var treeData = [];
        data.forEach(function(node) {
        	// add to parent
        	var parent = dataMap[node.parentOptId];
        	if (parent) {
        		// create child array if it doesn't exist
        		(parent.children || (parent.children = []))
        			// add node to child array
        			.push(node);
        	} else {
        		// parent is null or missing
        		treeData.push(node);
        	}
        });
        return treeData[0];
    },

    treeToArray: function(tree, options){
        // Options supported:
        // - maxDepth (0 for no limit)
        // - optIdExpanded: object with optIdExpanded status
        // childFlag
        // expandedFlag
        var nodes = [];
        var maxDepth = 0;
        if (options.hasOwnProperty('maxDepth'))   {
            maxDepth = options.maxDepth;
        }

        function traverse(node, depth) {
//          console.log("saw: " + node.component + " : " + node.label);
          node._depth = depth;
          nodes.push(node);
          if (node.children ) {
            node._hasChildren = true;
            if (    maxDepth == 0
                    || (depth < maxDepth && options.optIdExpanded[node.optId]==true)
                    || (depth < maxDepth && !options.optIdExpanded.hasOwnProperty(node.optId))
                    || options.optIdExpanded[node.optId])   {
                node.children.forEach(function(child) {
                  node._isExpanded = true;
    //              child.parent = node;
                  traverse(child, depth + 1);
                  delete node.children;
                });
            }
            else  {
                node._isExpanded = false;
            }
          }
          else {
            node._hasChildren = false;
          }
        }
        traverse(tree, 1);
//        console.log(nodes);
        return nodes;
    },

    humanTimeFromMsec: function(msec)	{
    	var time;
    	var milliseconds, seconds, minutes, hours, days;
    	var secondsRem, minutesRem, hoursRem, daysRem;
    	var dayInMs = 24*60*60*1000;
    	var secsInMs = 1000;
    	var minInMs = 60000;
    	var hoursInMs = 3600000;
    	// less than 1 second
    	if (msec <secsInMs)	{
    		time = msec + "ms";
    	}
    	// less than 1 minute
    	if (msec > secsInMs && msec < minInMs)	{
    		seconds = Math.floor(msec/secsInMs);
    		secondsRem = msec % secsInMs
    		milliseconds = secondsRem;
    		time = seconds + "s" + " " + milliseconds + "ms";
    	}
    	// less than 1 hour
    	if (msec >= minInMs && msec < hoursInMs)	{
    		minutes = Math.floor(msec / minInMs);
    		minutesRem = msec % minInMs;
    		seconds = Math.floor(minutesRem/secsInMs);
    		secondsRem = minutesRem%secsInMs;
    		milliseconds = secondsRem;
    		time =
       minutes + "m"
       + " " + seconds + "s";
     }
    	// less than 1 day
    	if (msec >= hoursInMs && msec < dayInMs)	{
    		hours = Math.floor(msec / hoursInMs);
    		hoursRem = msec % hoursInMs;
    		minutes = Math.floor(hoursRem / minInMs);
    		time =
       hours + "h"
       + " " + minutes + "m";
     }
      // more than 1 day
      if (msec > dayInMs)  {
        days = Math.floor(msec / dayInMs);
        daysRem = msec % dayInMs;
        hours = Math.floor(daysRem / hoursInMs);
        hoursRem = daysRem % hoursInMs;
        minutes = Math.floor(hoursRem / minInMs);
        time =
        days + "d"
        + " " + hours + "h"
        + " " + minutes + "m";
      }
      return time;
    },

    truncateTextMiddle: function(text, targetSize){
        var result;
        var length = text.length;
        if (length>targetSize)    {
            var start = text.substring(0, targetSize/2-1);
            var end = text.substring(length-targetSize/2, length);
            result = start + "..." + end;
        }
        else {
            result = text;
        }
//        console.log(result);
        return result;
    }
}

