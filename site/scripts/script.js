'use strict';

console.log( 'Javascript.' );

$(document).keypress(function(event) {
	$(".symbol-input").focus();
    if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode >= 97 && event.keyCode <= 122 ){
    	if(!$('#symbol-form').hasClass('active')){
    		$('#symbol-form').addClass('active');
    		$('.candlestick').addClass('muted');
    		$(".symbol-input").select();
    	}
    }
    else if(event.keyCode == 13) {
    	var inputSymbol = $(".symbol-input").val();
		generateData(inputSymbol);
    }
});

$(document).on('submit',function() { 
	return false;
});

function generateData(inputSymbol) {
	var url = "http://query.yahooapis.com/v1/public/yql";
    var symbol = inputSymbol;
    var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + symbol + "')");

    $.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env")
        .done(function (data) {
        $("#results>p").text("price: " + data.query.results.quote.LastTradePriceOnly);
        $('#symbol-form').removeClass('active');
        $('.candlestick').removeClass('muted');
        $('h1').text('$'+symbol);
    	$('#results').addClass('active');
        console.log(data.query.results);
        setItems(data);
    })
        .fail(function (jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
            $("#results>p").text('Request failed: ' + err);
    });

    function setItems(data){
    	var symbol = {
			price: data.query.results.quote.LastTradePriceOnly,
			high: data.query.results.quote.DaysHigh,
			low: data.query.results.quote.DaysLow,
			open: data.query.results.quote.Open,
			prevClose: data.query.results.quote.PreviousClose,
			upperWick: 0,
			lowerWick: 0,
			body: 0,
			spread: data.query.results.quote.DaysHigh - data.query.results.quote.DaysLow
		};

		$('.upper .high p').text(symbol.high);
		$('.lower .low p').text(symbol.low);

		var cHeight = window.innerHeight - (window.innerHeight*.40);

		if( symbol.price > symbol.prevClose  ){
			$('body').addClass('pos');
			$('body').removeClass('neg');

			$('.upper .low p').text(symbol.price);
			$('.lower .high p').text(symbol.prevClose);

			symbol.upperWick = (symbol.high - symbol.price) / symbol.spread;
			symbol.lowerWick = (symbol.prevClose - symbol.low) / symbol.spread;
			symbol.body = (symbol.price - symbol.prevClose) / symbol.spread;

			console.log(symbol);

		}else if( symbol.price < symbol.prevClose ){
			$('body').addClass('neg');
			$('body').removeClass('pos');

			$('.upper .low p').text(symbol.prevClose);
			$('.lower .high p').text(symbol.price);

			symbol.upperWick = (symbol.high - symbol.prevClose) / symbol.spread;
			symbol.lowerWick = (symbol.price - symbol.low) / symbol.spread;
			symbol.body = (symbol.prevClose - symbol.price) / symbol.spread;
			console.log(symbol);
		}else{
			$('body').removeClass('neg');
			$('body').removeClass('pos');

			$('.upper .low p').text(symbol.prevClose);
			$('.lower .high p').text(symbol.price);
		}
		$('.body').css('height',cHeight*symbol.body);
		$('.upper').css('height',cHeight*symbol.upperWick);
		$('.lower').css('height',cHeight*symbol.lowerWick);
    }	
}