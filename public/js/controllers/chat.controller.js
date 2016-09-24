angular.module('myApp').controller('ChatCtrl', ChatCtrl)

function ChatCtrl($scope, AuthFactory, $route, $window, socketio){
	var vm = this;
	vm.me = AuthFactory.loggedInUser
	console.log(AuthFactory.chatRoomStarted)
	
	// in order not to let socket io duplicate socket.on again
	if(AuthFactory.chatRoomStarted === false){
		console.log('inside!')
		socketio.on('get msg', (msg)=>{
			appendMessageToView(msg.user, msg.message)
		})	
		socketio.emit('user', vm.me)
		socketio.on('get users', (users)=>{
			appendCurrentUsersToView(users)
		})
		AuthFactory.chatRoomStarted = true
	}
	
	function appendCurrentUsersToView(users){
		console.log(`there are ${users.length} in the room, ${users}`)
	}

	function appendMessageToView(user, msg){
		console.log(user, msg)
	}

	vm.sendMessage = ()=>{
		socketio.emit('msg', {user:vm.me ,message: vm.msg})
		vm.msg = ''
	}


}