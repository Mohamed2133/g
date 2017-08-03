angular.module("myModule", []);

angular.module("myModule").constant("rootUrl", {
    order: "http://localhost:4121/talabat/order",
    restaurant: "http://localhost:4140/talabat/restaurant",
    orderToken: "http://localhost:4121/api/token",
    restaurantToken:"http://localhost:4140/api/token"
});

angular.module("myModule")
    .controller("orderController", ["$scope", "$http", "rootUrl", function ($scope, $http, rootUrl) {

        $scope.list = [
             {
                key: 1,
                value: "KFC"
            },
             {
                key: 2,
                value: "SFC Plus"
             },
             {
                 key: 3,
                 value: "Zaatar W Aktar"
             },
             {
                 key: 4,
                 value: "Burger King"
             }
        ]

        $scope.submit = function () {
            $scope.order = {
                ResturantId: $scope.restaurant.key,
                Item: $scope.item,
                ResturantName: $scope.restaurant.value,
                Quantity: $scope.quantity
            };
            if (validate()) {

                $http.post(rootUrl.orderToken, { name: "admin", password: "admin" })
                    .then(function (obj) {
                        let auth = obj.data;
                        let token = 'bearer ' + auth.token;
                        $http.post(rootUrl.order + "/create", $scope.order,
                            {
                                headers: {
                                    'Authorization': token
                                }
                            })
                            .then(function (obj) {
                                console.log(obj);
                            },
                            function (error) {
                                console.log(error);
                            });
                    }, function (error) {
                        console.log(error);
                    });
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

            $http.post(rootUrl.restaurantToken, { name: "admin", password: "admin" })
                .then(function (obj) {
                    let auth = obj.data;
                    let token = 'bearer ' + auth.token;
                    $http.get(rootUrl.restaurant,
                        {
                            headers: {
                                'Authorization': token
                            }
                        }).then(function (obj) {
                            $scope.restOrder = obj.data.filter(function (el) {
                                return el.status === 0;
                            });
                            console.log(obj.data);
                        }, function (error) {
                            console.log(error);
                        });
                }, function (error) {
                    console.log(error);
                });
        };
        getRestaurat();


        $scope.accept = function (resturant) {
            //accepted order
            resturant.status = 1;
            let val = resturant;
            $http.post(rootUrl.restaurantToken, { name: "admin", password: "admin" })
                .then(function (obj) {
                    let auth = obj.data;
                    let token = 'bearer ' + auth.token;
                    $http.put(rootUrl.restaurant, resturant, {
                        headers: {
                            'Authorization': token
                        }
                    }).then(function (obj)
                    {
                        console.log(obj.data);
                        getRestaurat();
                    }, function (error) {
                        console.log(error);
                    });
                }, function (error) {
                    console.log(error);
                });
        };
        $scope.reject = function (resturant) {
            //rejected oreder
            resturant.status = 2;
            let val = resturant;
            $http.post(rootUrl.restaurantToken, { name: "admin", password: "admin" })
                .then(function (obj) {
                    let auth = obj.data;
                    let token = 'bearer ' + auth.token;
                    $http.delete(rootUrl.restaurant + "/" + resturant.orderId,
                        {
                            headers: {
                                'Authorization': token
                            }
                        }).then(function (obj)
                        {
                            console.log(obj.data);
                            getRestaurat();
                        }, function (error)
                        {
                            console.log(error);
                        });
                }, function (error) {
                    console.log(error);
                });
        };

    }]);