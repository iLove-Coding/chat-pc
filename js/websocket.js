var Chat = {};

Chat.socket = null;

Chat.connect = (function(host) {
	if('WebSocket' in window) {
		Chat.socket = new WebSocket(host);
	} else if('MozWebSocket' in window) {
		Chat.socket = new MozWebSocket(host);
	} else {
		console.log('Error: WebSocket is not supported by this browser.');
		return;
	}

	Chat.socket.onopen = function() {
		console.log('Info: WebSocket connection opened.');
	};

	Chat.socket.onclose = function() {
		//		alert('Info: WebSocket closed.');
	};

	Chat.socket.onmessage = function(message) {
		console.log(message.data);
		var msg = JSON.parse(message.data);
		switch(msg.msgId) {
			case 1:
				console.log('生成用户列表');
				//写方法
				setFriendList(msg);
				break;
			case 2:
				console.log('收到消息');
				//方法
				onReceiveMsg(msg);
				break;
			case 3:
				console.log('收到自己的信息');
				onUserMsg(msg);
				break;
			default:
				break;
		}
	};
});

Chat.initialize = function() {
	if(window.location.protocol == 'http:') {
		Chat.connect('ws://' + "localhost:8080" + '/websocket/chat');
	} else {
		Chat.connect('wss://' + "localhost:8080" + '/websocket/chat');
	}
};

Chat.sendMessage = (function(msg) {
	var msgStr = JSON.stringify(msg);
	Chat.socket.send(msgStr);
});

Chat.initialize();