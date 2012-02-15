var _ = require('underscore');

var f_ = function(prop) {
    return function(obj) {
        return obj[prop];
    };
};

f_.I =
f_.i = _.identity;

f_.functionize = function(f_val) {
    if(_.isFunction(f_val)) {
        return f_val;
    } else {
        return function() { return f_val; }
    }
};

// TODO: variable args
f_.curry = function(fn) {
    var args = [].slice.apply(arguments);
    args.shift();
    return function() {
        return fn.apply(this, args.concat([].slice.apply(arguments)));
    };
};

// TODO: variable args
f_.curryR = function(fn, curried) {
    return function(called) {
        return fn(called, curried);
    };
};

f_._ =
f_.thru =
f_.thread = function() {
    var args = arguments;
    return function(val) {
        for(var i = 0; i < args.length; i++) {
            val = args[i](val);
        }
        return val;
    };
};

f_.zipObj = function(keys, props) {
    var pairs = _.zip(keys, props),
        rv = {};
    _.each(pairs, function(pair) {
        rv[pair[0]] = pair[1];
    });
    return rv;
};

f_.select =
f_.project = function(props) {
    return function(obj) {
        return f_.zipObj(props, _.map(props, f_.getR(obj)));
    };
};

f_.get = function(prop) {
    return function(obj) {
        return obj[prop];
    };
};

f_.getO = function(obj) {
    return function(prop) {
        return obj[prop];
    };
};

f_.set = function(prop, f_val) {
    var fn = f_.functionize(f_val);
    return function(obj) {
        obj[prop] = fn(obj);
        return obj;
    };
};

f_.setO = function(obj, f_val) {
    var fn = f_.functionize(f_val);
    return function(prop) {
        obj[prop] = fn(obj);
        return obj;
    };
};

// Weird - breaks model
// f_.getSet = function(prop, f_val) {
//    var fn = f_.functionize(f_val),
//        get = fn(f_.get(prop));
//    return function(obj) {
//        obj[prop] = get(obj);
//        return obj;
//    };
//};

f_.unaryExpr = function(expr, f_val) {
    var fn = f_.functionize(f_val);
    return function(obj) {
        return expr(fn(obj));
    };
};

f_.not = f_.curry(f_.unaryExpr, function(val) { return !val; });

f_.incr = f_.curry(f_.unaryExpr, function(val) { return val + 1; });

f_.incrBy = function(l_val) {
    var fn_l = f_.functionize(l_val);
    return f_.curry(f_.add, fn_l);
};

f_.moduloBy = function(l_val) {
    var fn_l = f_.function(l_val);
    return f_.curry(f.modulo, fn_l);
};

f_.decr = f_.curry(f_.unaryExpr, function(val) { return val - 1; });

f_.square = f_.curry(f_.unaryExpr, function(val) { return val * val; });

f_.binaryExpr = function(expr, f_val_l, f_val_r) {
    if(f_val_r === undefined) {
        f_val_r = f_val_l;
        f_val_l = f_.i;
    }
    var fn_l = f_.functionize(f_val_l),
        fn_r = f_.functionize(f_val_r);
    return function(obj) {
        return expr(fn_l(obj), fn_r(obj));
    };
};

f_.eq = f_.curry(f_.binaryExpr, function(l, r) { return _.isEqual(l, r); });

f_.neq = f_.curry(f_.binaryExpr, function(l, r) { return !_.isEqual(l, r); });

f_.gt = f_.curry(f_.binaryExpr, function(l, r) { return l > r; });

f_.gte = f_.curry(f_.binaryExpr, function(l, r) { return l >= r; });

f_.lt = f_.curry(f_.binaryExpr, function(l, r) { return l < r; });

f_.lte = f_.curry(f_.binaryExpr, function(l, r) { return l <= r; });

f_.append =
f_.add = f_.curry(f_.binaryExpr, function(l, r) { return l + r; });

f_.sub =
f_.subtract = f_.curry(f_.binaryExpr, function(l, r) { return l - r; });

f_.mul =
f_.multiply = f_.curry(f_.binaryExpr, function(l, r) { return l * r; });

f_.div =
f_.divide = f_.curry(f_.binaryExpr, function(l, r) { return l / r; });

f_.mod =
f_.modulo = f_.curry(f_.binaryExpr, function(l, r) { return l % r; });

f_.and = f_.curry(f_.binaryExpr, function(l, r) { return l && r; });

f_.or = f_.curry(f_.binaryExpr, function(l, r) { return l || r; });

f_.tertiaryExpr = function(expr, f_val_1, f_val_2, f_val_3) {
    var fn_1 = f_val_1,
        fn_2 = f_val_2,
        fn_3 = f_val_3;
    return function(obj) {
        return expr(fn_1(obj), fn_2(obj), fn_3(obj));
    };
};

f_.ifThenElse = f_.curry(f_.tertiaryExpr, function(_1, _2, _3) {
    return _1 ? _2 : _3;
});

f_.reduceExpr = function(expr, f_val) {
    var fn = f_.functionize(f_val);
    return function(memo, obj) {
        return expr(memo, fn(obj));
    };
};
f_.sum = f_.curry(f_.reduceExpr, function(l, r) { return l + r; });

f_.prod =
f_.product = f_.curry(f_.reduceExpr, function(l, r) { return l * r; });
f_.count = f_.curry(f_.reduceExpr, function(l, r) { return l + 1; });

f_.avg = 
f_.average = function(f_val) {
    var count = 0;
    var expr = function(l, r) {
        var numerator   = (l * count) + r,
            denominator = ++count;
        return numerator / denominator;
    };
    return f_.reduceExpr(expr, f_val);
};

f_.min = function(f_val) {
    var min = false;
    var expr = function(l, r) {
        return min = l < r ? l : r;
    };
    return f_.reduceExpr(expr, f_val);
};

f_.max = function(f_val) {
    var max = false;
    var expr = function(l, r) {
        return max = l > r ? l : r;
    };
    return f_.reduceExpr(expr, f_val);
};

var test = [ { a:4, b:2, c:3 }, { a: 1, b: 1, c: 2 }, { a: 2, b: 2, c: 2 } ];
out = _.map(test, f_.project(['b','c']));
out = _.map(test, f_.get('b'));
out = _.reduce(test, function(memo, obj) { return memo + obj['a']; }, 0);
out = _.reduce(test, f_.average(f_.add(f_('a'),f_('b'))), 0);
out = _.reduce(test, f_.min(f_('a')));
out = _.reduce(test, f_.max(f_('a')), 0);
// out = _.map(test, f_._(
//                     f_.getSet('a', f_.incrBy(5)),
//                     f_.getSet('b', f_.curry(f_.add, 4))
//                   )
//            );
// out = _.map(test, f_.getSet('a', f_.incr));
// out = _.map(test, f_.getSet('a', f_.incr));

var evens = _.map([1, 2, 3, 4, 5, 6], f_.add('2'));
var evens = _.map([1, 2, 3, 4, 5, 6], function(num) { return num + 2; });

var divBy2 = f_.eq(0,f_.mod('2'));
var divBy3 = f_.eq(0,f_.mod('3'));
var evens = _.filter([1, 2, 3, 4, 5, 6], f_.or(divBy2, divBy3));
var evens = _.filter([1, 2, 3, 4, 5, 6], f_.or(f_.eq(0, f_.mod('2')), f_.eq(0, f_.mod('3'))));
var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 === 0 || num % 3 === 0; });

var squareOdds = _.map([1, 2, 3, 4, 5, 6], f_.ifThenElse(f_.mod('2'), f_.mul(f_.i), f_.i));

console.log(squareOdds);
