
<p>
  <h1>redoor</h1>
  <h3>
      React / Preact / Inferno <br />
      State container manager
  </h3>
</p>

<!-- TABLE OF CONTENTS -->
## Table of Contents

**[About the Project](#about-the-project)** <br/>
**[Installation](#installation)** <br/>
**[Getting Started](#getting-started)** <br/>
**[Documentation](#documentation)** <br/>
&nbsp;&nbsp;&nbsp; **[Store](#store)** <br/>
&nbsp;&nbsp;&nbsp; [createStoreFactory](#create-store-factory) <br/>
&nbsp;&nbsp;&nbsp; [createStore](#create-store)<br/>
&nbsp;&nbsp;&nbsp; [Provider](#Provider)<br/>
&nbsp;&nbsp;&nbsp; [Connect](#Connect)<br/>
&nbsp;&nbsp;&nbsp; **[Actions](#Actions)**<br/>
&nbsp;&nbsp;&nbsp; [initState](#initState)<br/>
&nbsp;&nbsp;&nbsp; [ACTION functions](#action-functions)<br/>
&nbsp;&nbsp;&nbsp; [listen](#listen)<br/>
&nbsp;&nbsp;&nbsp; [bindStateMethods](#bindStateMethods)<br/>
&nbsp;&nbsp;&nbsp; [__module_name](#module-name)<br/>
&nbsp;&nbsp;&nbsp; [cxRun(action_name, args)](#cxRun-string)<br/>
&nbsp;&nbsp;&nbsp; [cxRun(object)](#cxRun-object)<br/>
&nbsp;&nbsp;&nbsp; [cxEmit](#cxEmit)<br/>
**[Devtool](#Devtool)**<br/>
**[License](#license)**<br/>


## [About The Project](#about-the-project)

Redoor state manager for React, Preact, Inferno. A fast, lightweight library of only 4.9 kb.


## [Installation](#Installation)

>npm
```sh
npm install redoor
```

>yarn
```sh
yarn add redoor
```

##  [Getting Started](#getting-started)

Example for preact
```javascript
import { h, Component, createContext, render } from 'preact';
import createStoreFactory from 'redoor';

const createStore = createStoreFactory({
    Component:Component,
    createContext:createContext,
    createElement:h
});

const actions_module = {
  initState:{
    cnt:0,
    direction:''
  },
  a_click:({state,args})=>({
    cnt:(state.cnt + args),
    direction:(args > 0 ? 'plus' : 'minus')
  })
}

const { Provider, Connect } = createStore([actions_module]);

const ButtonPlus = Connect(
  ({cxRun})=><button onClick={e=>cxRun('a_click',1)}>plus</button>
)

const ButtonMinus = Connect(
  ({cxRun})=><button onClick={e=>cxRun('a_click',-1)}>minus</button>
)

const Display = Connect(({direction,cnt})=><div>
      count: {cnt} <br/>
      direction: {direction}
</div>)

const Main = () => (
  <Provider>
    <Display/>
    <hr/>
    <ButtonPlus/> - <ButtonMinus/>
  </Provider>
)

render(<Main />, document.getElementById("app"));
```

## [Documentation](#documentation)
<pre>
                           +-----+                  `
                           |Store|                  `
                           +-----+                  `
                              |                     `
 +---------+    +-----+    +------+    +---------+  `
 |Component| -> |cxRun| -> |Action| -> |new state|  `
 +---------+    +-----+    +------+    +---------+  `
      ^                                      |      `
      |                                      |      `
      +--------------------------------------+      `
</pre>




Redoor - consists of two entities: store and actions.
store - the storage location of the global state
actions - methods for interacting with the store and components



## [Store](#store)
The project initialization module, here you need to import and specify all the necessary actions modules of the project. Also, if necessary, specify the debager options. The first thing to do is to create a store. To do this, you need to initialize two methods: createStoreFactory, createStore. createStore returns two methods that should be used in components.


<h3>
    <a href="#create-store-factory" id="create-store-factory">createStore</a> /
    <code>
        createStoreFactory ({ Component,  createContext,   createElement } )
    </code>
</h3>


First, you need to specify which library your project works with. It can be react, preact, inferno. The project initialization function takes an object with three variables as input parameters.


>__params__

**Component**
**createContext**
**createElement**

*react:*
~~~javascript
import React from 'react'
import createStoreFactory from 'redoor';
const createStore = createStoreFactory({
    Component: React.Component,
    createContext: React.createContext,
    createElement: React.createElement
} )
~~~
*preact:*
~~~javascript
import { h, Component, createContext } from 'preact';
import createStoreFactory from 'redoor';
const createStore = createStoreFactory({
    Component:Component,
    createContext:createContext,
    createElement:h
});
~~~

>__return__

Returns function **createStore**



<h3>
    <a href="#create-store" id="create-store">createStore</a> /
    <code>
        createStore(modules_array[, devtool_object])
    </code>
</h3>

>__params__

__modules_array__ - for an array of objects (modules), see actions <br/>
__devtool_object__ - optional debugger object [redoor-devtool](https://github.com/rubender/redoor-devtool). Default is false. If you want to connect the devtool server specify the object:
>  host  - ip devtool сервера
>  port  - port
>  name  - name of project

*пример:*
~~~javascript
import * as actions_Main from './actions_Main.js'
const { Provider, Connect } = createStore(
    [ actions_Main ],
    {
        host: 'localhost',
        port: '8333',
        name:'project_name'
    }
);
~~~
>__return__

Returns object  **{ Provider , Connect }**



<h3>
    <a href="#Provider" id="Provider">Provider</a> /
    <code>&#60;Provider&#62;&#60;/Provider&#62;</code>
</h3>

A root component whose descendants can be connected using the function **Connect**

>__props__

__providerConfig__  - Property of the component is passed to the **initState** function of the "actions" module.

*example:*
~~~javascript
import {Provider} from './store.js'
<Provider>
    <RootComponent providerConfig={{mobile:true}}/>
</Provider>
~~~



<h3>
    <a href="#Connect" id="Connect">Connect</a> /
    <code>
        Connect(Component [, filter_props_string])
    </code>
</h3>

Connecting the redoor store to the component

>__params__

**Component** - the component to connect to <br/>
**filter_props_string** - string variable, a list of parameters that must be passed to the component. Variables must be separated by commas. By default connect all props to component

> __return __

Returns the component

*example:*
~~~javascript
import {Connect} from './store.js'
const Component = ({counter, text})=><div>{text}:{counter}</div>
export default Connect(Component, "text, counter")
~~~



## [Actions](#Actions)

The action module has several functions, the name of which is redoor. Action names must start with the following prefixes: **a_** or **action**. Each action module can export its own initialization function. Redoor will merge all the objects into one. If you duplicate the same parameter in different modules, redoor will output an error to the console. To understand which modules the error occurred in, specify the ** __module_name* * variable in your module.



<h3>
    <a href="#initState" id="initState">initState</a> /
    <code>
        initState(providerConfig)
    </code>
</h3>

Reserved store initialization function. It can be either an object or a function.
>__params__

 __providerConfig__ ---  parameter received from __Provider__ <br/>
>__return__

the function should return an object with the initial values of the store



<h3>
    <a href="#action-functions" id="action-functions">ACTION functions</a> /
    <code>
        ["a_", "action"]action_name({state, args, emit})
    </code>
</h3>


Actions - - - functions for implementing the logic of working with components and sotre. Which call components via __cxRun__. Functions must be prefixed with __a___ or __action__ in the name, in the case of es6 modules, they must be exported.
 >__params__

Every action has object as a parameter with three arguments:
__state__ --- the current global state <br/>
__args__ --- the parameter passed through __cxRun__ <br/>
__emit(name, data)__ --- function to send global event. Where __name__ - - - event name, _ _ data__ - - - transmitted data <br/>

>__return__
The function can return an object with new store data and update all the components that are subscribed to them. Important! For async functions you need to use __setState__ from __bindStateMethods__.


*example:*
~~~javascript
export const a_switch = ({ state }) => {
    return  {
        switch_button: state.switch_button === 'off' ? 'on' : 'off'
    }
}
~~~

*async:*
~~~javascript
// cxRun("a_getUsers", "user_1")
let __getState;
export const bindStateMethods = (stateFn, updateState, emit) => {
    __setState = updateState;
};
export const a_getUsers = async ({ args: user_id, emit }) => {
    __setState({
        loading: true // show loading status
    });
    const userData = await getUserData(user_id); // get data
    emit('use_get_data', userData); // emit event "use_get_data"
    __setState({
        loading:false, // hide loading status
        userData // update user data
    });
};

~~~


<h3>
    <a href="#listen" id="listen">listen</a> /
    <code>
        listen(name, data)
    </code>
</h3>

Each action module can contain a function that is triggered every time an event occurs generated by the __emit__ function of a component or action.
 >__params__

__name__ - event name <br/>
__data__ - data passed through the function __emit__ <br/>
>__return__
no



<h3>
    <a href="#bindStateMethods" id="bindStateMethods">bindStateMethods</a> /
    <code>
        bindStateMethods(getState, setState, emit)
    </code>
</h3>



If you your actions have asynchronous code, then you need to throw the update functions of the redoor state. This can also be useful when working with websockets
 >__params__

__getState__ -  get state function <br/>
__setState__ -  set state function <br/>
__emit__ - send event function <br/>
>__return__
no

*example:*
~~~javascript
let __setState;
let __getState;
let __emit;
export const bindStateMethods = (stateFn, updateState, emit) => {
  __getState = stateFn;
  __setState = updateState;
  __emit = emit;
};
~~~


<h3>
    <a href="#module-name" id="module-name">__module_name</a> /
    <code>
        __module_name
    </code>
</h3>

Reserved variable name for debug. Redoor use this variable for debug.
Ex.:
~~~javascript
export const  __module_name = 'pay_module'
~~~



<h3>
    <a href="#cxRun-string" id="cxRun-string">cxRun</a> /
    <code>
        cxRun(action_name, args)
    </code>
</h3>

The function of initiating an action or updating the state directly. Automatically bind to related components via props.

> **params:**

__action_name__ - name of action (string)<br/>
__args__ - any data (object,string array) <br/>

> **return:**
нет



<h3>
    <a href="#cxRun-object" id="cxRun-object">cxRun</a> /
    <code>
        cxRun(object)
    </code>
</h3>

If an object is specified as a parameter, the function updates the state directly without an action.
 >__params__

__object__ - object to update state <br/>
 >__return__
 no




<h3>
    <a href="#cxEmit" id="cxEmit">cxEmit</a> /
    <code>
        cxEmit(event_name, args)
    </code>
</h3>
Function for sending a global event.
>__params__

 __event_name__ - event name <br/>
 __data__ - any data <br/>

>__return__
  no

<!-- Devtool -->
## [Devtool](#devtool)

[redoor-devtool](https://github.com/rubender/redoor-devtool)


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<pre>

  ______ _______ ______   _____   _____   ______
 |_____/ |______ |     \ |     | |     | |_____/
 |    \_ |______ |_____/ |_____| |_____| |    \_

</pre>
