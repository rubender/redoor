import { __dbg } from './utls-debug'


export function testModulesAndGetActions({ Modules }) {
  let actions = {};
  let testActions = {};
  let testModules = {};

  Modules.forEach((module, mod_cnt) => {
    if(module.__module_name) {
      if(testModules[module.__module_name] === undefined) {
        testModules[module.__module_name] = module.__module_name;
      }else {
        __dbg('warn', 'initState',
          `Duplicate modules name ${module.__module_name}`
        );
      }
    }else {
      module.__module_name = `module_No_${mod_cnt}`
      __dbg('warn', 'initState',
        `Module in createStore No:[${mod_cnt+1}] has no __module_name; add to file \nexport const __module_name = "your module name";`
      );
    }

    for (const action_name in module) {
      if (action_name.substr(0, 6) === 'action' || action_name.substr(0, 2) === 'a_') {

        if(testActions[action_name] === undefined) {
          testActions[action_name] = module.__module_name || ' ';
        } else {
          __dbg('error', 'initState',
            `Modules: ${module.__module_name} <-> ${testActions[action_name]} has dublicate action: ${action_name}`
          );
        }
        actions[action_name] = module[action_name];
      }
    }
  });
  return actions;
}


export function testModulesAndGetStates({ Modules, props }) {
  let initState = {};
  let testInitState = {};

  Modules.forEach((module,mod_cnt) => {
    if (module.initState) {
      let res;

      let initType = typeof module.initState;

      if (initType == 'object') { //DOC: initialization by object
        res = module.initState;
      } else if (initType == 'function'){
        res = module.initState(props.providerConfig);
      } else {
        __dbg('warn', 'initState',
          `Warning: ${module.__module_name || `$Module No:[${mod_cnt}] in initState`} mast be function or object`
        );
        return ;
      }

      Object.keys(res).map(key=>{
        if(testInitState[key] !== undefined) {
          __dbg('warn', 'initState',
            `Warning: ${testInitState[key]} - "${module.__module_name || `$Module No:[${mod_cnt}] in initState`}" duplicate initState. Key: "${key}"\n`
          );
        } else {
          testInitState[key] = module.__module_name || key;
        }
      })
      initState = Object.assign({}, initState, res);

    } else {
      __dbg('warn', 'initState',
        `Warning: ${module.__module_name || `$Module No:[${mod_cnt}] in createStore`} Actions file has no initState`
      );
    }
  });

  return initState;
}


