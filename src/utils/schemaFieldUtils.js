const mongoose = require("mongoose");
const {v4} = require('uuid');

// UUID 

const idWithV4UUID = {
    type: String,
    default: v4,
}

// String field that is required
const requiredAndString = {
    type: String,
    required: true
};

// String field that is required and unique
const requireStringAndUnique = {
    type: String,
    required: true,
    unique: true
};

// String field that is unique but not required
const StringAndUnique = {
    type: String,
    unique: true
};

// String field with a default value
const StringWithDefault = (defaultValue)=>{
   return {
    type: String,
    default: defaultValue,
   }
};

// String field with an enum constraint and required
const StringWithEnumAndRequired = (enumValues = [String])=>{
    return {
        type: String,
        enum: [...enumValues],
        required: true
    }
};
// String field with an enum constraint
const StringWithEnum = (enumValues = [String])=>{
    return {
        type: String,
        enum: [...enumValues],
    }
};

// String field with an enum constraint
const StringWithEnumAndDefault = (enumValues = [String],defaultValue)=>{
    return {
        type: String,
        enum: [...enumValues],
        default: defaultValue,
    }
};

// Number field that is required
const requiredAndNumber = {
    type: Number,
    required: true
};

const requireNumberAndUnique = {
    type: Number,
    required: true,
    unique: true
};



// Number field with a default value and required
const requiredNumberWithDefault = (defaultValue=0)=>({
    type: Number,
    default: defaultValue,
    required: true,
});

// Number field with a default value and required
const requiredNumberWithDefaultAndUnique = (defaultValue=0)=>({
    type: Number,
    default: defaultValue,
    required: true,
    unique: true,
});

// Number field with a default value
const NumberWithDefault = (defaultValue=0)=>({
    type: Number,
    default: defaultValue
});

// Boolean field with a default value
const BooleanWithDefault = {
    type: Boolean,
    default: false
};
// Boolean field with a default value true
const BooleanWithDefaultTrue = {
    type: Boolean,
    default: true
};

// Date field that is required
const requiredAndDate = {
    type: Date,
    required: true
};

// Date field with a default value of the current date
const DateWithDefault = {
    type: Date,
    default: Date.now
};

// ObjectId field referencing another model
const ObjectIdReference = (ref) => ({
    type: mongoose.Schema.Types.ObjectId,
    ref: ref,
});

// UUID field referencing another model
const UUIDIdReference = (ref) => ({
    type: String,
    ref: ref,
});

// Array of strings with a default empty array
const ArrayOfStrings = {
    type: [String],
    default: []
};

// Array of ObjectIds referencing another model
const ArrayOfUUIDs = (ref) => ({
    type: [String],
    ref: ref,
});

// Array of ObjectIds referencing another model
const ArrayOfObjectIds = (ref) => ({
    type: [mongoose.Schema.Types.ObjectId],
    ref: ref
});

// Field with custom validation function
const StringWithCustomValidation = {
    type: String,
    validate: {
        validator: function(value) {
            // Custom validation logic
            return value.length > 5;
        },
        message: 'String must be longer than 5 characters'
    }
};

module.exports = {
    idWithV4UUID,
    StringWithEnumAndDefault,
    requiredAndString,
    requiredAndNumber,
    requiredAndDate,
    DateWithDefault,
    ObjectIdReference,
    ArrayOfStrings,
    ArrayOfObjectIds,
    StringWithCustomValidation,
    BooleanWithDefault,
    BooleanWithDefaultTrue,
    NumberWithDefault,
    StringWithDefault,
    DateWithDefault,
    StringWithEnumAndRequired,
    StringAndUnique,
    requireStringAndUnique,
    StringWithEnum,
    requireNumberAndUnique,
    requiredNumberWithDefault,
    requiredNumberWithDefaultAndUnique,
    UUIDIdReference,
    ArrayOfUUIDs
}
