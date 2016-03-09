/**
 * Adapted from ReactCSSTransitionGroup.js by Facebook
 *
 * @providesModule ReactCSSTransitionReplace
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactLibObjectAssign = require('react/lib/Object.assign');

var _reactLibObjectAssign2 = _interopRequireDefault(_reactLibObjectAssign);

var _reactLibReactCSSTransitionGroupChild = require('react/lib/ReactCSSTransitionGroupChild');

var _reactLibReactCSSTransitionGroupChild2 = _interopRequireDefault(_reactLibReactCSSTransitionGroupChild);

var reactCSSTransitionGroupChild = _react2['default'].createFactory(_reactLibReactCSSTransitionGroupChild2['default']);

var TICK = 17;

function outerWidth(element) {
  var style = element.currentStyle || window.getComputedStyle(element);
  var margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  var padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  var border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
  var size = element.offsetWidth;
  var fudge = 0;
  return size + margin - padding + border + fudge;
}

function outerHeight(element) {
  var style = element.currentStyle || window.getComputedStyle(element);
  var margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
  var padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  var border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
  var size = element.offsetHeight;
  return size + margin - padding + border;
}

function createTransitionTimeoutPropValidator(transitionType) {
  var timeoutPropName = 'transition' + transitionType + 'Timeout';
  var enabledPropName = 'transition' + transitionType;

  return function (props) {
    // If the transition is enabled
    if (props[enabledPropName]) {
      // If no timeout duration is provided
      if (!props[timeoutPropName]) {
        return new Error(timeoutPropName + ' wasn\'t supplied to ReactCSSTransitionReplace: ' + 'this can cause unreliable animations and won\'t be supported in ' + 'a future version of React. See ' + 'https://fb.me/react-animation-transition-group-timeout for more ' + 'information.');

        // If the duration isn't a number
      } else if (typeof props[timeoutPropName] !== 'number') {
          return new Error(timeoutPropName + ' must be a number (in milliseconds)');
        }
    }
  };
}

var ReactCSSTransitionReplace = (function (_React$Component) {
  _inherits(ReactCSSTransitionReplace, _React$Component);

  function ReactCSSTransitionReplace() {
    var _this = this;

    _classCallCheck(this, ReactCSSTransitionReplace);

    _get(Object.getPrototypeOf(ReactCSSTransitionReplace.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      active: false,
      currentChild: this.props.children ? _react2['default'].Children.only(this.props.children) : null,
      nextChild: null,
      height: null,
      width: null,
      oldHeight: null,
      oldWidth: null
    };

    this._handleDoneAppearing = function () {
      _this.isTransitioning = false;
    };

    this._handleDoneEntering = function () {
      _this.isTransitioning = false;
      _this.setState({
        active: false,
        currentChild: _this.state.nextChild,
        nextChild: null,
        height: null,
        width: null,
        oldHeight: null,
        oldWidth: null
      });
    };

    this._handleDoneLeaving = function () {
      if (_this.isTransitioning) {
        var state = { currentChild: null };

        if (!_this.state.nextChild) {
          _this.isTransitioning = false;
          state.active = false;
          state.height = null;
          state.width = null;
          state.oldHeight = null;
          state.oldWidth = null;
        }

        _this.setState(state);
      }
    };
  }

  _createClass(ReactCSSTransitionReplace, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.transitionAppear && this.state.currentChild) {
        this.appearCurrent();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      // Setting false indicates that the child has changed, but it is a removal so there is no next child.
      var nextChild = nextProps.children ? _react2['default'].Children.only(nextProps.children) : false;
      var currentChild = this.state.currentChild;

      if (currentChild && nextChild && nextChild.key === currentChild.key) {
        // Nothing changed, but we are re-rendering so update the currentChild.
        return this.setState({
          currentChild: nextChild
        });
      }

      // Set the next child to start the transition, and set the current height.
      var oldWidth = this.state.currentChild ? outerWidth(_reactDom2['default'].findDOMNode(this.refs.curr)) : 0;
      var oldHeight = this.state.currentChild ? outerHeight(_reactDom2['default'].findDOMNode(this.refs.curr)) : 0;
      this.setState({
        active: false,
        nextChild: nextChild,
        height: oldHeight,
        width: oldWidth,
        oldHeight: oldHeight,
        oldWidth: oldWidth
      });

      // Enqueue setting the next height to trigger the height transition.
      this.timeout = setTimeout(function () {
        _this2.setState({
          active: true,
          height: _this2.state.nextChild ? outerHeight(_reactDom2['default'].findDOMNode(_this2.refs.next)) : 0,
          width: _this2.state.nextChild ? outerWidth(_reactDom2['default'].findDOMNode(_this2.refs.next)) : 0
        });
        _this2.timeout = null;
      }, TICK);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (!this.isTransitioning) {
        if (this.state.nextChild) {
          this.enterNext();
        }
        if (this.state.currentChild && (this.state.nextChild || this.state.nextChild === false)) {
          this.leaveCurrent();
        }
      }
    }
  }, {
    key: 'appearCurrent',
    value: function appearCurrent() {
      this.refs.curr.componentWillAppear(this._handleDoneAppearing);
      this.isTransitioning = true;
    }
  }, {
    key: 'enterNext',
    value: function enterNext() {
      this.refs.next.componentWillEnter(this._handleDoneEntering);
      this.isTransitioning = true;
    }
  }, {
    key: 'leaveCurrent',
    value: function leaveCurrent() {
      this.refs.curr.componentWillLeave(this._handleDoneLeaving);
      this.isTransitioning = true;
    }

    // When the leave transition time-out expires the animation classes are removed, so the
    // element must be removed from the DOM if the enter transition is still in progress.
  }, {
    key: '_wrapChild',
    value: function _wrapChild(child, moreProps) {
      // We need to provide this childFactory so that
      // ReactCSSTransitionReplaceChild can receive updates to name,
      // enter, and leave while it is leaving.
      return reactCSSTransitionGroupChild((0, _reactLibObjectAssign2['default'])({
        name: this.props.transitionName,
        appear: this.props.transitionAppear,
        enter: this.props.transitionEnter,
        leave: this.props.transitionLeave,
        appearTimeout: this.props.transitionAppearTimeout,
        enterTimeout: this.props.transitionEnterTimeout,
        leaveTimeout: this.props.transitionLeaveTimeout
      }, moreProps), child);
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state;
      var active = _state.active;
      var currentChild = _state.currentChild;
      var nextChild = _state.nextChild;
      var height = _state.height;
      var width = _state.width;
      var oldWidth = _state.oldWidth;
      var oldHeight = _state.oldHeight;

      var childrenToRender = [];

      var _props = this.props;
      var overflowHidden = _props.overflowHidden;

      var containerProps = _objectWithoutProperties(_props, ['overflowHidden']);

      if (currentChild) {
        childrenToRender.push(_react2['default'].createElement('span', {
          style: {
            display: 'block',
            height: oldHeight,
            width: oldWidth
          },
          key: 'curr'
        }, this._wrapChild(currentChild, { ref: 'curr' })));
      }

      if (height !== null && width !== null) {
        containerProps.className = (containerProps.className || '') + ' ' + containerProps.transitionName + '-height';
        containerProps.className += active ? ' ' + containerProps.transitionName + '-height-active' : '';
        containerProps.style = (0, _reactLibObjectAssign2['default'])({}, containerProps.style, {
          display: 'block',
          height: height,
          width: width
        });
        if (active) {
          containerProps.style = (0, _reactLibObjectAssign2['default'])({}, containerProps.style, {
            position: 'relative'
          });
        }

        if (overflowHidden) {
          containerProps.style.overflow = 'hidden';
        }
      }

      if (nextChild) {
        childrenToRender.push(_react2['default'].createElement('span', {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: active ? width : 'auto',
            height: active ? height : 'auto',
            visible: active ? 'visbile' : 'hidden'
          },
          key: 'next'
        }, this._wrapChild(nextChild, { ref: 'next' })));
      }

      return _react2['default'].createElement(this.props.component, containerProps, childrenToRender);
    }
  }], [{
    key: 'propTypes',
    value: {
      transitionName: _react2['default'].PropTypes.string.isRequired,
      transitionAppear: _react2['default'].PropTypes.bool,
      transitionEnter: _react2['default'].PropTypes.bool,
      transitionLeave: _react2['default'].PropTypes.bool,
      transitionAppearTimeout: createTransitionTimeoutPropValidator('Appear'),
      transitionEnterTimeout: createTransitionTimeoutPropValidator('Enter'),
      transitionLeaveTimeout: createTransitionTimeoutPropValidator('Leave'),
      overflowHidden: _react2['default'].PropTypes.bool
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      transitionAppear: false,
      transitionEnter: true,
      transitionLeave: true,
      overflowHidden: true,
      component: 'span'
    },
    enumerable: true
  }]);

  return ReactCSSTransitionReplace;
})(_react2['default'].Component);

exports['default'] = ReactCSSTransitionReplace;
module.exports = exports['default'];