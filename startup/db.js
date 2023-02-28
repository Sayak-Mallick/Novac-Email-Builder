const mongoose = require('mongoose');
const winston = require('winston');

module.exports = () => {
    mongoose.connect('mongodb://localhost:27017/emailDatabase', {
        useNewUrlParser: true,
        useUnifiedTopology: true
        
    }).then(() => winston.info('MongoDb connected successfuly...'));
}