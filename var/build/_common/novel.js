//- 小说内容
(function() {
	window.NOVEL = window.NOVEL || {};
	// 虚拟DOM及选择器
	NOVEL.DATA = {};
	NOVEL.DATA.windowH = $(window).height(),
	NOVEL.DATA.windowW = $(window).width();
	NOVEL.DATA.scroll_timeout = 100,
	NOVEL.DATA.soundState = true,
	NOVEL.DATA.$bg_wrp = $('.n-bg-wrp'),
	NOVEL.DATA.$out_bg = NOVEL.DATA.$bg_wrp.find('.n-bg-outer'),
	NOVEL.DATA.$in_bg = NOVEL.DATA.$bg_wrp.find('.n-bg-inner'),
	NOVEL.DATA.$bg_item = $('<div class="n-bg-item"></div>'),
	NOVEL.DATA.$content = $('.mainFrame').find('.n-container'), //- 盒子
	NOVEL.DATA.$audio_box = NOVEL.DATA.$content.find('.n-audio-box'), //- 音频
	NOVEL.DATA.$audio_mute = NOVEL.DATA.$content.find('.n-audio-mute'),
	NOVEL.DATA.anchor_last = '<div class="n-bg-anchor-last"></div>',//- 最后一个锚点
	NOVEL.DATA.br = '<p class="n-text-line"><br></p>',
	NOVEL.DATA.$btn_top = $('footer.foot-toolbar').find('.back-to-top'),
	NOVEL.DATA.$title = NOVEL.DATA.$content.find('h1'),
	NOVEL.DATA.$bg_anchor = NOVEL.DATA.$content.children('b'),
	NOVEL.DATA.$aside = NOVEL.DATA.$content.children('p'),
	NOVEL.DATA.$illustration = NOVEL.DATA.$content.children('img'),
	NOVEL.DATA.$dialogue = NOVEL.DATA.$content.children('dl'),
	NOVEL.DATA.$avatar = $('<img class="n-dialogue-avatar" src="">'),
	NOVEL.DATA.$audio_anchor = $('<div class="n-audio-anchor"></div>'),
	NOVEL.DATA.$dd_wrapper = $('<div class="n-dialogue-container clearfix"><div class="n-dialogue-box"></div></div>'),
	NOVEL.DATA.src_base = './_res/',
	NOVEL.DATA.$chapter = $('<div class="n-chapter"></div>');
	// 数据填充
	NOVEL.fillBase = function() {
			//- 封面
			// var _coverImg = $img.clone();
			// _coverImg.attr('src', playscript.cover);
			// NOVEL.DATA.$cover.append(_coverImg); //- 页面渲染
		//- 章节
			NOVEL.DATA.$title.addClass('h1 n-text n-align-center');
			NOVEL.DATA.$title.wrap(NOVEL.DATA.$chapter);
		//- 背景锚点
			var bgs = '';
			NOVEL.DATA.$bg_anchor.each(function(i, e) {
				var _this = $(this),
					src = _this.attr('tu'),
					_bg_item = NOVEL.DATA.$bg_item.clone();
				_bg_item.css({
					'backgroundColor': 'transparent',
					'backgroundImage': 'url(' + NOVEL.DATA.src_base + src + '.jpg)'
				});
				_bg_item.attr('tu', src);
				_this.attr('data-target', NOVEL.DATA.src_base + src + '.jpg');
				_this.addClass('n-bg-anchor');
				bgs += _bg_item[0].outerHTML;
			});
			if (NOVEL.DATA.windowW > 500) {
				NOVEL.DATA.$out_bg.append(bgs);
				NOVEL.DATA.$in_bg.append(bgs);
			} else {
				NOVEL.DATA.$out_bg.append(bgs);
			}
			//- 首个背景及锚点
			var _bg_item = NOVEL.DATA.$bg_item.clone(),
				_f_anchor = $('<b class="n-bg-anchor n-bg-anchor-first" data-target="black"></b>');
			_bg_item.css({
				'backgroundColor': 'black',
				'backgroundImage': 'none'
			});
			_bg_item.addClass('active');
			NOVEL.DATA.$out_bg.prepend(_bg_item.clone());
			NOVEL.DATA.$in_bg.prepend(_bg_item.clone());
			_f_anchor.attr('data-target', 'black');
			NOVEL.DATA.$content.prepend(_f_anchor);
			NOVEL.DATA.$content.append($(NOVEL.DATA.anchor_last));
		//- 旁白
			NOVEL.DATA.$aside.each(function(i, e) {
				var _this = $(this);
				_this.addClass('n-text');
				_this.after($(NOVEL.DATA.br + NOVEL.DATA.br));
			});
		//- 插图
			NOVEL.DATA.$illustration.each(function(i, e) {
				var _this = $(this),
					src = _this.attr('tu');
				_this.addClass('n-image');
				_this.attr('src', NOVEL.DATA.src_base + src + '.png');//插图和人物头像均为png格式
				_this.after($(NOVEL.DATA.br + NOVEL.DATA.br + NOVEL.DATA.br + NOVEL.DATA.br));
			});
		//- 对话
			NOVEL.DATA.$dialogue.each(function(i, e) {
				var _this = $(this),
					_dt = _this.children('dt'),
					_dd = _this.children('dd'),
					src_img = _dt.attr('tu'),
					src_audio = _dd.attr('yin'),
					_name = _dt.html(),
					isRight = false,//默认左方向
					hasAudio = _dd.attr('yin') == undefined ? false : true,
					_avatar = NOVEL.DATA.$avatar.clone(),
					_audio_anchor = NOVEL.DATA.$audio_anchor.clone();
				//方向
				if (character.direction[_name] !== undefined) {
					isRight = !!character.direction[_name];
				}
				//头像
				if (character.name[_name] !== undefined) {
					_avatar.attr('src', NOVEL.DATA.src_base + character.name[_name] + '.png');//插图和人物头像均为png格式
				} else if (_name.indexOf('男') >= 0) {
					_avatar.attr('src', NOVEL.DATA.src_base + 'nanz' + '.png');//男性头像
				} else if (_name.indexOf('女') >= 0) {
					_avatar.attr('src', NOVEL.DATA.src_base + 'nvz' + '.png');//女性头像
				} else {
					_avatar.attr('src', NOVEL.DATA.src_base + 'zhongx' + '.png');//中性头像
				}
				_dt.before(_avatar);
				if (isRight) {
					_this.addClass('n-dialogue n-dialogue-align-right');
				} else {
					_this.addClass('n-dialogue n-dialogue-align-left');
				}
				_dt.addClass('n-dialogue-name');
				
				if (hasAudio) {
					//音频
					_audio_anchor.attr('data-target', NOVEL.DATA.src_base + src_audio + '.mp3');//音频为MP3格式
					_audio_anchor.attr('data-firstplay', true);
					_dt.after(_audio_anchor);
				}
				_dd.addClass('n-dialogue-box-balloon-center').wrap(NOVEL.DATA.$dd_wrapper);
				_this.after($(NOVEL.DATA.br + NOVEL.DATA.br + NOVEL.DATA.br + NOVEL.DATA.br));
			});
		}
	NOVEL.fillBase();
	// 滚动到顶部
	NOVEL.scrollTop = function () {
		$('html,body').animate({
			scrollTop: 0
		}, 0);
		$(window).trigger('scroll');
	}
	NOVEL.DATA.$btn_top.on('click', NOVEL.scrollTop());
	// 音频播放
	HTMLAudioElement.prototype.stop = function() { 
		this.pause();
		this.currentTime = 0.0;
	};
	// 音频
	NOVEL.audio = function () {
		var _dialogue = NOVEL.DATA.$content.find('.n-dialogue'),
			_audio_anchor = _dialogue.find('.n-audio-anchor');
		_audio_anchor.each(function() {
			var _this = $(this);
			_this.parents('.n-dialogue').on('click', function() {
				var _audio_target = _this.data('target'),
					_audio_panel = NOVEL.DATA.$audio_box.find('audio').filter(function() {
						return $(this).attr('src') == _audio_target;
					});
				var _audio = NOVEL.DATA.$audio_box.find('audio'),
					_audio_info = _audio_target;
				if (!NOVEL.DATA.$audio_mute.hasClass('muted')) {
					if (_audio_panel.length) {
						if (!_audio_panel[0].paused) {
							//- console.log('playing');
						} else {
							NOVEL.DATA.$audio_box.find('audio').each(function() {
								$(this)[0].stop();
							});
							_audio_panel[0].play();
						}
					} else {
						
						_audio.attr({
							'src': _audio_info,
							'autoplay': 'autoplay'
						});
						_audio[0].play();
					}
					//- 正在播放
					if (_this.attr('src') != './audio/oops.mp3') {
						_audio.on('playing', function() {
							var _this = $(this),
								target = $('.n-audio-anchor').filter(function() {
									return $(this).data('target') == _this.attr('src');
								});
								target.addClass('playing');
						});
						_audio.on('ended', function() {
							var _this = $(this),
								target = $('.n-audio-anchor').filter(function() {
									return $(this).data('target') == _this.attr('src');
								});
							target.attr('data-firstplay', false);
							$('.n-audio-anchor').each(function() {
								$(this).removeClass('playing');
							});
						});
					}
				}
			});
		});
		
		// 滚动自动加载播放
		$(window).on('scroll', function() {
			clearTimeout(timeout_scroll);
			var timeout_scroll = setTimeout(function() {
				var $this = $(this),
					st = $this.scrollTop();
				_audio_anchor.each(function(i, e) {
					var _this = $(this),
						ot = _this.offset().top;
					var data_target = _this.data('target');
					if (st >= ot - NOVEL.DATA.windowH / 2 - 50 && st <= ot - NOVEL.DATA.windowH / 2 + 50) {//- 上下100像素为检测范围
						var target = _this.data('target'),
							audio = NOVEL.DATA.$audio_box.find('audio').filter(function() {
								return $(this).attr('src') == target;
							});
						if (_this.data('firstplay') == true) {
							_this.trigger('click');
						}
					}
				});
			}, NOVEL.DATA.scroll_timeout);
		});
		
		// 静音
		NOVEL.DATA.$audio_mute.on('click', function() {
			if (NOVEL.DATA.soundState) {
				NOVEL.DATA.$audio_box.find('audio').each(function() {
					var _this = $(this);
					_this[0].muted = true;
				});
				NOVEL.DATA.$audio_mute.addClass('muted');
				NOVEL.DATA.soundState = false;
			} else {
				NOVEL.DATA.$audio_box.find('audio').each(function() {
					var _this = $(this);
					_this[0].muted = false;
				});
				NOVEL.DATA.$audio_mute.removeClass('muted');
				NOVEL.DATA.soundState = true;
			}
		});
		
		//- 音频结束
		NOVEL.DATA.$audio_box.find('audio').on('ended', function() {
			var _this = $(this);
			//- _this.attr('data-playing', false);
			_this.attr({
				'src': '../_common/_res/oops.mp3',
				'autoplay': 'autoplay'
			});
			//- if (switchAnchorBadge != undefined) {
			//- 	clearInterval(switchAnchorBadge);
			//- }
		});
	}
	NOVEL.audio();
	// 背景切换
	NOVEL.bg = function() {
		$(window).on('scroll', function() {
			clearTimeout(timeout_scroll);
			var timeout_scroll = setTimeout(function() {
				var $this = $(this),
					st = $this.scrollTop(),
					_anchor = NOVEL.DATA.$content.find('.n-bg-anchor');
				_anchor.each(function(i,e) {
					var _this = $(this),
						ot = _this.offset().top;
					var data_target = _this.attr('tu');
					if (st == 0) {
						NOVEL.DATA.$bg_wrp.find($('.n-bg-item')).filter(function() {
							return $(this).parent().children().index($(this)) == 0;
						}).addClass('active').siblings().removeClass('active');
					} else {
						if (!_this.is('.n-bg-anchor-first')) {
							var n_ot = _this.nextAll('.n-bg-anchor').length ? _this.nextAll('.n-bg-anchor').eq(0).offset().top : $('.n-bg-anchor-last').offset().top;
							if (st >= ot - NOVEL.DATA.windowH && st < n_ot - NOVEL.DATA.windowH) {
								$('.n-bg-item').filter(function() {
									return $(this).attr('tu') == data_target;
								}).addClass('active').siblings().removeClass('active');
							}
						} else {
							if (st < NOVEL.DATA.$content.find('.n-bg-anchor').eq(1).offset().top - NOVEL.DATA.windowH) {
								$('.n-bg-item').filter(function() {
									return $(this).attr('tu') == data_target;
								}).addClass('active').siblings().removeClass('active');
							}
						}
					}
				});
			}, NOVEL.DATA.scroll_timeout);
		});
	}
	NOVEL.bg();
})();
// 设置localstorage
(function() {
	var className = document.getElementsByTagName('body')[0].getAttribute("class");
	var localData = JSON.parse(localStorage.getItem('xiaoshuo')) || {};
	var path = window.location.pathname,
		pathArray = path.split('/'),
		localIndex = pathArray[pathArray.length - 2];

	if (typeof(localData[localIndex]) == "undefined") {
		localData[localIndex] = {};
	} else {
	}
	localData[localIndex].title = $('body').data('title');
	var d = new Date();
	localData[localIndex].time = d;
	localData[localIndex].order = $('body').data('order');
	localData[localIndex].chapter = $('.n-chapter').children('h1').html();
	localData[localIndex].consume = [];
	var str = JSON.stringify(localData);
	localStorage.setItem('xiaoshuo', str);
	console.log(localData);
})();