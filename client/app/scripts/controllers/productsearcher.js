'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProductsearcherCtrl
 * @description
 * # ProductsearcherCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('ProductSearcherCtrl', 
              ['$scope', '$location', '$uibModal', 'Products', 'ServerData', 'Messages', 'Notifier',  
              function ($scope, $location, $uibModal, Products, ServerData, Messages, Notifier) {
    
    Products.getList().then(function(products) {      
      $scope.products = products;   
    }); 
   
        
    $scope.sampleBookSelected = 0; 
    $scope.shoppingCartSellings = [];
    
    $scope.modals = {
        sampleBook : false,
        sellingItem : false,
        productdetails : false, 
        background: false
    };
    
    $scope.serverData = ServerData;
    
    $scope.search = function(){
        Products.getList({tags:$scope.tags}).then(function(products) {
            $scope.products = products;
        });
    }    
    
    $scope.showSampleBook = function(product){
        var samplebookModal = $uibModal.open({
            templateUrl: '../../views/samplebook.html',
            controller: 'SamplebookCtrl',
            resolve: {
                product: function () {
                    return product;                                        
                }
            }
        });
    }

    $scope.getProductImageUrl = function(product) {
        return  $scope.serverData.urlImages + "/" + 
                product.category + "/" + 
                product.properties.type + "/" +
                product.name + "-M.jpg"
    }
    

    $scope.addProduct = function(product) {
        var addProductModal = $uibModal.open({
          templateUrl: '../../views/addingProduct.html',
          controller: 'AddingProductCtrl',
          resolve: {
            productName: function () {
              return product.name;
            }
          }
        });

        addProductModal.result.then(function (quantityToAdd) {
            product.quantity += quantityToAdd;
            product.save();

            Notifier({ 
                message: Messages.message012 + product.name + ' : ' + product.quantity,
                classes: 'alert-info'
            });                    
        });
    };

    $scope.showSellingItem = function(product) {
        var addingProductToCartModal = $uibModal.open({
          templateUrl: '../../views/sellingItem.html',
          controller: 'sellingItemCtrl',
          size:'lg',
          resolve: {
            sellingItem: function () {
                return {
                    product: product
                };
            }
          }
        });

        addingProductToCartModal.result.then(function(sellingItem) {
            if(!_.contains($scope.shoppingCartSellings, sellingItem)){           
                $scope.shoppingCartSellings.push(sellingItem);
            }
        }); 
    };            
    
    $scope.editProduct = function(productId){
        $location.path ("products/" + productId);
    }    
    
    $scope.windowTop = function(){
        window.scrollTo(0, 0);
    }
    
  }]);
