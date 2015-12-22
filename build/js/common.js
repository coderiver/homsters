$(document).ready(function() {

	if ( $('.l-preloader').length ) {
		if (window.preloaderSetting == 'first') {
			$('.l-section').first().queryLoader2({
				percentage: true
			});

			$('.l-section').first().imagesLoaded(function() {
				$('.l-preloader-counter').text('100%');
				$('.l-preloader-bar').stop().animate({
					'height': '100%'
				}, 200);
				window.setTimeout(function() {
					$('.l-preloader' ).animate({height: 0}, 300, function() {
						$('.l-preloader').remove();
						$('#qLimageContainer').remove();
					});
				}, 200);
			});
		} else {
			$('body').queryLoader2({
				percentage: true
			});

			$(window).load(function() {
				$('.l-preloader-counter').text('100%');
				$('.l-preloader-bar').stop().animate({
					'height': '100%'
				}, 200);
				window.setTimeout(function() {
					$('.l-preloader' ).animate({height: 0}, 300, function() {
						$('.l-preloader').remove();
						$('#qLimageContainer').remove();
					});
				}, 200);
			});
		}
	}

	var resizeTimer = null,
		scrollInit = false;

		window.resizeHandler = function() {
			var body = $('body'),
				header = $('.l-header'),
				firstSection = $('.l-section').first(),
				headerTop = 0,
				scrollOffsetTolerance = 0,
				H = $(window).height() - 0,// Browser window height
				W = $(window).width() - 0,// Browser window width
				h = window.headerHeight = header.height() - 0,// header height, calculated depending on window width
				hh,
				f = $('.l-footer').height() - 0;// footer height, affects .l-main bottom margin

			$('.l-main').css('margin-bottom', f + 'px');

			firstSection.css({'height': ''});
			hh = firstSection.height() - 0;

			if (body.hasClass('headerpos_top')) {
				if (body.hasClass('hometype_fullscreen')) {
					firstSection.css({'height': Math.max((H - h), hh) + 'px'});
				}
				if (body.hasClass('headertype_sticky')) {
					firstSection.css({'margin-top': h + 'px'});
				}
			}

			header.css('top', headerTop + 'px');

			if (body.hasClass('headertype_sticky')) {
				scrollOffsetTolerance = h - 1;
			}

			var linkScroll = function(event, link) {
				event.preventDefault();
				event.stopPropagation();

				$('html, body').animate({
					scrollTop: $(link.hash).offset().top - scrollOffsetTolerance + 'px'
				}, {
					duration: 800
				});
			};

			$('a[class="w-logo-link"][href="#"]').off('click').click(function(event) {
				event.preventDefault();
				event.stopPropagation();
				$('html, body').animate({
					scrollTop: 0
				}, {
					duration: 800
				});
			});

			$('a[class="w-toplink"]').off('click').click(function(event) {
				event.preventDefault();
				event.stopPropagation();
				$('html, body').animate({
					scrollTop: 0
				}, {
					duration: 800
				});
			});

			$('a[href^="#"][href!="#"]').off('click').die('click').live('click', function(event) {
				linkScroll(event, this);
			});

			if (scrollInit == false && document.location.hash && $(document.location.hash).length) {
				scrollInit = true;

				$('html, body').animate({
					scrollTop: $(document.location.hash).offset().top - scrollOffsetTolerance + 'px'
				}, {
					duration: 800
				});
			}

			$('.l-header .w-nav').each(function() {
				var nav = $(this),
					navControl = nav.find('.w-nav-control'),
					navList = nav.find('.w-nav-list.level_1'),
					navSubLists = navList.find('.w-nav-item.with_sublevel .w-nav-list'),
					navAnchors = nav.find('.w-nav-anchor'),
					navRunning = false,
					mobileNavWidth = 1023;

				if (window.mobileNavWidth !== undefined) {
					mobileNavWidth = window.mobileNavWidth - 0;
				}

				if (W <= mobileNavWidth) {
					var listOpen = false,
						navSubControls = navList.find('.w-nav-item.with_sublevel .w-nav-hint');

					if (! nav.hasClass('touch_enabled')) {
						nav.addClass('touch_enabled');
						navList.css({display: 'none'});
						navSubLists.css({display: 'none'});
					}

					navControl.off('click').click(function() {
						if (! navRunning) {
							navRunning = true;
							if (listOpen) {
								navList.slideUp(250, function() {
									navRunning = false;
								});
								listOpen = false;
							} else {
								navList.slideDown(250, function() {
									navRunning = false;
								});
								listOpen = true;
							}
						}
					});

					navSubControls.off('click').click(function() {
						if (! navRunning) {
							navRunning = true;
							var subList = $(this).closest('.w-nav-item-h').find('.w-nav-list').first(),
								subListOpen = subList.data('subListOpen'),
								currentNavItem = $(this).closest('.w-nav-item');

							if (subListOpen) {
								subList.slideUp(250, function() {
									navRunning = false;
									currentNavItem.removeClass('open');
								});
								subListOpen = false;
							} else {
								subList.slideDown(250, function() {
									navRunning = false;
									currentNavItem.addClass('open');
								});
								subListOpen = true;
							}

							subList.data('subListOpen', subListOpen);
						}

						return false;
					});

					navAnchors.click(function() {
						if (W <= mobileNavWidth) {
							navRunning = true;
							navList.slideUp(250, function() {
								navRunning = false;
							});
							listOpen = false;
						}
					});

				} else {
					nav.removeClass('touch_enabled');
					nav.find('.w-nav-item').removeClass('open');
					navList.css({height: '', display: ''});
					navSubLists.css({height: '', display: ''});
					navControl.off('click');

				}
			});

			var scrollTimer = false,
				scrollHandler = function() {
					var scrollPosition	= parseInt($(window).scrollTop(), 10);

					if (scrollPosition >= H) {
						$('.w-toplink').addClass('active');
					} else {
						$('.w-toplink').removeClass('active');
					}

					if (body.hasClass('headertype_sticky') && (body.hasClass('headerpos_bottom') || body.hasClass('headerpos_outside'))) {
						if (scrollPosition > headerTop) {
							header.css({ position: 'fixed', top: 0});
						} else {
							header.css({ position: '', top: headerTop});
						}

					}


					// Move trough each menu and check its position with scroll position then add current class
					$('.w-nav-item a[href^=#]').each(function() {
						var thisHref = $(this).attr('href');

						if ($(thisHref).length) {
							var thisTruePosition = parseInt($(thisHref).offset().top, 10),
								thisPosition = thisTruePosition - h;

							if(scrollPosition >= thisPosition) {
								$('.w-nav-item a[href^=#]').parent().parent().removeClass('active');
								$('.w-nav-item a[href=' + thisHref + ']').parent().parent().addClass('active');
							}
						}
					});


					//If we're at the bottom of the page, move pointer to the lal-section-hst section
					var bottomPage	= parseInt($(document).height(), 10) - parseInt($(window).height(), 10);

					if(scrollPosition === bottomPage || scrollPosition >= bottomPage) {
						var thisHref = $('.w-nav-item a[href^=#]:last').attr('href');
						if ($(thisHref).length) {
							$('.w-nav-item a[href^=#]').parent().parent().removeClass('active');
							$('.w-nav-item a[href^=#]:last').parent().parent().addClass('active');
						}
					}
				};

			window.clearTimeout(scrollTimer);
			scrollHandler();

			$(window).scroll(function() {
				window.clearTimeout(scrollTimer);
				scrollTimer = window.setTimeout(function() {
					scrollHandler();
				}, 10);
			});

		};

		window.resizeHandler();

		$(window).resize(function() {
			window.clearTimeout(resizeTimer);
			resizeTimer = window.setTimeout(function() {
				window.resizeHandler();
			}, 50);
		});

});