var app=angular.module("demoiamgeup",['ui.router']);
app.config(function($stateProvider, $urlRouterProvider)
{
	$urlRouterProvider.otherwise('/indexer');
	$stateProvider
	.state('indexer',
	{
		url:'/indexer',
		templateUrl: 'templates/indexer.html',
		controller: 'indexercontrol'	
	}).state('getImages',
	{
		url:'/getimages',
		controller:'getimagecontroll'
	})
})
app.controller("getimagecontroll",function($scope,$http,$parse)
{
	
})
app.controller("indexercontrol",function($scope,$http,$state,$parse){
	$http.get("/info").success(function(data){
		$scope.info=data;
	});
		var incr=1;
	$scope.sendToServer=function()
	{
		incr++;
		var data={
			mydata:{
				value1:$scope.forSend,
				value2:$scope.forSend,
				storename:"fromangularrt"+incr
			}
		}
		console.log($scope.forSend)
		$http.post("/textdata",data).success(function(data){
			$scope.serverfiles=data;
		}).error(function(data){
			console.log(data)
		})
	}
	$scope.buttonClicked=function()
	{
		$http.get("/typedval").success(function(data)
		{
			$scope.myValue=data;
		})
	}
	 $scope.uploadFile = function(){
        var file = $scope.myFile;
         var fd = new FormData();// for make multipart/form data to send to node
        fd.append('file', file);
        console.log('file is ' );
        console.log($scope.myFile);
        $http.post("/fileUpload", fd, {
            headers: {'Content-Type': undefined}
        })
        .success(function(data){
        	console.log("server recieved data is : "+data)
        })
        .error(function(){
        });
    }
    $scope.GetFiles=function()
    {
		$http.get("/getimages").success(function(data){
			$scope.imager=$parse(data);
		}).error(function(data){
			console.log(data)
		})
	}
});
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);//check the file is currect format
            var modelSetter = model.assign;//assign to scope variable
            element.bind('change', function(){// listen the element get changes
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);// send the file properties to modelSetter
                    var reader = new FileReader();
                     reader.onload = function(){
     				 var dataURL = reader.result;
	 				 scope.imager=dataURL;
	 				 scope.$apply();
    };reader.readAsDataURL(element[0].files[0]);
                });
            });
        }
    };
}]);


