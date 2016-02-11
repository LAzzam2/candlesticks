'use strict';

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

		if( symbol.price > symbol.open  ){
			$('.candlestick').addClass('pos');
			$('.candlestick').removeClass('neg');

			$('.upper .low p').text(symbol.price);
			$('.lower .high p').text(symbol.open);

			symbol.upperWick = (symbol.high - symbol.price) / symbol.spread;
			symbol.body = (symbol.price - symbol.open) / symbol.spread;
			symbol.lowerWick = (symbol.open - symbol.low) / symbol.spread;
			bgColor(symbol);
		}else if( symbol.price < symbol.open ){
			$('.candlestick').addClass('neg');
			$('.candlestick').removeClass('pos');

			$('.upper .low p').text(symbol.open);
			$('.lower .high p').text(symbol.price);

			symbol.upperWick = (symbol.high - symbol.open) / symbol.spread;
			symbol.body = (symbol.open - symbol.price) / symbol.spread;
			symbol.lowerWick = (symbol.price - symbol.low) / symbol.spread;
			bgColor(symbol);
		}else{
			$('.candlestick').removeClass('neg');
			$('.candlestick').removeClass('pos');

			$('.upper .low p').text(symbol.open);
			$('.lower .high p').text(symbol.price);
			bgColor(symbol);
		}
		
		$('.body').css('height',cHeight*symbol.body);
		$('.upper').css('height',cHeight*symbol.upperWick);
		$('.lower').css('height',cHeight*symbol.lowerWick);
		function bgColor(symbol){
			console.log( symbol.price, symbol.prevClose );
			if( parseInt(symbol.price) > parseInt(symbol.prevClose) ){
				$('body').addClass('pos');
				$('body').removeClass('neg');
			}else if( symbol.price < symbol.prevClose ){
				$('body').addClass('neg');
				$('body').removeClass('pos');
			}else{
				$('body').removeClass('neg');
				$('body').removeClass('pos');
			}
		}
    }	
}