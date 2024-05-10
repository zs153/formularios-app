(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
}((function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var autosize$1 = {exports: {}};

	/*!
		autosize 4.0.2
		license: MIT
		http://www.jacklmoore.com/autosize
	*/
	(function (module, exports) {
	(function (global, factory) {
		{
			factory(module, exports);
		}
	})(commonjsGlobal, function (module, exports) {
		var map = typeof Map === "function" ? new Map() : function () {
			var keys = [];
			var values = [];
			return {
				has: function has(key) {
					return keys.indexOf(key) > -1;
				},
				get: function get(key) {
					return values[keys.indexOf(key)];
				},
				set: function set(key, value) {
					if (keys.indexOf(key) === -1) {
						keys.push(key);
						values.push(value);
					}
				},
				delete: function _delete(key) {
					var index = keys.indexOf(key);
					if (index > -1) {
						keys.splice(index, 1);
						values.splice(index, 1);
					}
				}
			};
		}();
		var createEvent = function createEvent(name) {
			return new Event(name, { bubbles: true });
		};
		try {
			new Event('test');
		} catch (e) {
			createEvent = function createEvent(name) {
				var evt = document.createEvent('Event');
				evt.initEvent(name, true, false);
				return evt;
			};
		}
		function assign(ta) {
			if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || map.has(ta)) return;
			var heightOffset = null;
			var clientWidth = null;
			var cachedHeight = null;
			function init() {
				var style = window.getComputedStyle(ta, null);
				if (style.resize === 'vertical') {
					ta.style.resize = 'none';
				} else if (style.resize === 'both') {
					ta.style.resize = 'horizontal';
				}
				if (style.boxSizing === 'content-box') {
					heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
				} else {
					heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
				}
				if (isNaN(heightOffset)) {
					heightOffset = 0;
				}
				update();
			}
			function changeOverflow(value) {
				{
					var width = ta.style.width;
					ta.style.width = '0px';
					ta.offsetWidth;
					ta.style.width = width;
				}
				ta.style.overflowY = value;
			}
			function getParentOverflows(el) {
				var arr = [];
				while (el && el.parentNode && el.parentNode instanceof Element) {
					if (el.parentNode.scrollTop) {
						arr.push({
							node: el.parentNode,
							scrollTop: el.parentNode.scrollTop
						});
					}
					el = el.parentNode;
				}
				return arr;
			}
			function resize() {
				if (ta.scrollHeight === 0) {
					return;
				}
				var overflows = getParentOverflows(ta);
				var docTop = document.documentElement && document.documentElement.scrollTop;
				ta.style.height = '';
				ta.style.height = ta.scrollHeight + heightOffset + 'px';
				clientWidth = ta.clientWidth;
				overflows.forEach(function (el) {
					el.node.scrollTop = el.scrollTop;
				});
				if (docTop) {
					document.documentElement.scrollTop = docTop;
				}
			}
			function update() {
				resize();
				var styleHeight = Math.round(parseFloat(ta.style.height));
				var computed = window.getComputedStyle(ta, null);
				var actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(computed.height)) : ta.offsetHeight;
				if (actualHeight < styleHeight) {
					if (computed.overflowY === 'hidden') {
						changeOverflow('scroll');
						resize();
						actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
					}
				} else {
					if (computed.overflowY !== 'hidden') {
						changeOverflow('hidden');
						resize();
						actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
					}
				}
				if (cachedHeight !== actualHeight) {
					cachedHeight = actualHeight;
					var evt = createEvent('autosize:resized');
					try {
						ta.dispatchEvent(evt);
					} catch (err) {
					}
				}
			}
			var pageResize = function pageResize() {
				if (ta.clientWidth !== clientWidth) {
					update();
				}
			};
			var destroy = function (style) {
				window.removeEventListener('resize', pageResize, false);
				ta.removeEventListener('input', update, false);
				ta.removeEventListener('keyup', update, false);
				ta.removeEventListener('autosize:destroy', destroy, false);
				ta.removeEventListener('autosize:update', update, false);
				Object.keys(style).forEach(function (key) {
					ta.style[key] = style[key];
				});
				map.delete(ta);
			}.bind(ta, {
				height: ta.style.height,
				resize: ta.style.resize,
				overflowY: ta.style.overflowY,
				overflowX: ta.style.overflowX,
				wordWrap: ta.style.wordWrap
			});
			ta.addEventListener('autosize:destroy', destroy, false);
			if ('onpropertychange' in ta && 'oninput' in ta) {
				ta.addEventListener('keyup', update, false);
			}
			window.addEventListener('resize', pageResize, false);
			ta.addEventListener('input', update, false);
			ta.addEventListener('autosize:update', update, false);
			ta.style.overflowX = 'hidden';
			ta.style.wordWrap = 'break-word';
			map.set(ta, {
				destroy: destroy,
				update: update
			});
			init();
		}
		function destroy(ta) {
			var methods = map.get(ta);
			if (methods) {
				methods.destroy();
			}
		}
		function update(ta) {
			var methods = map.get(ta);
			if (methods) {
				methods.update();
			}
		}
		var autosize = null;
		if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
			autosize = function autosize(el) {
				return el;
			};
			autosize.destroy = function (el) {
				return el;
			};
			autosize.update = function (el) {
				return el;
			};
		} else {
			autosize = function autosize(el, options) {
				if (el) {
					Array.prototype.forEach.call(el.length ? el : [el], function (x) {
						return assign(x);
					});
				}
				return el;
			};
			autosize.destroy = function (el) {
				if (el) {
					Array.prototype.forEach.call(el.length ? el : [el], destroy);
				}
				return el;
			};
			autosize.update = function (el) {
				if (el) {
					Array.prototype.forEach.call(el.length ? el : [el], update);
				}
				return el;
			};
		}
		exports.default = autosize;
		module.exports = exports['default'];
	});
	}(autosize$1, autosize$1.exports));
	var autosize = autosize$1.exports;

	var elements = document.querySelectorAll('[data-bs-toggle="autosize"]');
	if (elements.length) {
	  elements.forEach(function (element) {
	    autosize(element);
	  });
	}

	function _typeof(obj) {
	  "@babel/helpers - typeof";
	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }
	  return _typeof(obj);
	}
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}
	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}
	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }
	  return obj;
	}
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }
	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}
	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}
	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };
	  return _setPrototypeOf(o, p);
	}
	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;
	  try {
	    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}
	function _objectWithoutPropertiesLoose(source, excluded) {
	  if (source == null) return {};
	  var target = {};
	  var sourceKeys = Object.keys(source);
	  var key, i;
	  for (i = 0; i < sourceKeys.length; i++) {
	    key = sourceKeys[i];
	    if (excluded.indexOf(key) >= 0) continue;
	    target[key] = source[key];
	  }
	  return target;
	}
	function _objectWithoutProperties(source, excluded) {
	  if (source == null) return {};
	  var target = _objectWithoutPropertiesLoose(source, excluded);
	  var key, i;
	  if (Object.getOwnPropertySymbols) {
	    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
	    for (i = 0; i < sourceSymbolKeys.length; i++) {
	      key = sourceSymbolKeys[i];
	      if (excluded.indexOf(key) >= 0) continue;
	      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
	      target[key] = source[key];
	    }
	  }
	  return target;
	}
	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	  return self;
	}
	function _possibleConstructorReturn(self, call) {
	  if (call && (typeof call === "object" || typeof call === "function")) {
	    return call;
	  }
	  return _assertThisInitialized(self);
	}
	function _createSuper(Derived) {
	  var hasNativeReflectConstruct = _isNativeReflectConstruct();
	  return function _createSuperInternal() {
	    var Super = _getPrototypeOf(Derived),
	        result;
	    if (hasNativeReflectConstruct) {
	      var NewTarget = _getPrototypeOf(this).constructor;
	      result = Reflect.construct(Super, arguments, NewTarget);
	    } else {
	      result = Super.apply(this, arguments);
	    }
	    return _possibleConstructorReturn(this, result);
	  };
	}
	function _superPropBase(object, property) {
	  while (!Object.prototype.hasOwnProperty.call(object, property)) {
	    object = _getPrototypeOf(object);
	    if (object === null) break;
	  }
	  return object;
	}
	function _get(target, property, receiver) {
	  if (typeof Reflect !== "undefined" && Reflect.get) {
	    _get = Reflect.get;
	  } else {
	    _get = function _get(target, property, receiver) {
	      var base = _superPropBase(target, property);
	      if (!base) return;
	      var desc = Object.getOwnPropertyDescriptor(base, property);
	      if (desc.get) {
	        return desc.get.call(receiver);
	      }
	      return desc.value;
	    };
	  }
	  return _get(target, property, receiver || target);
	}
	function set(target, property, value, receiver) {
	  if (typeof Reflect !== "undefined" && Reflect.set) {
	    set = Reflect.set;
	  } else {
	    set = function set(target, property, value, receiver) {
	      var base = _superPropBase(target, property);
	      var desc;
	      if (base) {
	        desc = Object.getOwnPropertyDescriptor(base, property);
	        if (desc.set) {
	          desc.set.call(receiver, value);
	          return true;
	        } else if (!desc.writable) {
	          return false;
	        }
	      }
	      desc = Object.getOwnPropertyDescriptor(receiver, property);
	      if (desc) {
	        if (!desc.writable) {
	          return false;
	        }
	        desc.value = value;
	        Object.defineProperty(receiver, property, desc);
	      } else {
	        _defineProperty(receiver, property, value);
	      }
	      return true;
	    };
	  }
	  return set(target, property, value, receiver);
	}
	function _set(target, property, value, receiver, isStrict) {
	  var s = set(target, property, value, receiver || target);
	  if (!s && isStrict) {
	    throw new Error('failed to set property');
	  }
	  return value;
	}
	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}
	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}
	function _iterableToArrayLimit(arr, i) {
	  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;
	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);
	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }
	  return _arr;
	}
	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}
	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;
	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	  return arr2;
	}
	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	function isString(str) {
	  return typeof str === 'string' || str instanceof String;
	}
	var DIRECTION = {
	  NONE: 'NONE',
	  LEFT: 'LEFT',
	  FORCE_LEFT: 'FORCE_LEFT',
	  RIGHT: 'RIGHT',
	  FORCE_RIGHT: 'FORCE_RIGHT'
	};
	function forceDirection(direction) {
	  switch (direction) {
	    case DIRECTION.LEFT:
	      return DIRECTION.FORCE_LEFT;
	    case DIRECTION.RIGHT:
	      return DIRECTION.FORCE_RIGHT;
	    default:
	      return direction;
	  }
	}
	function escapeRegExp(str) {
	  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
	}
	function objectIncludes(b, a) {
	  if (a === b) return true;
	  var arrA = Array.isArray(a),
	      arrB = Array.isArray(b),
	      i;
	  if (arrA && arrB) {
	    if (a.length != b.length) return false;
	    for (i = 0; i < a.length; i++) {
	      if (!objectIncludes(a[i], b[i])) return false;
	    }
	    return true;
	  }
	  if (arrA != arrB) return false;
	  if (a && b && _typeof(a) === 'object' && _typeof(b) === 'object') {
	    var dateA = a instanceof Date,
	        dateB = b instanceof Date;
	    if (dateA && dateB) return a.getTime() == b.getTime();
	    if (dateA != dateB) return false;
	    var regexpA = a instanceof RegExp,
	        regexpB = b instanceof RegExp;
	    if (regexpA && regexpB) return a.toString() == b.toString();
	    if (regexpA != regexpB) return false;
	    var keys = Object.keys(a);
	    for (i = 0; i < keys.length; i++) {
	      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
	    }
	    for (i = 0; i < keys.length; i++) {
	      if (!objectIncludes(b[keys[i]], a[keys[i]])) return false;
	    }
	    return true;
	  } else if (a && b && typeof a === 'function' && typeof b === 'function') {
	    return a.toString() === b.toString();
	  }
	  return false;
	}

	var ActionDetails = function () {
	  function ActionDetails(value, cursorPos, oldValue, oldSelection) {
	    _classCallCheck(this, ActionDetails);
	    this.value = value;
	    this.cursorPos = cursorPos;
	    this.oldValue = oldValue;
	    this.oldSelection = oldSelection;
	    while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) {
	      --this.oldSelection.start;
	    }
	  }
	  _createClass(ActionDetails, [{
	    key: "startChangePos",
	    get: function get() {
	      return Math.min(this.cursorPos, this.oldSelection.start);
	    }
	  }, {
	    key: "insertedCount",
	    get: function get() {
	      return this.cursorPos - this.startChangePos;
	    }
	  }, {
	    key: "inserted",
	    get: function get() {
	      return this.value.substr(this.startChangePos, this.insertedCount);
	    }
	  }, {
	    key: "removedCount",
	    get: function get() {
	      return Math.max(this.oldSelection.end - this.startChangePos ||
	      this.oldValue.length - this.value.length, 0);
	    }
	  }, {
	    key: "removed",
	    get: function get() {
	      return this.oldValue.substr(this.startChangePos, this.removedCount);
	    }
	  }, {
	    key: "head",
	    get: function get() {
	      return this.value.substring(0, this.startChangePos);
	    }
	  }, {
	    key: "tail",
	    get: function get() {
	      return this.value.substring(this.startChangePos + this.insertedCount);
	    }
	  }, {
	    key: "removeDirection",
	    get: function get() {
	      if (!this.removedCount || this.insertedCount) return DIRECTION.NONE;
	      return this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos ? DIRECTION.RIGHT : DIRECTION.LEFT;
	    }
	  }]);
	  return ActionDetails;
	}()

	var ChangeDetails = function () {
	  function ChangeDetails(details) {
	    _classCallCheck(this, ChangeDetails);
	    Object.assign(this, {
	      inserted: '',
	      rawInserted: '',
	      skip: false,
	      tailShift: 0
	    }, details);
	  }
	  _createClass(ChangeDetails, [{
	    key: "aggregate",
	    value: function aggregate(details) {
	      this.rawInserted += details.rawInserted;
	      this.skip = this.skip || details.skip;
	      this.inserted += details.inserted;
	      this.tailShift += details.tailShift;
	      return this;
	    }
	  }, {
	    key: "offset",
	    get: function get() {
	      return this.tailShift + this.inserted.length;
	    }
	  }]);
	  return ChangeDetails;
	}()

	var ContinuousTailDetails = function () {
	  function ContinuousTailDetails() {
	    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	    var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	    var stop = arguments.length > 2 ? arguments[2] : undefined;
	    _classCallCheck(this, ContinuousTailDetails);
	    this.value = value;
	    this.from = from;
	    this.stop = stop;
	  }
	  _createClass(ContinuousTailDetails, [{
	    key: "toString",
	    value: function toString() {
	      return this.value;
	    }
	  }, {
	    key: "extend",
	    value: function extend(tail) {
	      this.value += String(tail);
	    }
	  }, {
	    key: "appendTo",
	    value: function appendTo(masked) {
	      return masked.append(this.toString(), {
	        tail: true
	      }).aggregate(masked._appendPlaceholder());
	    }
	  }, {
	    key: "state",
	    get: function get() {
	      return {
	        value: this.value,
	        from: this.from,
	        stop: this.stop
	      };
	    },
	    set: function set(state) {
	      Object.assign(this, state);
	    }
	  }, {
	    key: "shiftBefore",
	    value: function shiftBefore(pos) {
	      if (this.from >= pos || !this.value.length) return '';
	      var shiftChar = this.value[0];
	      this.value = this.value.slice(1);
	      return shiftChar;
	    }
	  }]);
	  return ContinuousTailDetails;
	}()

	var top = 'top';
	var bottom = 'bottom';
	var right = 'right';
	var left = 'left';
	var auto = 'auto';
	var basePlacements = [top, bottom, right, left];
	var start = 'start';
	var end = 'end';
	var clippingParents = 'clippingParents';
	var viewport = 'viewport';
	var popper = 'popper';
	var reference = 'reference';
	var variationPlacements = basePlacements.reduce(function (acc, placement) {
	  return acc.concat([placement + "-" + start, placement + "-" + end]);
	}, []);
	var placements = [].concat(basePlacements, [auto]).reduce(function (acc, placement) {
	  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
	}, []);
	var beforeRead = 'beforeRead';
	var read = 'read';
	var afterRead = 'afterRead';
	var beforeMain = 'beforeMain';
	var main = 'main';
	var afterMain = 'afterMain';
	var beforeWrite = 'beforeWrite';
	var write = 'write';
	var afterWrite = 'afterWrite';
	var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

	function getNodeName(element) {
	  return element ? (element.nodeName || '').toLowerCase() : null;
	}

	function getWindow(node) {
	  if (node == null) {
	    return window;
	  }
	  if (node.toString() !== '[object Window]') {
	    var ownerDocument = node.ownerDocument;
	    return ownerDocument ? ownerDocument.defaultView || window : window;
	  }
	  return node;
	}

	function isElement$1(node) {
	  var OwnElement = getWindow(node).Element;
	  return node instanceof OwnElement || node instanceof Element;
	}
	function isHTMLElement(node) {
	  var OwnElement = getWindow(node).HTMLElement;
	  return node instanceof OwnElement || node instanceof HTMLElement;
	}
	function isShadowRoot(node) {
	  if (typeof ShadowRoot === 'undefined') {
	    return false;
	  }
	  var OwnElement = getWindow(node).ShadowRoot;
	  return node instanceof OwnElement || node instanceof ShadowRoot;
	}

	function applyStyles(_ref) {
	  var state = _ref.state;
	  Object.keys(state.elements).forEach(function (name) {
	    var style = state.styles[name] || {};
	    var attributes = state.attributes[name] || {};
	    var element = state.elements[name];
	    if (!isHTMLElement(element) || !getNodeName(element)) {
	      return;
	    }
	    Object.assign(element.style, style);
	    Object.keys(attributes).forEach(function (name) {
	      var value = attributes[name];
	      if (value === false) {
	        element.removeAttribute(name);
	      } else {
	        element.setAttribute(name, value === true ? '' : value);
	      }
	    });
	  });
	}
	function effect$2(_ref2) {
	  var state = _ref2.state;
	  var initialStyles = {
	    popper: {
	      position: state.options.strategy,
	      left: '0',
	      top: '0',
	      margin: '0'
	    },
	    arrow: {
	      position: 'absolute'
	    },
	    reference: {}
	  };
	  Object.assign(state.elements.popper.style, initialStyles.popper);
	  state.styles = initialStyles;
	  if (state.elements.arrow) {
	    Object.assign(state.elements.arrow.style, initialStyles.arrow);
	  }
	  return function () {
	    Object.keys(state.elements).forEach(function (name) {
	      var element = state.elements[name];
	      var attributes = state.attributes[name] || {};
	      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
	      var style = styleProperties.reduce(function (style, property) {
	        style[property] = '';
	        return style;
	      }, {});
	      if (!isHTMLElement(element) || !getNodeName(element)) {
	        return;
	      }
	      Object.assign(element.style, style);
	      Object.keys(attributes).forEach(function (attribute) {
	        element.removeAttribute(attribute);
	      });
	    });
	  };
	}
	var applyStyles$1 = {
	  name: 'applyStyles',
	  enabled: true,
	  phase: 'write',
	  fn: applyStyles,
	  effect: effect$2,
	  requires: ['computeStyles']
	};

	function getBasePlacement(placement) {
	  return placement.split('-')[0];
	}

	function getBoundingClientRect(element) {
	  var rect = element.getBoundingClientRect();
	  return {
	    width: rect.width,
	    height: rect.height,
	    top: rect.top,
	    right: rect.right,
	    bottom: rect.bottom,
	    left: rect.left,
	    x: rect.left,
	    y: rect.top
	  };
	}

	function getLayoutRect(element) {
	  var clientRect = getBoundingClientRect(element);
	  var width = element.offsetWidth;
	  var height = element.offsetHeight;
	  if (Math.abs(clientRect.width - width) <= 1) {
	    width = clientRect.width;
	  }
	  if (Math.abs(clientRect.height - height) <= 1) {
	    height = clientRect.height;
	  }
	  return {
	    x: element.offsetLeft,
	    y: element.offsetTop,
	    width: width,
	    height: height
	  };
	}

	function contains(parent, child) {
	  var rootNode = child.getRootNode && child.getRootNode();
	  if (parent.contains(child)) {
	    return true;
	  }
	  else if (rootNode && isShadowRoot(rootNode)) {
	      var next = child;
	      do {
	        if (next && parent.isSameNode(next)) {
	          return true;
	        }
	        next = next.parentNode || next.host;
	      } while (next);
	    }
	  return false;
	}

	function getComputedStyle$1(element) {
	  return getWindow(element).getComputedStyle(element);
	}

	function isTableElement(element) {
	  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
	}

	function getDocumentElement(element) {
	  return ((isElement$1(element) ? element.ownerDocument :
	  element.document) || window.document).documentElement;
	}

	function getParentNode(element) {
	  if (getNodeName(element) === 'html') {
	    return element;
	  }
	  return (
	    element.assignedSlot ||
	    element.parentNode || (
	    isShadowRoot(element) ? element.host : null) ||
	    getDocumentElement(element)
	  );
	}

	function getTrueOffsetParent(element) {
	  if (!isHTMLElement(element) ||
	  getComputedStyle$1(element).position === 'fixed') {
	    return null;
	  }
	  return element.offsetParent;
	}
	function getContainingBlock(element) {
	  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
	  var isIE = navigator.userAgent.indexOf('Trident') !== -1;
	  if (isIE && isHTMLElement(element)) {
	    var elementCss = getComputedStyle$1(element);
	    if (elementCss.position === 'fixed') {
	      return null;
	    }
	  }
	  var currentNode = getParentNode(element);
	  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
	    var css = getComputedStyle$1(currentNode);
	    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
	      return currentNode;
	    } else {
	      currentNode = currentNode.parentNode;
	    }
	  }
	  return null;
	}
	function getOffsetParent(element) {
	  var window = getWindow(element);
	  var offsetParent = getTrueOffsetParent(element);
	  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
	    offsetParent = getTrueOffsetParent(offsetParent);
	  }
	  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
	    return window;
	  }
	  return offsetParent || getContainingBlock(element) || window;
	}

	function getMainAxisFromPlacement(placement) {
	  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
	}

	var max = Math.max;
	var min = Math.min;
	var round = Math.round;

	function within(min$1, value, max$1) {
	  return max(min$1, min(value, max$1));
	}

	function getFreshSideObject() {
	  return {
	    top: 0,
	    right: 0,
	    bottom: 0,
	    left: 0
	  };
	}

	function mergePaddingObject(paddingObject) {
	  return Object.assign({}, getFreshSideObject(), paddingObject);
	}

	function expandToHashMap(value, keys) {
	  return keys.reduce(function (hashMap, key) {
	    hashMap[key] = value;
	    return hashMap;
	  }, {});
	}

	var toPaddingObject = function toPaddingObject(padding, state) {
	  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
	    placement: state.placement
	  })) : padding;
	  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
	};
	function arrow(_ref) {
	  var _state$modifiersData$;
	  var state = _ref.state,
	      name = _ref.name,
	      options = _ref.options;
	  var arrowElement = state.elements.arrow;
	  var popperOffsets = state.modifiersData.popperOffsets;
	  var basePlacement = getBasePlacement(state.placement);
	  var axis = getMainAxisFromPlacement(basePlacement);
	  var isVertical = [left, right].indexOf(basePlacement) >= 0;
	  var len = isVertical ? 'height' : 'width';
	  if (!arrowElement || !popperOffsets) {
	    return;
	  }
	  var paddingObject = toPaddingObject(options.padding, state);
	  var arrowRect = getLayoutRect(arrowElement);
	  var minProp = axis === 'y' ? top : left;
	  var maxProp = axis === 'y' ? bottom : right;
	  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
	  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
	  var arrowOffsetParent = getOffsetParent(arrowElement);
	  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
	  var centerToReference = endDiff / 2 - startDiff / 2;
	  var min = paddingObject[minProp];
	  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
	  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
	  var offset = within(min, center, max);
	  var axisProp = axis;
	  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
	}
	function effect$1(_ref2) {
	  var state = _ref2.state,
	      options = _ref2.options;
	  var _options$element = options.element,
	      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;
	  if (arrowElement == null) {
	    return;
	  }
	  if (typeof arrowElement === 'string') {
	    arrowElement = state.elements.popper.querySelector(arrowElement);
	    if (!arrowElement) {
	      return;
	    }
	  }
	  if (!contains(state.elements.popper, arrowElement)) {
	    return;
	  }
	  state.elements.arrow = arrowElement;
	}
	var arrow$1 = {
	  name: 'arrow',
	  enabled: true,
	  phase: 'main',
	  fn: arrow,
	  effect: effect$1,
	  requires: ['popperOffsets'],
	  requiresIfExists: ['preventOverflow']
	};

	var unsetSides = {
	  top: 'auto',
	  right: 'auto',
	  bottom: 'auto',
	  left: 'auto'
	};
	function roundOffsetsByDPR(_ref) {
	  var x = _ref.x,
	      y = _ref.y;
	  var win = window;
	  var dpr = win.devicePixelRatio || 1;
	  return {
	    x: round(round(x * dpr) / dpr) || 0,
	    y: round(round(y * dpr) / dpr) || 0
	  };
	}
	function mapToStyles(_ref2) {
	  var _Object$assign2;
	  var popper = _ref2.popper,
	      popperRect = _ref2.popperRect,
	      placement = _ref2.placement,
	      offsets = _ref2.offsets,
	      position = _ref2.position,
	      gpuAcceleration = _ref2.gpuAcceleration,
	      adaptive = _ref2.adaptive,
	      roundOffsets = _ref2.roundOffsets;
	  var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
	      _ref3$x = _ref3.x,
	      x = _ref3$x === void 0 ? 0 : _ref3$x,
	      _ref3$y = _ref3.y,
	      y = _ref3$y === void 0 ? 0 : _ref3$y;
	  var hasX = offsets.hasOwnProperty('x');
	  var hasY = offsets.hasOwnProperty('y');
	  var sideX = left;
	  var sideY = top;
	  var win = window;
	  if (adaptive) {
	    var offsetParent = getOffsetParent(popper);
	    var heightProp = 'clientHeight';
	    var widthProp = 'clientWidth';
	    if (offsetParent === getWindow(popper)) {
	      offsetParent = getDocumentElement(popper);
	      if (getComputedStyle$1(offsetParent).position !== 'static') {
	        heightProp = 'scrollHeight';
	        widthProp = 'scrollWidth';
	      }
	    }
	    offsetParent = offsetParent;
	    if (placement === top) {
	      sideY = bottom;
	      y -= offsetParent[heightProp] - popperRect.height;
	      y *= gpuAcceleration ? 1 : -1;
	    }
	    if (placement === left) {
	      sideX = right;
	      x -= offsetParent[widthProp] - popperRect.width;
	      x *= gpuAcceleration ? 1 : -1;
	    }
	  }
	  var commonStyles = Object.assign({
	    position: position
	  }, adaptive && unsetSides);
	  if (gpuAcceleration) {
	    var _Object$assign;
	    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) < 2 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
	  }
	  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
	}
	function computeStyles(_ref4) {
	  var state = _ref4.state,
	      options = _ref4.options;
	  var _options$gpuAccelerat = options.gpuAcceleration,
	      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
	      _options$adaptive = options.adaptive,
	      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
	      _options$roundOffsets = options.roundOffsets,
	      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
	  var commonStyles = {
	    placement: getBasePlacement(state.placement),
	    popper: state.elements.popper,
	    popperRect: state.rects.popper,
	    gpuAcceleration: gpuAcceleration
	  };
	  if (state.modifiersData.popperOffsets != null) {
	    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
	      offsets: state.modifiersData.popperOffsets,
	      position: state.options.strategy,
	      adaptive: adaptive,
	      roundOffsets: roundOffsets
	    })));
	  }
	  if (state.modifiersData.arrow != null) {
	    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
	      offsets: state.modifiersData.arrow,
	      position: 'absolute',
	      adaptive: false,
	      roundOffsets: roundOffsets
	    })));
	  }
	  state.attributes.popper = Object.assign({}, state.attributes.popper, {
	    'data-popper-placement': state.placement
	  });
	}
	var computeStyles$1 = {
	  name: 'computeStyles',
	  enabled: true,
	  phase: 'beforeWrite',
	  fn: computeStyles,
	  data: {}
	};

	var passive = {
	  passive: true
	};
	function effect(_ref) {
	  var state = _ref.state,
	      instance = _ref.instance,
	      options = _ref.options;
	  var _options$scroll = options.scroll,
	      scroll = _options$scroll === void 0 ? true : _options$scroll,
	      _options$resize = options.resize,
	      resize = _options$resize === void 0 ? true : _options$resize;
	  var window = getWindow(state.elements.popper);
	  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
	  if (scroll) {
	    scrollParents.forEach(function (scrollParent) {
	      scrollParent.addEventListener('scroll', instance.update, passive);
	    });
	  }
	  if (resize) {
	    window.addEventListener('resize', instance.update, passive);
	  }
	  return function () {
	    if (scroll) {
	      scrollParents.forEach(function (scrollParent) {
	        scrollParent.removeEventListener('scroll', instance.update, passive);
	      });
	    }
	    if (resize) {
	      window.removeEventListener('resize', instance.update, passive);
	    }
	  };
	}
	var eventListeners = {
	  name: 'eventListeners',
	  enabled: true,
	  phase: 'write',
	  fn: function fn() {},
	  effect: effect,
	  data: {}
	};

	var hash$1 = {
	  left: 'right',
	  right: 'left',
	  bottom: 'top',
	  top: 'bottom'
	};
	function getOppositePlacement(placement) {
	  return placement.replace(/left|right|bottom|top/g, function (matched) {
	    return hash$1[matched];
	  });
	}

	var hash = {
	  start: 'end',
	  end: 'start'
	};
	function getOppositeVariationPlacement(placement) {
	  return placement.replace(/start|end/g, function (matched) {
	    return hash[matched];
	  });
	}

	function getWindowScroll(node) {
	  var win = getWindow(node);
	  var scrollLeft = win.pageXOffset;
	  var scrollTop = win.pageYOffset;
	  return {
	    scrollLeft: scrollLeft,
	    scrollTop: scrollTop
	  };
	}

	function getWindowScrollBarX(element) {
	  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
	}

	function getViewportRect(element) {
	  var win = getWindow(element);
	  var html = getDocumentElement(element);
	  var visualViewport = win.visualViewport;
	  var width = html.clientWidth;
	  var height = html.clientHeight;
	  var x = 0;
	  var y = 0;
	  if (visualViewport) {
	    width = visualViewport.width;
	    height = visualViewport.height;
	    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
	      x = visualViewport.offsetLeft;
	      y = visualViewport.offsetTop;
	    }
	  }
	  return {
	    width: width,
	    height: height,
	    x: x + getWindowScrollBarX(element),
	    y: y
	  };
	}

	function getDocumentRect(element) {
	  var _element$ownerDocumen;
	  var html = getDocumentElement(element);
	  var winScroll = getWindowScroll(element);
	  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
	  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
	  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
	  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
	  var y = -winScroll.scrollTop;
	  if (getComputedStyle$1(body || html).direction === 'rtl') {
	    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
	  }
	  return {
	    width: width,
	    height: height,
	    x: x,
	    y: y
	  };
	}

	function isScrollParent(element) {
	  var _getComputedStyle = getComputedStyle$1(element),
	      overflow = _getComputedStyle.overflow,
	      overflowX = _getComputedStyle.overflowX,
	      overflowY = _getComputedStyle.overflowY;
	  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
	}

	function getScrollParent(node) {
	  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
	    return node.ownerDocument.body;
	  }
	  if (isHTMLElement(node) && isScrollParent(node)) {
	    return node;
	  }
	  return getScrollParent(getParentNode(node));
	}

	function listScrollParents(element, list) {
	  var _element$ownerDocumen;
	  if (list === void 0) {
	    list = [];
	  }
	  var scrollParent = getScrollParent(element);
	  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
	  var win = getWindow(scrollParent);
	  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
	  var updatedList = list.concat(target);
	  return isBody ? updatedList :
	  updatedList.concat(listScrollParents(getParentNode(target)));
	}

	function rectToClientRect(rect) {
	  return Object.assign({}, rect, {
	    left: rect.x,
	    top: rect.y,
	    right: rect.x + rect.width,
	    bottom: rect.y + rect.height
	  });
	}

	function getInnerBoundingClientRect(element) {
	  var rect = getBoundingClientRect(element);
	  rect.top = rect.top + element.clientTop;
	  rect.left = rect.left + element.clientLeft;
	  rect.bottom = rect.top + element.clientHeight;
	  rect.right = rect.left + element.clientWidth;
	  rect.width = element.clientWidth;
	  rect.height = element.clientHeight;
	  rect.x = rect.left;
	  rect.y = rect.top;
	  return rect;
	}
	function getClientRectFromMixedType(element, clippingParent) {
	  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
	}
	function getClippingParents(element) {
	  var clippingParents = listScrollParents(getParentNode(element));
	  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
	  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
	  if (!isElement$1(clipperElement)) {
	    return [];
	  }
	  return clippingParents.filter(function (clippingParent) {
	    return isElement$1(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
	  });
	}
	function getClippingRect(element, boundary, rootBoundary) {
	  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
	  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
	  var firstClippingParent = clippingParents[0];
	  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
	    var rect = getClientRectFromMixedType(element, clippingParent);
	    accRect.top = max(rect.top, accRect.top);
	    accRect.right = min(rect.right, accRect.right);
	    accRect.bottom = min(rect.bottom, accRect.bottom);
	    accRect.left = max(rect.left, accRect.left);
	    return accRect;
	  }, getClientRectFromMixedType(element, firstClippingParent));
	  clippingRect.width = clippingRect.right - clippingRect.left;
	  clippingRect.height = clippingRect.bottom - clippingRect.top;
	  clippingRect.x = clippingRect.left;
	  clippingRect.y = clippingRect.top;
	  return clippingRect;
	}

	function getVariation(placement) {
	  return placement.split('-')[1];
	}

	function computeOffsets(_ref) {
	  var reference = _ref.reference,
	      element = _ref.element,
	      placement = _ref.placement;
	  var basePlacement = placement ? getBasePlacement(placement) : null;
	  var variation = placement ? getVariation(placement) : null;
	  var commonX = reference.x + reference.width / 2 - element.width / 2;
	  var commonY = reference.y + reference.height / 2 - element.height / 2;
	  var offsets;
	  switch (basePlacement) {
	    case top:
	      offsets = {
	        x: commonX,
	        y: reference.y - element.height
	      };
	      break;
	    case bottom:
	      offsets = {
	        x: commonX,
	        y: reference.y + reference.height
	      };
	      break;
	    case right:
	      offsets = {
	        x: reference.x + reference.width,
	        y: commonY
	      };
	      break;
	    case left:
	      offsets = {
	        x: reference.x - element.width,
	        y: commonY
	      };
	      break;
	    default:
	      offsets = {
	        x: reference.x,
	        y: reference.y
	      };
	  }
	  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
	  if (mainAxis != null) {
	    var len = mainAxis === 'y' ? 'height' : 'width';
	    switch (variation) {
	      case start:
	        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
	        break;
	      case end:
	        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
	        break;
	    }
	  }
	  return offsets;
	}

	function detectOverflow(state, options) {
	  if (options === void 0) {
	    options = {};
	  }
	  var _options = options,
	      _options$placement = _options.placement,
	      placement = _options$placement === void 0 ? state.placement : _options$placement,
	      _options$boundary = _options.boundary,
	      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
	      _options$rootBoundary = _options.rootBoundary,
	      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
	      _options$elementConte = _options.elementContext,
	      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
	      _options$altBoundary = _options.altBoundary,
	      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
	      _options$padding = _options.padding,
	      padding = _options$padding === void 0 ? 0 : _options$padding;
	  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
	  var altContext = elementContext === popper ? reference : popper;
	  var referenceElement = state.elements.reference;
	  var popperRect = state.rects.popper;
	  var element = state.elements[altBoundary ? altContext : elementContext];
	  var clippingClientRect = getClippingRect(isElement$1(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
	  var referenceClientRect = getBoundingClientRect(referenceElement);
	  var popperOffsets = computeOffsets({
	    reference: referenceClientRect,
	    element: popperRect,
	    strategy: 'absolute',
	    placement: placement
	  });
	  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
	  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
	  var overflowOffsets = {
	    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
	    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
	    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
	    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
	  };
	  var offsetData = state.modifiersData.offset;
	  if (elementContext === popper && offsetData) {
	    var offset = offsetData[placement];
	    Object.keys(overflowOffsets).forEach(function (key) {
	      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
	      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
	      overflowOffsets[key] += offset[axis] * multiply;
	    });
	  }
	  return overflowOffsets;
	}

	function computeAutoPlacement(state, options) {
	  if (options === void 0) {
	    options = {};
	  }
	  var _options = options,
	      placement = _options.placement,
	      boundary = _options.boundary,
	      rootBoundary = _options.rootBoundary,
	      padding = _options.padding,
	      flipVariations = _options.flipVariations,
	      _options$allowedAutoP = _options.allowedAutoPlacements,
	      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
	  var variation = getVariation(placement);
	  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
	    return getVariation(placement) === variation;
	  }) : basePlacements;
	  var allowedPlacements = placements$1.filter(function (placement) {
	    return allowedAutoPlacements.indexOf(placement) >= 0;
	  });
	  if (allowedPlacements.length === 0) {
	    allowedPlacements = placements$1;
	  }
	  var overflows = allowedPlacements.reduce(function (acc, placement) {
	    acc[placement] = detectOverflow(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      padding: padding
	    })[getBasePlacement(placement)];
	    return acc;
	  }, {});
	  return Object.keys(overflows).sort(function (a, b) {
	    return overflows[a] - overflows[b];
	  });
	}

	function getExpandedFallbackPlacements(placement) {
	  if (getBasePlacement(placement) === auto) {
	    return [];
	  }
	  var oppositePlacement = getOppositePlacement(placement);
	  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
	}
	function flip(_ref) {
	  var state = _ref.state,
	      options = _ref.options,
	      name = _ref.name;
	  if (state.modifiersData[name]._skip) {
	    return;
	  }
	  var _options$mainAxis = options.mainAxis,
	      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
	      _options$altAxis = options.altAxis,
	      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
	      specifiedFallbackPlacements = options.fallbackPlacements,
	      padding = options.padding,
	      boundary = options.boundary,
	      rootBoundary = options.rootBoundary,
	      altBoundary = options.altBoundary,
	      _options$flipVariatio = options.flipVariations,
	      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
	      allowedAutoPlacements = options.allowedAutoPlacements;
	  var preferredPlacement = state.options.placement;
	  var basePlacement = getBasePlacement(preferredPlacement);
	  var isBasePlacement = basePlacement === preferredPlacement;
	  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
	  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
	    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      padding: padding,
	      flipVariations: flipVariations,
	      allowedAutoPlacements: allowedAutoPlacements
	    }) : placement);
	  }, []);
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var checksMap = new Map();
	  var makeFallbackChecks = true;
	  var firstFittingPlacement = placements[0];
	  for (var i = 0; i < placements.length; i++) {
	    var placement = placements[i];
	    var _basePlacement = getBasePlacement(placement);
	    var isStartVariation = getVariation(placement) === start;
	    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
	    var len = isVertical ? 'width' : 'height';
	    var overflow = detectOverflow(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      altBoundary: altBoundary,
	      padding: padding
	    });
	    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
	    if (referenceRect[len] > popperRect[len]) {
	      mainVariationSide = getOppositePlacement(mainVariationSide);
	    }
	    var altVariationSide = getOppositePlacement(mainVariationSide);
	    var checks = [];
	    if (checkMainAxis) {
	      checks.push(overflow[_basePlacement] <= 0);
	    }
	    if (checkAltAxis) {
	      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
	    }
	    if (checks.every(function (check) {
	      return check;
	    })) {
	      firstFittingPlacement = placement;
	      makeFallbackChecks = false;
	      break;
	    }
	    checksMap.set(placement, checks);
	  }
	  if (makeFallbackChecks) {
	    var numberOfChecks = flipVariations ? 3 : 1;
	    var _loop = function _loop(_i) {
	      var fittingPlacement = placements.find(function (placement) {
	        var checks = checksMap.get(placement);
	        if (checks) {
	          return checks.slice(0, _i).every(function (check) {
	            return check;
	          });
	        }
	      });
	      if (fittingPlacement) {
	        firstFittingPlacement = fittingPlacement;
	        return "break";
	      }
	    };
	    for (var _i = numberOfChecks; _i > 0; _i--) {
	      var _ret = _loop(_i);
	      if (_ret === "break") break;
	    }
	  }
	  if (state.placement !== firstFittingPlacement) {
	    state.modifiersData[name]._skip = true;
	    state.placement = firstFittingPlacement;
	    state.reset = true;
	  }
	}
	var flip$1 = {
	  name: 'flip',
	  enabled: true,
	  phase: 'main',
	  fn: flip,
	  requiresIfExists: ['offset'],
	  data: {
	    _skip: false
	  }
	};

	function getSideOffsets(overflow, rect, preventedOffsets) {
	  if (preventedOffsets === void 0) {
	    preventedOffsets = {
	      x: 0,
	      y: 0
	    };
	  }
	  return {
	    top: overflow.top - rect.height - preventedOffsets.y,
	    right: overflow.right - rect.width + preventedOffsets.x,
	    bottom: overflow.bottom - rect.height + preventedOffsets.y,
	    left: overflow.left - rect.width - preventedOffsets.x
	  };
	}
	function isAnySideFullyClipped(overflow) {
	  return [top, right, bottom, left].some(function (side) {
	    return overflow[side] >= 0;
	  });
	}
	function hide$1(_ref) {
	  var state = _ref.state,
	      name = _ref.name;
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var preventedOffsets = state.modifiersData.preventOverflow;
	  var referenceOverflow = detectOverflow(state, {
	    elementContext: 'reference'
	  });
	  var popperAltOverflow = detectOverflow(state, {
	    altBoundary: true
	  });
	  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
	  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
	  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
	  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
	  state.modifiersData[name] = {
	    referenceClippingOffsets: referenceClippingOffsets,
	    popperEscapeOffsets: popperEscapeOffsets,
	    isReferenceHidden: isReferenceHidden,
	    hasPopperEscaped: hasPopperEscaped
	  };
	  state.attributes.popper = Object.assign({}, state.attributes.popper, {
	    'data-popper-reference-hidden': isReferenceHidden,
	    'data-popper-escaped': hasPopperEscaped
	  });
	}
	var hide$2 = {
	  name: 'hide',
	  enabled: true,
	  phase: 'main',
	  requiresIfExists: ['preventOverflow'],
	  fn: hide$1
	};

	function distanceAndSkiddingToXY(placement, rects, offset) {
	  var basePlacement = getBasePlacement(placement);
	  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
	  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
	    placement: placement
	  })) : offset,
	      skidding = _ref[0],
	      distance = _ref[1];
	  skidding = skidding || 0;
	  distance = (distance || 0) * invertDistance;
	  return [left, right].indexOf(basePlacement) >= 0 ? {
	    x: distance,
	    y: skidding
	  } : {
	    x: skidding,
	    y: distance
	  };
	}
	function offset(_ref2) {
	  var state = _ref2.state,
	      options = _ref2.options,
	      name = _ref2.name;
	  var _options$offset = options.offset,
	      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
	  var data = placements.reduce(function (acc, placement) {
	    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
	    return acc;
	  }, {});
	  var _data$state$placement = data[state.placement],
	      x = _data$state$placement.x,
	      y = _data$state$placement.y;
	  if (state.modifiersData.popperOffsets != null) {
	    state.modifiersData.popperOffsets.x += x;
	    state.modifiersData.popperOffsets.y += y;
	  }
	  state.modifiersData[name] = data;
	}
	var offset$1 = {
	  name: 'offset',
	  enabled: true,
	  phase: 'main',
	  requires: ['popperOffsets'],
	  fn: offset
	};

	function popperOffsets(_ref) {
	  var state = _ref.state,
	      name = _ref.name;
	  state.modifiersData[name] = computeOffsets({
	    reference: state.rects.reference,
	    element: state.rects.popper,
	    strategy: 'absolute',
	    placement: state.placement
	  });
	}
	var popperOffsets$1 = {
	  name: 'popperOffsets',
	  enabled: true,
	  phase: 'read',
	  fn: popperOffsets,
	  data: {}
	};

	function getAltAxis(axis) {
	  return axis === 'x' ? 'y' : 'x';
	}

	function preventOverflow(_ref) {
	  var state = _ref.state,
	      options = _ref.options,
	      name = _ref.name;
	  var _options$mainAxis = options.mainAxis,
	      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
	      _options$altAxis = options.altAxis,
	      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
	      boundary = options.boundary,
	      rootBoundary = options.rootBoundary,
	      altBoundary = options.altBoundary,
	      padding = options.padding,
	      _options$tether = options.tether,
	      tether = _options$tether === void 0 ? true : _options$tether,
	      _options$tetherOffset = options.tetherOffset,
	      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
	  var overflow = detectOverflow(state, {
	    boundary: boundary,
	    rootBoundary: rootBoundary,
	    padding: padding,
	    altBoundary: altBoundary
	  });
	  var basePlacement = getBasePlacement(state.placement);
	  var variation = getVariation(state.placement);
	  var isBasePlacement = !variation;
	  var mainAxis = getMainAxisFromPlacement(basePlacement);
	  var altAxis = getAltAxis(mainAxis);
	  var popperOffsets = state.modifiersData.popperOffsets;
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
	    placement: state.placement
	  })) : tetherOffset;
	  var data = {
	    x: 0,
	    y: 0
	  };
	  if (!popperOffsets) {
	    return;
	  }
	  if (checkMainAxis || checkAltAxis) {
	    var mainSide = mainAxis === 'y' ? top : left;
	    var altSide = mainAxis === 'y' ? bottom : right;
	    var len = mainAxis === 'y' ? 'height' : 'width';
	    var offset = popperOffsets[mainAxis];
	    var min$1 = popperOffsets[mainAxis] + overflow[mainSide];
	    var max$1 = popperOffsets[mainAxis] - overflow[altSide];
	    var additive = tether ? -popperRect[len] / 2 : 0;
	    var minLen = variation === start ? referenceRect[len] : popperRect[len];
	    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
	    var arrowElement = state.elements.arrow;
	    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
	      width: 0,
	      height: 0
	    };
	    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
	    var arrowPaddingMin = arrowPaddingObject[mainSide];
	    var arrowPaddingMax = arrowPaddingObject[altSide];
	    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
	    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
	    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
	    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
	    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
	    var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
	    var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
	    var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;
	    if (checkMainAxis) {
	      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
	      popperOffsets[mainAxis] = preventedOffset;
	      data[mainAxis] = preventedOffset - offset;
	    }
	    if (checkAltAxis) {
	      var _mainSide = mainAxis === 'x' ? top : left;
	      var _altSide = mainAxis === 'x' ? bottom : right;
	      var _offset = popperOffsets[altAxis];
	      var _min = _offset + overflow[_mainSide];
	      var _max = _offset - overflow[_altSide];
	      var _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);
	      popperOffsets[altAxis] = _preventedOffset;
	      data[altAxis] = _preventedOffset - _offset;
	    }
	  }
	  state.modifiersData[name] = data;
	}
	var preventOverflow$1 = {
	  name: 'preventOverflow',
	  enabled: true,
	  phase: 'main',
	  fn: preventOverflow,
	  requiresIfExists: ['offset']
	};

	function getHTMLElementScroll(element) {
	  return {
	    scrollLeft: element.scrollLeft,
	    scrollTop: element.scrollTop
	  };
	}

	function getNodeScroll(node) {
	  if (node === getWindow(node) || !isHTMLElement(node)) {
	    return getWindowScroll(node);
	  } else {
	    return getHTMLElementScroll(node);
	  }
	}

	function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
	  if (isFixed === void 0) {
	    isFixed = false;
	  }
	  var documentElement = getDocumentElement(offsetParent);
	  var rect = getBoundingClientRect(elementOrVirtualElement);
	  var isOffsetParentAnElement = isHTMLElement(offsetParent);
	  var scroll = {
	    scrollLeft: 0,
	    scrollTop: 0
	  };
	  var offsets = {
	    x: 0,
	    y: 0
	  };
	  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
	    if (getNodeName(offsetParent) !== 'body' ||
	    isScrollParent(documentElement)) {
	      scroll = getNodeScroll(offsetParent);
	    }
	    if (isHTMLElement(offsetParent)) {
	      offsets = getBoundingClientRect(offsetParent);
	      offsets.x += offsetParent.clientLeft;
	      offsets.y += offsetParent.clientTop;
	    } else if (documentElement) {
	      offsets.x = getWindowScrollBarX(documentElement);
	    }
	  }
	  return {
	    x: rect.left + scroll.scrollLeft - offsets.x,
	    y: rect.top + scroll.scrollTop - offsets.y,
	    width: rect.width,
	    height: rect.height
	  };
	}

	function order(modifiers) {
	  var map = new Map();
	  var visited = new Set();
	  var result = [];
	  modifiers.forEach(function (modifier) {
	    map.set(modifier.name, modifier);
	  });
	  function sort(modifier) {
	    visited.add(modifier.name);
	    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
	    requires.forEach(function (dep) {
	      if (!visited.has(dep)) {
	        var depModifier = map.get(dep);
	        if (depModifier) {
	          sort(depModifier);
	        }
	      }
	    });
	    result.push(modifier);
	  }
	  modifiers.forEach(function (modifier) {
	    if (!visited.has(modifier.name)) {
	      sort(modifier);
	    }
	  });
	  return result;
	}
	function orderModifiers(modifiers) {
	  var orderedModifiers = order(modifiers);
	  return modifierPhases.reduce(function (acc, phase) {
	    return acc.concat(orderedModifiers.filter(function (modifier) {
	      return modifier.phase === phase;
	    }));
	  }, []);
	}

	function debounce(fn) {
	  var pending;
	  return function () {
	    if (!pending) {
	      pending = new Promise(function (resolve) {
	        Promise.resolve().then(function () {
	          pending = undefined;
	          resolve(fn());
	        });
	      });
	    }
	    return pending;
	  };
	}

	function mergeByName(modifiers) {
	  var merged = modifiers.reduce(function (merged, current) {
	    var existing = merged[current.name];
	    merged[current.name] = existing ? Object.assign({}, existing, current, {
	      options: Object.assign({}, existing.options, current.options),
	      data: Object.assign({}, existing.data, current.data)
	    }) : current;
	    return merged;
	  }, {});
	  return Object.keys(merged).map(function (key) {
	    return merged[key];
	  });
	}

	var DEFAULT_OPTIONS = {
	  placement: 'bottom',
	  modifiers: [],
	  strategy: 'absolute'
	};
	function areValidElements() {
	  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	  return !args.some(function (element) {
	    return !(element && typeof element.getBoundingClientRect === 'function');
	  });
	}
	function popperGenerator(generatorOptions) {
	  if (generatorOptions === void 0) {
	    generatorOptions = {};
	  }
	  var _generatorOptions = generatorOptions,
	      _generatorOptions$def = _generatorOptions.defaultModifiers,
	      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
	      _generatorOptions$def2 = _generatorOptions.defaultOptions,
	      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
	  return function createPopper(reference, popper, options) {
	    if (options === void 0) {
	      options = defaultOptions;
	    }
	    var state = {
	      placement: 'bottom',
	      orderedModifiers: [],
	      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
	      modifiersData: {},
	      elements: {
	        reference: reference,
	        popper: popper
	      },
	      attributes: {},
	      styles: {}
	    };
	    var effectCleanupFns = [];
	    var isDestroyed = false;
	    var instance = {
	      state: state,
	      setOptions: function setOptions(options) {
	        cleanupModifierEffects();
	        state.options = Object.assign({}, defaultOptions, state.options, options);
	        state.scrollParents = {
	          reference: isElement$1(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
	          popper: listScrollParents(popper)
	        };
	        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers)));
	        state.orderedModifiers = orderedModifiers.filter(function (m) {
	          return m.enabled;
	        });
	        runModifierEffects();
	        return instance.update();
	      },
	      forceUpdate: function forceUpdate() {
	        if (isDestroyed) {
	          return;
	        }
	        var _state$elements = state.elements,
	            reference = _state$elements.reference,
	            popper = _state$elements.popper;
	        if (!areValidElements(reference, popper)) {
	          return;
	        }
	        state.rects = {
	          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
	          popper: getLayoutRect(popper)
	        };
	        state.reset = false;
	        state.placement = state.options.placement;
	        state.orderedModifiers.forEach(function (modifier) {
	          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
	        });
	        for (var index = 0; index < state.orderedModifiers.length; index++) {
	          if (state.reset === true) {
	            state.reset = false;
	            index = -1;
	            continue;
	          }
	          var _state$orderedModifie = state.orderedModifiers[index],
	              fn = _state$orderedModifie.fn,
	              _state$orderedModifie2 = _state$orderedModifie.options,
	              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
	              name = _state$orderedModifie.name;
	          if (typeof fn === 'function') {
	            state = fn({
	              state: state,
	              options: _options,
	              name: name,
	              instance: instance
	            }) || state;
	          }
	        }
	      },
	      update: debounce(function () {
	        return new Promise(function (resolve) {
	          instance.forceUpdate();
	          resolve(state);
	        });
	      }),
	      destroy: function destroy() {
	        cleanupModifierEffects();
	        isDestroyed = true;
	      }
	    };
	    if (!areValidElements(reference, popper)) {
	      return instance;
	    }
	    instance.setOptions(options).then(function (state) {
	      if (!isDestroyed && options.onFirstUpdate) {
	        options.onFirstUpdate(state);
	      }
	    });
	    function runModifierEffects() {
	      state.orderedModifiers.forEach(function (_ref3) {
	        var name = _ref3.name,
	            _ref3$options = _ref3.options,
	            options = _ref3$options === void 0 ? {} : _ref3$options,
	            effect = _ref3.effect;
	        if (typeof effect === 'function') {
	          var cleanupFn = effect({
	            state: state,
	            name: name,
	            instance: instance,
	            options: options
	          });
	          var noopFn = function noopFn() {};
	          effectCleanupFns.push(cleanupFn || noopFn);
	        }
	      });
	    }
	    function cleanupModifierEffects() {
	      effectCleanupFns.forEach(function (fn) {
	        return fn();
	      });
	      effectCleanupFns = [];
	    }
	    return instance;
	  };
	}
	var createPopper$2 = popperGenerator();

	var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
	var createPopper$1 = popperGenerator({
	  defaultModifiers: defaultModifiers$1
	});

	var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$2];
	var createPopper = popperGenerator({
	  defaultModifiers: defaultModifiers
	});

	var Popper = /*#__PURE__*/Object.freeze({
		__proto__: null,
		popperGenerator: popperGenerator,
		detectOverflow: detectOverflow,
		createPopperBase: createPopper$2,
		createPopper: createPopper,
		createPopperLite: createPopper$1,
		top: top,
		bottom: bottom,
		right: right,
		left: left,
		auto: auto,
		basePlacements: basePlacements,
		start: start,
		end: end,
		clippingParents: clippingParents,
		viewport: viewport,
		popper: popper,
		reference: reference,
		variationPlacements: variationPlacements,
		placements: placements,
		beforeRead: beforeRead,
		read: read,
		afterRead: afterRead,
		beforeMain: beforeMain,
		main: main,
		afterMain: afterMain,
		beforeWrite: beforeWrite,
		write: write,
		afterWrite: afterWrite,
		modifierPhases: modifierPhases,
		applyStyles: applyStyles$1,
		arrow: arrow$1,
		computeStyles: computeStyles$1,
		eventListeners: eventListeners,
		flip: flip$1,
		hide: hide$2,
		offset: offset$1,
		popperOffsets: popperOffsets$1,
		preventOverflow: preventOverflow$1
	});

	const MAX_UID = 1000000;
	const MILLISECONDS_MULTIPLIER = 1000;
	const TRANSITION_END = 'transitionend';
	const toType = obj => {
	  if (obj === null || obj === undefined) {
	    return `${obj}`;
	  }
	  return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
	};
	const getUID = prefix => {
	  do {
	    prefix += Math.floor(Math.random() * MAX_UID);
	  } while (document.getElementById(prefix));
	  return prefix;
	};
	const getSelector = element => {
	  let selector = element.getAttribute('data-bs-target');
	  if (!selector || selector === '#') {
	    let hrefAttr = element.getAttribute('href');
	    if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
	      return null;
	    }
	    if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
	      hrefAttr = '#' + hrefAttr.split('#')[1];
	    }
	    selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
	  }
	  return selector;
	};
	const getSelectorFromElement = element => {
	  const selector = getSelector(element);
	  if (selector) {
	    return document.querySelector(selector) ? selector : null;
	  }
	  return null;
	};
	const getElementFromSelector = element => {
	  const selector = getSelector(element);
	  return selector ? document.querySelector(selector) : null;
	};
	const getTransitionDurationFromElement = element => {
	  if (!element) {
	    return 0;
	  }
	  let {
	    transitionDuration,
	    transitionDelay
	  } = window.getComputedStyle(element);
	  const floatTransitionDuration = Number.parseFloat(transitionDuration);
	  const floatTransitionDelay = Number.parseFloat(transitionDelay);
	  if (!floatTransitionDuration && !floatTransitionDelay) {
	    return 0;
	  }
	  transitionDuration = transitionDuration.split(',')[0];
	  transitionDelay = transitionDelay.split(',')[0];
	  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
	};
	const triggerTransitionEnd = element => {
	  element.dispatchEvent(new Event(TRANSITION_END));
	};
	const isElement = obj => (obj[0] || obj).nodeType;
	const emulateTransitionEnd = (element, duration) => {
	  let called = false;
	  const durationPadding = 5;
	  const emulatedDuration = duration + durationPadding;
	  function listener() {
	    called = true;
	    element.removeEventListener(TRANSITION_END, listener);
	  }
	  element.addEventListener(TRANSITION_END, listener);
	  setTimeout(() => {
	    if (!called) {
	      triggerTransitionEnd(element);
	    }
	  }, emulatedDuration);
	};
	const typeCheckConfig = (componentName, config, configTypes) => {
	  Object.keys(configTypes).forEach(property => {
	    const expectedTypes = configTypes[property];
	    const value = config[property];
	    const valueType = value && isElement(value) ? 'element' : toType(value);
	    if (!new RegExp(expectedTypes).test(valueType)) {
	      throw new TypeError(`${componentName.toUpperCase()}: ` + `Option "${property}" provided type "${valueType}" ` + `but expected type "${expectedTypes}".`);
	    }
	  });
	};
	const isVisible = element => {
	  if (!element) {
	    return false;
	  }
	  if (element.style && element.parentNode && element.parentNode.style) {
	    const elementStyle = getComputedStyle(element);
	    const parentNodeStyle = getComputedStyle(element.parentNode);
	    return elementStyle.display !== 'none' && parentNodeStyle.display !== 'none' && elementStyle.visibility !== 'hidden';
	  }
	  return false;
	};
	const isDisabled = element => {
	  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
	    return true;
	  }
	  if (element.classList.contains('disabled')) {
	    return true;
	  }
	  if (typeof element.disabled !== 'undefined') {
	    return element.disabled;
	  }
	  return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
	};
	const findShadowRoot = element => {
	  if (!document.documentElement.attachShadow) {
	    return null;
	  }
	  if (typeof element.getRootNode === 'function') {
	    const root = element.getRootNode();
	    return root instanceof ShadowRoot ? root : null;
	  }
	  if (element instanceof ShadowRoot) {
	    return element;
	  }
	  if (!element.parentNode) {
	    return null;
	  }
	  return findShadowRoot(element.parentNode);
	};
	const noop = () => function () {};
	const reflow = element => element.offsetHeight;
	const getjQuery = () => {
	  const {
	    jQuery
	  } = window;
	  if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	    return jQuery;
	  }
	  return null;
	};
	const onDOMContentLoaded = callback => {
	  if (document.readyState === 'loading') {
	    document.addEventListener('DOMContentLoaded', callback);
	  } else {
	    callback();
	  }
	};
	const isRTL = () => document.documentElement.dir === 'rtl';
	const defineJQueryPlugin = (name, plugin) => {
	  onDOMContentLoaded(() => {
	    const $ = getjQuery();
	    if ($) {
	      const JQUERY_NO_CONFLICT = $.fn[name];
	      $.fn[name] = plugin.jQueryInterface;
	      $.fn[name].Constructor = plugin;
	      $.fn[name].noConflict = () => {
	        $.fn[name] = JQUERY_NO_CONFLICT;
	        return plugin.jQueryInterface;
	      };
	    }
	  });
	};
	const elementMap = new Map();
	var Data = {
	  set(element, key, instance) {
	    if (!elementMap.has(element)) {
	      elementMap.set(element, new Map());
	    }
	    const instanceMap = elementMap.get(element);
	    if (!instanceMap.has(key) && instanceMap.size !== 0) {
	      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
	      return;
	    }
	    instanceMap.set(key, instance);
	  },
	  get(element, key) {
	    if (elementMap.has(element)) {
	      return elementMap.get(element).get(key) || null;
	    }
	    return null;
	  },
	  remove(element, key) {
	    if (!elementMap.has(element)) {
	      return;
	    }
	    const instanceMap = elementMap.get(element);
	    instanceMap.delete(key);
	    if (instanceMap.size === 0) {
	      elementMap.delete(element);
	    }
	  }
	};
	const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
	const stripNameRegex = /\..*/;
	const stripUidRegex = /::\d+$/;
	const eventRegistry = {};
	let uidEvent = 1;
	const customEvents = {
	  mouseenter: 'mouseover',
	  mouseleave: 'mouseout'
	};
	const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
	function getUidEvent(element, uid) {
	  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
	}
	function getEvent(element) {
	  const uid = getUidEvent(element);
	  element.uidEvent = uid;
	  eventRegistry[uid] = eventRegistry[uid] || {};
	  return eventRegistry[uid];
	}
	function bootstrapHandler(element, fn) {
	  return function handler(event) {
	    event.delegateTarget = element;
	    if (handler.oneOff) {
	      EventHandler.off(element, event.type, fn);
	    }
	    return fn.apply(element, [event]);
	  };
	}
	function bootstrapDelegationHandler(element, selector, fn) {
	  return function handler(event) {
	    const domElements = element.querySelectorAll(selector);
	    for (let {
	      target
	    } = event; target && target !== this; target = target.parentNode) {
	      for (let i = domElements.length; i--;) {
	        if (domElements[i] === target) {
	          event.delegateTarget = target;
	          if (handler.oneOff) {
	            EventHandler.off(element, event.type, fn);
	          }
	          return fn.apply(target, [event]);
	        }
	      }
	    }
	    return null;
	  };
	}
	function findHandler(events, handler, delegationSelector = null) {
	  const uidEventList = Object.keys(events);
	  for (let i = 0, len = uidEventList.length; i < len; i++) {
	    const event = events[uidEventList[i]];
	    if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
	      return event;
	    }
	  }
	  return null;
	}
	function normalizeParams(originalTypeEvent, handler, delegationFn) {
	  const delegation = typeof handler === 'string';
	  const originalHandler = delegation ? delegationFn : handler;
	  let typeEvent = originalTypeEvent.replace(stripNameRegex, '');
	  const custom = customEvents[typeEvent];
	  if (custom) {
	    typeEvent = custom;
	  }
	  const isNative = nativeEvents.has(typeEvent);
	  if (!isNative) {
	    typeEvent = originalTypeEvent;
	  }
	  return [delegation, originalHandler, typeEvent];
	}
	function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
	  if (typeof originalTypeEvent !== 'string' || !element) {
	    return;
	  }
	  if (!handler) {
	    handler = delegationFn;
	    delegationFn = null;
	  }
	  const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
	  const events = getEvent(element);
	  const handlers = events[typeEvent] || (events[typeEvent] = {});
	  const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);
	  if (previousFn) {
	    previousFn.oneOff = previousFn.oneOff && oneOff;
	    return;
	  }
	  const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
	  const fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
	  fn.delegationSelector = delegation ? handler : null;
	  fn.originalHandler = originalHandler;
	  fn.oneOff = oneOff;
	  fn.uidEvent = uid;
	  handlers[uid] = fn;
	  element.addEventListener(typeEvent, fn, delegation);
	}
	function removeHandler(element, events, typeEvent, handler, delegationSelector) {
	  const fn = findHandler(events[typeEvent], handler, delegationSelector);
	  if (!fn) {
	    return;
	  }
	  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
	  delete events[typeEvent][fn.uidEvent];
	}
	function removeNamespacedHandlers(element, events, typeEvent, namespace) {
	  const storeElementEvent = events[typeEvent] || {};
	  Object.keys(storeElementEvent).forEach(handlerKey => {
	    if (handlerKey.includes(namespace)) {
	      const event = storeElementEvent[handlerKey];
	      removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
	    }
	  });
	}
	const EventHandler = {
	  on(element, event, handler, delegationFn) {
	    addHandler(element, event, handler, delegationFn, false);
	  },
	  one(element, event, handler, delegationFn) {
	    addHandler(element, event, handler, delegationFn, true);
	  },
	  off(element, originalTypeEvent, handler, delegationFn) {
	    if (typeof originalTypeEvent !== 'string' || !element) {
	      return;
	    }
	    const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
	    const inNamespace = typeEvent !== originalTypeEvent;
	    const events = getEvent(element);
	    const isNamespace = originalTypeEvent.startsWith('.');
	    if (typeof originalHandler !== 'undefined') {
	      if (!events || !events[typeEvent]) {
	        return;
	      }
	      removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
	      return;
	    }
	    if (isNamespace) {
	      Object.keys(events).forEach(elementEvent => {
	        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
	      });
	    }
	    const storeElementEvent = events[typeEvent] || {};
	    Object.keys(storeElementEvent).forEach(keyHandlers => {
	      const handlerKey = keyHandlers.replace(stripUidRegex, '');
	      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
	        const event = storeElementEvent[keyHandlers];
	        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
	      }
	    });
	  },
	  trigger(element, event, args) {
	    if (typeof event !== 'string' || !element) {
	      return null;
	    }
	    const $ = getjQuery();
	    const typeEvent = event.replace(stripNameRegex, '');
	    const inNamespace = event !== typeEvent;
	    const isNative = nativeEvents.has(typeEvent);
	    let jQueryEvent;
	    let bubbles = true;
	    let nativeDispatch = true;
	    let defaultPrevented = false;
	    let evt = null;
	    if (inNamespace && $) {
	      jQueryEvent = $.Event(event, args);
	      $(element).trigger(jQueryEvent);
	      bubbles = !jQueryEvent.isPropagationStopped();
	      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
	      defaultPrevented = jQueryEvent.isDefaultPrevented();
	    }
	    if (isNative) {
	      evt = document.createEvent('HTMLEvents');
	      evt.initEvent(typeEvent, bubbles, true);
	    } else {
	      evt = new CustomEvent(event, {
	        bubbles,
	        cancelable: true
	      });
	    }
	    if (typeof args !== 'undefined') {
	      Object.keys(args).forEach(key => {
	        Object.defineProperty(evt, key, {
	          get() {
	            return args[key];
	          }
	        });
	      });
	    }
	    if (defaultPrevented) {
	      evt.preventDefault();
	    }
	    if (nativeDispatch) {
	      element.dispatchEvent(evt);
	    }
	    if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
	      jQueryEvent.preventDefault();
	    }
	    return evt;
	  }
	}

	const VERSION = '5.0.0-beta3';
	class BaseComponent {
	  constructor(element) {
	    element = typeof element === 'string' ? document.querySelector(element) : element;
	    if (!element) {
	      return;
	    }
	    this._element = element;
	    Data.set(this._element, this.constructor.DATA_KEY, this);
	  }
	  dispose() {
	    Data.remove(this._element, this.constructor.DATA_KEY);
	    this._element = null;
	  }
	  static getInstance(element) {
	    return Data.get(element, this.DATA_KEY);
	  }
	  static get VERSION() {
	    return VERSION;
	  }
	}

	const NAME$b = 'alert';
	const DATA_KEY$b = 'bs.alert';
	const EVENT_KEY$b = `.${DATA_KEY$b}`;
	const DATA_API_KEY$8 = '.data-api';
	const SELECTOR_DISMISS = '[data-bs-dismiss="alert"]';
	const EVENT_CLOSE = `close${EVENT_KEY$b}`;
	const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
	const EVENT_CLICK_DATA_API$7 = `click${EVENT_KEY$b}${DATA_API_KEY$8}`;
	const CLASS_NAME_ALERT = 'alert';
	const CLASS_NAME_FADE$5 = 'fade';
	const CLASS_NAME_SHOW$8 = 'show';
	class Alert extends BaseComponent {
	  static get DATA_KEY() {
	    return DATA_KEY$b;
	  }
	  close(element) {
	    const rootElement = element ? this._getRootElement(element) : this._element;
	    const customEvent = this._triggerCloseEvent(rootElement);
	    if (customEvent === null || customEvent.defaultPrevented) {
	      return;
	    }
	    this._removeElement(rootElement);
	  }
	  _getRootElement(element) {
	    return getElementFromSelector(element) || element.closest(`.${CLASS_NAME_ALERT}`);
	  }
	  _triggerCloseEvent(element) {
	    return EventHandler.trigger(element, EVENT_CLOSE);
	  }
	  _removeElement(element) {
	    element.classList.remove(CLASS_NAME_SHOW$8);
	    if (!element.classList.contains(CLASS_NAME_FADE$5)) {
	      this._destroyElement(element);
	      return;
	    }
	    const transitionDuration = getTransitionDurationFromElement(element);
	    EventHandler.one(element, 'transitionend', () => this._destroyElement(element));
	    emulateTransitionEnd(element, transitionDuration);
	  }
	  _destroyElement(element) {
	    if (element.parentNode) {
	      element.parentNode.removeChild(element);
	    }
	    EventHandler.trigger(element, EVENT_CLOSED);
	  }
	  static jQueryInterface(config) {
	    return this.each(function () {
	      let data = Data.get(this, DATA_KEY$b);
	      if (!data) {
	        data = new Alert(this);
	      }
	      if (config === 'close') {
	        data[config](this);
	      }
	    });
	  }
	  static handleDismiss(alertInstance) {
	    return function (event) {
	      if (event) {
	        event.preventDefault();
	      }
	      alertInstance.close(this);
	    };
	  }
	}
	EventHandler.on(document, EVENT_CLICK_DATA_API$7, SELECTOR_DISMISS, Alert.handleDismiss(new Alert()));
	defineJQueryPlugin(NAME$b, Alert)
	const NAME$a = 'button';
	const DATA_KEY$a = 'bs.button';
	const EVENT_KEY$a = `.${DATA_KEY$a}`;
	const DATA_API_KEY$7 = '.data-api';
	const CLASS_NAME_ACTIVE$3 = 'active';
	const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
	const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$7}`;
	class Button extends BaseComponent {
	  static get DATA_KEY() {
	    return DATA_KEY$a;
	  }
	  toggle() {
	    this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
	  }
	  static jQueryInterface(config) {
	    return this.each(function () {
	      let data = Data.get(this, DATA_KEY$a);
	      if (!data) {
	        data = new Button(this);
	      }
	      if (config === 'toggle') {
	        data[config]();
	      }
	    });
	  }
	}
	EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
	  event.preventDefault();
	  const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
	  let data = Data.get(button, DATA_KEY$a);
	  if (!data) {
	    data = new Button(button);
	  }
	  data.toggle();
	})
	defineJQueryPlugin(NAME$a, Button);
	function normalizeData(val) {
	  if (val === 'true') {
	    return true;
	  }
	  if (val === 'false') {
	    return false;
	  }
	  if (val === Number(val).toString()) {
	    return Number(val);
	  }
	  if (val === '' || val === 'null') {
	    return null;
	  }
	  return val;
	}
	function normalizeDataKey(key) {
	  return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
	}
	const Manipulator = {
	  setDataAttribute(element, key, value) {
	    element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
	  },
	  removeDataAttribute(element, key) {
	    element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
	  },
	  getDataAttributes(element) {
	    if (!element) {
	      return {};
	    }
	    const attributes = {};
	    Object.keys(element.dataset).filter(key => key.startsWith('bs')).forEach(key => {
	      let pureKey = key.replace(/^bs/, '');
	      pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
	      attributes[pureKey] = normalizeData(element.dataset[key]);
	    });
	    return attributes;
	  },
	  getDataAttribute(element, key) {
	    return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
	  },
	  offset(element) {
	    const rect = element.getBoundingClientRect();
	    return {
	      top: rect.top + document.body.scrollTop,
	      left: rect.left + document.body.scrollLeft
	    };
	  },
	  position(element) {
	    return {
	      top: element.offsetTop,
	      left: element.offsetLeft
	    };
	  }
	};
	const NODE_TEXT = 3;
	const SelectorEngine = {
	  find(selector, element = document.documentElement) {
	    return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
	  },
	  findOne(selector, element = document.documentElement) {
	    return Element.prototype.querySelector.call(element, selector);
	  },
	  children(element, selector) {
	    return [].concat(...element.children).filter(child => child.matches(selector));
	  },
	  parents(element, selector) {
	    const parents = [];
	    let ancestor = element.parentNode;
	    while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
	      if (ancestor.matches(selector)) {
	        parents.push(ancestor);
	      }
	      ancestor = ancestor.parentNode;
	    }
	    return parents;
	  },
	  prev(element, selector) {
	    let previous = element.previousElementSibling;
	    while (previous) {
	      if (previous.matches(selector)) {
	        return [previous];
	      }
	      previous = previous.previousElementSibling;
	    }
	    return [];
	  },
	  next(element, selector) {
	    let next = element.nextElementSibling;
	    while (next) {
	      if (next.matches(selector)) {
	        return [next];
	      }
	      next = next.nextElementSibling;
	    }
	    return [];
	  }
	}
	const NAME$8 = 'collapse';
	const DATA_KEY$8 = 'bs.collapse';
	const EVENT_KEY$8 = `.${DATA_KEY$8}`;
	const DATA_API_KEY$5 = '.data-api';
	const Default$7 = {
	  toggle: true,
	  parent: ''
	};
	const DefaultType$7 = {
	  toggle: 'boolean',
	  parent: '(string|element)'
	};
	const EVENT_SHOW$5 = `show${EVENT_KEY$8}`;
	const EVENT_SHOWN$5 = `shown${EVENT_KEY$8}`;
	const EVENT_HIDE$5 = `hide${EVENT_KEY$8}`;
	const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$8}`;
	const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
	const CLASS_NAME_SHOW$7 = 'show';
	const CLASS_NAME_COLLAPSE = 'collapse';
	const CLASS_NAME_COLLAPSING = 'collapsing';
	const CLASS_NAME_COLLAPSED = 'collapsed';
	const WIDTH = 'width';
	const HEIGHT = 'height';
	const SELECTOR_ACTIVES = '.show, .collapsing';
	const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
	class Collapse extends BaseComponent {
	  constructor(element, config) {
	    super(element);
	    this._isTransitioning = false;
	    this._config = this._getConfig(config);
	    this._triggerArray = SelectorEngine.find(`${SELECTOR_DATA_TOGGLE$4}[href="#${this._element.id}"],` + `${SELECTOR_DATA_TOGGLE$4}[data-bs-target="#${this._element.id}"]`);
	    const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
	    for (let i = 0, len = toggleList.length; i < len; i++) {
	      const elem = toggleList[i];
	      const selector = getSelectorFromElement(elem);
	      const filterElement = SelectorEngine.find(selector).filter(foundElem => foundElem === this._element);
	      if (selector !== null && filterElement.length) {
	        this._selector = selector;
	        this._triggerArray.push(elem);
	      }
	    }
	    this._parent = this._config.parent ? this._getParent() : null;
	    if (!this._config.parent) {
	      this._addAriaAndCollapsedClass(this._element, this._triggerArray);
	    }
	    if (this._config.toggle) {
	      this.toggle();
	    }
	  }
	  static get Default() {
	    return Default$7;
	  }
	  static get DATA_KEY() {
	    return DATA_KEY$8;
	  }
	  toggle() {
	    if (this._element.classList.contains(CLASS_NAME_SHOW$7)) {
	      this.hide();
	    } else {
	      this.show();
	    }
	  }
	  show() {
	    if (this._isTransitioning || this._element.classList.contains(CLASS_NAME_SHOW$7)) {
	      return;
	    }
	    let actives;
	    let activesData;
	    if (this._parent) {
	      actives = SelectorEngine.find(SELECTOR_ACTIVES, this._parent).filter(elem => {
	        if (typeof this._config.parent === 'string') {
	          return elem.getAttribute('data-bs-parent') === this._config.parent;
	        }
	        return elem.classList.contains(CLASS_NAME_COLLAPSE);
	      });
	      if (actives.length === 0) {
	        actives = null;
	      }
	    }
	    const container = SelectorEngine.findOne(this._selector);
	    if (actives) {
	      const tempActiveData = actives.find(elem => container !== elem);
	      activesData = tempActiveData ? Data.get(tempActiveData, DATA_KEY$8) : null;
	      if (activesData && activesData._isTransitioning) {
	        return;
	      }
	    }
	    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);
	    if (startEvent.defaultPrevented) {
	      return;
	    }
	    if (actives) {
	      actives.forEach(elemActive => {
	        if (container !== elemActive) {
	          Collapse.collapseInterface(elemActive, 'hide');
	        }
	        if (!activesData) {
	          Data.set(elemActive, DATA_KEY$8, null);
	        }
	      });
	    }
	    const dimension = this._getDimension();
	    this._element.classList.remove(CLASS_NAME_COLLAPSE);
	    this._element.classList.add(CLASS_NAME_COLLAPSING);
	    this._element.style[dimension] = 0;
	    if (this._triggerArray.length) {
	      this._triggerArray.forEach(element => {
	        element.classList.remove(CLASS_NAME_COLLAPSED);
	        element.setAttribute('aria-expanded', true);
	      });
	    }
	    this.setTransitioning(true);
	    const complete = () => {
	      this._element.classList.remove(CLASS_NAME_COLLAPSING);
	      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
	      this._element.style[dimension] = '';
	      this.setTransitioning(false);
	      EventHandler.trigger(this._element, EVENT_SHOWN$5);
	    };
	    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
	    const scrollSize = `scroll${capitalizedDimension}`;
	    const transitionDuration = getTransitionDurationFromElement(this._element);
	    EventHandler.one(this._element, 'transitionend', complete);
	    emulateTransitionEnd(this._element, transitionDuration);
	    this._element.style[dimension] = `${this._element[scrollSize]}px`;
	  }
	  hide() {
	    if (this._isTransitioning || !this._element.classList.contains(CLASS_NAME_SHOW$7)) {
	      return;
	    }
	    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);
	    if (startEvent.defaultPrevented) {
	      return;
	    }
	    const dimension = this._getDimension();
	    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
	    reflow(this._element);
	    this._element.classList.add(CLASS_NAME_COLLAPSING);
	    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
	    const triggerArrayLength = this._triggerArray.length;
	    if (triggerArrayLength > 0) {
	      for (let i = 0; i < triggerArrayLength; i++) {
	        const trigger = this._triggerArray[i];
	        const elem = getElementFromSelector(trigger);
	        if (elem && !elem.classList.contains(CLASS_NAME_SHOW$7)) {
	          trigger.classList.add(CLASS_NAME_COLLAPSED);
	          trigger.setAttribute('aria-expanded', false);
	        }
	      }
	    }
	    this.setTransitioning(true);
	    const complete = () => {
	      this.setTransitioning(false);
	      this._element.classList.remove(CLASS_NAME_COLLAPSING);
	      this._element.classList.add(CLASS_NAME_COLLAPSE);
	      EventHandler.trigger(this._element, EVENT_HIDDEN$5);
	    };
	    this._element.style[dimension] = '';
	    const transitionDuration = getTransitionDurationFromElement(this._element);
	    EventHandler.one(this._element, 'transitionend', complete);
	    emulateTransitionEnd(this._element, transitionDuration);
	  }
	  setTransitioning(isTransitioning) {
	    this._isTransitioning = isTransitioning;
	  }
	  dispose() {
	    super.dispose();
	    this._config = null;
	    this._parent = null;
	    this._triggerArray = null;
	    this._isTransitioning = null;
	  }
	  _getConfig(config) {
	    config = { ...Default$7,
	      ...config
	    };
	    config.toggle = Boolean(config.toggle);
	    typeCheckConfig(NAME$8, config, DefaultType$7);
	    return config;
	  }
	  _getDimension() {
	    return this._element.classList.contains(WIDTH) ? WIDTH : HEIGHT;
	  }
	  _getParent() {
	    let {
	      parent
	    } = this._config;
	    if (isElement(parent)) {
	      if (typeof parent.jquery !== 'undefined' || typeof parent[0] !== 'undefined') {
	        parent = parent[0];
	      }
	    } else {
	      parent = SelectorEngine.findOne(parent);
	    }
	    const selector = `${SELECTOR_DATA_TOGGLE$4}[data-bs-parent="${parent}"]`;
	    SelectorEngine.find(selector, parent).forEach(element => {
	      const selected = getElementFromSelector(element);
	      this._addAriaAndCollapsedClass(selected, [element]);
	    });
	    return parent;
	  }
	  _addAriaAndCollapsedClass(element, triggerArray) {
	    if (!element || !triggerArray.length) {
	      return;
	    }
	    const isOpen = element.classList.contains(CLASS_NAME_SHOW$7);
	    triggerArray.forEach(elem => {
	      if (isOpen) {
	        elem.classList.remove(CLASS_NAME_COLLAPSED);
	      } else {
	        elem.classList.add(CLASS_NAME_COLLAPSED);
	      }
	      elem.setAttribute('aria-expanded', isOpen);
	    });
	  }
	  static collapseInterface(element, config) {
	    let data = Data.get(element, DATA_KEY$8);
	    const _config = { ...Default$7,
	      ...Manipulator.getDataAttributes(element),
	      ...(typeof config === 'object' && config ? config : {})
	    };
	    if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
	      _config.toggle = false;
	    }
	    if (!data) {
	      data = new Collapse(element, _config);
	    }
	    if (typeof config === 'string') {
	      if (typeof data[config] === 'undefined') {
	        throw new TypeError(`No method named "${config}"`);
	      }
	      data[config]();
	    }
	  }
	  static jQueryInterface(config) {
	    return this.each(function () {
	      Collapse.collapseInterface(this, config);
	    });
	  }
	}
	EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
	  if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
	    event.preventDefault();
	  }
	  const triggerData = Manipulator.getDataAttributes(this);
	  const selector = getSelectorFromElement(this);
	  const selectorElements = SelectorEngine.find(selector);
	  selectorElements.forEach(element => {
	    const data = Data.get(element, DATA_KEY$8);
	    let config;
	    if (data) {
	      if (data._parent === null && typeof triggerData.parent === 'string') {
	        data._config.parent = triggerData.parent;
	        data._parent = data._getParent();
	      }
	      config = 'toggle';
	    } else {
	      config = triggerData;
	    }
	    Collapse.collapseInterface(element, config);
	  });
	});
	defineJQueryPlugin(NAME$8, Collapse);
	const NAME$7 = 'dropdown';
	const DATA_KEY$7 = 'bs.dropdown';
	const EVENT_KEY$7 = `.${DATA_KEY$7}`;
	const DATA_API_KEY$4 = '.data-api';
	const ESCAPE_KEY$2 = 'Escape';
	const SPACE_KEY = 'Space';
	const TAB_KEY = 'Tab';
	const ARROW_UP_KEY = 'ArrowUp';
	const ARROW_DOWN_KEY = 'ArrowDown';
	const RIGHT_MOUSE_BUTTON = 2;
	const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY$2}`);
	const EVENT_HIDE$4 = `hide${EVENT_KEY$7}`;
	const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$7}`;
	const EVENT_SHOW$4 = `show${EVENT_KEY$7}`;
	const EVENT_SHOWN$4 = `shown${EVENT_KEY$7}`;
	const EVENT_CLICK = `click${EVENT_KEY$7}`;
	const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
	const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$7}${DATA_API_KEY$4}`;
	const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$7}${DATA_API_KEY$4}`;
	const CLASS_NAME_DISABLED = 'disabled';
	const CLASS_NAME_SHOW$6 = 'show';
	const CLASS_NAME_DROPUP = 'dropup';
	const CLASS_NAME_DROPEND = 'dropend';
	const CLASS_NAME_DROPSTART = 'dropstart';
	const CLASS_NAME_NAVBAR = 'navbar';
	const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]';
	const SELECTOR_MENU = '.dropdown-menu';
	const SELECTOR_NAVBAR_NAV = '.navbar-nav';
	const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
	const PLACEMENT_TOP = 'top-start';
	const PLACEMENT_TOPEND = 'top-end';
	const PLACEMENT_BOTTOM = 'bottom-start';
	const PLACEMENT_BOTTOMEND = 'bottom-end';
	const PLACEMENT_RIGHT = 'right-start';
	const PLACEMENT_LEFT = 'left-start';
	const Default$6 = {
	  offset: [0, 2],
	  boundary: 'clippingParents',
	  reference: 'toggle',
	  display: 'dynamic',
	  popperConfig: null
	};
	const DefaultType$6 = {
	  offset: '(array|string|function)',
	  boundary: '(string|element)',
	  reference: '(string|element|object)',
	  display: 'string',
	  popperConfig: '(null|object|function)'
	}
	class Dropdown extends BaseComponent {
	  constructor(element, config) {
	    super(element);
	    this._popper = null;
	    this._config = this._getConfig(config);
	    this._menu = this._getMenuElement();
	    this._inNavbar = this._detectNavbar();
	    this._addEventListeners();
	  }
	  static get Default() {
	    return Default$6;
	  }
	  static get DefaultType() {
	    return DefaultType$6;
	  }
	  static get DATA_KEY() {
	    return DATA_KEY$7;
	  }
	  toggle() {
	    if (this._element.disabled || this._element.classList.contains(CLASS_NAME_DISABLED)) {
	      return;
	    }
	    const isActive = this._element.classList.contains(CLASS_NAME_SHOW$6);
	    Dropdown.clearMenus();
	    if (isActive) {
	      return;
	    }
	    this.show();
	  }
	  show() {
	    if (this._element.disabled || this._element.classList.contains(CLASS_NAME_DISABLED) || this._menu.classList.contains(CLASS_NAME_SHOW$6)) {
	      return;
	    }
	    const parent = Dropdown.getParentFromElement(this._element);
	    const relatedTarget = {
	      relatedTarget: this._element
	    };
	    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget);
	    if (showEvent.defaultPrevented) {
	      return;
	    }
	    if (this._inNavbar) {
	      Manipulator.setDataAttribute(this._menu, 'popper', 'none');
	    } else {
	      if (typeof Popper === 'undefined') {
	        throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
	      }
	      let referenceElement = this._element;
	      if (this._config.reference === 'parent') {
	        referenceElement = parent;
	      } else if (isElement(this._config.reference)) {
	        referenceElement = this._config.reference;
	        if (typeof this._config.reference.jquery !== 'undefined') {
	          referenceElement = this._config.reference[0];
	        }
	      } else if (typeof this._config.reference === 'object') {
	        referenceElement = this._config.reference;
	      }
	      const popperConfig = this._getPopperConfig();
	      const isDisplayStatic = popperConfig.modifiers.find(modifier => modifier.name === 'applyStyles' && modifier.enabled === false);
	      this._popper = createPopper(referenceElement, this._menu, popperConfig);
	      if (isDisplayStatic) {
	        Manipulator.setDataAttribute(this._menu, 'popper', 'static');
	      }
	    }
	    if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
	      [].concat(...document.body.children).forEach(elem => EventHandler.on(elem, 'mouseover', null, noop()));
	    }
	    this._element.focus();
	    this._element.setAttribute('aria-expanded', true);
	    this._menu.classList.toggle(CLASS_NAME_SHOW$6);
	    this._element.classList.toggle(CLASS_NAME_SHOW$6);
	    EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
	  }
	  hide() {
	    if (this._element.disabled || this._element.classList.contains(CLASS_NAME_DISABLED) || !this._menu.classList.contains(CLASS_NAME_SHOW$6)) {
	      return;
	    }
	    const relatedTarget = {
	      relatedTarget: this._element
	    };
	    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget);
	    if (hideEvent.defaultPrevented) {
	      return;
	    }
	    if (this._popper) {
	      this._popper.destroy();
	    }
	    this._menu.classList.toggle(CLASS_NAME_SHOW$6);
	    this._element.classList.toggle(CLASS_NAME_SHOW$6);
	    Manipulator.removeDataAttribute(this._menu, 'popper');
	    EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
	  }
	  dispose() {
	    EventHandler.off(this._element, EVENT_KEY$7);
	    this._menu = null;
	    if (this._popper) {
	      this._popper.destroy();
	      this._popper = null;
	    }
	    super.dispose();
	  }
	  update() {
	    this._inNavbar = this._detectNavbar();
	    if (this._popper) {
	      this._popper.update();
	    }
	  }
	  _addEventListeners() {
	    EventHandler.on(this._element, EVENT_CLICK, event => {
	      event.preventDefault();
	      this.toggle();
	    });
	  }
	  _getConfig(config) {
	    config = { ...this.constructor.Default,
	      ...Manipulator.getDataAttributes(this._element),
	      ...config
	    };
	    typeCheckConfig(NAME$7, config, this.constructor.DefaultType);
	    if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
	      throw new TypeError(`${NAME$7.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
	    }
	    return config;
	  }
	  _getMenuElement() {
	    return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
	  }
	  _getPlacement() {
	    const parentDropdown = this._element.parentNode;
	    if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
	      return PLACEMENT_RIGHT;
	    }
	    if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
	      return PLACEMENT_LEFT;
	    }
	    const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';
	    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
	      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
	    }
	    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
	  }
	  _detectNavbar() {
	    return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
	  }
	  _getOffset() {
	    const {
	      offset
	    } = this._config;
	    if (typeof offset === 'string') {
	      return offset.split(',').map(val => Number.parseInt(val, 10));
	    }
	    if (typeof offset === 'function') {
	      return popperData => offset(popperData, this._element);
	    }
	    return offset;
	  }
	  _getPopperConfig() {
	    const defaultBsPopperConfig = {
	      placement: this._getPlacement(),
	      modifiers: [{
	        name: 'preventOverflow',
	        options: {
	          boundary: this._config.boundary
	        }
	      }, {
	        name: 'offset',
	        options: {
	          offset: this._getOffset()
	        }
	      }]
	    };
	    if (this._config.display === 'static') {
	      defaultBsPopperConfig.modifiers = [{
	        name: 'applyStyles',
	        enabled: false
	      }];
	    }
	    return { ...defaultBsPopperConfig,
	      ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
	    };
	  }
	  static dropdownInterface(element, config) {
	    let data = Data.get(element, DATA_KEY$7);
	    const _config = typeof config === 'object' ? config : null;
	    if (!data) {
	      data = new Dropdown(element, _config);
	    }
	    if (typeof config === 'string') {
	      if (typeof data[config] === 'undefined') {
	        throw new TypeError(`No method named "${config}"`);
	      }
	      data[config]();
	    }
	  }
	  static jQueryInterface(config) {
	    return this.each(function () {
	      Dropdown.dropdownInterface(this, config);
	    });
	  }
	  static clearMenus(event) {
	    if (event) {
	      if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY) {
	        return;
	      }
	      if (/input|select|textarea|form/i.test(event.target.tagName)) {
	        return;
	      }
	    }
	    const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);
	    for (let i = 0, len = toggles.length; i < len; i++) {
	      const context = Data.get(toggles[i], DATA_KEY$7);
	      const relatedTarget = {
	        relatedTarget: toggles[i]
	      };
	      if (event && event.type === 'click') {
	        relatedTarget.clickEvent = event;
	      }
	      if (!context) {
	        continue;
	      }
	      const dropdownMenu = context._menu;
	      if (!toggles[i].classList.contains(CLASS_NAME_SHOW$6)) {
	        continue;
	      }
	      if (event) {
	        if ([context._element].some(element => event.composedPath().includes(element))) {
	          continue;
	        }
	        if (event.type === 'keyup' && event.key === TAB_KEY && dropdownMenu.contains(event.target)) {
	          continue;
	        }
	      }
	      const hideEvent = EventHandler.trigger(toggles[i], EVENT_HIDE$4, relatedTarget);
	      if (hideEvent.defaultPrevented) {
	        continue;
	      }
	      if ('ontouchstart' in document.documentElement) {
	        [].concat(...document.body.children).forEach(elem => EventHandler.off(elem, 'mouseover', null, noop()));
	      }
	      toggles[i].setAttribute('aria-expanded', 'false');
	      if (context._popper) {
	        context._popper.destroy();
	      }
	      dropdownMenu.classList.remove(CLASS_NAME_SHOW$6);
	      toggles[i].classList.remove(CLASS_NAME_SHOW$6);
	      Manipulator.removeDataAttribute(dropdownMenu, 'popper');
	      EventHandler.trigger(toggles[i], EVENT_HIDDEN$4, relatedTarget);
	    }
	  }
	  static getParentFromElement(element) {
	    return getElementFromSelector(element) || element.parentNode;
	  }
	  static dataApiKeydownHandler(event) {
	    if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY$2 && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
	      return;
	    }
	    event.preventDefault();
	    event.stopPropagation();
	    if (this.disabled || this.classList.contains(CLASS_NAME_DISABLED)) {
	      return;
	    }
	    const parent = Dropdown.getParentFromElement(this);
	    const isActive = this.classList.contains(CLASS_NAME_SHOW$6);
	    if (event.key === ESCAPE_KEY$2) {
	      const button = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0];
	      button.focus();
	      Dropdown.clearMenus();
	      return;
	    }
	    if (!isActive && (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY)) {
	      const button = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0];
	      button.click();
	      return;
	    }
	    if (!isActive || event.key === SPACE_KEY) {
	      Dropdown.clearMenus();
	      return;
	    }
	    const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, parent).filter(isVisible);
	    if (!items.length) {
	      return;
	    }
	    let index = items.indexOf(event.target);
	    if (event.key === ARROW_UP_KEY && index > 0) {
	      index--;
	    }
	    if (event.key === ARROW_DOWN_KEY && index < items.length - 1) {
	      index++;
	    }
	    index = index === -1 ? 0 : index;
	    items[index].focus();
	  }
	}
	EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
	EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
	EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
	EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
	EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
	  event.preventDefault();
	  Dropdown.dropdownInterface(this);
	});
	defineJQueryPlugin(NAME$7, Dropdown);
	const NAME$6 = 'modal';
	const DATA_KEY$6 = 'bs.modal';
	const EVENT_KEY$6 = `.${DATA_KEY$6}`;
	const DATA_API_KEY$3 = '.data-api';
	const ESCAPE_KEY$1 = 'Escape';
	const Default$5 = {
	  backdrop: true,
	  keyboard: true,
	  focus: true
	};
	const DefaultType$5 = {
	  backdrop: '(boolean|string)',
	  keyboard: 'boolean',
	  focus: 'boolean'
	};
	const EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
	const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$6}`;
	const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
	const EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
	const EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
	const EVENT_FOCUSIN$1 = `focusin${EVENT_KEY$6}`;
	const EVENT_RESIZE = `resize${EVENT_KEY$6}`;
	const EVENT_CLICK_DISMISS$2 = `click.dismiss${EVENT_KEY$6}`;
	const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$6}`;
	const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$6}`;
	const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$6}`;
	const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
	const CLASS_NAME_SCROLLBAR_MEASURER = 'modal-scrollbar-measure';
	const CLASS_NAME_BACKDROP = 'modal-backdrop';
	const CLASS_NAME_OPEN = 'modal-open';
	const CLASS_NAME_FADE$4 = 'fade';
	const CLASS_NAME_SHOW$5 = 'show';
	const CLASS_NAME_STATIC = 'modal-static';
	const SELECTOR_DIALOG = '.modal-dialog';
	const SELECTOR_MODAL_BODY = '.modal-body';
	const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
	const SELECTOR_DATA_DISMISS$2 = '[data-bs-dismiss="modal"]';
	const SELECTOR_FIXED_CONTENT$1 = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
	const SELECTOR_STICKY_CONTENT$1 = '.sticky-top';
	class Modal extends BaseComponent {
	  constructor(element, config) {
	    super(element);
	    this._config = this._getConfig(config);
	    this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
	    this._backdrop = null;
	    this._isShown = false;
	    this._isBodyOverflowing = false;
	    this._ignoreBackdropClick = false;
	    this._isTransitioning = false;
	    this._scrollbarWidth = 0;
	  }
	  static get Default() {
	    return Default$5;
	  }
	  static get DATA_KEY() {
	    return DATA_KEY$6;
	  }
	  toggle(relatedTarget) {
	    return this._isShown ? this.hide() : this.show(relatedTarget);
	  }
	  show(relatedTarget) {
	    if (this._isShown || this._isTransitioning) {
	      return;
	    }
	    if (this._isAnimated()) {
	      this._isTransitioning = true;
	    }
	    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
	      relatedTarget
	    });
	    if (this._isShown || showEvent.defaultPrevented) {
	      return;
	    }
	    this._isShown = true;
	    this._checkScrollbar();
	    this._setScrollbar();
	    this._adjustDialog();
	    this._setEscapeEvent();
	    this._setResizeEvent();
	    EventHandler.on(this._element, EVENT_CLICK_DISMISS$2, SELECTOR_DATA_DISMISS$2, event => this.hide(event));
	    EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
	      EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
	        if (event.target === this._element) {
	          this._ignoreBackdropClick = true;
	        }
	      });
	    });
	    this._showBackdrop(() => this._showElement(relatedTarget));
	  }
	  hide(event) {
	    if (event) {
	      event.preventDefault();
	    }
	    if (!this._isShown || this._isTransitioning) {
	      return;
	    }
	    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
	    if (hideEvent.defaultPrevented) {
	      return;
	    }
	    this._isShown = false;
	    const isAnimated = this._isAnimated();
	    if (isAnimated) {
	      this._isTransitioning = true;
	    }
	    this._setEscapeEvent();
	    this._setResizeEvent();
	    EventHandler.off(document, EVENT_FOCUSIN$1);
	    this._element.classList.remove(CLASS_NAME_SHOW$5);
	    EventHandler.off(this._element, EVENT_CLICK_DISMISS$2);
	    EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);
	    if (isAnimated) {
	      const transitionDuration = getTransitionDurationFromElement(this._element);
	      EventHandler.one(this._element, 'transitionend', event => this._hideModal(event));
	      emulateTransitionEnd(this._element, transitionDuration);
	    } else {
	      this._hideModal();
	    }
	  }
	  dispose() {
	    [window, this._element, this._dialog].forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY$6));
	    super.dispose();
	    EventHandler.off(document, EVENT_FOCUSIN$1);
	    this._config = null;
	    this._dialog = null;
	    this._backdrop = null;
	    this._isShown = null;
	    this._isBodyOverflowing = null;
	    this._ignoreBackdropClick = null;
	    this._isTransitioning = null;
	    this._scrollbarWidth = null;
	  }
	  handleUpdate() {
	    this._adjustDialog();
	  }
	  _getConfig(config) {
	    config = { ...Default$5,
	      ...config
	    };
	    typeCheckConfig(NAME$6, config, DefaultType$5);
	    return config;
	  }
	  _showElement(relatedTarget) {
	    const isAnimated = this._isAnimated();
	    const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
	    if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
	      document.body.appendChild(this._element);
	    }
	    this._element.style.display = 'block';
	    this._element.removeAttribute('aria-hidden');
	    this._element.setAttribute('aria-modal', true);
	    this._element.setAttribute('role', 'dialog');
	    this._element.scrollTop = 0;
	    if (modalBody) {
	      modalBody.scrollTop = 0;
	    }
	    if (isAnimated) {
	      reflow(this._element);
	    }
	    this._element.classList.add(CLASS_NAME_SHOW$5);
	    if (this._config.focus) {
	      this._enforceFocus();
	    }
	    const transitionComplete = () => {
	      if (this._config.focus) {
	        this._element.focus();
	      }
	      this._isTransitioning = false;
	      EventHandler.trigger(this._element, EVENT_SHOWN$3, {
	        relatedTarget
	      });
	    };
	    if (isAnimated) {
	      const transitionDuration = getTransitionDurationFromElement(this._dialog);
	      EventHandler.one(this._dialog, 'transitionend', transitionComplete);
	      emulateTransitionEnd(this._dialog, transitionDuration);
	    } else {
	      transitionComplete();
	    }
	  }
	  _enforceFocus() {
	    EventHandler.off(document, EVENT_FOCUSIN$1);
	    EventHandler.on(document, EVENT_FOCUSIN$1, event => {
	      if (document !== event.target && this._element !== event.target && !this._element.contains(event.target)) {
	        this._element.focus();
	      }
	    });
	  }
	  _setEscapeEvent() {
	    if (this._isShown) {
	      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
	        if (this._config.keyboard && event.key === ESCAPE_KEY$1) {
	          event.preventDefault();
	          this.hide();
	        } else if (!this._config.keyboard && event.key === ESCAPE_KEY$1) {
	          this._triggerBackdropTransition();
	        }
	      });
	    } else {
	      EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS);
	    }
	  }
	  _setResizeEvent() {
	    if (this._isShown) {
	      EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
	    } else {
	      EventHandler.off(window, EVENT_RESIZE);
	    }
	  }
	  _hideModal() {
	    this._element.style.display = 'none';
	    this._element.setAttribute('aria-hidden', true);
	    this._element.removeAttribute('aria-modal');
	    this._element.removeAttribute('role');
	    this._isTransitioning = false;
	    this._showBackdrop(() => {
	      document.body.classList.remove(CLASS_NAME_OPEN);
	      this._resetAdjustments();
	      this._resetScrollbar();
	      EventHandler.trigger(this._element, EVENT_HIDDEN$3);
	    });
	  }
	  _removeBackdrop() {
	    this._backdrop.parentNode.removeChild(this._backdrop);
	    this._backdrop = null;
	  }
	  _showBackdrop(callback) {
	    const isAnimated = this._isAnimated();
	    if (this._isShown && this._config.backdrop) {
	      this._backdrop = document.createElement('div');
	      this._backdrop.className = CLASS_NAME_BACKDROP;
	      if (isAnimated) {
	        this._backdrop.classList.add(CLASS_NAME_FADE$4);
	      }
	      document.body.appendChild(this._backdrop);
	      EventHandler.on(this._element, EVENT_CLICK_DISMISS$2, event => {
	        if (this._ignoreBackdropClick) {
	          this._ignoreBackdropClick = false;
	          return;
	        }
	        if (event.target !== event.currentTarget) {
	          return;
	        }
	        if (this._config.backdrop === 'static') {
	          this._triggerBackdropTransition();
	        } else {
	          this.hide();
	        }
	      });
	      if (isAnimated) {
	        reflow(this._backdrop);
	      }
	      this._backdrop.classList.add(CLASS_NAME_SHOW$5);
	      if (!isAnimated) {
	        callback();
	        return;
	      }
	      const backdropTransitionDuration = getTransitionDurationFromElement(this._backdrop);
	      EventHandler.one(this._backdrop, 'transitionend', callback);
	      emulateTransitionEnd(this._backdrop, backdropTransitionDuration);
	    } else if (!this._isShown && this._backdrop) {
	      this._backdrop.classList.remove(CLASS_NAME_SHOW$5);
	      const callbackRemove = () => {
	        this._removeBackdrop();
	        callback();
	      };
	      if (isAnimated) {
	        const backdropTransitionDuration = getTransitionDurationFromElement(this._backdrop);
	        EventHandler.one(this._backdrop, 'transitionend', callbackRemove);
	        emulateTransitionEnd(this._backdrop, backdropTransitionDuration);
	      } else {
	        callbackRemove();
	      }
	    } else {
	      callback();
	    }
	  }
	  _isAnimated() {
	    return this._element.classList.contains(CLASS_NAME_FADE$4);
	  }
	  _triggerBackdropTransition() {
	    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
	    if (hideEvent.defaultPrevented) {
	      return;
	    }
	    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
	    if (!isModalOverflowing) {
	      this._element.style.overflowY = 'hidden';
	    }
	    this._element.classList.add(CLASS_NAME_STATIC);
	    const modalTransitionDuration = getTransitionDurationFromElement(this._dialog);
	    EventHandler.off(this._element, 'transitionend');
	    EventHandler.one(this._element, 'transitionend', () => {
	      this._element.classList.remove(CLASS_NAME_STATIC);
	      if (!isModalOverflowing) {
	        EventHandler.one(this._element, 'transitionend', () => {
	          this._element.style.overflowY = '';
	        });
	        emulateTransitionEnd(this._element, modalTransitionDuration);
	      }
	    });
	    emulateTransitionEnd(this._element, modalTransitionDuration);
	    this._element.focus();
	  }
	  _adjustDialog() {
	    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
	    if (!this._isBodyOverflowing && isModalOverflowing && !isRTL() || this._isBodyOverflowing && !isModalOverflowing && isRTL()) {
	      this._element.style.paddingLeft = `${this._scrollbarWidth}px`;
	    }
	    if (this._isBodyOverflowing && !isModalOverflowing && !isRTL() || !this._isBodyOverflowing && isModalOverflowing && isRTL()) {
	      this._element.style.paddingRight = `${this._scrollbarWidth}px`;
	    }
	  }
	  _resetAdjustments() {
	    this._element.style.paddingLeft = '';
	    this._element.style.paddingRight = '';
	  }
	  _checkScrollbar() {
	    const rect = document.body.getBoundingClientRect();
	    this._isBodyOverflowing = Math.round(rect.left + rect.right) < window.innerWidth;
	    this._scrollbarWidth = this._getScrollbarWidth();
	  }
	  _setScrollbar() {
	    if (this._isBodyOverflowing) {
	      this._setElementAttributes(SELECTOR_FIXED_CONTENT$1, 'paddingRight', calculatedValue => calculatedValue + this._scrollbarWidth);
	      this._setElementAttributes(SELECTOR_STICKY_CONTENT$1, 'marginRight', calculatedValue => calculatedValue - this._scrollbarWidth);
	      this._setElementAttributes('body', 'paddingRight', calculatedValue => calculatedValue + this._scrollbarWidth);
	    }
	    document.body.classList.add(CLASS_NAME_OPEN);
	  }
	  _setElementAttributes(selector, styleProp, callback) {
	    SelectorEngine.find(selector).forEach(element => {
	      if (element !== document.body && window.innerWidth > element.clientWidth + this._scrollbarWidth) {
	        return;
	      }
	      const actualValue = element.style[styleProp];
	      const calculatedValue = window.getComputedStyle(element)[styleProp];
	      Manipulator.setDataAttribute(element, styleProp, actualValue);
	      element.style[styleProp] = callback(Number.parseFloat(calculatedValue)) + 'px';
	    });
	  }
	  _resetScrollbar() {
	    this._resetElementAttributes(SELECTOR_FIXED_CONTENT$1, 'paddingRight');
	    this._resetElementAttributes(SELECTOR_STICKY_CONTENT$1, 'marginRight');
	    this._resetElementAttributes('body', 'paddingRight');
	  }
	  _resetElementAttributes(selector, styleProp) {
	    SelectorEngine.find(selector).forEach(element => {
	      const value = Manipulator.getDataAttribute(element, styleProp);
	      if (typeof value === 'undefined' && element === document.body) {
	        element.style[styleProp] = '';
	      } else {
	        Manipulator.removeDataAttribute(element, styleProp);
	        element.style[styleProp] = value;
	      }
	    });
	  }
	  _getScrollbarWidth() {
	    const scrollDiv = document.createElement('div');
	    scrollDiv.className = CLASS_NAME_SCROLLBAR_MEASURER;
	    document.body.appendChild(scrollDiv);
	    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
	    document.body.removeChild(scrollDiv);
	    return scrollbarWidth;
	  }
	  static jQueryInterface(config, relatedTarget) {
	    return this.each(function () {
	      let data = Data.get(this, DATA_KEY$6);
	      const _config = { ...Default$5,
	        ...Manipulator.getDataAttributes(this),
	        ...(typeof config === 'object' && config ? config : {})
	      };
	      if (!data) {
	        data = new Modal(this, _config);
	      }
	      if (typeof config === 'string') {
	        if (typeof data[config] === 'undefined') {
	          throw new TypeError(`No method named "${config}"`);
	        }
	        data[config](relatedTarget);
	      }
	    });
	  }
	}
	EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
	  const target = getElementFromSelector(this);
	  if (this.tagName === 'A' || this.tagName === 'AREA') {
	    event.preventDefault();
	  }
	  EventHandler.one(target, EVENT_SHOW$3, showEvent => {
	    if (showEvent.defaultPrevented) {
	      return;
	    }
	    EventHandler.one(target, EVENT_HIDDEN$3, () => {
	      if (isVisible(this)) {
	        this.focus();
	      }
	    });
	  });
	  let data = Data.get(target, DATA_KEY$6);
	  if (!data) {
	    const config = { ...Manipulator.getDataAttributes(target),
	      ...Manipulator.getDataAttributes(this)
	    };
	    data = new Modal(target, config);
	  }
	  data.toggle(this);
	});
	defineJQueryPlugin(NAME$6, Modal);

	var dropdownTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
	dropdownTriggerList.map(function (dropdownTriggerEl) {
	  return new Dropdown(dropdownTriggerEl);
	})
	var selectors = '.dropdown, .dropup, .dropend, .dropstart',
	    dropdowns = document.querySelectorAll(selectors);
	var currentTarget = undefined;
	dropdowns.forEach(function (dropdown) {
	  dropdown.addEventListener('mousedown', function (e) {
	    e.stopPropagation();
	    if (e.target.dataset.bsToggle && e.target.dataset.bsToggle === 'dropdown') {
	      currentTarget = e.currentTarget;
	    }
	  })
	  dropdown.addEventListener('hide.bs.dropdown', function (e) {
	    e.stopPropagation();
	    var parent = currentTarget ? currentTarget.parentElement.closest(selectors) : undefined;
	    if (parent && parent === dropdown) {
	      e.preventDefault();
	    }
	    currentTarget = undefined;
	  })
	})

})))
