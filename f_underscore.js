//      f_underscore.js 0.0.1
//      (c) 2012 Kris Jordan
//      `f_underscore` is freely distributable under the MIT license.
//      For all details and documentation:
//      http://krisjordan.com/f_underscore

(function() {

    // Baseline
    // --------

    // All of `f_`'s functions are plain old functions bundled in an object.
    var f_  = function(get) { return wrapper(get); };

    // var wrapper = function() { this._stack = []; };
    // f_.prototype = wrapper.prototype;

    // // Helper function to continue chaining intermediate results.
    // var result = function(obj, chain) {
    //   return chain ? _(obj).chain() : obj;
    // };

    // // A method to easily add functions to the OOP wrapper.
    // var addToWrapper = function(name, func) {
    //   wrapper.prototype[name] = function() {
    //     var args = slice.call(arguments);
    //     unshift.call(args, this._wrapped);
    //     return result(func.apply(_, args), this._chain);
    //   };
    // };

    // f_.mixin = function(obj) {
    //   _.each(_.functions(obj), function(name){
    //     addToWrapper(name, f_[name] = obj[name]);
    //   });
    // };

    // end chain, fluent api support

    // Export `f_` to the window/global namespace.
    // Establish the root object, `window` in the browser, or `global` on 
    // the server. The following snippet courtesy of underscore.js.
    var root = this;

    if (typeof exports !== 'undefined') {
        var _ = require('underscore');
        exports.f_ = f_;
    } else {
        this['f_'] = f_;
        var _ = this['_'];
    }

    // Current version.
    f_.VERSION = '0.0.1';

    // Shorthand for the identity function.
    f_.I =
    f_.i = _.identity;

    // More aliases.
    var ArrayProto  = Array.prototype,
        ObjProto    = Object.prototype,
        StringProto = String.prototype,
        FuncProto   = Function.prototype;

    // Given two arrays of same length, one with strings/keys, the other with values, 
    // return an object comprised of the keys and values.
    f_.zipObject = function(keys, props) {
        var pairs = _.zip(keys,props),
            result = {};
        _.each(pairs, function(pair) {
            result[pair[0]] = pair[1];
        });
        return result;
    };

    // Given two arrays return an array of all permutations of one item selected
    // from each array.
    // TODO: test, add multiple arg support
    f_.permute = function(l, r) {
	    if(l.length === 0 && r.length > 0) {
	        var temp = r;
            r = l;
            l = temp;
        }
        var result = [];
        for(var i = 0; i < l.length; i++) {
            if(r.length > 0) {
                for(var j = 0; j < r.length; j++) {
                    result.push([l[i], r[j]]);
                }
            } else {
                result.push([l[i]]);
            }
        }
        return result;
    };

    // Given a function `f`, fill in arguments `Af` without calling `f`. Returns a new
    // function `p`. When `p` is called with argumens `Ap`, function `f` is called with
    // a concatenation of `Af` and `Ap` for arguments.
    //
    //     partial(F, Af...) generates P
    //     P(Ap...) calls F(Af..., Ap...)
    //
    f_.partial = function(fn) {
        var args = _.rest(arguments, 1);
        return function() {
            return fn.apply(this, args.concat([].slice.apply(arguments)));
        };
    };

    // Given a list of functions, return a new function that, when invoked, will
    // call each function in the list in succession passing the return value of each
    // as an argument to the next. The reverse call order of `_.compose`.
    f_.thread = function() {
        var args = arguments;
        return function() {
            var val = [].slice.apply(arguments);
            for(var i = 0; i < args.length; i++) {
                val = [args[i].apply(this, val)];
            }
            return val[0];
        };
    };

    // TODO: Document, test, and decide whether to keep.
    f_.apply = function(fn) {
        return function(obj) {
            return fn.apply(obj, arguments);
        };
    };

    f_.applyFunction = function(obj) {
        return function(fn) {
            return fn.apply(obj, arguments);
        };
    };

    f_.call = function(fn) {
        return function(obj) {
            return fn(obj);
        };
    };

    f_.callFunction = function(obj) {
        return function(fn) {
            return fn(obj);
        };
    };

    // Iterator Function Generators
    // -------------------

    // Turn a non-function value into a function that returns that value.
    f_.functionize = function(f_v) {
        return _.isFunction(f_v) ? f_v : function(){ return f_v; };
    };

    // ### Accessors

    // Make a function that will return the specified property when invoked
    // with an object.
    f_.get = function(prop) {
        return function(obj) {
            return obj[prop];
        };
    };

    // Get a property, use it to call the iterator
    f_.getSet = function(prop, iterator) {
        return function(obj) {
            obj[prop] = iterator(obj[prop]);
            return obj;
        };
    };

    // Make a function that will return the value of the specified object's
    // property when invoked with a property.
    f_.getByProperty = function(obj) {
        return function(prop) {
            return obj[prop];
        };
    };

    // Make a function that will set the specified property to be the evaluation
    // of `f_v` (iterator function or value) when invoked with an object.
    f_.set = function(prop, f_v) {
        var iterator = f_.functionize(f_v);
        return function(obj) {
            obj[prop] = iterator(obj);
            return obj;
        };
    };

    // Make a function that can be called with property names. It will set
    // the property of the specified object to the evaluation of `f_v`.
    f_.setByProperty = function(obj, f_v) {
        var iterator = f_.functionize(f_v);
        return function(prop) {
            obj[prop] = iterator(obj, prop);
            return obj;
        };
    };

    // Make a function that when called with an object will return a
    // new object with only the specified `properties`.
    f_.project = function(properties) {
        return function(obj) {
            return f_.zipObject(properties, 
                                _.map(properties, f_.getByProperty(obj)));
        };
    };

    // Make a function that will call `fn` bound to the object the iterator
    // is invoked with.
    f_.bindFunction = function(fn) {
        var args = _.map(_.rest(arguments), f_.functionize);
        return function(item) {
            return fn.apply(item, _.map(args, f_.callFunction(item)));
        };
    };

    // Binary Method 
    f_.bindMethod = function(method) {
        var args = _.map(_.rest(arguments), f_.functionize);
        return function(obj) {
            var argVals = _.map(args, f_.callFunction(obj));
            // Support calling method in a binary expression sense
            if(!obj[method]) {
                obj     = _.first(argVals);
                argVals = _.rest(argVals);
            }
            return obj[method].apply(obj, argVals);
        };
    };

    // ### Methods Iterators
    var methods = [ 
                        // Array
                        'pop',
                        'push',
                        'reverse',
                        'shift',
                        'sort',
                        'splice',
                        'unshift',
                        'join',

                        // String
                        'charAt',
                        'charCodeAt',
                        'match',
                        'replace',
                        'search',
                        'split',
                        'substr',
                        'substring',
                        'toLowerCase',
                        'toUpperCase',

                        // Common
                        'concat',
                        'indexOf',
                        'lastIndexOf',
                        'slice'
                    ];
    _.extend(f_, f_.zipObject(
                    methods,
                    _.map(methods, function(fn) { 
                        return f_.partial(f_.bindMethod, fn); 
                    })
                 )
            );

    // ### Expressions

    // Unary Expression Template
    f_.unaryExpr = function(expr, f_v) {
        if(f_v === undefined) {
            f_v = f_.i;
        }
        if(_.isFunction(f_v)) {
            return function(obj) {
                return expr(f_v(obj));
            };
        } else {
            return function(obj) {
                return expr(f_v);
            };
        };
    };

    // Binary Expression Template 
    f_.binaryExpr = function(expr, f_v_l, f_v_r) {
        // Support single arg variants where we're partially applying
        // the right hand value and using identity as left hand value.
        // Useful for operations on lists of values rather than objects.
        // i.e. _.map([1,2], f_.add(1)) -> [2,3];
        if(f_v_r === undefined) {
            f_v_r = f_v_l;
            f_v_l = f_.i;
        }

        if(_.isFunction(f_v_l)) {
            if(_.isFunction(f_v_r)) {
                return function(obj) {
                    return expr(f_v_l(obj), f_v_r(obj));
                };
            } else {
                return function(obj) {
                    return expr(f_v_l(obj), f_v_r);
                };
            }
        } else {
            if(_.isFunction(f_v_r)) {
                return function(obj) {
                    return expr(f_v_l, f_v_r(obj));
                };
            } else {
                return function() {
                    return expr(f_v_l, f_v_r);
                };
            }
        }
    };

    // ### Primitives
    var 

    // Arithmetic Primitives
    add         = function(l, r)        { return l + r; },
    subtract    = function(l, r)        { return l - r; },
    multiply    = function(l, r)        { return l * r; },
    divide      = function(l, r)        { return l / r; },
    modulo      = function(l, r)        { return l % r; },

    increment   = function(l)           { return l + 1; },
    decrement   = function(l)           { return l - 1; },
    square      = function(l)           { return l * l; },
    negate      = function(l)           { return l * -1; },

    //  String
    append      = function(l, r)        { return (''+l).concat(r); }
    prepend     = function(l, r)        { return (''+r).concat(l); }

    // Relational
    greaterThan = function(l, r)        { return l >  r; },
    atLeast     = function(l, r)        { return l >= r; },
    lessThan    = function(l, r)        { return l <  r; },
    atMost      = function(l, r)        { return l <= r; },

    greaterOf   = function(l, r)        { return l > r ? l : r; },
    lesserOf    = function(l, r)        { return l < r ? l : r; },

    //  Equality
    equality    = _.isEqual,
    inequality  = function()            { return !equality.apply(this,arguments); },

    //  Logical
    and         = function(l, r)        { return l && r; },
    neither     = function(l, r)        { return !l && !r; },
    or          = function(l, r)        { return l || r; },
    xor         = function(l, r)        { return (l && !r) || (!l && r); },
    not         = function(l)           { return !l; }

    ;

    // ### Expression Iterators

    // Unary
    f_.incr         = f_.increment      = f_.partial(f_.unaryExpr, increment);
    f_.decr         = f_.decrement      = f_.partial(f_.unaryExpr, decrement);
    f_.sqr          = f_.square         = f_.partial(f_.unaryExpr, square);
    f_.not                              = f_.partial(f_.unaryExpr, not);
    f_.neg          = f_.negate         = f_.partial(f_.unaryExpr, negate);

    // Binary
    f_.add                              = f_.partial(f_.binaryExpr, add);
    f_.sub          = f_.subtract       = f_.partial(f_.binaryExpr, subtract);
    f_.mul          = f_.multiply       = f_.partial(f_.binaryExpr, multiply);
    f_.div          = f_.divide         = f_.partial(f_.binaryExpr, divide);
    f_.mod          = f_.modulo         = f_.partial(f_.binaryExpr, modulo);

    // String
    f_.append                           = f_.partial(f_.binaryExpr, append);
    f_.prepend                          = f_.partial(f_.binaryExpr, prepend);

    // Relational
    f_.eq           = f_.isEqual        = f_.partial(f_.binaryExpr, equality);
    f_.neq          = f_.isNotEqual     = f_.partial(f_.binaryExpr, inequality);

    f_.gt           = f_.greaterThan    = f_.partial(f_.binaryExpr, greaterThan);
    f_.gte          = f_.atLeast        = f_.partial(f_.binaryExpr, atLeast);
    f_.lt           = f_.lessThan       = f_.partial(f_.binaryExpr, lessThan);
    f_.lte          = f_.atMost         = f_.partial(f_.binaryExpr, atMost);
        
    f_.greaterOf                        = f_.partial(f_.binaryExpr, greaterOf);
    f_.lesserOf                         = f_.partial(f_.binaryExpr, lesserOf);

    // Logical
    f_.and                              = f_.partial(f_.binaryExpr, and);
    f_.neither                          = f_.partial(f_.binaryExpr, neither);
    f_.or                               = f_.partial(f_.binaryExpr, or);
    f_.xor                              = f_.partial(f_.binaryExpr, xor);

    // ### Reducer Iterators

    f_.reduceExpr = function(expr, f_v) {
        var fn;
        if(f_v === undefined) {
            fn = f_.i;
        } else {
            fn = f_.functionize(f_v);
        }
        return function(memo, obj) {
            return expr(memo, fn(obj));
        };
    };

    f_.sum      = f_.partial(f_.reduceExpr, add);
    f_.product  = f_.partial(f_.reduceExpr, multiply);
    f_.count    = f_.partial(f_.reduceExpr, increment);
    f_.min      = f_.partial(f_.reduceExpr, lesserOf);
    f_.max      = f_.partial(f_.reduceExpr, greaterOf);

    f_.average = function(f_v) {
        var count = 1;
        var expr = function(l, r) {
            var numerator   = (l * count) + r,
                denominator = ++count;
            return numerator / denominator;
        };
        return f_.reduceExpr(expr, f_v);
    };

    // Need to clean up names and process here.

    var oneTimeStorage = {};
    _.each(_.functions(f_), function(key) {
        oneTimeStorage[key] = function() {
            this.stack.push(f_[key].apply(this, arguments));
            return this;
        };
    });

    var wrapper = function(get) {
        var stack = [];
        if(get !== undefined) {
            stack.push(f_.get(get));
        }
        var chained = function() {
            return f_.thread.apply(null, this.stack).apply(this, arguments);
        };
        chained.stack = stack;
        _.extend(chained, oneTimeStorage);
        return chained; 
    };

    // can we create a closure once that has all of the functions setup,
    // then somehow reuse it.


}).call(this);
