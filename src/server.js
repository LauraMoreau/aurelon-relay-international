import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,resolve,extname} from 'node:path';
import {DEFAULT_CONFIG,simulate} from './relay.js';
const root = resolve(dirname(fileURLToPath(import.meta.url)),'..','public');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(req.method==='GET' && url.pathname==='/api/config') return json(res,DEFAULT_CONFIG);
  if(req.method==='POST' && url.pathname==='/api/simulate') {
    try {
      let raw=''; for await (const chunk of req) {raw+=chunk;if(raw.length>100000)throw Error('Request too large');}
      const input=JSON.parse(raw);return json(res,simulate(input.config,input.scenario));
    }catch(err){return json(res,{error:err.message},400)}
  }
  if(req.method!=='GET')return json(res,{error:'Method not allowed'},405);
  const path=url.pathname==='/'?'/index.html':url.pathname;
  if(!['/index.html','/app.js','/styles.css'].includes(path))return json(res,{error:'Not found'},404);
  try{const file=await readFile(resolve(root,path.slice(1)));res.writeHead(200,{'content-type':types[extname(path)],'cache-control':'no-store'});res.end(file)}
  catch{json(res,{error:'Not found'},404)}
});
function json(res,obj,status=200){res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(obj))}
server.listen(process.env.PORT||3000,()=>console.log(`Relay lab at http://localhost:${process.env.PORT||3000}`));
