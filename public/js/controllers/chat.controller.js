angular.module('myApp').controller('ChatCtrl', ChatCtrl)

function ChatCtrl($scope, AuthFactory, $route, $window, socketio, messagesFacotry, UsersDataFactory){
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
		UsersDataFactory.getAllUsers().then((res)=>{
			let sortedUsers = res.message.map((user)=>{
				return {id: user._id ,name: user.name, profileUrl: user.profileUrl || ''}
			})
			messagesFacotry.usersFromDB = sortedUsers
		})

		// switch chatRoomStarted to true
		AuthFactory.chatRoomStarted = true

		// listen msg from server
		socketio.on('get msg', (msg)=>{
			if(msg.user == vm.me){
				messagesFacotry.messages.push({user:msg.user, message:msg.message, profileUrl: msg.profileUrl})
				appendSelfMessageToView(msg.user, msg.message, msg.profileUrl)
			} else {
				messagesFacotry.messages.push({user:msg.user, message:msg.message, profileUrl: msg.profileUrl})
				appendOtherMessageToView(msg.user, msg.message, msg.profileUrl)	
			}
		})	

		// send user to server
		socketio.emit('user', {name:vm.me, id:AuthFactory.loggedInUserId})
		
		
		// listen msg from server
		socketio.on('get users', (users)=>{
			
			messagesFacotry.users = users;
			
			UsersDataFactory.getAllUsers().then((res)=>{
				let ifEmptyUrl = 'https://www.securefileexchange.com/8BASE/media/images/person-icon-law.png'
				let sortedUsers = res.message.map((user)=>{
					return {id: user._id ,name: user.name, profileUrl: user.profileUrl || ifEmptyUrl}
				})
				messagesFacotry.usersFromDB = sortedUsers
			}).then(()=>{
				
				// associate profile URL to users
				vm.users = users.map((user)=>{
					
					let indexOfUser = messagesFacotry.usersFromDB.map(function(e) {return e.id; }).indexOf(user.id)
					
					return {user: user.name, id: user.id, profileUrl: messagesFacotry.usersFromDB[indexOfUser].profileUrl}
				})
			})

			
		})
	}

	vm.captureEnterKey = (msg)=>{
		if(msg.keyCode === 13){
			vm.sendMessage()
		}
	}
	vm.sendMessage = ()=>{
		let indexOfUser =  vm.users.map(e=>e.id).indexOf(AuthFactory.loggedInUserId)
		if(vm.msg){
			socketio.emit('msg', {user:vm.me ,message: vm.msg, profileUrl: vm.users[indexOfUser].profileUrl})
			vm.msg = ''	
		}
	}
	



	// helper functions ----------------------------------------
	function appendOtherMessageToView(user, msg, profileUrl){
		let template = `
			<div class="row">
				<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
					<img src="${profileUrl}" class="img-responsive img-circle">
				</div>
				<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">
					<div class="well well-lg ">${msg}</div>
				</div>
			</div>
			<br>
		`
		$('#msgBox').prepend(template)
	}
	function appendSelfMessageToView(user, msg, profileUrl){
		let template = `
			<div class="row">
				<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 col-lg-offset-2 col-md-offset-2 col-sm-offset-2 col-xs-offset-2">
					<div class="well well-lg text-info">${msg}</div>
				</div>
				<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
					<img src="${profileUrl}" class="img-responsive img-circle">
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