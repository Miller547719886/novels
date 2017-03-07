//- 小说目录
(function() {
	window.PAGELIST = window.PAGELIST || {};
	var path = window.location.pathname,
		pathArray = path.split('/'),
		localIndex = pathArray[pathArray.length - 2];
	PAGELIST.index = localIndex;
	PAGELIST.cover = '../_common/_res/cover.png';
	PAGELIST.SL = {};//选择器
	PAGELIST.SL.body = $('.page-list');
	PAGELIST.SL.cata = PAGELIST.SL.body.find('.cata-container .n-outer');
	PAGELIST.SL.cover = PAGELIST.SL.body.find('.n-cover');
	PAGELIST.SL.title = PAGELIST.SL.body.find('.n-info .n-title');
	PAGELIST.SL.author = PAGELIST.SL.body.find('.n-info .n-author');
	PAGELIST.SL.update = PAGELIST.SL.body.find('.n-info .n-update');
	PAGELIST.SL.time = PAGELIST.SL.body.find('.n-info .n-time');
	PAGELIST.SL.desc = PAGELIST.SL.body.find('.n-abstract');

	PAGELIST.DOM = {};//虚拟DOM字符串
	PAGELIST.DOM.cataItem = $('<div class="href-cont"><a href="" class="n-pages"></a></div>');
	PAGELIST.DOM.lock = $('<i class="locked"></i>');
	PAGELIST.DOM.cataList = '';
	var local = JSON.parse(localStorage.getItem('xiaoshuo'))[PAGELIST.index];//当前小说本地存储

	// var data = {
	// 	"title": "霸道总裁",
	// 	"cover": "./_res/demo.jpg",
	// 	"author": "",
	// 	"update": "更新至第100章 高山流水",//"已完结 共100章"
	// 	"time": "2012-08-10",
	// 	"cata": [
	// 		{
	// 			"name": "第一章",
	// 			"vip": 0
	// 		},{
	// 			"name": "第二章",
	// 			"vip": 0
	// 		},{
	// 			"name": "第三章",
	// 			"vip": 1
	// 		},{
	// 			"name": "第四章",
	// 			"vip": 1
	// 		}
	// 	],
	// 	"desc": "主人公南望，离家多年之后，考上了故乡所在地的名校“朗润大学”。在那里，他认识了好友“大K”和大K的女朋主人公南望，离家多年之后，考上了故乡所在地的名校“朗润大学”。在那里，他认识了好友“大K”和大K的女朋主人公南望。"
	// };
	// PAGELIST.SL.cover.find('img').attr('src', data.cover);//封面图src
	// PAGELIST.SL.title.html(data.title);//小说名
	// PAGELIST.SL.author.html(data.author);//作者
	// PAGELIST.SL.update.html(data.update);//更新或完结
	// PAGELIST.SL.time.html(data.time);//更新时间
	// PAGELIST.SL.desc.html(data.desc);//简介
	// for(var i = 0; i < data.cata.length; i++) {//目录
	// 	var _item = PAGELIST.DOM.cataItem.clone();
	// 	_item.attr('href', 'novel-' + (i + 1) + (data.cata[i].vip == true ? '.vip' : '.html'))
	// 		.html(data.cata[i].name)
	// 		.append(data.cata[i].vip == true ? PAGELIST.DOM.lock : '');
	// 	var html = _item[0].outerHTML;
	// 	PAGELIST.DOM.cataList += html;
	// }
	// PAGELIST.SL.cata.append($(PAGELIST.DOM.cataList));

	//如果没有本地存储
	if (local == null) {
		PAGELIST.SL.body.find('a.n-btn-read').html('开始阅读');
		PAGELIST.SL.body.find('.n-readState').html('还没开始阅读');
	}
	//如果有本地存储 
	else {
		console.log(local);
		if (local.consume.length > 0) {
			for(var j in local.consume) {
				PAGELIST.SL.cata.find('.href-cont').eq(local.consume[j]).find('.locked').remove();//删除锁标记
			}
		}
		PAGELIST.SL.body.find('a.n-btn-read').html('继续阅读 第' + local.order + '章');
		PAGELIST.SL.body.find('.cata-container .href-cont').eq(local.order - 1).addClass('recentRead');
		PAGELIST.SL.body.find('.n-readState').html('读到' + local.chapter);
	}
	$.ajax({
		type:"GET",
		url: "//s.dahao.de/zongcai/index.json",
		dataType: "json",
		success: function(data) {
			PAGELIST.SL.cover.find('img').attr('src', data.cover);//封面图src
			PAGELIST.SL.title.html(data.title);//小说名
			PAGELIST.SL.author.html(data.author);//作者
			PAGELIST.SL.update.html(data.update);//更新或完结
			PAGELIST.SL.time.html(data.time);//更新时间
			PAGELIST.SL.desc.html(data.desc);//简介
			for(var i = 0; i < data.cata.length; i++) {//目录
				var _item = PAGELIST.DOM.cataItem.clone();
				_item.attr('href', 'novel-' + (i + 1) + (data.cata[i].vip == true ? '.vip' : '.html'))
					.html(data.cata[i].name)
					.append(data.cata[i].vip == true ? PAGELIST.DOM.lock : '');
				var html = _item[0].outerHTML;
				PAGELIST.DOM.cataList += html;
			}
			PAGELIST.SL.cata.append($(PAGELIST.DOM.cataList));
		}
	});
})();