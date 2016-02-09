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

function generateData() {
	var symbol = {
		price: '12',
		high: '',
		low: '',
		open: ''
	};
	symbol.price = Math.floor( Math.random() * 7 );
	symbol.open = symbol.price;
	symbol.high = symbol.price;
	symbol.low = symbol.price;
	setInterval(function(){
		$('.lower .high p').text(symbol.open);
		var change = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * .50);
		console.log(change);
		symbol.price = symbol.price + change;
		console.log(symbol.price);
		$("#results>p").text("price: " + symbol.price);

		if(symbol.price < symbol.low){
			symbol.low = symbol.price;
			$('.lower .low p').text(symbol.low);
		}
		else if(symbol.price > symbol.high){
			symbol.high = symbol.price;
			$('.upper .high p').text(symbol.high);
		}
		else if(symbol.price > symbol.open){
			$('.candlestick').addClass('pos');
			$('.candlestick').removeClass('neg');
		}
		else if(symbol.price < symbol.open){
			$('.candlestick').addClass('neg');
			$('.candlestick').removeClass('pos');
		}
		else if(symbol.price == symbol.open){
			$('.candlestick').removeClass('neg');
			$('.candlestick').removeClass('pos');
		}

	},2000);
	
}
generateData();