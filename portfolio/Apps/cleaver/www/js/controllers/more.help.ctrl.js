angular.module('cleverbaby.controllers')
    .controller('MoreHelpCtrl', ['$scope', '$timeout', '$state', '$stateParams',
        function($scope, $timeout, $state, $stateParams) {

        	$scope.hasTopic = $stateParams.helpId ? true : false;
        	$scope.topic = {
        		title: 'How do I Sign In?',
        		text:
        			'<div>You can either Sign In with your Facebook or Google Account or create an account with Clever Baby.</div>' +
        			'<div>To create and sign in with your Clever Baby account follow these steps:</div>' + 
        			'<ol><li>1) xxxx </li><li>2) xxxx </li><li>3) xxxx </li> </ul>' +
    				'<div>To sign in with your Facebook or Google Account follow these steps:</div>' +
    				'<ol><li>1) xxxx </li><li>2) xxxx </li><li>3) xxxx </li> </ul>'
        	}

            $scope.goHelp = function (id) {
        		$state.go('app.help', { helpId: id });
            };

        }
    ]);
