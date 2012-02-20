// f_underscore.js 0.0.1
// (c) 2012 Kris Jordan
// f_underscore is freely distributable under the MIT license.
// For all details and documentation:
// http://krisjordan.com/f_underscore

(function() {

    // Baseline
    // --------

    // All of `f_`'s functions are plain old functions bundled in an object.
    var f_  = {};

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

    // Function Functions
    // ---------------------------------

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
    // as an argument to the next.
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

    // When called with a value, return the value.
    f_.I =
    f_.i = _.identity;

    // Turn a non-function value into a function that returns that value.
    f_.functionize = function(f_v) {
        return _.isFunction(f_v) ? f_v : function(){ return f_v; };
    };

    // Iterator Generators
    // -------------------

    // ### Accessor Iterators

    // Make a function that will return the specified property when invoked
    // with an object.
    f_.get = function(prop) {
        return function(obj) {
            return obj[prop];
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

    // ### Expression Iterators

    // Primitive Functions
    // -------------------
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
        append      = function(l, r)        { return "" + l + r; }

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
        not         = function(l)           { return !l; },

    //  Ternary
        ternary     = function(i, t, e)     { return i ? t : e; }
        ;

    // ## Unary Expressions

    f_.unaryExpr = function(expr, f_v) {
        var fn = f_.functionize(f_v);
        return function(obj) {
            return expr(fn(obj));
        };
    };

    f_.incr         = f_.increment    = f_.partial(f_.unaryExpr, increment);
    f_.decr         = f_.decrement    = f_.partial(f_.unaryExpr, decrement);
    f_.sqr          = f_.square       = f_.partial(f_.unaryExpr, square);
    f_.not                            = f_.partial(f_.unaryExpr, not);
    f_.neg          = f_.negate       = f_.partial(f_.unaryExpr, negate);

    // ## Binary Expressions
    // [ fn, .. aliases .. ]

    f_.binaryExpr = function(expr, f_v_l, f_v_r) {
        // Support single arg variants where we're partially applying
        // the right hand value and using identity as left hand value.
        // Useful for operations on lists of values rather than objects.
        // i.e. _.map([1,2], f_.add(1)) -> [2,3];
        if(f_v_r === undefined) {
            f_v_r = f_v_l;
            f_v_l = f_.i;
        }
        var fn_l = f_.functionize(f_v_l),
            fn_r = f_.functionize(f_v_r);
        return function(obj) {
            return expr(fn_l(obj), fn_r(obj));
        };
    };

    f_.add          = f_.partial(f_.binaryExpr, add);
    f_.sub          = f_.subtract       = f_.partial(f_.binaryExpr, subtract);
    f_.mul          = f_.multiply       = f_.partial(f_.binaryExpr, multiply);
    f_.div          = f_.divide         = f_.partial(f_.binaryExpr, divide);
    f_.mod          = f_.modulo         = f_.partial(f_.binaryExpr, modulo);

    f_.concat       = f_.append         = f_.partial(f_.binaryExpr, append);

    f_.gt           = f_.greaterThan    = f_.partial(f_.binaryExpr, greaterThan);
    f_.gte          = f_.atLeast        = f_.partial(f_.binaryExpr, atLeast);
    f_.lt           = f_.lessThan       = f_.partial(f_.binaryExpr, lessThan);
    f_.lte          = f_.atMost         = f_.partial(f_.binaryExpr, atMost);
        
    f_.greaterOf                        = f_.partial(f_.binaryExpr, greaterOf);
    f_.lesserOf                         = f_.partial(f_.binaryExpr, lesserOf);

    f_.eq           = f_.equality       = f_.partial(f_.binaryExpr, equality);
    f_.neq          = f_.inequality     = f_.partial(f_.binaryExpr, inequality);

    f_.and                              = f_.partial(f_.binaryExpr, and);
    f_.neither                          = f_.partial(f_.binaryExpr, neither);
    f_.or                               = f_.partial(f_.binaryExpr, or);
    f_.xor                              = f_.partial(f_.binaryExpr, xor);


    // ## Ternary Expressions

    f_.ternaryExpr = function(expr, f_v_1, f_v_2, f_v_3) {
        var fn_1 = f_.functionize(f_v_1),
            fn_2 = f_.functionize(f_v_2),
            fn_3 = f_.functionize(f_v_3);
        return function(obj) {
            return expr(fn_1(obj), fn_2(obj), fn_3(obj));
        };
    };

    f_.ternary = f_.partial(f_.ternaryExpr, ternary);

    // ## Reducers

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

    f_.avg = 
    f_.average = function(f_v) {
        var count = 0;
        var expr = function(l, r) {
            var numerator   = (l * count) + r,
                denominator = ++count;
            return numerator / denominator;
        };
        return f_.reduceExpr(expr, f_v);
    };

}).call(this);
