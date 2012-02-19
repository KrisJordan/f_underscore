// if(this['require'] !== undefined) {
// var _ = require('underscore');
// }

var f_  = {};

window.f_ = f_;

// ## Utility Functions

// When called with a value, return the value.
f_.I =
f_.i = _.identity;

var _wire = function(target, exprs, partialFn) {
    _.each(exprs, function(exprAliasesList, name) {
        var exprFn  = _.first(exprAliasesList),
            aliases = _.rest(exprAliasesList);
        target[name] = f_.partial(partialFn, exprFn);
        _.each(aliases, f_.setByProperty(target, function() { return target[name]; }));
    });
};

f_.partial = function(fn) {
    var args = _.rest(arguments, 1);
    return function() {
        return fn.apply(this, args.concat([].slice.apply(arguments)));
    };
};

f_.partialRight =
f_.partialR = function(fn) {
    var args = _.rest(arguments, 1);
    return function(called) {
        return fn.apply(this, [].slice.apply(arguments).concat(args));
    };
};

f_.thru =
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

f_.zipObject = function(keys, props) {
    var pairs = _.zip(keys, props),
        rv = {};
    _.each(pairs, function(pair) {
        rv[pair[0]] = pair[1];
    });
    return rv;
};

_.mixin({
    partial:        f_.partial,
    partialRight:   f_.partialRight,
    partialR:       f_.partialRight,
    thru:           f_.thru,
    thread:         f_.thread,
    zipObject:      f_.zipObject
});

// When called with a function, return the function.
// When `functionize` is called with a value, return a new function
// which, when called, will return the value.
f_.functionize = function(f_v) {
    return _.isFunction(f_v) ? f_v : function(){ return f_v; };
};

f_.get = function(prop) {
    return function(obj) {
        return obj[prop];
    };
};

f_.getByProperty = function(obj) {
    return function(prop) {
        return obj[prop];
    };
};

f_.set = function(prop, f_v) {
    var fn = f_.functionize(f_v);
    return function(obj) {
        obj[prop] = fn(obj);
        return obj;
    };
};

f_.setByProperty = function(obj, f_v) {
    var fn = f_.functionize(f_v);
    return function(prop) {
        obj[prop] = fn(obj);
        return obj;
    };
};

f_.project = function(props) {
    return function(obj) {
        return _.zipObject(props, _.map(props, f_.getByProperty(obj)));
    };
};

// ## Primitive Functions
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

var unaryExprs = {
    increment:  [increment, 'incr'],
    decrement:  [decrement, 'decr'],
    square:     [square,    'sqr'],
    not:        [not],
    negate:     [negate,    'neg']
};

f_.unaryExpr = function(expr, f_v) {
    var fn = f_.functionize(f_v);
    return function(obj) {
        return expr(fn(obj));
    };
};

_wire(f_, unaryExprs, f_.unaryExpr);

// ## Binary Expressions
// [ fn, .. aliases .. ]
var binaryExprs = {
    add:            [add,           'sum'],
    subtract:       [subtract,      'sub'],
    multiply:       [multiply,      'mul', 'prod'],
    divide:         [divide,        'div'],
    modulo:         [modulo,        'mod'],

    append:         [append,        'concat'],

    greaterThan:    [greaterThan,   'gt'],
    atLeast:        [atLeast,       'gte'],
    lessThan:       [lessThan,      'lt'],
    atMost:         [atMost,        'lte'],
    
    greaterOf:      [greaterOf],
    lesserOf:       [lesserOf],

    equality:       [equality,      'eq'],
    inequality:     [inequality,    'neq'],

    and:            [and],
    neither:        [neither],
    or:             [or],
    xor:            [xor]
};

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

_wire(f_, binaryExprs, f_.binaryExpr);

// ## Ternary Expressions

f_.ternaryExpr = function(expr, f_v_1, f_v_2, f_v_3) {
    var fn_1 = f_.functionize(f_v_1),
        fn_2 = f_.functionize(f_v_2),
        fn_3 = f_.functionize(f_v_3);
    return function(obj) {
        return expr(fn_1(obj), fn_2(obj), fn_3(obj));
    };
};

var ternaryExprs = {
    ternary:    [ternary, 'ifThenElse']
};

_wire(f_, ternaryExprs, f_.ternaryExpr);

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

var reducers = {
    sum:        [add],
    product:    [multiply],
    count:      [increment],
    min:        [lesserOf],
    max:        [greaterOf]
};
_wire(f_, reducers, f_.reduceExpr);

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
