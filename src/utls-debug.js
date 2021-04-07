
const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export let __dbg = () => {}



export function runDebugger(dbg_opt) {
  let __ws = {};

  function print_log(etype, name, args){
      if(etype === 'warn') {
        console.warn(`rprovider: ${etype} : ${name} : ${args}`,args)
      }else if(etype === 'error') {
        console.error(`rprovider: ${etype} : ${name} : ${args}`,args)
      }else {
        console.log(`rprovider: ${etype} : ${name} : ${args}`,args)
      }
  }
  __dbg = (etype, name, args) => {
    if(!!dbg_opt.log) {
      print_log(etype,name,args);
    }
  }


  console.log('provider.js -> runDebugger: ',dbg_opt, __dbg);

  const HOST = dbg_opt && dbg_opt.host || 'localhost';
  const PORT = dbg_opt && dbg_opt.port || 8666;
  const wsurl = `ws://${HOST}:${PORT}`;
  const proj_name = dbg_opt && dbg_opt.name || ('debugger'+~~(Math.random()*1000));

  if(dbg_opt  && dbg_opt.WebSocket) {
    __ws = new (dbg_opt.WebSocket)(wsurl);
  } else {
    if( IS_BROWSER ) {
      __ws = new WebSocket(wsurl);
    }
  }

  if( IS_BROWSER ) {
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      __dbg('error', 'error', { msg, url, lineNo, columnNo, error: error.stack.toString() });
    }
  }



  __ws.onopen = msg => {
    console.log(`\nProvider WebSocket debuger connection is successful.\nurl: ${wsurl}\nname:${proj_name}\n\n`);
    let dbg_id = Math.random();

    __dbg = (etype, name, args) => {
      print_log(etype,name,args);
      let data = { type:etype, name:name, args:args }
      data.proj_name = proj_name;
      data.created = Date.now();
      __ws && setTimeout(()=>__ws.send(JSON.stringify(data)));
    } // __dbg
  }

  __ws.onerror = error => {
    //console.error(`Provider debugger connection (${wsurl}) fail. Error: `,error);
  };

  __ws.onclose = e => {
    console.log(`Provider WebSocket  debugger connection (${wsurl}) is closed.`)
  }
  return __dbg;
} //runDebugger
