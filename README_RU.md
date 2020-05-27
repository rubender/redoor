




<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!--
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]-->
[![MIT License][license-shield]][license-url]
<!--[![LinkedIn][linkedin-shield]][linkedin-url]-->



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h1 align="center">
      <a href="https://github.com/rubender/redoor"> redoor  </a>
  </h1>

  <h3 align="center">
      React / Preact / Inferno <br />
      State container manager
  </h3>

  <!--p align="center">
    An awesome README template to jumpstart your projects!
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template">View Demo</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Report Bug</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Request Feature</a>
  </p>
</p-->

[[RU](https://github.com/rubender/redoor/blob/master/README_RU.md) / [EN](https://github.com/rubender/redoor) ]

<!-- TABLE OF CONTENTS -->
## Table of Contents

**[About the Project](#about-the-project)**
**[Installation](#installation)**
**[Getting Started](#getting-started)**
**[Documentation](#documentation)**
&nbsp;&nbsp;&nbsp; **[Store](#store)**
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
&nbsp;&nbsp;&nbsp; **[Components props ](#createStore)**<br/>
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
Redoor - состоит из двух сущностей: store и actaions.
store - место хранения глобального стейта
actaions  - методы взаимодействия с store и компонентами



## [Store](#store)
Модуль инициализации проекта, здесь необходимо импортировать и у казать все необходимые actions моуди проекта. Так же по необходимости указать дебагер.
Первое что надо сделать это создать store. Для этого необходимо инициализировать два метода
createStoreFactory и его результат createStore. createStore возвращает два метода которые необходимо использовать в компонентах.
[createStoreFactory](#create-store-factory)
###  [createStoreFactory](#create-store-factory)  / createStoreFactory ({ Component,  createContext,   createElement } )
 >__params__

Прежде необходимо указать с какой библиотекой работает ваш проект. Это моет быть react, preact, inferno. Функция инициализации проекта, в качестве входных параметров принимет объект с тремя переменными.
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

Вернет функцию __createStore__

### [createStore](#create-store) / `createStore(modules_array[, devtool_object])`
 >__params__

__modules_array__ - массив объектов  см. actions
__devtool_object__ - необязательный параметр включения [redoor-devtool](https://github.com/rubender/redoor-devtool). По умолчанию false. Если вы хотите подключить devtool сервер укажите объект содержащий:
>  host     ---  ip devtool сервера
>  port     --- порт
> name  --- название проекта

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

 Возвращает объект  __{ Provider , Connect }__

### [Provider](#Provider) / `<Provider></Provider>`
Рутовый компонент, потомки могут быть подключены с помощью функции __Connect__
>__props__

__providerConfig__   --- параметр инициализации передается в функцию  __initState__
*пример:*
~~~javascript
import {Provider} from './store.js'
<Provider>
    <RootComponent providerConfig={{mobile:true}}/>
</Provider>
~~~

### [Connect](#Connect) /  `Connect(Component [, filter_props_string])`
Функция соеденения глобального стора с компонентом
 >__params__

__Component__ --- компонент которому необходимо подключить redoor
__filter_props_string__ --- стринговая переменная список параметров кторые необходимо передать компоненту. Переменные должны быть разделены запятой.

> __return __

Возвращает компонент

*пример:*
~~~javascript
import {Connect} from './store.js'
const Component = ({counter, text})=><div>{text}:{counter}</div>
export default Connect(Component, "text, counter")
~~~

## [Actions](#Actions)

Все акшенсы, а также вспомогательные функции должны переданы в массив __createStore__
Модуль акшенсов имеет несколько функций название которых зарезервированный redoor. Название акшенсы должны начинаться с префиксов: __a___ или __action__.  Если вы используете es6 модули вы можете экспортировать функции redoor автоматически добавит их. Каждый модуль акшенсов может экспортировать свою функцию инициализации. Redoor объединит все объекты в один. В случае если вы продублируете один и тот же параметр в разных модулях redoor выведет в консоль ошибку. Чтобы понять в каких модулях произошла ошибка укажите ____module_name__ переменную.

### [initState](#initState) / `initState(providerConfig)`
Зарезервированная функция инициализации стора.    Она может быть как объект так и функция.
 >__params__

 __providerConfig__ ---  параметр получаемый от __Provider__
>__return__

функция должна вернуть объект с начальными значениями стора

### [ACTION functions](#action-functions) / `["a_", "action"]action_name({state, args, emit})`
Акшенсы --- функции реализации логики работы с компанентами и сторам. Которые вызывают компоненты посредством __cxRun__. Функции должны в названии меть префикс __a___ или __action__,  в случае es6 модулей должны быть экспортированы.
 >__params__

Каждый акшенс имеет в качестве параметра объект с тремя аргументами:
__state__  --- текущий глобальный стейт
__args__ --- параметр передаваемый через __cxRun__
__emit(name, data)__ --- функция отправки глобального события. Где  __name__ --- название события, __data__ --- передоваемые данные

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


### [listen](#listen) /  `listen(name, data)`
Каждый акшен модуль может содержать функцию которая инициируется каждый раз когда происходит событие генерированное функцией __emit__ компонентом или акшенсом.
 >__params__

__name__ --- название события
__data__ ---  данные переданные через функцию __emit__
>__return__
нет

### [bindStateMethods](#bindStateMethods) / `bindStateMethods(getState, setState, emit)`
###
Если вы ваши акшенсы имеют асинхронный кода то необходимо пробросить функции обнаваления стейта redoor. Это так же может быть полезно в случае работы с вебсокетами
 >__params__

__getState__ ---  функция получения стейта
__setState__ --- функция установки стейта
__emit__ ---- функция отправки события
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

### [__module_name](#module-name) / `__module_name`
Reserved variable name for debug. Redoor use this variable for debug.
Ex.:
~~~javascript
export const  __module_name = 'pay_module'
~~~




## components reserved  props

### [cxRun](#cxRun-string) / `cxRun(action_name, args)`

функция инициации акшенса или обновления стейта на прямую. Автоматически добавляется связанным компонентам через props.
> **params:**

__action_name__ --- стринговая переменная название акшена
__args__ --- передоваемые акшену данные

> **return:**


нет
###  [cxRun](#cxRun-object) / `cxRun(object)`
если в качестве параметра указан объект, то функция обнавляет стейт напрямую без акшена.
 >__params__

__object__ --- объект обновления глобального стейта
 >__return__
 нет

###  [cxEmit](#cxEmit) / `cxEmit(event_name, args)`
Функция отправки глобального события.
 >__params__

 __name__ --- название события
 __data__ --- передоваемые данные

 >__return__
  нет

<!-- Devtool -->
## [Devtool](#devtool)

[redoor-devtool](https://github.com/rubender/redoor-devtool)

<!-- ROADMAP
## Roadmap

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a list of proposed features (and known issues).
-->


<!-- CONTRIBUTING
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
-->


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)
-->




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=flat-square
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=flat-square
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=flat-square
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=flat-square
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=flat-square
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
