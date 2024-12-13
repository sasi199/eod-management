const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");

const courseSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    courseName: schemaFields.StringWithEnumAndRequired(['Full Stack','Digital Marketing']),
    // courseId: schemaFields.idWithV4UUID,
    courseCode: schemaFields.requiredAndString,
    courseKeywords:schemaFields.ArrayOfStrings,
    courseDuration:schemaFields.requiredAndString,
    active: schemaFields.BooleanWithDefaultTrue,
    archive: schemaFields.BooleanWithDefault,
}, { timestamps: true, collection: "Course" });

const CourseModel = mongoose.model('Course', courseSchema);

module.exports = CourseModel;