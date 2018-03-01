//聊天页面的数据
let data = [{
		msgId: 1,
		sendId: -1,
		receiveId: -1,
		msg: '[{"id": 10001,"userImg": "img/photo1.jpg","name": "小猪"}, {"id": 10002,"userImg": "img/photo2.jpg","name": "小猫"}, {"id": 10003,"userImg": "img/photo3.jpg","name": "小狗"}]'
	},
	{
		msgId: 2,
		sendId: 10002,
		receiveId: 10001,
		msg: "你是tt吗？"
	},
	{
		msgId: 2,
		sendId: 10001,
		receiveId: '10002',
		msg: "不是！"
	},
	{
		msgId: 3,
		sendId: -1,
		receiveId: 10000,
		msg: "美少女"
	}
];

//存放当前用户信息的map
let myInfo = {};
//存放好友信息的map
let friendMap = new Map();
// 相关 DOM
let $chatPanel = $('.chat-panel');
let $friendName = $('.friend-name');
let $defaultPanel = $('.default-panel');
let $chatBox = $('.chat-box');

/**
 * 好友列表内容 HTML 模板
 * @param {Array} 好友列表
 * @return {String} 返回html字符串
 */
function friendListTpl(list) {
	if(!list.length) {
		return "";
	}

	let htmlText = [];
	for(let i = 0; i < list.length; i++) {
		console.log(i)
		htmlText.push('<li class="friend-item" data-user="' + list[i].id + '">');
		htmlText.push('<a href="javascript:;">');
		htmlText.push('<img src="' + 'img/photo1.jpg' + '" alt="" />')
		htmlText.push('<span class="f-name">' + list[i].name + '</span>');
//		htmlText.push('<span class="info-tip-icon">' + friendMap.get[list[i].id].chatInfo.length + '</span>');
		htmlText.push('</a>');
		htmlText.push('</li>');
	}
	return htmlText.join('');
}

/**
 * 发送消息 HTML 模板
 * @param {src，String} 发送消息头像，消息内容
 * @return {String} 返回html字符串
 */
function sengMsgTpl(userImg, msg) {
	let htmlText = [];
	htmlText.push('<div class="send-item">');
	htmlText.push('<a href="javascript:;"><img src="' + userImg + '" alt="" /></a>');
	htmlText.push('<span>' + msg + '</span>');
	htmlText.push('</div>');
	return htmlText.join('');
}
/**
 * 接收消息 HTML 模板
 * @param {src，String} 接收消息头像，消息内容
 * @return {String} 返回html字符串
 */
function receiveMsgTpl(userImg, msg) {
	let htmlText = [];
	htmlText.push('<div class="res-item">');
	htmlText.push('<a href="javascript:;"><img src="' + userImg + '" alt="" /></a>');
	htmlText.push('<span>' + msg + '</span>');
	htmlText.push('</div>');
	return htmlText.join('');
}
/*
 * 处理json中的信息
 * @param {消息号}  getServerJson
 */
function getServerJson(msgId) {
	let msg;
	switch(msgId) {
		case 1:
			msg = data[0];
			break;
		case 2:
			msg = data[1];
			break;
		case 3:
			msg = data[3];
			break;
	}
	return msg;
}
/*
 * 根据消息号设置对应处理方法
 * @param {消息号} onMessage
 */
function onMessage(msgId) {
	let msg = getServerJson(msgId);
	switch(msg.msgId) {
		case 1:
			console.log('生成用户列表');
			//设置好友列表，存储好友信息
			setFriendList(msg);
			break;
		case 2:
			console.log('收到消息');
			//执行方法onReceiveMsg
			onReceiveMsg(msg);
			break;
		case 3:
			console.log('收到自己的信息');
			//执行方法onUserMsg
			onUserMsg(msg);
			break;
		default:
			break;
	}
}
/*
 * 根据服务器发来的信息将好友信息添加到map中
 */
function setFriendList(msg) {
	let friendArr = JSON.parse(msg.msg);
	friendArr.forEach(function(item) {
		friendMap.set(item.id, {
			friendName: item.name,
			friendPhoto: 'img/photo1.jpg',
			chatInfo: []
		})
	})
	createList(friendArr);
	console.log(friendMap)
}
/*
 * 创建好友列表方法
 */
function createList(msg) {
	//显示好友列表
	var friendList = $('.friend-list');
	friendList.html("");
	let friendListHtml = friendListTpl(msg);
	friendList.html(friendListHtml);

	//点击好友列表中的好友
	$('.friend-item').click(function() {
		let friendId = $(this).attr('data-user');
		let friendName = friendMap.get(parseInt(friendId)).friendName;
		$friendName.html(friendName);
		$friendName.attr('data-chat', friendId);

		$chatPanel.html("");
		// 调用onChatMsg方法，根据map中存放的信息渲染聊天的页面
		let chatHtml = onChatMsg(friendMap.get(parseInt(friendId)));
		$chatPanel.html(chatHtml);
		//隐藏默认面板
		$defaultPanel.hide();
		//显示聊天面板
		$chatBox.show();
		//为发送消息按钮绑定事件
		$('.btn').off('click', sendFn);
		$('.btn').on('click', sendFn);
	})
}
/*
 * 根据map中存放的信息，产生聊天的html字符串
 */
function onChatMsg(msg) {
	if(!msg.chatInfo.length) {
		return "";
	}
	let chatMsgHtml = "";
	console.log(msg)
	msg.chatInfo.forEach(function(item) {
		if(item.type == 2) {
			chatMsgHtml += receiveMsgTpl(msg.friendPhoto, item.msg);
		} else {
			chatMsgHtml += sengMsgTpl($('.user-photo-img').attr('src'), item.msg);
		}
	})
	return chatMsgHtml;
}
/*
 * 发送消息函数
 */
function sendFn() {
	if($('.msg-input').val() == "") {
		return;
	}
	console.log($('.msg-input').val());

	//在map中添加本次发送的信息
	friendMap.get(parseInt($friendName.attr('data-chat'))).chatInfo.push({
		type: 1,
		time: '10:00',
		msg: $('.msg-input').val()
	})

	//页面显示本次发送的信息
	$chatPanel.append(sengMsgTpl($('.user-photo-img').attr('src'), $('.msg-input').val()));

	//将发送的信息发给服务器
	let msgObj = new MsgObj(2, myInfo.id, parseInt($friendName.attr('data-chat')), $('.msg-input').val());
	console.log(msgObj);
	Chat.sendMessage(msgObj);
}
/*
 	发送给服务器的对象模板类
	{
	msgId: 2,
	sendId: 10002,
	receiveId: 10001,
	msg: "你是tt吗？"
	}
 */
class MsgObj {
	constructor(msgId, sendId, receiveId, msg) {
		this.msgId = msgId;
		this.sendId = sendId;
		this.receiveId = receiveId;
		this.msg = msg;
	}
}

function onReceiveMsg(msg) {
	friendMap.get(msg.sendId).chatInfo.push({
		type: 2,
		time: '10:00',
		msg: msg.msg
	})
	//如果正在聊天，则存放到map中后要添加到聊天面板中
	if($friendName.html() == friendMap.get(msg.sendId).friendName) {
		$chatPanel.append(receiveMsgTpl(friendMap.get(msg.sendId).friendPhoto, msg.msg))
	}
}

function onUserMsg(msg) {
	$('.user-photo-img').attr('src', 'img/1.jpeg');
	$('.user-name').html(msg.msg);
	myInfo.name = msg.msg;
	myInfo.id = msg.receiveId;
}
/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
	// 渲染页面
	onMessage(1);
	onMessage(3);
	$('.res-btn').click(function() {
		onMessage(2);
	});
}

init();