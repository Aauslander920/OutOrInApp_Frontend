var app = angular.module("FoodApp", []);

app.controller('foodController', ['$http', function($http) {
  this.recipeGroup = [];
  this.categories = [];
  this.categoryRecipes = [];

  // function to pull all categories from rails API:
    $http({
      method: 'GET',
      url: 'http://localhost:3000/categories'
    }).then(function(response) {
      // console.log(response);
      // console.log(response.data);
      this.categories = response.data;
      console.log(this.categories);
    }.bind(this));

  // function to show all of that category's recipes:
  this.showRecipesByCategory = function(index) {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/categories/' + this.categories[index].id + '/recipes'
    }).then(function(response) {
      console.log(response.data);
      this.categoryRecipes = response.data;
    }.bind(this));
  }

  this.key = '4674c93fb8691a3cc6c841773dc368e4';
  this.searchTerm = '';

  // Function to populate results from API:
  this.query = function() {
    this.searchTerm = this.searchTerm.toLowerCase();

    // // get all categories:
    // $http({
    //   method: 'GET',
    //   url: 'http://localhost:3000/categories'
    // }).then(function(response) {
    //   this.categories = response.data;
    // }.bind(this));

    // check if category list already includes current search term:
    function isUnique (term, index, array) {
      term == this.categories[index].name
    } // looking for false here

    if (this.categories.every(isUnique)) {
      $http({
        method: 'POST',
        url: 'http://localhost:3000/categories',
        data: {
          name: this.searchTerm
        }
        }).then(function(response) {
          console.log(response);
          categoryId = response.data.id;
        }.bind(this));

        // get recipes from API:
        $http({
          method: 'GET',
          url: 'http://food2fork.com/api/search?key=' + this.key + '&q=' + this.searchTerm
        }).then(function(response) {
          // console.log(response.data);
          // console.log(response.data.recipes);
          this.recipeGroup = response.data.recipes.map(function (recipeObj) {
            var rObj = {};
            rObj['name'] = recipeObj.title;
            rObj['img_url'] = recipeObj.image_url;
            rObj['url'] = recipeObj.source_url;
            rObj['category_id'] = categoryId;
            return rObj;
          });
          // console.log(this.recipeGroup);
          // this returns a maximum of 30 recipes; could put in a shuffle function to shuffle the array and display in random order instead of same order every time?
        }.bind(this));
    } else {

    }

  } /////////// END this.query function


    // Yelp API call here
    // $http({
    //   method: 'GET',
    //   url: "https://api.yelp.com/v3/businesses/search?term=" + this.searchTerm + "&location=" + this.location +  "&categories=restaurants&sort_by=distance",
    //   headers: {
    //     'authorization': 'Bearer kxeNhjKVOho4QTBNr0mSGwdtCKGZTmW-PgvVQpjMkrNIucjw3uN63VJWg8GxX6j4DsI4Xn1oaWKQO-HzJBFQJzu0-XUzIeNZqv8ghhER5m_IQFCs3NjWF3ST6QWOWHYx',
    //     'Access-Control-Allow-Origin' : '*',
    //     'Access-Control-Allow-Headers' : '*',
    //     'Access-Control-Allow-Methods' : 'OPTIONS'
    //   },
    // }).then(function(response) {
    //   console.log(response.data);
    //   console.log(response.data.places);
    //   this.placeData = response.data.places;
    // }.bind(this));

  // Function to add a recipe to the db:
  this.addRecipe = function(index) {
    $http({
      method: 'POST',
      url: 'http://localhost:3000/categories/' + this.recipeGroup[index].category_id + '/recipes',
      data: { recipe: this.recipeGroup[index] }
    }).then(function(response) {
      console.log('adding recipe');
      console.log(response);
    }.bind(this));
  }

  // Function to delete recipe:
  this.deleteRecipe = function(index) {
    $http({
      method: 'DELETE',
      url: 'http://localhost:3000/categories/' + this.categoryRecipes[index].category_id + '/recipes/' + this.categoryRecipes[index].id
    }).then(function(response) {
      console.log('deleting recipe');
    }.bind(this));
  }

  // Function to edit a category:
  this.editCategory = function(index) {
    $http({
      method: 'PUT',
      url: 'http://localhost:3000/categories/' + this.categories[index].id,
      data: {
        name: this.editCategoryData.name,
        description: this.editCategoryData.description
      }
    }).then(function(response) {
      console.log('editing category');
      console.log(response.data);
    }.bind(this));
  }

}]); // end app controller
