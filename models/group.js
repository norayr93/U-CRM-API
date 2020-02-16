const Group = mongoose => {
    const GroupSchema = mongoose.Schema({
        name: {
            required: true,
            trim: true,
            type: String,
            minLength: 1,
        },
        faculty: {
            required: true,
            trim: true,
            type: String,
            minLength: 1,
        },
        groupId: mongoose.Types.ObjectId,
    });

    return mongoose.model('Group', GroupSchema);
};

module.exports = Group;
