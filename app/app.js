angular.module('tracy-ui', ['ui.bootstrap','ui.router', 'ngStorage', 'ngResource', 'highcharts-ng', 'googlechart'])

	.config(function($stateProvider, $urlRouterProvider)
	{
        $urlRouterProvider.otherwise('/landing');
		$stateProvider
			.state('landing', {
				name: 'landing',
				url: '/landing',
				templateUrl: 'tracy-core/landing/landing.html'
			})

			.state('config', {
				name: 'config',
				url: '/config',
				templateUrl: 'tracy-core/config/config.html'
			})

			.state('task', {
				name: 'task',
				url: '/task?env&application&task&view',
				templateUrl: 'tracy-core/task/task.html'
			})

			.state('application', {
				name: 'application',
				url: '/application?env&application&view',
				templateUrl: 'tracy-core/application/application.html'
			})

            .state('timeline',{
                name: 'timeline',
                url:'/timeline/:sequenceId?env&application&task&earliest&latest&rtBelow&rtAbove',
                templateUrl:'tracy-core/tracy-modules/task-timeline/task-timeline.html'
            })
	});