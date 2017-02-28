
angular
    .module('tracy-ui')
    .controller('TracyViewerController', TracyViewerController);

TracyViewerController.$inject =
    ['$uibModalInstance', 'data'];

function TracyViewerController ($uibModalInstance, data)  {
  var charLimit = 80;
  var $ctrl = this;
  $ctrl.data = data;
  $ctrl.truncatedData = {};

  for (var key in $ctrl.data) {
    if ($ctrl.data[key] === Object($ctrl.data[key])) {
        $ctrl.truncatedData[key] = JSON.stringify($ctrl.data[key]);
        $ctrl.truncatedData[key] = tracy.truncateTextMiddle($ctrl.truncatedData[key], charLimit);
    }
    else    {
        $ctrl.truncatedData[key] = tracy.truncateTextMiddle($ctrl.data[key], charLimit);
    }
  }

  $ctrl.hasMore = function() {
    $ctrl.urlForMore = $ctrl.data.t_providerUrl;
    return  $ctrl.data.hasOwnProperty('t_providerUrl');
  };

  $ctrl.ok = function () {
    $uibModalInstance.close();
  };
}

