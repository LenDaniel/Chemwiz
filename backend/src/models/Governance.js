const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  key: {type:String,required:true,unique:true},
  kind: {type:String,required:true,index:true},
  ownerId: {type:String,default:'',index:true},
  schoolId: {type:String,default:'',index:true},
  revision: {type:Number,required:true,default:1},
  data: {type:mongoose.Schema.Types.Mixed,required:true},
},{timestamps:true,minimize:false});
module.exports = mongoose.model('Governance',schema);
