const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");
const { schema } = require('./authModel');
const { v4} = require('uuid')


const RoleSchema = mongoose.Schema({
   _id:{
    type:String,
    default:v4
   },
   roleName:{
    type:String,
    required:true
   },
   admin:{
    type:Array,
    default:[],
   },
   batch:{
    type:Array,
    default:[]
   },
   staffs:{
    type:Array,
    default:[]
   },
   trainee:{
    type:Array,
    default:[]
   },
   task:{
    type:Array,
    default:[]
   },
   eod:{
    type:Array,
    default:[]
   },
   assesment:{
    type:Array,
    default:[]
   },
   report:{
    type:Array,
    default:[]
   },
   shedule:{
    type:Array,
    default:[]
   },
   payroll:{
    type:Array,
    default:[]
   },
   config:{
    type:Array,
    default:[]
   },
   isArchive:{
    type:Boolean,
    default:false
   },
   active:{
    type:Boolean,
    default:true
   },
   hierarchyLevel:{
    type:Number,
    required:true
   },
   syllabus:{
    type:Array,
    default:[]
   },
   system:{
    type:Array,
    default:[]
   },
   leave:{
    type:Array,
    default:[],
   },
   role:{
    type:Array,
    default:[]
   },
   authorityLevel:{
    type:String,
    enum:['High','Medium','Low']
   }

  },{timestamp:true,collection:"Role"});

  const RoleModel = mongoose.model('Role',RoleSchema);

  module.exports = { RoleModel }