const mongoose = require('mongoose');
mongoose.set('debug', true);

var mongoURL = 'mongodb+srv://s92066483:Abcd1234@cluster0.izkukh0.mongodb.net/bookme'

mongoose.connect(mongoURL)

var connection = mongoose.connection

connection.on('error', ()=>{
    console.log('Mongo DB Connection Failed')
})

connection.on('connected', ()=>{ 
    console.log('Mongo DB Connected')
})


module.exports = mongoose