const User = require('./user') ;
const Student = require('./student') ;
const Group = require('./group') ;
const Faculty = require('./faculty') ;

const initModels = mongoose => {
    User(mongoose);
    Student(mongoose);
    Faculty(mongoose);
    Group(mongoose);
};

module.exports = initModels;
