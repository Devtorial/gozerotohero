# Vue and the Vue-cli
In our last step, we just ran into a problem. We want to split our code into modules so that it is easier to understand and maintain. Vue has something called [Single File Components](https://vuejs.org/v2/guide/single-file-components.html) so we can do just that. Only problem is that we now need to start using a Javascript module loader to bundle our code together for us. We will be using [Webpack](https://webpack.js.org/) together with the Vue CLI (command-line interpreter) for this step.

## Install Node.js
The Vue CLI and webpack both use Node.js so we'll install that first. We need a version >= 4.x

Go to the [Node.js download site](https://nodejs.org/en/download/) and install Node.js for your current operating system.

## Install the Vue CLI
Install the Vue CLI globally so that it is always available from your command prompt or terminal window. 

From a command prompt/terminal window type:

`npm install -g vue-cli`

## Create Vue webpack template project
From a command prompt/terminal window type:
`vue init webpack step3-webpack`

You will be asked the below questions. You may use other answers to suit your project needs, but we've provided the answers we picked for your reference:
1. Project name: `step3-webpack`
2. Project description: `Devtorial zero to hero tutorial`
3. Author: `Rob Archibald <rob.archibald@devtorial.com>`
4. Vue build: `Runtime + Compiler`
5. Install vue-router? `Y`
6. Use ESLint to lint your code? `y`
7. Pick an ESLint preset: `Airbnb`
8. Setup unit tests with Karma + Mocha? `y`
9. Setup e2e tests with Nightwatch? `y`

This will create a new folder named `step3-webpack` which contains the following assets:
- ![folder](../../resources/img.png) build
  - build.js
  - check-version.js
  - dev-client.js
  - dev-server.js
  - utils.js
  - vue-loader.conf.js
  - webpack.base.conf.js
  - webpack.prod.conf.js
  - webpack.test.conf.js
- ![folder](../../resources/img.png) config
  - dev.env.js
  - index.js
  - prod.env.js
  - test.env.js
- ![folder](../../resources/img.png) src
  - ![folder](../../resources/img.png) assets
    - logo.png
  - ![folder](../../resources/img.png) components
    - Hello.vue
  - ![folder](../../resources/img.png) router
    - index.js
  - App.vue
  - main.js
- ![folder](../../resources/img.png) static
  - .gitkeep
- ![folder](../../resources/img.png) test
  - ![folder](../../resources/img.png) e2e
    - ![folder](../../resources/img.png) custom-assertions
      - elementCount.js
    - ![folder](../../resources/img.png) specs
      - test.js
    - nightwatch.conf.js
    - runner.js
  - ![folder](../../resources/img.png) unit
    - ![folder](../../resources/img.png) specs
      - Hello.spec.js
    - .eslintrc
    - index.js
    - karma.conf.js
- .babelrc
- .editorconfig
- .eslintignore
- .eslint.js
- .gitignore
- .postcssrc.js
- index.html
- package.json
- README.md

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
