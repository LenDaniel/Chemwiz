const path=require('node:path');
const root=path.resolve(__dirname,'..');
const args=process.argv.slice(2);let apply=false,envFile=path.join(root,'.env');
for(let i=0;i<args.length;i++){
  if(args[i]==='--apply')apply=true;
  else if(args[i]==='--dry-run')apply=false;
  else if(args[i]==='--env'&&args[i+1])envFile=path.resolve(args[++i]);
  else{console.error('Usage: npm run privacy:maintenance -- [--env private-file] [--dry-run | --apply]');process.exit(1);}
}
require('dotenv').config({path:envFile,quiet:true});
async function main(){require('../backend/src/config/runtime').validateRuntimeConfig();await require('../backend/src/config/db')();const result=await require('../backend/src/services/privacyMaintenance.service').runMaintenance({apply});console.log(JSON.stringify(result,null,2));}
main().catch(error=>{console.error('Privacy maintenance failed:',{name:error.name,code:error.code || 'MAINTENANCE_FAILED'});process.exitCode=1;}).finally(async()=>{await require('mongoose').disconnect();});
