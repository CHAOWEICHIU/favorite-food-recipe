angular.module('myApp').controller('ChatCtrl', ChatCtrl)

function ChatCtrl($scope, AuthFactory, $route, $window, socketio, messagesFacotry){
	var vm = this;
	vm.me = AuthFactory.loggedInUser;
	vm.users = [];

	// save temp message while user navigate to other page
	if (messagesFacotry.users.length !== 0){
		vm.users = messagesFacotry.users
		initMessages();
	}
	
	
	
	
	// in order not to let socket io duplicate socket.on again
	if(AuthFactory.chatRoomStarted === false){
		
		// switch chatRoomStarted to true
		AuthFactory.chatRoomStarted = true

		// listen msg from server
		socketio.on('get msg', (msg)=>{
			if(msg.user == vm.me){
				messagesFacotry.messages.push({user:msg.user, message:msg.message})
				appendSelfMessageToView(msg.user, msg.message)
			} else {
				messagesFacotry.messages.push({user:msg.user, message:msg.message})
				appendOtherMessageToView(msg.user, msg.message)	
			}
		})	

		// send user to server
		socketio.emit('user', vm.me)
		
		
		// listen msg from server
		socketio.on('get users', (users)=>{
			messagesFacotry.users = users;
			vm.users = users
		})
	}

	vm.captureEnterKey = (msg)=>{
		if(msg.keyCode === 13){
			vm.sendMessage()
		}
	}
	vm.sendMessage = ()=>{
		if(vm.msg){
			socketio.emit('msg', {user:vm.me ,message: vm.msg})
			vm.msg = ''	
		}
	}
	



	// helper functions ----------------------------------------
	function appendOtherMessageToView(user, msg){
		let template = `
			<div class="row">
				<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
					<img src="https://www.securefileexchange.com/8BASE/media/images/person-icon-law.png" class="img-responsive img-circle">
				</div>
				<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">
					<div class="well well-lg ">${msg}</div>
				</div>
			</div>
			<br>
		`
		$('#msgBox').prepend(template)
	}
	function appendSelfMessageToView(user, msg){
		let template = `
			<div class="row">
				<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 col-lg-offset-2 col-md-offset-2 col-sm-offset-2 col-xs-offset-2">
					<div class="well well-lg text-info">${msg}</div>
				</div>
				<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
					<img src="https://www.securefileexchange.com/8BASE/media/images/person-icon-law.png" class="img-responsive img-circle">
				</div>
			</div>
			<br>
		`
		$('#msgBox').prepend(template)
	}
	function initMessages(){
		messagesFacotry.messages.forEach((msg)=>{
			if(msg.user == vm.me){
				appendSelfMessageToView(msg.user, msg.message)
			} else {
				appendOtherMessageToView(msg.user, msg.message)
			}
		})
	}
	// ----------------------------------------------------------

	


}