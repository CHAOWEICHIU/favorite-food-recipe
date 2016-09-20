angular.module('myApp').controller('ChatCtrl', ChatCtrl)

function ChatCtrl($scope ,socketio){
	var vm = this;

	vm.messages = [
		{'msg': 'hi'},
		{'msg': 'cool'}
	];
	
	vm.sendMessage = ()=>{
		vm.messages.push({msg:vm.msg})
		socketio.emit('send msg', vm.msg)
		vm.msg = ''
		socketio.on('get msg', (data)=>{
			
			
		})
	}
	
	console.log('ChatCtrl!')
}