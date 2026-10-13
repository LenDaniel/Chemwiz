const test=require('node:test');
const assert=require('node:assert/strict');
const {validateProduction}=require('../scripts/check-production.cjs');
test('production checks require MongoDB, HTTPS and canonical private settings',()=>{
 const valid={NODE_ENV:'production',DATA_MODE:'mongodb',MONGODB_URI:'mongodb+srv://database-user:fixture@cluster.example/chemwiz',JWT_SECRET:'fixture-private-secret-longer-than-32characters',APP_URL:'https://chemwiz.example'};
 assert.deepEqual(validateProduction(valid),[]);
 assert.ok(validateProduction({...valid,DATA_MODE:'local'}).some(issue=>issue.includes('DATA_MODE')));
 assert.ok(validateProduction({...valid,APP_URL:'http://localhost:5000'}).some(issue=>issue.includes('APP_URL')));
 assert.ok(validateProduction({...valid,MONGO_URI:'conflicting-alias'}).some(issue=>issue.includes('canonical')));
 assert.ok(validateProduction({...valid,JWT_SECRET:'short'}).some(issue=>issue.includes('JWT_SECRET')));
});
