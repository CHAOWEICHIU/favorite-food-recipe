angular.module('myApp').controller('ChatCtrl', ChatCtrl)

function ChatCtrl($scope, AuthFactory, $route, $window){
	// $window.location.reload()
	console.log('chat room')
	var vm = this;
	var socket = io.connect();
	vm.me = AuthFactory.loggedInUser
	vm.isStarted = false;
	vm.sendMessage = ()=>{
		socket.emit('send msg', {user:vm.me, msg:vm.msg})
		vm.msg = ''
		
	}
	socket.on('get msg', (data)=>{
	function appendToChatroom(templateString){
		vm.isStarted = true;
		$('#chatroom').prepend(templateString)
		$scope.$digest()
		$scope.$apply()
	}	
		if(data.user === vm.me){
			let templateString = `
				  <li class="list-group-item active">
				    <div class="row">
				    	<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 col-lg-offset-2 col-md-offset-2 col-sm-offset-2 col-xs-offset-2">
				    		<p class="list-group-item-text pull-right">${data.msg}</p>
				    	</div>	
				    	<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
				    		<span class="badge">${data.user}</span>		
				    	</div>	
				    </div>
				  </li>
			`;
			appendToChatroom(templateString);
		} else {
			let templateString = `
				<li class="list-group-item">
				    <div class="row">
				    	<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 ">
				    		<span class="badge">${data.user}</span>		
				    	</div>	
				    	<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-xs-offset-1">
				    		<p class="list-group-item-text">${data.msg}</p>
				    	</div>	
				    </div>
			  	</li>
			`;
			appendToChatroom(templateString);
		}
		
	})
}