/**
* ui.xcodeMirror Module v1.0.0
*
* Integrates codeMirror and AngularJs, syncronizing ngModel and codeMirror values 
*/
angular.module('ui.xcodeMirror', []).directive('xcodeMirror', xcodeMirrorDirective);

function xcodeMirrorDirective ( $timeout ){
	// Runs during compile
	return {
		scope: {
			exec: "=",
			options: "=?"
		},
		controller: function($scope, $element, $attrs, $transclude) {

			//init options default
			if(!$scope.options){
				$scope.options = {
					mode : "text/xml",
	    			htmlMode: true,
					lineNumbers: true,
					theme: "monokai",
				};
			}

		},
		require: '?ngModel',
		restrict: 'EA',
		template: '<textarea id="xcodeMirror"></textarea>',
		replace: false,
		link: function($scope, iElm, iAttrs, ngModel) {

			// the codeMirror instance var
			$scope.xcodeMirror = null;
			
			// watch the model changes
			$scope.$watch(function(){
				return ngModel.$modelValue;
			}, function(newValue, oldValue){
				if($scope.code != ngModel.$modelValue){
					$scope.code = ngModel.$modelValue;
				}
			});

			// destroy and initialize the codeMirror instance when called
			var exec = function(){

				// clean the watcher on $scope.code
				if($scope.listenerCode)
					$scope.listenerCode();

				// destroy the codeMirror instance if exists
				if($scope.xcodeMirror){
					var elmEditor = $scope.xcodeMirror.getWrapperElement();
					elmEditor.parentElement.removeChild(elmEditor);
					elmEditor = null;
				}

				// initialize a codeMirror instance and monitoring changes on both, on codeMirror and on the model
				$timeout(function(){

					// codeMirror init
					$scope.xcodeMirror = CodeMirror.fromTextArea(document.getElementById('xcodeMirror'), $scope.options);

					// apply the codeMirror changes to the model and sync the $scope.code value
					$scope.xcodeMirror.on('change', function(){
						$scope.code = $scope.xcodeMirror.getValue();
						ngModel.$setViewValue($scope.code);
					});

					// $scope.code is the link between model and codeMirror value
					// On external changes on the model, it updates the codeMirror value
					$scope.listenerCode = $scope.$watch('code', function(newValue, oldValue){
						if(newValue && newValue != $scope.xcodeMirror.getValue())
							$scope.xcodeMirror.setValue(newValue);
					});

				}, 0);
				
			};

			// executes every time the $scope.exec is updated
			$scope.$watch('exec', function (newValue, oldValue) {
				exec();
			});

		}
	};
}