'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NavLink = exports.Link = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _utils = require('../utils');

var _utils2 = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var LinkInner = function LinkInner(props) {
  var to = props.to,
      redirect = props.redirect,
      _props$component = props.component,
      Component = _props$component === undefined ? 'a' : _props$component,
      children = props.children,
      onPress = props.onPress,
      onClick = props.onClick,
      _props$down = props.down,
      down = _props$down === undefined ? false : _props$down,
      _props$shouldDispatch = props.shouldDispatch,
      shouldDispatch = _props$shouldDispatch === undefined ? true : _props$shouldDispatch,
      target = props.target,
      dispatch = props.dispatch,
      bn = props.basename,
      cp = props.currentPathname,
      rudy = props.rudy,
      routesAdded = props.routesAdded,
      u = props.url,
      isActive = props.isActive,
      partial = props.partial,
      strict = props.strict,
      query = props.query,
      hash = props.hash,
      activeStyle = props.activeStyle,
      activeClassName = props.activeClassName,
      ariaCurrent = props.ariaCurrent,
      p = _objectWithoutProperties(props, ['to', 'redirect', 'component', 'children', 'onPress', 'onClick', 'down', 'shouldDispatch', 'target', 'dispatch', 'basename', 'currentPathname', 'rudy', 'routesAdded', 'url', 'isActive', 'partial', 'strict', 'query', 'hash', 'activeStyle', 'activeClassName', 'ariaCurrent']);

  var routes = rudy.routes,
      getLocation = rudy.getLocation,
      options = rudy.options,
      history = rudy.history;

  var curr = cp || getLocation().pathname; // for relative paths and incorrect actions (incorrect actions don't waste re-renderings and just get current pathname from context)

  var _toUrlAndAction = (0, _utils2.toUrlAndAction)(to, routes, bn, curr, options),
      fullUrl = _toUrlAndAction.fullUrl,
      action = _toUrlAndAction.action;

  var hasHref = Component === 'a' || typeof Component !== 'string';

  var handler = _utils2.handlePress.bind(null, action, rudy.routes, shouldDispatch, dispatch, onPress || onClick, target, redirect, fullUrl, history);

  return React.createElement(
    Component,
    _extends({
      onClick: !down && handler || _utils2.preventDefault,
      href: hasHref ? fullUrl : undefined,
      onMouseDown: down ? handler : undefined,
      onTouchStart: down ? handler : undefined,
      target: target
    }, p, navLinkProps(props, fullUrl, action)),
    children
  );
};

var navLinkProps = function navLinkProps(props, toFullUrl, action) {
  if (!props.url) return;

  var basename = props.basename,
      url = props.url,
      isActive = props.isActive,
      partial = props.partial,
      strict = props.strict,
      q = props.query,
      h = props.hash,
      style = props.style,
      className = props.className,
      activeStyle = props.activeStyle,
      _props$activeClassNam = props.activeClassName,
      activeClassName = _props$activeClassNam === undefined ? '' : _props$activeClassNam,
      _props$ariaCurrent = props.ariaCurrent,
      ariaCurrent = _props$ariaCurrent === undefined ? 'true' : _props$ariaCurrent,
      rudy = props.rudy;
  var getLocation = rudy.getLocation,
      options = rudy.options,
      routes = rudy.routes;

  var _urlToLocation = (0, _utils.urlToLocation)(toFullUrl),
      pathname = _urlToLocation.pathname,
      query = _urlToLocation.query,
      hash = _urlToLocation.hash;

  var matchers = { path: pathname, query: q && query, hash: h && hash };
  var opts = { partial: partial, strict: strict };
  var route = routes[action.type] || {};
  var match = (0, _utils.matchUrl)(url, matchers, opts, route, options);

  if (match) {
    Object.assign(match, action);
  }

  var active = !!(isActive ? isActive(match, getLocation()) : match);

  return {
    style: active ? { ...style, ...activeStyle } : style,
    className: ((className || '') + ' ' + (active ? activeClassName : '')).trim(),
    'aria-current': active && ariaCurrent
  };
};

var mapState = function mapState(state, _ref) {
  var rudy = _ref.rudy,
      props = _objectWithoutProperties(_ref, ['rudy']);

  var _rudy$getLocation = rudy.getLocation(),
      url = _rudy$getLocation.url,
      pathname = _rudy$getLocation.pathname,
      bn = _rudy$getLocation.basename,
      routesAdded = _rudy$getLocation.routesAdded;

  var isNav = props.activeClassName || props.activeStyle; // only NavLinks re-render when the URL changes

  // We are very precise about what we want to cause re-renderings, as perf is
  // important! So only pass currentPathname if the user will in fact be making
  // use of it for relative paths.
  var currentPathname = void 0;

  if (typeof props.to === 'string' && props.to.charAt(0) !== '/') {
    currentPathname = pathname;
  }

  var basename = bn ? '/' + bn : '';

  return { rudy: rudy, basename: basename, routesAdded: routesAdded, url: isNav && url, currentPathname: pathname };
};

var connector = (0, _reactRedux.connect)(mapState);

var LinkConnected = connector(LinkInner);

var Link = function Link(props, context) {
  return React.createElement(LinkConnected, _extends({ rudy: context.store.getState.rudy }, props));
};

Link.contextTypes = { store: _propTypes2.default.object.isRequired };

exports.default = Link;
exports.Link = Link;
var NavLink = exports.NavLink = function NavLink(_ref2) {
  var _ref2$activeClassName = _ref2.activeClassName,
      activeClassName = _ref2$activeClassName === undefined ? 'active' : _ref2$activeClassName,
      props = _objectWithoutProperties(_ref2, ['activeClassName']);

  return React.createElement(Link, _extends({ activeClassName: activeClassName }, props));
};