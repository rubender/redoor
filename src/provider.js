import { shallowEqual, getStatePropsFilterFunction } from './utls'
import { runDebugger, __dbg } from './utls-debug'
import { testModulesAndGetActions, testModulesAndGetStates } from './utls-module-loader'


/**
  createStoreFactory: incapsulate functions for React / Preact / Inferno
*/

function createStoreFactory({ Component, createContext, createElement }) {

  class PureComponent extends Component {
    shouldComponentUpdate(nextProps, nextState) {
      const { renderComponent1, ...restA } = this.props;
      const { renderComponent2, ...restB } = nextProps;
      return !shallowEqual(restA,restB);
    }
    render() {
      const { renderComponent, ...rest } = this.props;
      return renderComponent(rest);
    }
  } //PureComponent


  const CreateConnect = (Consumer) => (UserComponent, filterParam) => {
    const mapStateToProps = getStatePropsFilterFunction(filterParam);
    const RenderComponent = props => createElement(UserComponent,  {...props}, null); //props => <UserComponent {...props} />;

    const ConnectedComponent = props => createElement(
        Consumer,
        null,
        value => {
          const { state, cxRun, cxEmit } = value;
          const filteredState = mapStateToProps(state || {});
          let p = {
            renderComponent:RenderComponent,
            ...props,
            ...filteredState,
            cxRun:cxRun,
            cxEmit:cxEmit,
          }
          return createElement(PureComponent, {...p}, null); // <PureComponent {...p} />;
        } // cchildren
    ); //ConnectedComponent


    ConnectedComponent.displayName = `Connect(${
      UserComponent.displayName ||
      UserComponent.name ||
      'Unknown'
    })`;

    return ConnectedComponent;
  } //CreateConnect


  const ProviderEx = (StoreContext, Modules) => {

    let __actions = testModulesAndGetActions({ Modules, __dbg });

    return class Provider extends Component {
      constructor(props) {
        super(props);

        this.listeners = [];

        if (!Array.isArray(Modules)) {
          return __dbg('error', 'createStore', 'Error: createStore() actions must be an array!');
        }

        const _initState = testModulesAndGetStates({ Modules, props, __dbg });
        __dbg('action', 'initState', _initState);

        this.state = {          // global state
          ..._initState,
          //route:route
        };

        Modules.map(
          module => {
            module.bindStateMethods &&
              module.bindStateMethods( // DOC:
                () => this.state, //first parameter
                this.__updateState, //sendond parameter
                this.__emit, //thord paramter
              );

            module.listen && this.listeners.push(module.listen);
          }
        );
      } //constructor


      /**
        run action
        params:
        obj - string or object or function
        args - parameters for action
        resFn - callback success update state
      */
      __cxRun = (
                  actionName,       //  action name
                  args,             //  argument pass into action
                  resFn = () => {}
                ) => {
        try {
          let newstate;
          if (typeof actionName === 'string') {
            newstate = __actions[actionName]({
              done: this.__updateState,
              state: this.state,
              actions: __actions,
              emit: this.__emit,
              args: args,
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
            __dbg('error', actionName, 'provider.js -> No action function: [' + actionName + ']');
          }

          __dbg('error', actionName, `Error: ',${e.toString()}`);

        }
      } // __cxRun

      __emit = (event, data) => {
        __dbg('emit', event, data);
        this.listeners.map(listener => {
          setTimeout(()=>{
            listener(event, data);
          });
        });
      } // __emit

      __updateState = (fn,call) => {
        if(fn === null || fn === undefined) return null;
        // !!! DEBUG if function
        this.setState(fn,call);
      } // __updateState

      render() {
        __dbg('state', 'state', this.state);

        let value = {
          state:this.state,
          cxRun:this.__cxRun,
          cxEmit:this.__emit
        }
        return createElement(
          StoreContext.Provider,  // element
          {value:value},          // props
          this.props.children     // children
        );
      } //render
    } //Provider
  } //ProviderEx

  const createStore = ( ACTIONS, dbg = false ) => {
    //__dbg = !!dbg;
    if(dbg) {
      runDebugger(dbg);
    }
    const StoreContext = createContext();
    const Provider = ProviderEx(StoreContext, ACTIONS);
    const Connect = CreateConnect(StoreContext.Consumer);
    return {
      Provider,
      Connect,
    }
  } //createStore

  return createStore;
} //createStoreFactory

export default createStoreFactory;



