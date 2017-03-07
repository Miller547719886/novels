#线上预览
[有声小说（多终端设备）](http://dahao.de/xiaoshuo/)
#小说内容填充格式
##章节
如果你需要在小说章节中添加章节名称：
    h1 第1章 | 小心玩火自焚
##台本
###背景锚点
如果你在某个位置需要切换背景：
    b(tu="nightclub")
###旁白
如果你在某个位置需要独白：
    p 纸醉金迷的日本，处处歌舞升平、熙熙攘攘。
###插图
如果你在某个位置需要人物肖像或者是其他类似图片：
    img(tu="card_luoyy")
###对白
如果你在某个位置需要对白：
    dl
        dt 宫小曼
        dd(yin="fengcy0001") 对不起啦，不过你也喝太多了……
##角色表
每个小说需要一个角色表实现人物名和头像、对话方向的映射。格式：
头像：
洛瑶瑶:luoyy,
宫小曼:gongxm,
御傲天:yuat
方向：
洛瑶瑶:1,
宫小曼:0,
御傲天:0
#本地服务器搭建方式（以nginx为例）
##配置
在nginx服务器的配置文件（nginx.conf）中添加一段：

	server {
		listen       80;
		listen       dahao.de;
		server_name  dahao.de;

		location / {
		    root   D:\html;//这里填写你的目录路径
		    index  index.html index.htm;
		}
    	}
	
##Host
（windows系统下）命令行输入ipconfig找到Ipv4地址，
找到C:\Windows\System32\Drivers\Etc目录下的host文件，打开并添加一行
	192.168.1.111 dahao.de //此处输入刚才找到的Ipv4地址

##启动
启动nginx服务，访问dahao.de就可以了。
