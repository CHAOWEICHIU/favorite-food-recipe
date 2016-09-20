angular.module('myApp').controller('ChatCtrl', ChatCtrl)

function ChatCtrl(socketio){
	var vm = this;

	vm.message = ''
	
	vm.sendMessage = ()=>{
		console.log(vm.msg)
	}
	socketio.on('chat', (msg)=>{

	})
	console.log('ChatCtrl!')
}