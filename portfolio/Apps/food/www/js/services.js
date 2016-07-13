var app = angular.module('hoss_app.services', [])

app.factory('Cates', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var cates = [{
    id: 0,
	class: 'item-1',
	img: 'img/category/1.jpg',
    name: 'Breakfast',
    lastText: 'Enthusiastically architect.'
  }, {
    id: 1,
	class: 'item-2',
	img: 'img/category/2.jpg',
    name: 'Dinner',
    lastText: 'Enthusiastically architect.'
  }, {
    id: 2,
	class: 'item-3',
	img: 'img/category/3.jpg',
    name: 'Sweets',
    lastText: 'Enthusiastically architect.'
  }, {
    id: 3,
	class: 'item-4',
	img: 'img/category/4.jpg',
    name: 'Coffee',
    lastText: 'Enthusiastically architect.'
  }, {
    id: 4,
	class: 'item-5',
	img: 'img/category/5.jpg',
    name: 'Special drinks',
    lastText: 'Enthusiastically architect.'
  }];

  return {
    all: function() {
      return cates;
    },
    get: function(cateId) {
      for (var i = 0; i < cates.length; i++) {
        if (cates[i].id === parseInt(cateId)) {
          return cates[i];
        }
      }
      return null;
    }
  };
});

app.service('Products', function() {
	var products = [{
		id: 0,
        cateId: 0,
		img: 'img/product/thumb1.jpg',
		imgLg: 'img/product/1.jpg',
		name: 'BEET ROOT AND RED BEAN VEGAN BURGERS',
		price: '$10.00',
		like: '2145'
	  }, {
		id: 1,
        cateId: 0,
		img: 'img/product/thumb2.jpg',
        imgLg: 'img/product/2.jpg',
		name: 'FRESH STRAWBERRY CREAM',
		price: '$5.00',
		like: '738'
	  }, {
		id: 2,
        cateId: 0,
		img: 'img/product/thumb3.jpg',
        imgLg: 'img/product/3.jpg',
		name: 'VEGAN BURGER WITH FRESH VEGETABLES',
		price: '$24.00',
		like: '1029'
	  }, {
		id: 3,
        cateId: 0,
		img: 'img/product/thumb4.jpg',
        imgLg: 'img/product/4.jpg',
		name: 'FRESH BAKED PASTIES FILLED WITH MEAT AND VEGETABLES',
		price: '$7.00',
		like: '802'
	  }, {
		id: 4,
        cateId: 0,
		img: 'img/product/thumb5.jpg',
        imgLg: 'img/product/5.jpg',
		name: 'OMELETTE WITH ASPARAGUS',
		price: '$10.00',
		like: '218'
	  }, {
		id: 5,
        cateId: 0,
		img: 'img/product/thumb6.jpg',
        imgLg: 'img/product/6.jpg',
		name: 'BROWN RICE WITH GARLIC AND LIME',
		price: '$5.00',
		like: '738'
	  }, {
		id: 6,
        cateId: 0,
		img: 'img/product/thumb7.jpg',
        imgLg: 'img/product/7.jpg',
		name: 'OMELETTE WITH ASPARAGUS, BEANS AND THYME',
		price: '$24.00',
		like: '1029'
	  }, {
		id: 7,
        cateId: 1,
		img: 'img/product/thumb8.jpg',
        imgLg: 'img/product/8.jpg',
		name: 'FRIED MASHED POTATOES',
		price: '$24.00',
		like: '1029'
	  }, {
		id: 8,
        cateId: 1,
		img: 'img/product/thumb9.jpg',
        imgLg: 'img/product/9.jpg',
		name: 'CREAMY MUSHROOM SOUP',
		price: '$35.00',
		like: '342'
	  }, {
		id: 9,
        cateId: 1,
		img: 'img/product/thumb10.jpg',
        imgLg: 'img/product/10.jpg',
		name: 'TAGLIATELLE PASTA WITH SPINACH AND GREEN PEAS',
		price: '$39.00',
		like: '480'
	  }, {
		id: 10,
        cateId: 2,
		img: 'img/product/thumb11.jpg',
        imgLg: 'img/product/11.jpg',
		name: 'BLUEBERRY PANCAKE',
		price: '$15.00',
		like: '1291'
	  }, {
		id: 11,
        cateId: 2,
		img: 'img/product/thumb12.jpg',
        imgLg: 'img/product/12.jpg',
		name: 'HOMEMADE GRAPE PIE',
		price: '$12.00',
		like: '575'
	  }, {
		id: 12,
        cateId: 2,
		img: 'img/product/thumb13.jpg',
        imgLg: 'img/product/13.jpg',
		name: 'HOMEMADE PESTO',
		price: '$15.00',
		like: '583'
	  }, {
		id: 13,
        cateId: 2,
		img: 'img/product/thumb14.jpg',
        imgLg: 'img/product/14.jpg',
		name: 'BERRY SMOOTHIE',
		price: '$20.00',
		like: '120'
	  }, {
		id: 14,
        cateId: 2,
		img: 'img/product/thumb15.jpg',
        imgLg: 'img/product/15.jpg',
		name: 'FRESH OLIVES',
		price: '$10.00',
		like: '203'
	  }, {
		id: 15,
        cateId: 3,
		img: 'img/product/thumb16.jpg',
        imgLg: 'img/product/16.jpg',
		name: 'Latte Coffee',
		price: '$15.00',
		like: '163'
	  }, {
		id: 16,
        cateId: 3,
		img: 'img/product/thumb17.jpg',
        imgLg: 'img/product/17.jpg',
		name: 'Con Panna Coffee',
		price: '$20.00',
		like: '52'
	  }, {
		id: 17,
        cateId: 3,
		img: 'img/product/thumb18.jpg',
        imgLg: 'img/product/18.jpg',
		name: 'Iced Espresso Coffee',
		price: '$23.00',
		like: '232'
	  }, {
		id: 18,
        cateId: 3,
		img: 'img/product/thumb19.jpg',
        imgLg: 'img/product/19.jpg',
		name: 'Con Zucchero Coffee',
		price: '$20.00',
		like: '2323'
	  }, {
		id: 19,
        cateId: 3,
		img: 'img/product/thumb20.jpg',
        imgLg: 'img/product/20.jpg',
		name: 'Macchiato Coffee',
		price: '$26.00',
		like: '546'
	  }, {
		id: 20,
        cateId: 4,
		img: 'img/product/thumb21.jpg',
        imgLg: 'img/product/21.jpg',
		name: 'Beach Burn Cocktail',
		price: '$30.00',
		like: '964'
	  }, {
		id: 21,
        cateId: 4,
		img: 'img/product/thumb22.jpg',
        imgLg: 'img/product/22.jpg',
		name: 'Pink Cocktail - Cranberry Vodka Spritzer',
		price: '$12.00',
		like: '340'
	  }, {
		id: 22,
        cateId: 4,
		img: 'img/product/thumb23.jpg',
        imgLg: 'img/product/23.jpg',
		name: 'Zydeco Fiddle Cocktail',
		price: '$23.00',
		like: '332'
	  }, {
		id: 23,
        cateId: 4,
		img: 'img/product/thumb24.jpg',
        imgLg: 'img/product/24.jpg',
		name: 'Fever Pitch Cocktail',
		price: '$30.00',
		like: '492'
	  }];

	  return {
		all: function() {
		  return products;
		},
		get: function(productId) {
		  for (var i = 0; i < products.length; i++) {
			if (products[i].id === parseInt(productId)) {
			  return products[i];
			}
		  }
		  return null;
		},
		getByCate: function(cateId) {
          var product_cate = [];
		  for (var i = 0; i < products.length; i++) {
			if (products[i].cateId === parseInt(cateId)) {
                product_cate.push(products[i]);
			}
		  }
            return product_cate;
		}
	  };
	});
app.service('Carts', function() {
    var carts = [{
        id: 0,
        cateId: 0,
        img: 'img/product/thumb1.jpg',
        imgLg: 'img/product/1.jpg',
        name: 'BEET ROOT AND RED BEAN VEGAN BURGERS',
        price: '$10.00',
        qty: '3'
    }, {
        id: 8,
        cateId: 1,
        img: 'img/product/thumb9.jpg',
        imgLg: 'img/product/9.jpg',
        name: 'CREAMY MUSHROOM SOUP',
        price: '$35.00',
        qty: '4'
    }, {
        id: 13,
        cateId: 2,
        img: 'img/product/thumb14.jpg',
        imgLg: 'img/product/14.jpg',
        name: 'BERRY SMOOTHIE',
        price: '$20.00',
        qty: '2'
    }];

    return {
        all: function() {
            return carts;
        }
    };
});
