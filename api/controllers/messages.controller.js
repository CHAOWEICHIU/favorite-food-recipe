'use strict'

const mongoose = require('mongoose');
const Message = mongoose.model('Message');

module.exports.addMessage = (created_user, msg) => {
	var newMsg = new Message({
		created_user: created_user,
		msg: msg		
	})
	newMsg.save((err)=>{
		if(err) throw err;
	})
}

function handleResStatus(err ,req, res, doc ,stauts){	
	if(err){
		res.status(500).send(err);
	} else if (!doc){
		console.log('!doc')
		res.status(404).send('not found')
	} else {
		switch(stauts){
			case 200:
				res.status(200).json({message:doc});
				break;
			case 201:
				console.log('created')
				res.status(201).json({message:doc});
				break;
			default:
				console.log('unknow!', err, doc)
				res.status(500).send(err);
		}
	}
}


module.exports.messagesGetAll = (req, res)=>{
	Message
		.find()
		.exec((err, messages)=>{
			if(err){
				handleResStatus(err ,req, res)
			} else {
				handleResStatus(err ,req, res, messages ,200)
			}
		})
}

module.exports.messagesAddOne = (req, res) => {
	Message
		.create({
			created_user: req.body.created_user,
			msg: req.body.msg
		}, (err, message)=>{
			if(err){
				console.log(err)
				handleResStatus(err ,req, res)
			} else {
				handleResStatus(err ,req, res, message ,201)
			}
		})		
}