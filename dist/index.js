"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  cleanup: true,
  render: true
};
exports.cleanup = cleanup;
exports.render = render;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _testUtils = require("@vue/test-utils");

var _domTestingLibrary = require("dom-testing-library");

Object.keys(_domTestingLibrary).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _domTestingLibrary[key];
    }
  });
});
var mountedWrappers = new Set();

function render(TestComponent) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$props = _ref.props,
      props = _ref$props === void 0 ? null : _ref$props,
      _ref$store = _ref.store,
      store = _ref$store === void 0 ? null : _ref$store,
      _ref$routes = _ref.routes,
      routes = _ref$routes === void 0 ? null : _ref$routes;

  var configurationCb = arguments.length > 2 ? arguments[2] : undefined;
  var isShallow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var localVue = (0, _testUtils.createLocalVue)();
  var vuexStore = null;
  var router = null;

  if (store) {
    var Vuex = require('vuex');

    localVue.use(Vuex);
    vuexStore = new Vuex.Store(store);
  }

  if (routes) {
    var VueRouter = require('vue-router');

    localVue.use(VueRouter);
    router = new VueRouter({
      routes: routes
    });
  }

  if (configurationCb && typeof configurationCb === 'function') {
    configurationCb(localVue);
  }

  var mountMethod = isShallow ? _testUtils.shallowMount : _testUtils.mount;
  var wrapper = mountMethod(TestComponent, {
    localVue: localVue,
    router: router,
    store: vuexStore,
    propsData: (0, _objectSpread2.default)({}, props),
    attachToDocument: true,
    sync: false
  });
  return (0, _objectSpread2.default)({
    debug: function debug() {
      return console.log((0, _domTestingLibrary.prettyDOM)(wrapper.element));
    },
    unmount: function unmount() {
      return wrapper.destroy();
    },
    isUnmounted: function isUnmounted() {
      return wrapper.vm._isDestroyed;
    },
    html: function html() {
      return wrapper.html();
    },
    emitted: function emitted() {
      return wrapper.emitted();
    },
    updateProps: function updateProps(_) {
      wrapper.setProps(_);
      return (0, _domTestingLibrary.wait)();
    },
    updateState: function updateState(_) {
      return wrapper.setData(_);
    }
  }, (0, _domTestingLibrary.getQueriesForElement)(wrapper.element));
}

function cleanup() {
  mountedWrappers.forEach(cleanupAtWrapper);
}

function cleanupAtWrapper(wrapper) {
  if (wrapper.parentNode === document.body) {
    document.body.removeChild(wrapper);
  }

  wrapper.destroy();
  mountedWrappers.delete(wrapper);
}

_domTestingLibrary.fireEvent.touch = function (elem) {
  _domTestingLibrary.fireEvent.focus(elem);

  _domTestingLibrary.fireEvent.blur(elem);
};