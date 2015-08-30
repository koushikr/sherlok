
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

var pictureDict = {
    "Samsung_Galaxy_S6": {
        "price": 36000,
        "image_name": "./img/products/samsung.png"
    },
    "Dell_Latitude_3540": {
        "price": 58000,
        "image_name": "./img/products/dell_laptop.png"
    },
    "Seagate_2TB_Hard_drive": {
        "price": 12000,
        "image_name": "./img/products/seagate.png"
    },
    "Nikon_D7100_DSLR_Camera": {
        "price": 80000,
        "image_name": "./img/products/nikon.png"
    },
    "Micromax_LED_TV": {
        "price": 40000,
        "image_name": "./img/products/micromax_tv.png"
    },
    "Lenovo_Yoga_Tablet_Laptop": {
        "price": 25000,
        "image_name": "./img/products/lenovo_laptop.png"
    }
}

var states = ['Samsung Galaxy S6', 'Dell Latitude 3540', 'Seagate 2TB Hard drive', 'Nikon D7100 DSLR Camera',
'Micromax LED TV', 'Lenovo Yoga Tablet Laptop'
];

$('#the-basics .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'states',
  source: substringMatcher(states)
}).on('typeahead:selected', function(obj, datum){
    var clone = datum;
    datum=datum.replace(/ /g,"_");
    $('#product-info').removeClass('hidden');
    $('.product-container').removeClass('hidden');
    $('#'+datum).removeClass('hidden');
    $('#selectedProduct').val(datum);
    $('#product-text-value').html(clone);
    console.log(pictureDict);
    $('.product-position').attr('src', pictureDict[datum].image_name);
    $('.number').html(pictureDict[datum].price);
    updateSlider(pictureDict, datum);
});


var updateSlider = function(pictureDict, datum){
    var $element = $('input[id="customer-price-range"]');
    $element.attr({
        min: pictureDict[datum].price - 1000,
        max: pictureDict[datum].price + 1000,
        step: 100,
        value: pictureDict[datum].price - 1000
    });
    $element.rangeslider('update', true);
}


$(function() {
    var $element = $('input[id="customer-price-range"]');
    var $handle;

    $element.attr({
        min: 8000,
        max: 10000,
        step: 100,
        value: 9000
    });

    $element
      .rangeslider({
        polyfill: false,
        onInit: function() {
          $handle = $('.rangeslider__handle', this.$range);
          updateHandle($handle[0], this.value);
        }
      })
      .on('input', function() {
        updateHandle($handle[0], this.value);
      });

    function updateHandle(el, val) {
        $('#customer-price .number').html(val);
    }

});



