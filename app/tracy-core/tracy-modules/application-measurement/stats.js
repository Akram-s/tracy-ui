'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('tracy-ui')
    .directive('stats',function() {
    	return {
  		templateUrl:'tracy-core/tracy-modules/application-measurement/stats.html',
  		restrict:'E',
  		replace:true,
  		scope: {
        info: '=info'
        // 'rttt': '@',
        // 'rttunit': '@',
        // 'apdexscore': '@'
        },
        link: function (scope, element) {
          // Resolve ADPDEX Rating, and score related shades
          if (scope.info.apdexScore >= 0.94) {
            scope.apdexRating = "EXCELLENT";
            scope.color = "blue";
            scope.apdexRatingShade = "primary";
          }
          else if (scope.info.apdexScore >= 0.85 && scope.info.apdexScore <= 0.93) {
            scope.apdexRating = "GOOD";
            scope.color = "green";
            scope.apdexRatingShade = "success";
          }
          else if (scope.info.apdexScore >= 0.70 && scope.info.apdexScore <= 0.84) {
            scope.apdexRating = "FAIR";
            scope.color = "orange";
            scope.apdexRatingShade = "warning";
          }
          else if (scope.info.apdexScore >= 0.50 && scope.info.apdexScore <= 0.69) {
            scope.apdexRating = "POOR";
            scope.color = "red";
            scope.apdexRatingShade = "danger";
          }
          else {
            scope.apdexRating = "UNACCEPTABLE";
            scope.color = "gray";
            scope.apdexRatingShade = "default";
          }

          // Response time shading
          //   mean
          if (scope.info.meanLatency < scope.info.rttT) {
            scope.meanLatencyShade = "success";
          }
          else if (scope.info.meanLatency >= scope.info.rttT && scope.info.meanLatency <= scope.info.rttF) {
            scope.meanLatencyShade = "warning";
          }
          else if (scope.info.meanLatency > scope.info.rttF) {
            scope.meanLatencyShade = "danger";
          }
          //   p50
          if (scope.info.p50Latency < scope.info.rttT) {
            scope.p50LatencyShade = "success";
          }
          else if (scope.info.p50Latency >= scope.info.rttT && scope.info.p50Latency <= scope.info.rttF) {
            scope.p50LatencyShade = "warning";
          }
          else if (scope.info.p50Latency > scope.info.rttF) {
            scope.p50LatencyShade = "danger";
          }
          //   p90
          if (scope.info.p90Latency < scope.info.rttT) {
            scope.p90LatencyShade = "success";
          }
          else if (scope.info.p90Latency >= scope.info.rttT && scope.info.p90Latency <= scope.info.rttF) {
            scope.p90LatencyShade = "warning";
          }
          else if (scope.info.p90Latency > scope.info.rttF) {
            scope.p90LatencyShade = "danger";
          }
          //   p95
          if (scope.info.p95Latency < scope.info.rttT) {
            scope.p95LatencyShade = "success";
          }
          else if (scope.info.p95Latency >= scope.info.rttT && scope.info.p95Latency <= scope.info.rttF) {
            scope.p95LatencyShade = "warning";
          }
          else if (scope.info.p95Latency > scope.info.rttF) {
            scope.p95LatencyShade = "danger";
          }
          //   p99
          if (scope.info.p99Latency < scope.info.rttT) {
            scope.p99LatencyShade = "success";
          }
          else if (scope.info.p99Latency >= scope.info.rttT && scope.info.p99Latency <= scope.info.rttF) {
            scope.p99LatencyShade = "warning";
          }
          else if (scope.info.p99Latency > scope.info.rttF) {
            scope.p99LatencyShade = "danger";
          }
        }
    }
  });
