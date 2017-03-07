//- 小说书架
(function() {
	window.BOOKSHELF = window.BOOKSHELF || {};
	var local = JSON.parse(localStorage.getItem('xiaoshuo'));
	BOOKSHELF.SL = {};//选择器
	BOOKSHELF.SL.container = $('.bookshelf').find('.container');

	BOOKSHELF.DOM = {};//虚拟DOM字符串
	BOOKSHELF.DOM.item = $('<div class="row n-item"><div class="n-title"><a href="" class="n-pages"></a></div><div class="clearfix"><div class="n-cover pull-left"><img src="" alt=""></div><div class="pull-right"><p class="n-author">作者：</p><p class="n-update"></p><div class="n-ud-time"><i class="icons icon-time"></i><span class="n-update-time"></span></div><div class="n-read-info"></div></div></div></div>');
	BOOKSHELF.DOM.hasRead = $('<span class="n-readState"></span><a href="" class="n-continueRead">继续阅读</a>');
	BOOKSHELF.DOM.noRead = $('<a href="" class="n-continueRead">开始阅读</a>');
	BOOKSHELF.DOM.list = [];
	BOOKSHELF.DOM.relist = [];
	$.ajax({
		type:"GET",
		url: "//s.dahao.de/zongcai/index.json",
		dataType: "json",
		success: function(data) {
			for (var n in data) {
				var _item = BOOKSHELF.DOM.item.clone();
				_item.attr('data-index', n); 
				_item.find('.n-title a').attr('href', './' + n +'/index.html').html(data[n].title);
				_item.find('.n-cover').attr('href', data[n].cover);
				_item.find('.n-author').html(data[n].author);
				_item.find('.n-update').html(data[n].update);
				_item.find('.n-update-time').html(data[n].time);
				BOOKSHELF.DOM.list.push(_item[0].outerHTML);
			}
		}
	});
	// var data = {
	// 	"yatou": {
	// 		"title": "纯情丫头火辣辣",
	// 		"cover": "./1.png",
	// 		"author": "小学生",
	// 		"time": "2012-08-10",
	// 		"update": "更新至第100章 高山流水",
	// 		"vip": 3
	// 	},
	// 	"zongcai": {
	// 		"title": "纯情丫头火辣辣",
	// 		"cover": "./1.png",
	// 		"author": "小学生",
	// 		"time": "2012-08-10",
	// 		"update": "已完结 共100章",
	// 		"vip": 3
	// 	}
	// };
	// for (var n in data) {
	// 	var _item = BOOKSHELF.DOM.item.clone();
	// 	_item.attr('data-index', n); 
	// 	_item.find('.n-title a').attr('href', './' + n +'/index.html').html(data[n].title);
	// 	_item.find('.n-cover').attr('href', data[n].cover);
	// 	_item.find('.n-author').html(data[n].author);
	// 	_item.find('.n-update').html(data[n].update);
	// 	_item.find('.n-update-time').html(data[n].time);
	// 	BOOKSHELF.DOM.list.push(_item[0].outerHTML);
	// }
	//随机排序
	for (var i = 0, len = BOOKSHELF.DOM.list.length; i < len; i++) {
		var j = Math.floor(Math.random() * BOOKSHELF.DOM.list.length);
		BOOKSHELF.DOM.relist[i] = BOOKSHELF.DOM.list[j];
		BOOKSHELF.DOM.list.splice(j, 1);
	}
	//填充
	for (var m = 0; m < BOOKSHELF.DOM.relist.length; m++) {
		BOOKSHELF.SL.container.append($(BOOKSHELF.DOM.relist[m]))
	}
	//最近阅读
	BOOKSHELF.SL.container.find('.n-item').each(function(i, e) {
		var _this = $(this),
			index = _this.attr('data-index');
		if (typeof(local[index]) != "undefined") {
			var obj = local[index];
			var hasRead = BOOKSHELF.DOM.hasRead.clone();
			hasRead.filter('.n-readState').html('读到' + obj.chapter);
			hasRead.filter('.n-continueRead').attr('href', './' + index + '/' + 'novel-' + obj.order + (obj.order >= data[index].vip ? '.vip' : '.html'));
			_this.find('.n-read-info').append(hasRead);
		} else {
			var noRead = BOOKSHELF.DOM.noRead.clone();
			noRead.attr('href', './' + index + '/' + 'novel-1.html');
			_this.find('.n-read-info').append(noRead);
		}
	});
})();