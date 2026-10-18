const crypto = require('node:crypto');
const {getDataMode} = require('../config/runtime');
const {modelForRuntime} = require('../data/workerMongoContext');
const local = getDataMode()==='local';
const model = local ? null : modelForRuntime(require('../models/Governance'));
const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
async function list(filter={}) {
  if(local) return require('../data/localModels').Governance.list(filter);
  await model.init();return model.find(filter).lean();
}
async function get(key) {
  if(local) return require('../data/localModels').Governance.get(key);
  await model.init();return model.findOne({key}).lean();
}
async function put(key,revision,data,metadata={}) {
  if(local) return require('../data/localModels').Governance.put(key,revision,data,metadata);
  await model.init();
  if(!revision) {
    try{return (await model.create({key,revision:1,data,...metadata})).toObject();}
    catch(error){if(error.code===11000)return null;throw error;}
  }
  return model.findOneAndUpdate({key,revision},{$set:{data,...metadata},$inc:{revision:1}},{new:true,runValidators:true}).lean();
}
async function mutate(key,change,metadata={}) {
  for(let attempt=0;attempt<5;attempt++) {
    const previous=await get(key);
    const data=await change(clone(previous?.data),previous);
    const saved=await put(key,previous?.revision || 0,data,metadata);
    if(saved)return saved;
  }
  throw Object.assign(new Error('This record changed in another session. Refresh and retry.'),{statusCode:409,code:'GOVERNANCE_CONFLICT'});
}
async function remove(key,revision) {
  if(local)return require('../data/localModels').Governance.remove(key,revision);
  return (await model.deleteOne({key,revision})).deletedCount===1;
}
module.exports={get,list,put,mutate,remove,id:()=>crypto.randomBytes(12).toString('hex')};
