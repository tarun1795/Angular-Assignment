angular.module('myApp', ['ngRoute'])
    .controller('editEmpController', function ($scope, $rootScope, $routeParams, employee) {
        $scope.empId;
        $scope.emp;
        $scope.empId = $routeParams.id;
        //returns array of 1 employee which is selected
        $scope.emp = $rootScope.employees.filter(function (e) {
            return e.id == $scope.empId;
        });
        $scope.updateEmployee = function () {
            var e = {
                "id": $scope.emp[0].id,
                "name": $scope.emp[0].name,
                "email": $scope.emp[0].email,
                "phone": $scope.emp[0].phone,
                "address": $scope.emp[0].address
            }
            // console.log(e);
            employee.updateEmp(e).then(function (status) {
                if (status == 204) {
                    alert("Employee Updated");
                }
            });
        }
    })
    .controller('addEmployeeController', function ($scope, $rootScope, employee) {
        $scope.name;
        $scope.email;
        $scope.phone;
        $scope.addr;
        $scope.addEmployee = function () {
            //TODO erase this .. comes here till now
            console.log($scope.name);
            var emp = {
                "name": $scope.name,
                "email": $scope.email,
                "phone": $scope.phone,
                "address": $scope.addr
            }
            employee.addEmpl(emp).then(function (status) {
                if (status == 204) {
                    $rootScope.employees.push(emp);
                    alert("Employee Added");
                }
            })
        }
    })
    .controller('employeeController', function ($scope, $rootScope, $location, employee) {
        $rootScope.employees;
        $scope.onEdit = function (id) {
            $location.path('/editEmployee/' + id)
        }
        $scope.delet = function (id) {
            employee.deleteEmployee(id).then(function (data) {
                if (data) {
                    $rootScope.employees = $rootScope.employees.filter(function (e) {
                        return e.id != id;
                    })
                }
            })
        }
        $scope.emp = employee.getEmployeeList().then(function (data) {
            $rootScope.employees = data;
        });


    })
    .service('employee', ['$http', function ($http) {

        this.updateEmp = function (e) {
            //console.log(e);
            return $http({
                    url: 'http://localhost/CRUDEmployeeRest/webapi/employee/' + e.id,
                    method: "PUT",
                    data: e
                })
                .then(function (response) {
                        return response.status;
                    },
                    function (response) { // optional
                        alert("Error: " + response)
                    });
        }
        this.addEmpl = function (emp) {
            return $http({
                    url: 'http://localhost/CRUDEmployeeRest/webapi/employee',
                    method: "POST",
                    data: emp
                })
                .then(function (response) {
                        return response.status;
                    },
                    function (response) { // optional
                        alert("Error: " + response)
                    });
        }
        this.getEmployeeList = function () {
            return $http.get("http://localhost/CRUDEmployeeRest/webapi/employee/")
                .then(function (response) {
                    return response.data;
                });
        }

        this.deleteEmployee = function (id) {
            return $http.delete("http://localhost/CRUDEmployeeRest/webapi/employee/" + id)
                .then(function (response) {
                    if (response.status == 204) {
                        return true;
                    }
                });
        }
    }])
    .config(function ($routeProvider, $locationProvider) {
        console.log("config");
        $routeProvider
            .when('/employeeList', {
                templateUrl: '/EmployeeList.html'
                // controller: 'BookController' 
            })
            .when('/addEmploye', {
                templateUrl: '/AddEmploye.html',
                controller: 'addEmployeeController'
            })
            .when('/editEmployee/:id', {
                templateUrl: '/editEmployee.html',
                controller: 'editEmpController'
            })
        $locationProvider.html5Mode(true);
    })