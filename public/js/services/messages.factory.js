angular.module('myApp').factory('messagesFacotry', messagesFacotry)

function messagesFacotry(){
  return {
    messages: [],
    users: []
  }
}