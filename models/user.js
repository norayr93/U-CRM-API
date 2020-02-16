const User = mongoose => {
    const UserSchema = mongoose.Schema({
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    });

    return mongoose.model('User', UserSchema);
};

module.exports = User;
