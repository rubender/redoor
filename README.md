


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
  <a href="https://github.com/rubender/redoor">🚪 redoor  </a>

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



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
* [Installation](#installation)
* [Getting Started](#getting-started)
* [Documentation](#documentation)
* [License](#license)



<!-- ABOUT THE PROJECT -->
## About The Project

Redoor state manager for React, Preact, Inferno.  Simple light library about 4.9k.

Why:
* Easy to use
* Light
* No dependency

<!--
### Built With
This section should list any major frameworks that you built your project using. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.
* [Bootstrap](https://getbootstrap.com)
* [JQuery](https://jquery.com)
* [Laravel](https://laravel.com)
-->


<!-- GETTING STARTED -->
## Installation

>npm
```sh
npm install redoor
```

>yarn
```sh
npm install redoor
```

<!-- USAGE EXAMPLES -->
##  Getting Started


### Quick example  for preact
```javascript
import { h, Component, createContext, render } from 'preact';
import createStoreFactory from 'redoor';

const createStore = createStoreFactory({Component, createContext, createElement:h});

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

## Documentation

## Store
### Provider
### Connect(Component[, filter_props])

## Actions

### initState, initState(props)

### listen(name, data)

### bindStateMethods(getState, setState, emit)

### a_[_action name_]({state, args, emit}),  action_[_action name_]({state, args, emit})

### __module_name


## components

### cxRun(action_name, args)
### cxRun(object)
### cxEmit(event_name, args)



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
