var loaded = false;
var data = {};

var app = {

	
	init: function() {
	
	
		$(window).scroll(function(e) {
			loaded = false;
			if ($(window).scrollTop() + $(window).height() + 60 >= $(document).height() && !loaded) {
				
				loaded = true;
				
				data.limit = 10;
				
				data.start = $('#offersList').find('.box-element').length;
				app.getItems(data);
				
				setTimeout(function() {
			       loaded = false;
		        }, 1000);
			
			}
			//console.log('from top:' + $(window).scrollTop());
		});
		
		$(window).resize(function(e) {
			width = $(window).width();
			if (width<630) {
				
				$('.box-element').addClass('last');
			
			} else if (width<966) {
				$('.box-element').removeClass('last');
				$('.box-element').each(function(i, item) {
					if (!((i+1) % 2))
						$(item).addClass('last');
				});
			} else {
				$('.box-element').removeClass('last');
				$('.box-element').each(function(i, item) {
					if (!((i+1) % 3))
						$(item).addClass('last');
				});
			}
		});
		
		app.initCategories();
		
		$('body').touchwipe({
			wipeLeft : function () {
				$('.menu-trigger').removeClass('active');
				$('#pageWrap').removeClass('active');
				$('#menuContent').removeClass('active');
				$('#menuContent').css('z-index', '-1');
			},
			wipeRight : function () {
				$('.menu-trigger').addClass('active');
				$('#pageWrap').addClass('active');
				$('#menuContent').addClass('active');
				setTimeout(function() {
					$('#menuContent').css('z-index', 0);
				}, 200);
			},
			//wipeUp: function() { alert("up"); },
			//wipeDown: function() { alert("down"); },
			min_move_x : 24,
			min_move_y : 24,
			preventDefaultEvents : false
		});
		
		$('.menu-trigger').click(function() {
			if ($('#pageWrap').hasClass('active')) {
				$(this).removeClass('active');
				$('#pageWrap').removeClass('active');
				$('#menuContent').removeClass('active');
				$('#menuContent').css('z-index', '-1');
			} else {
				$(this).addClass('active');
				$('#pageWrap').addClass('active');
				$('#menuContent').addClass('active');
				setTimeout(function() {
					$('#menuContent').css('z-index', 0);
				}, 200);
			}
		});
		
		data = {};
		data.start = 0;
		data.limit = 10;
		
		app.getItems(data);
		
		$('.top-form').unbind('submit');
		$('.top-form').submit(function(e) {
			e.preventDefault();
			
			data = {};
			data.start = 0;
			data.limit = 10;
			data.search = $('.top-form').find('input[type="text"]').val();
			
			app.getItems(data);
			
		});
		
		
	},
	
	initCategories: function() {
		$.get('http://projects.efley.ee/dealhouse/api.php?action=getCatCounts', {}, function(results) {
		
			$.each(results, function(name, count) {
				
				$('.' + name).find('strong').html(count);
				
			});
		
		}, 'jsonp');
		
		$('#menuContent').find('a').click(function(e) {
			e.preventDefault();
			category = $.trim($(this).attr('class').replace('active', ''));
			console.log(category);
			
			data = {};
			data.start = 0;
			data.limit = 10;
			data.category = category;
			
			app.getItems(data);
			
			$('.menu-trigger').removeClass('active');
			$('#pageWrap').removeClass('active');
			$('#menuContent').removeClass('active');
			$('#menuContent').css('z-index', '-1');
			
		});
		
	},
	
	showLoader: function() {
		//console.log('show IT: ' + line);
		$('.ajax-loader').css('height', $('body').height() + 'px');
		$('.ajax-loader').find('img').center();
		$('.ajax-loader').fadeIn();
	},
	
	
	getItems: function(data) {
	
		template = $('#offerTemplate');
	
		app.showLoader();
	
		$.get('http://projects.efley.ee/dealhouse/api.php?action=getOffers', data, function(results) {
			$.each(results, function(i,offer) {
			
				//if(i % 3)
			
				template.find('.box-element').attr('data-id', offer.id);
				template.find('.box-element').attr('data-link', offer.link);
				
				template.find('.box-element').attr('title', offer.name);
				
				template.find('.box-element').find('a').attr('href', offer.link).html('www.' + offer.partner + '.ee');
				
				template.find('.offer-description').html(offer.name);
				template.find('img').attr('src', offer.image);
				template.find('.sale-percent').html(offer.percent + '%');
				
				template.find('.sale-percent').removeClass('green').removeClass('red').removeClass('yellow');
				
				if(offer.percent < 50)
					template.find('.sale-percent').addClass('green');
				else if(offer.percent < 70)
					template.find('.sale-percent').addClass('yellow');
				else
					template.find('.sale-percent').addClass('red');
				
				template.find('.new-price').html(offer.price + '€');
				template.find('.old-price').html(offer.value + '€');
				
				$('#offersList').append(template.html());
				console.log(offer);
			});
			
			//image load time also..
			setTimeout(function() {
				$('.ajax-loader').fadeOut();
			}, 500);
			
			
			app.bindClick();
			
			$(window).resize();
		
		}, 'jsonp');
	},
	
	bindClick: function() {
		$('.box-element').unbind('click');
		$('.box-element').click(function(e) {
			e.preventDefault();
			window.open($(this).data('link'), '_blank');
			//$('.box-element').unbind('click');
			//$(this).find('a').click();
			//app.bindClick();
			
		});
		$('.like').unbind('click');
		$('.like').click(function(e) {
			e.preventDefault();
			e.stopPropagation();
			id = $(this).parent().data('id');
			app.toFavs(id);
		})
	},
	
	toFavs: function(id) {
	
		console.log('liked: ' + id);
		
	},
	
}

$(document).ready(function() {
	app.init();
})

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) - 80 + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) - 29 + 
                                                $(window).scrollLeft()) + "px");
    return this;
}