angular.module("myModule", []);

angular.module("myModule").constant("rootUrl", {
    order: "http://localhost:4121/talabat/order",
    restaurant: "http://localhost:4140/talabat/restaurant"
});

angular.module("myModule")
    .controller("orderController", ["$scope", "$http", "rootUrl", function ($scope, $http, rootUrl) {
        //$scope.pageName = "Talabat First Page";
        // Id 
        // OrderDetails 
        // Quantity 
        // Status 
        // ResturantId 
        $scope.submit = function () {
            $scope.order = {
                ResturantId: $scope.restaurant,
                OrderDetails: $scope.item,
                Quantity: $scope.quantity
            };
            if (validate()) {
                $http.post(rootUrl.order + "/create", $scope.order).then(
                    function (obj) {
                        console.log(obj);
                    },
                    function (error) {
                        console.log(error);
                    }
                );
            }
        };

        let validate = function () {
            if (($scope.order.ResturantId !== undefined || $scope.ResturantId !== null)
                && ($scope.order.OrderDetails !== undefined || $scope.order.OrderDetails !== null)
                && ($scope.order.Quantity !== undefined || $scope.Quantity !== null)) {
                return true;
            } else {
                return false;
            }
        };

    }]);

angular.module("myModule")
    .controller("restaurantController", ["$scope", "$http", "rootUrl", "$filter", function ($scope, $http, rootUrl, $filter) {
        let getRestaurat = function () {
            $http.get(rootUrl.restaurant)
                .then(function (obj) {
                    $scope.restOrder = obj.data.filter(function (el) {
                        return el.status == 0;
                    });
                    console.log(obj.data);
                }, function (error) {
                    console.log(error);
                });
        };
        getRestaurat();


        $scope.accept = function (resturant) {
            //accepted order
            resturant.status = 1;
            let val = resturant;
            $http.post(rootUrl, resturant).then(function (obj) {
                console.log(obj.data);
            }, function (error) {
                console.log(error);
                });
        };
        $scope.reject = function (resturant) {
            //rejected oreder
            resturant.status = 2;
            let val = resturant;
            $http.delete(rootUrl.restaurant + "/" + resturant.orderId).then(function (obj) {
                console.log(obj.data);
            }, function (error) {
                console.log(error);
                });
        }; 

    }]);