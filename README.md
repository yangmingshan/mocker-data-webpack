# mocker-data-webpack
A webpack-dev-server middleware for mock api response.

## Installation
You can install it via [yarn](https://yarnpkg.com) or [npm](https://npmjs.com).
```
$ yarn add mocker-data-webpack --dev
$ npm install mocker-data-webpack --save-dev
```

## Usage
#### webpack.config.js
```js
const mockerDataWebpack = require('mocker-data-webpack');

module.exports = {
  //...
  devServer: {
    before: mockerDataWebpack() // It accept a parameter with options
  }
};
```

## Options

#### options.prefix
default: '/api'

The prefix of apis, all request start with it will be send to `mocker-data-webpack`, and you don't need to write it in your data files.

#### options.path
default: './mock'

The path of data files directory, you can pass relative path or absolute path, `mocker-data-webpack` will search this directory to find response for the request.

## License
[MIT](https://opensource.org/licenses/MIT)
