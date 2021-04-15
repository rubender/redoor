(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.redoor = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  const hasOwnProperty = Object.prototype.hasOwnProperty;

  function is(x, y) {
    return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y // eslint-disable-line no-self-compare
    ;
  }
  /**
   * Performs equality by iterating through keys on an object and returning false
   * when any key has values which are not strictly equal between the arguments.
   * Returns true when the values of all keys are strictly equal.
   */


  function shallowEqual(objA, objB) {
    if (is(objA, objB)) {
      return true;
    }

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
      return false;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
      return false;
    } // Test for A's keys different from B.


    let i = keysA.length;

    while (i--) {
      //for (let i = 0; i < keysA.length; i++) {
      if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
        return false;
      }
    }

    return true;
  }
  const getStatePropsFilterFunction = filterParam => {
    let stateToPropsFunc = state => state; // no filter


    if (!!filterParam) {
      // DOC: with filter
      if (typeof filterParam === 'string') {
        // DOC: filter is string
        filterParam = filterParam.replace(/\s+/g, '');
        let paramsValueNames = filterParam.split(/[,]/g).filter(i => i.length);

        stateToPropsFunc = state => {
          return paramsValueNames.reduce((a, k) => (a[k] = state[k], a), {});
        };
      }

      if (typeof filterParam === 'function') {
        // DOC: filter custim function
        stateToPropsFunc = filterParam;
      }
    }

    return stateToPropsFunc;
  };

  const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  let __dbg = () => {};
  function runDebugger(dbg_opt) {
    let __ws = {};

    function print_log(etype, name, args) {
      if (!!dbg_opt.log) {
        if (etype === 'warn') {
          console.warn(`redoor: ${etype} : ${name} : ${args}`, args);
        } else if (etype === 'error') {
          console.error(`redoor: ${etype} : ${name} : ${args}`, args);
        } else {
          console.log(`redoor: ${etype} : ${name} : ${args}`, args);
        }
      }
    }

    __dbg = (etype, name, args) => {
      if (!!dbg_opt.log) {
        print_log(etype, name, args);
      }
    };

    const HOST = dbg_opt && dbg_opt.host || 'localhost';
    const PORT = dbg_opt && dbg_opt.port || 8333;
    const wsurl = `ws://${HOST}:${PORT}`;
    const proj_name = dbg_opt && dbg_opt.name || 'debugger' + ~~(Math.random() * 1000);

    if (dbg_opt && dbg_opt.WebSocket) {
      __ws = new dbg_opt.WebSocket(wsurl);
    } else {
      if (IS_BROWSER) {
        __ws = new WebSocket(wsurl);
      }
    }

    if (IS_BROWSER) {
      window.onerror = function (msg, url, lineNo, columnNo, error) {
        __dbg('error', 'error', {
          msg,
          url,
          lineNo,
          columnNo,
          error: error.stack.toString()
        });
      };
    }

    __ws.onopen = msg => {
      console.log(`\nProvider WebSocket debuger connection is successful.\nurl: ${wsurl}\nname:${proj_name}\n\n`);

      __dbg = (etype, name, args) => {
        print_log(etype, name, args);
        let data = {
          type: etype,
          name: name,
          args: args
        };
        data.proj_name = proj_name;
        data.created = Date.now();
        __ws && setTimeout(() => __ws.send(JSON.stringify(data)));
      }; // __dbg

    };

    __ws.onerror = error => {//console.error(`Provider debugger connection (${wsurl}) fail. Error: `,error);
    };

    __ws.onclose = e => {
      console.log(`Provider WebSocket  debugger connection (${wsurl}) is closed.`);
    };

    return __dbg;
  } //runDebugger

  function testModulesAndGetActions({
    Modules
  }) {
    let actions = {};
    let testActions = {};
    let testModules = {};
    Modules.forEach((module, mod_cnt) => {
      if (module.__module_name) {
        if (testModules[module.__module_name] === undefined) {
          testModules[module.__module_name] = module.__module_name;
        } else {
          __dbg('warn', 'initState', `Duplicate modules name ${module.__module_name}`);
        }
      } else {
        //module.__module_name = `module_No_${mod_cnt}`
        __dbg('warn', 'initState', `Module in createStore No:[${mod_cnt + 1}] has no __module_name; add to file \nexport const __module_name = "your module name";`);
      }

      for (const action_name in module) {
        if (action_name.substr(0, 6) === 'action' || action_name.substr(0, 2) === 'a_') {
          if (testActions[action_name] === undefined) {
            testActions[action_name] = module.__module_name || ' ';
          } else {
            __dbg('error', 'initState', `Modules: ${module.__module_name} <-> ${testActions[action_name]} has dublicate action: ${action_name}`);
          }

          actions[action_name] = module[action_name];
        }
      }
    });
    return actions;
  }
  function testModulesAndGetStates({
    Modules,
    props
  }) {
    let initState = {};
    let testInitState = {};
    Modules.forEach((module, mod_cnt) => {
      if (module.initState) {
        let res;
        let initType = typeof module.initState;

        if (initType == 'object') {
          //DOC: initialization by object
          res = module.initState;
        } else if (initType == 'function') {
          res = module.initState(props.providerConfig);
        } else {
          __dbg('warn', 'initState', `Warning: ${module.__module_name || `$Module No:[${mod_cnt}] in initState`} mast be function or object`);

          return;
        }

        Object.keys(res).map(key => {
          if (testInitState[key] !== undefined) {
            __dbg('warn', 'initState', `Warning: ${testInitState[key]} - "${module.__module_name || `$Module No:[${mod_cnt}] in initState`}" duplicate initState. Key: "${key}"\n`);
          } else {
            testInitState[key] = module.__module_name || key;
          }
        });
        initState = Object.assign({}, initState, res);
      } else {
        __dbg('warn', 'initState', `Warning: ${module.__module_name || `$Module No:[${mod_cnt}] in createStore`} Actions file has no initState`);
      }
    });
    return initState;
  }

  /**
    createStoreFactory: incapsulate functions for React / Preact / Inferno
  */

  function createStoreFactory({
    Component,
    createContext,
    createElement
  }) {
    class PureComponent extends Component {
      shouldComponentUpdate(nextProps, nextState) {
        const {
          renderComponent1,
          ...restA
        } = this.props;
        const {
          renderComponent2,
          ...restB
        } = nextProps;
        return !shallowEqual(restA, restB);
      }

      render() {
        const {
          renderComponent,
          ...rest
        } = this.props;
        return renderComponent(rest);
      }

    } //PureComponent


    const CreateConnect = Consumer => (UserComponent, filterParam) => {
      const mapStateToProps = getStatePropsFilterFunction(filterParam);

      const RenderComponent = props => createElement(UserComponent, { ...props
      }, props.children); //props => <UserComponent {...props} />;


      const ConnectedComponent = props => createElement(Consumer, null, value => {
        const {
          state,
          cxRun,
          cxEmit
        } = value;
        const filteredState = mapStateToProps(state || {});
        let p = {
          renderComponent: RenderComponent,
          ...props,
          ...filteredState,
          cxRun: cxRun,
          cxEmit: cxEmit
        };
        return createElement(PureComponent, { ...p
        }, props.children); // <PureComponent {...p} />;
      } // children
      ); //ConnectedComponent


      ConnectedComponent.displayName = `Connect(${UserComponent.displayName || UserComponent.name || 'Unknown'})`;
      return ConnectedComponent;
    }; //CreateConnect


    const ProviderEx = (StoreContext, Modules) => {
      let __actions = testModulesAndGetActions({
        Modules,
        __dbg
      });

      return class Provider extends Component {
        constructor(props) {
          super(props);

          _defineProperty(this, "__cxRun", (actionName, //  action name
          args, //  argument pass into action
          resFn = () => {}) => {
            try {
              let newstate;

              if (typeof actionName === 'string') {
                newstate = __actions[actionName]({
                  done: this.__updateState,
                  state: this.state,
                  actions: __actions,
                  emit: this.__emit,
                  args: args
                });

                __dbg('action', actionName, args);
              }

              if (typeof actionName === 'object') {
                newstate = actionName;

                __dbg('action', 'setState', actionName);
              }

              if (typeof actionName === 'function') {
                newstate = actionName;

                __dbg('action', 'setState', '[[function]]');
              }

              this.__updateState(newstate, resFn);
            } catch (e) {
              if (!__actions[actionName]) {
                __dbg('error', actionName, 'redoor -> No action function: [' + actionName + ']');
              }

              __dbg('error', actionName, `Error: ',${e.toString()}`);
            }
          });

          _defineProperty(this, "__emit", (event, data) => {
            __dbg('emit', event, data);

            this.listeners.map(listener => {
              listener(event, data);
            });
          });

          _defineProperty(this, "__updateState", (fn, call) => {
            if (fn === null || fn === undefined) return null; // !!! DEBUG if function

            this.setState(fn, call);
          });

          this.listeners = [];

          if (!Array.isArray(Modules)) {
            return __dbg('error', 'createStore', 'Error: createStore() actions must be an array!');
          }

          const _initState = testModulesAndGetStates({
            Modules,
            props,
            __dbg
          });

          __dbg('action', 'initState', _initState);

          this.state = { // global state
            ..._initState //route:route

          };
          Modules.map(module => {
            module.bindStateMethods && module.bindStateMethods( // DOC:
            () => this.state, //first parameter
            this.__updateState, //sendond parameter
            this.__emit //thord paramter
            );
            module.listen && this.listeners.push(module.listen);
          });
        } //constructor

        /**
          run action
          params:
          obj - string or object or function
          args - parameters for action
          resFn - callback success update state
        */


        // __updateState
        render() {
          __dbg('state', 'state', this.state);

          let value = {
            state: this.state,
            cxRun: this.__cxRun,
            cxEmit: this.__emit
          };
          return createElement(StoreContext.Provider, // element
          {
            value: value
          }, // props
          this.props.children // children
          );
        } //render


      }; //Provider
    }; //ProviderEx


    const createStore = (ACTIONS, dbg = false) => {
      //__dbg = !!dbg;
      if (dbg) {
        runDebugger(dbg);
      }

      const StoreContext = createContext();
      const Provider = ProviderEx(StoreContext, ACTIONS);
      const Connect = CreateConnect(StoreContext.Consumer);
      return {
        Provider,
        Connect
      };
    }; //createStore


    return createStore;
  } //createStoreFactory

  return createStoreFactory;

})));
