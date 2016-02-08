'use strict';

console.log( 'Javascript.' );

function getData() {
    var url = "http://query.yahooapis.com/v1/public/yql";
    var symbol = 'gpro';
    var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + symbol + "')");

    $.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env")
        .done(function (data) {
        $("#results>p").text("price: " + data.query.results.quote.LastTradePriceOnly);
        console.log(data.query.results);
    })
        .fail(function (jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
            $("#results>p").text('Request failed: ' + err);
    });
}
getData();
// setInterval(function(){
// 	getData();
// },1000)