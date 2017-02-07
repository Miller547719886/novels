// 变量
//- 选择器 
var windowH = $(window).height(),
scroll_timeout = 100,
soundState = true,
$out_bg = $('.n-bg-wrp').find('.n-bg-outer'),
$in_bg = $('.n-bg-wrp').find('.n-bg-inner'),
$bg_item = $('<div class="n-bg-item"></div>'),
$content = $('.mainFrame').find('.n-container'), //- 盒子
$playscript = $content.find('.n-playscript'), //- 台本
$audio_box = $content.find('.n-audio-box'), //- 音频
$cover = $content.find('.n-cover'), //- 封面
$title = $content.find('.n-chapter'), //- 章节
$audio_mute = $content.find('.n-audio-mute'),
$audio = $('<audio></audio>'),
$audio_anchor = $('<div class="n-audio-anchor"></div>')
$h1 = $('<div class="h1 n-text n-align-center"></div>'),
$anchor = $('<div class="n-bg-anchor"></div>'),//- 锚点
anchor_last = '<div class="n-bg-anchor-last"></div>',//- 最后一个锚点
br = '<p class="n-text-line"><br></p>',
$br = $(br),//- 空行
$txt = $('<div class="n-text"></div>'),
$img = $('<img class="n-image" src="">'),
$btn_top = $('footer.foot-toolbar').find('.back-to-top'),
$dialogueL = $('<div class="n-dialogue n-dialogue-align-left"><img class="n-dialogue-avatar" src=""><div class="n-dialogue-name"></div><div class="n-dialogue-container clearfix"><div class="n-dialogue-box"><div class="n-dialogue-box-balloon-center"></div></div></div></div>'),
$dialogueR = $('<div class="n-dialogue n-dialogue-align-right"><img class="n-dialogue-avatar" src=""><div class="n-dialogue-name"></div><div class="n-dialogue-container clearfix"><div class="n-dialogue-box"><div class="n-dialogue-box-balloon-center"></div></div></div></div>');

// 滚动到顶部
$(function() {
	$btn_top.on('click', function() {
		$('html,body').animate({
			scrollTop: 0
		}, 0);
	});
});

// 数据填充
function fillBase() {
	//- 封面
	var _coverImg = $img.clone();
	_coverImg.attr('src', playscript.cover);
	$cover.append(_coverImg); //- 页面渲染
	//- 章节
	var _h1 = $h1.clone();
	_h1.html(playscript.chapter);
	$title.append(_h1);
	//- 首个背景锚点
	var _f_anchor = $anchor.clone();
	_f_anchor.attr('data-target',0);
	$content.prepend(_f_anchor);
}

function fillBG() {
	var bgs = '', //- 用于存储背景div字符串
	windowW = $(window).width();
	for (var item in playscript.background) {
		var _bg_item = $bg_item.clone(),
			_item = playscript.background[item];
		if (_item.img) {
			_bg_item.css({
				'backgroundColor': 'transparent',
				'backgroundImage': 'url(' + _item.img + '.jpg)'
			});
		}
		if (_item.color) {
			_bg_item.css({
				'backgroundColor': _item.color,
				'backgroundImage': 'none'
			});
		}
		_bg_item.attr('data-index',item);
		if (item == 0) {
			_bg_item.addClass('active');
		} else {
			_bg_item.removeClass('active');
		}
		bgs += _bg_item[0].outerHTML;
	}
	if (windowW > 500) {
		$out_bg.append(bgs);
		$in_bg.append(bgs);
	} else {
		$out_bg.append(bgs);
	}
}

function fillPlayscript() {
	//- 台本
	var _playscript = '';
	for (var item in playscript.info) {
		var _item = playscript.info[item];
		switch (_item.type) {
			case 'text':
				{
					var _txt = $txt.clone(),
						_edge_txt = 2;
					_txt.html(_item.fill);
					_playscript += _txt[0].outerHTML;
					for (var i = 0; i < _edge_txt; i++) {
						_playscript += br;
					}
				}
				break;

			case 'img':
				{
					var _img = $img.clone(),
						_edge_img = 4;
					_img.attr('src', _item.fill + '.png');
					_playscript += _img[0].outerHTML;
					for (var i = 0; i < _edge_img; i++) {
						_playscript += br;
					}
				}
				break;

			case 'dialogue':
				{
					var _dialogue = _item.setting.side === 'left' ? $dialogueL.clone() : $dialogueR.clone(),
						_edge_dialogue = 4;
					_dialogue.find('.n-dialogue-avatar').attr('src', _item.setting.avatar + '.png');
					_dialogue.find('.n-dialogue-name').html(_item.setting.name);
					_dialogue.find('.n-dialogue-box-balloon-center').html(_item.fill);
					if (_item.audio) {
						var _audio_anchor = $audio_anchor.clone();
						_audio_anchor.attr('data-target', _item.audio);
						_audio_anchor.attr('data-firstplay', true);
						_dialogue.append(_audio_anchor);
					}
					_playscript += _dialogue[0].outerHTML;
					for (var i = 0; i < _edge_dialogue; i++) {
						_playscript += br;
					}
				}
				break;

			case 'bg':
				{
					var _anchor = $anchor.clone();
					_anchor.attr('data-target', _item.target);
					_playscript += _anchor[0].outerHTML;
				}
				break;

			default:
			console.log('check your config!', _item);
		}
	}
	_playscript += anchor_last;
	$playscript.append(_playscript); //- 页面渲染
}

$(function() {
	fillBase();
	fillBG();
	fillPlayscript();
});

// 音频播放
HTMLAudioElement.prototype.stop = function() { 
	this.pause();
	this.currentTime = 0.0;
};

$(function() {
	var _dialogue = $content.find('.n-dialogue'),
		_audio_anchor = _dialogue.find('.n-audio-anchor');
	_audio_anchor.each(function() {
		var _this = $(this);
		_this.parents('.n-dialogue').on('click', function() {
			var _audio_target = _this.data('target'),
				_audio_panel = $audio_box.find('audio').filter(function() {
					return $(this).attr('src') == _audio_target;
				});
			var _audio = $audio_box.find('audio'),
				_audio_info = _audio_target;
			if (!$audio_mute.hasClass('muted')) {
				if (_audio_panel.length) {
					if (!_audio_panel[0].paused) {
						//- console.log('playing');
					} else {
						$audio_box.find('audio').each(function() {
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
				if (st >= ot - windowH / 2 - 50 && st <= ot - windowH / 2 + 50) {//- 上下100像素为检测范围
					var target = _this.data('target'),
						audio = $audio_box.find('audio').filter(function() {
							return $(this).attr('src') == target;
						});
					if (_this.data('firstplay') == true) {
						_this.trigger('click');
						console.log(11);
					}
				}
			});
		}, scroll_timeout);
	});
	
	// 静音
	$audio_mute.on('click', function() {
		if (soundState) {
			$audio_box.find('audio').each(function() {
				var _this = $(this);
				_this[0].muted = true;
			});
			$audio_mute.addClass('muted');
			soundState = false;
		} else {
			$audio_box.find('audio').each(function() {
				var _this = $(this);
				_this[0].muted = false;
			});
			$audio_mute.removeClass('muted');
			soundState = true;
		}
	});
	
	//- 音频结束
	$audio_box.find('audio').on('ended', function() {
		var _this = $(this);
		//- _this.attr('data-playing', false);
		_this.attr({
			'src': './audio/oops.mp3',
			'autoplay': 'autoplay'
		});
		//- if (switchAnchorBadge != undefined) {
		//- 	clearInterval(switchAnchorBadge);
		//- }
	});
});

// 背景切换
$(function() {
	$(window).on('scroll', function() {
		clearTimeout(timeout_scroll);
		var timeout_scroll = setTimeout(function() {
			var $this = $(this),
				st = $this.scrollTop(),
				_anchor = $content.find('.n-bg-anchor');
			_anchor.each(function(i,e) {
				var _this = $(this),
					ot = _this.offset().top;
				var data_target = _this.data('target');
				if (st == 0) {
					$('.n-bg-item').filter(function() {
						return $(this).data('index') == 0;
					}).addClass('active').siblings().removeClass('active');	
				} else {
					if (data_target != 0) {
						var n_ot = _this.nextAll('.n-bg-anchor').length ? _this.nextAll('.n-bg-anchor').eq(0).offset().top : $('.n-bg-anchor-last').offset().top;
						if (st >= ot - windowH && st < n_ot - windowH) {
							$('.n-bg-item').filter(function() {
								return $(this).data('index') == data_target;
							}).addClass('active').siblings().removeClass('active');
						}
					} else {
						if (st < $('.n-playscript').find('.n-bg-anchor').eq(0).offset().top - windowH) {
							$('.n-bg-item').filter(function() {
								return $(this).data('index') == data_target;
							}).addClass('active').siblings().removeClass('active');
						}
					}
				}
			});
		}, scroll_timeout);
	});
});