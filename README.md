<<<<<<< HEAD
<!--
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]-->
[![MIT License][license-shield]][license-url]
<!--[![LinkedIn][linkedin-shield]][linkedin-url]-->



=======
>>>>>>> 71ecb305919da2c2f50375c771dbdf5bbdcf07e5
<br />
<p align="center">
  <h1 align="center">🚪 redoor</h1>
  <h3 align="center">
      React / Preact / Inferno <br />
      State container manager
  </h3>
</p>

[[RU](https://github.com/rubender/redoor/blob/master/README_RU.md) / [EN](https://github.com/rubender/redoor) ]

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

Redoor стейт менеджер для React, Preact, Inferno.  Быстрая легкая библиотека всего 4.9kб.


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

Пример для preact
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







Redoor - состоит из двух сущностей: store и actaions.
store - место хранения глобального стейта
actaions  - методы взаимодействия с store и компонентами



## [Store](#store)
Модуль инициализации проекта, здесь необходимо импортировать и у казать все необходимые actions моуди проекта. Так же по необходимости указать дебагер.
Первое что надо сделать это создать store. Для этого необходимо инициализировать два метода
createStoreFactory и его результат createStore. createStore возвращает два метода которые необходимо использовать в компонентах.



<h3>
    <a href="#create-store-factory" id="create-store-factory">createStore</a> /
    <code>
        createStoreFactory ({ Component,  createContext,   createElement } )
    </code>
</h3>


Прежде необходимо указать с какой библиотекой работает ваш проект. Это моет быть react, preact, inferno. Функция инициализации проекта, в качестве входных параметров принимет объект с тремя переменными.

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

Вернет функцию **createStore**



<h3>
    <a href="#create-store" id="create-store">createStore</a> /
    <code>
        createStore(modules_array[, devtool_object])
    </code>
</h3>

>__params__

__modules_array__ - массив объектов (модулей) см. actions <br/>
__devtool_object__ - необязательный параметр включения [redoor-devtool](https://github.com/rubender/redoor-devtool). По умолчанию false. Если вы хотите подключить devtool сервер укажите объект содержащий:
>  host  - ip devtool сервера
>  port  - порт
>  name  - название проекта

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

Возвращает объект  **{ Provider , Connect }**



<h3>
    <a href="#Provider" id="Provider">Provider</a> /
    <code>&#60;Provider&#62;&#60;/Provider&#62;</code>
</h3>

Рутовый компонент, потомки которого могут быть подключены с помощью функции **Connect**

>__props__

__providerConfig__  - "пропс" компонента передается в функцию  **initState** модуля "акшенсов".

*пример:*
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

Функция соеденения redoor стора с компонентом

>__params__

**Component** - компонент к которому необходимо подключить redoor <br/>
**filter_props_string** - стринговая переменная, список параметров кторые необходимо передать компоненту. Переменные должны быть разделены запятой.

> __return __

Возвращает компонент

*пример:*
~~~javascript
import {Connect} from './store.js'
const Component = ({counter, text})=><div>{text}:{counter}</div>
export default Connect(Component, "text, counter")
~~~



## [Actions](#Actions)

Все акшенсы, а также вспомогательные функции должны быть переданы в массив **createStore**
Модуль акшенсов имеет несколько функций название которых зарезерованно redoor. Названия акшенсов должны начинаться с префиксов: **a_** или **action**. Каждый модуль акшенсов может экспортировать свою функцию инициализации. Redoor объединит все объекты в один. В случае если вы продублируете один и тот же параметр в разных модулях redoor выведет в консоль ошибку. Чтобы понять в каких модулях произошла ошибка укажите **__module_name** переменную в ваш модуль.




<h3>
    <a href="#initState" id="initState">initState</a> /
    <code>
        initState(providerConfig)
    </code>
</h3>

Зарезервированная функция инициализации стора.    Она может быть как объект так и функция.
>__params__

 __providerConfig__ ---  параметр получаемый от __Provider__ <br/>
>__return__

функция должна вернуть объект с начальными значениями стора



<h3>
    <a href="#action-functions" id="action-functions">ACTION functions</a> /
    <code>
        ["a_", "action"]action_name({state, args, emit})
    </code>
</h3>

Акшенсы --- функции реализации логики работы с компанентами и сторам. Которые вызывают компоненты посредством __cxRun__. Функции должны в названии меть префикс __a___ или __action__,  в случае es6 модулей должны быть экспортированы.
 >__params__

Каждый акшенс имеет в качестве параметра объект с тремя аргументами:
__state__  --- текущий глобальный стейт <br/>
__args__ --- параметр передаваемый через __cxRun__ <br/>
__emit(name, data)__ --- функция отправки глобального события. Где  __name__ --- название события, __data__ --- передоваемые данные <br/>

>__return__

Функция может вернуть объект с новыми данными стора и обновят все компоненты которые на них подписаны. Важно! Если функция будет асинхронной, то необходимо воспользоваться __setState__ из __bindStateMethods__.

*пример:*
~~~javascript
export const a_switch = ({ state }) => {
    return  {
        switch_button: state.switch_button === 'off' ? 'on' : 'off'
    }
}
~~~

*асинхронный код:*
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

Каждый акшен модуль может содержать функцию которая инициируется каждый раз когда происходит событие генерированное функцией __emit__ компонентом или акшенсом.
 >__params__

__name__ - название события <br/>
__data__ - данные переданные через функцию __emit__ <br/>
>__return__
нет



<h3>
    <a href="#bindStateMethods" id="bindStateMethods">bindStateMethods</a> /
    <code>
        bindStateMethods(getState, setState, emit)
    </code>
</h3>


Если вы ваши акшенсы имеют асинхронный кода то необходимо пробросить функции обнаваления стейта redoor. Это так же может быть полезно в случае работы с вебсокетами
 >__params__

__getState__ -  функция получения стейта <br/>
__setState__ - функция установки стейта <br/>
__emit__ - функция отправки события <br/>
>__return__
нет

*пример:*
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
Функция инициации акшенса или обновления стейта на прямую. Автоматически добавляется связанным компонентам через props.

> **params:**

__action_name__ - стринговая переменная название акшена <br/>
__args__ - передоваемые акшену данные <br/>

> **return:**
нет



<h3>
    <a href="#cxRun-object" id="cxRun-object">cxRun</a> /
    <code>
        cxRun(object)
    </code>
</h3>

Если в качестве параметра указан объект, то функция обнавляет стейт напрямую без акшена.
 >__params__

__object__ - объект обновления глобального стейта <br/>
 >__return__
 нет




<h3>
    <a href="#cxEmit" id="cxEmit">cxEmit</a> /
    <code>
        cxEmit(event_name, args)
    </code>
</h3>
Функция отправки глобального события.
>__params__

 __event_name__ - название события <br/>
 __data__ - передоваемые данные <br/>

>__return__
  нет

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