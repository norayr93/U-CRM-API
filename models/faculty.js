const Faculty = mongoose => {
    const FacultySchema = mongoose.Schema({
        name: {
            required: true,
            trim: true,
            type: String,
            minLength: 1,
        },
        facultyId: mongoose.Types.ObjectId,
    });

    return mongoose.model('Faculty', FacultySchema);
};

module.exports = Faculty;
