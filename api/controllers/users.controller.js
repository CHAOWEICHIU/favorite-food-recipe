const mongoose = require('mongoose');
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




module.exports.register = (req, res) => {
	console.log('start to register new user')

	var username = req.body.username;
	var name = req.body.name || username;
	var password = req.body.password;

	User.create({
		username: username,
		name: name,
		password: password
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
			handleResStatus(err, req, res, foundUser);	
		} else {
			handleResStatus(err, req, res);
		}
		
	})
}






