'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');




function handleResStatus(err, req, res, doc){	
	if(err){
		console.log('err')
		res.status(500).json({message: err})
	} else if(!doc){
		console.log('!doc')
		res.status(404).json({message: 'Not Found'})
	} 

	if(doc !== 'undefined'){
		res.status(200).json({message: doc})
	}
}

module.exports.usersGetAll = (req, res)=>{
	User.find().exec((err, users)=>{
		if(err){
			handleResStatus(err, req, res)	
		} else {
			handleResStatus(err, req, res, users)	
		}
		
	})
}

module.exports.usersGetOne = (req, res)=>{
	let userId = req.params.userId
	User
		.findById(userId)
		.exec((err, user)=>{
			if(err){
				handleResStatus(err, req, res);	
			} else {
				handleResStatus(err, req, res, user);	
			}
			
		})
}


module.exports.userUpdateOne = (req, res)=>{
	var userId = req.params.userId;
	User
		.findById(userId)
		// .select('-rooms')
		.exec((err, user)=>{
			if(err){
				res.status(500).send('Error find the user!')
			} else if (!user){
				res.status(404).send('user not found')
			} else {
				user.username = req.body.username
				user.name = req.body.name
				user.password = req.body.password
				user.likes = req.body.likes
				user.profileUrl = req.body.profileUrl

				user.save((err, updatedUser)=>{
					handleResStatus(err, req, res, updatedUser)
				})
			}
		})
}

module.exports.register = (req, res) => {
	console.log('start to register new user')

	var username = req.body.username;
	var name = req.body.name || username;
	var password = req.body.password;

	User.create({
		username: username,
		name: name,
		password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
	}, (err, createdUser)=>{
		handleResStatus(err, req, res, createdUser);
	})
}

module.exports.login = (req, res) => {
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({
		username: username
	}, (err, foundUser)=>{
		if(foundUser){
			if(bcrypt.compareSync(password, foundUser.password)){
				let token = jwt.sign({ name: foundUser.name, id:foundUser._id }, 'secret', { expiresIn: 3600 });
				handleResStatus(err, req, res, {success:true, token: token});
			} else {
				res.status(401).json({message: 'Unauthorised'})
			}
		} else {
			handleResStatus(err, req, res);
		}
		
	})
}

module.exports.authenticate = (req, res, next) => {
	var headerExists = req.headers;
	if(headerExists){
		let token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, 'secret', (err, decoded)=>{
			if(err){
				res.status(401).json({message: err});
			} else {
				req.user = decoded.name;
				next();
			}
		})
	} else {
		res.status(403).json({message: 'No token provided'})
	}
}






