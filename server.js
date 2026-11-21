const http=require('http'),fs=require('fs');
const F={'/':['index.html','text/html'],'/style.css':['style.css','text/css'],'/app.js':['app.js','text/javascript']};
const SYS="You are Elite AI, a fast, private assistant running fully offline on the user's own device. Be clear, accurate and concise. Use Markdown for lists and code.";
const O='http://127.0.0.1:11434';
http.createServer(async(req,res)=>{
  if(req.method==='POST'&&req.url==='/chat'){
    let b='';for await(const c of req)b+=c;
    const ac=new AbortController();res.on('close',()=>ac.abort());
    res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
    try{
      const r=await fetch(O+'/api/chat',{method:'POST',signal:ac.signal,headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'qwen2.5:0.5b',stream:true,messages:[{role:'system',content:SYS},...JSON.parse(b).messages]})});
      const d=new TextDecoder();let buf='';
      for await(const ch of r.body){buf+=d.decode(ch,{stream:true});let i;
        while((i=buf.indexOf('\n'))>=0){const l=buf.slice(0,i);buf=buf.slice(i+1);
          if(l.trim()){try{res.write(JSON.parse(l).message?.content||'')}catch{}}}}
    }catch(e){if(e.name!=='AbortError')res.write('The offline model is not running. Start it with: sudo systemctl start ollama')}
    return res.end();
  }
  if(req.url==='/status'){
    try{await fetch(O+'/api/tags');res.writeHead(200);res.end('ok')}catch{res.writeHead(503);res.end('down')}return;
  }
  const f=F[req.url.split('?')[0]];
  if(!f){res.writeHead(404);return res.end('Not found')}
  res.writeHead(200,{'Content-Type':f[1]+'; charset=utf-8'});res.end(fs.readFileSync(__dirname+'/'+f[0]));
}).listen(3000,()=>console.log('Elite AI running at http://localhost:3000'));
