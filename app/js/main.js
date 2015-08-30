
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

var states = ['Samsung Galaxy S6', 'Dell Latitude 3540', 'Seagate Wireless Plus', 'Nikon D7100 DSLR Camera',
'Micromax Full HD LED Television', 'Lenovo Yoga 10 Tablet'
];

$('#the-basics .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'states',
  source: substringMatcher(states)
});



$(function() {
    var $element = $('input[type="range"]');
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


    var source   = $("#bid-result-template").html();
    var template = Handlebars.compile(source);
    var context = {bid_seller: "Pai Mobile", bid_price: "5500", bid_rating: "3.6", bid_duration: "45", bid_distance: "4.2"};
    var html    = template(context);

    console.log("html");
    console.log(html);

    $('#bid-container').append(html);
});



