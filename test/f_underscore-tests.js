$(document).ready(function() {

    module("f_");

    test("identity", function() {
        equals(f_.i(1), 1);
    });

    
    var f1 = function(){ return 1; },
        i = function(a) { return a; },
        add = function(a, b) { return a + b; },
        append = function(a, b) { return ""+a +b; },
        incr = function(a) { return a + 1; };

    var o       = { a: 1, b: 2 },
        bools   = { t: true, f: false },
        keys    = [ 'a', 'b' ],
        vals    = [ 1, 2];

    test("f_.concat", function(){
        deepEqual(f_.concat(['foo'])(['bar']), ['bar','foo']);
        deepEqual(f_.concat('foo')('bar'), 'barfoo');
        deepEqual(f_.concat('foo')('bar'), 'barfoo');
        deepEqual(f_.concat('#', f_.get('a'))(o), '#1');
        deepEqual(f_.concat('', f_.get('a'), '#')(o), '1#');
        deepEqual(f_.concat([], f_.get('a'), '#')(o), [1, '#']);
        deepEqual(f_.concat([], f_.i)(o), [o]);
    });

    test("f_.replace", function(){
        deepEqual(_.map(['ab','ba'], f_.replace(/b/,'')), ['a','a']);
        deepEqual(_.map([{a:'ab'},{a:'ba'}], f_.replace(f_.get('a'), /b/,'')), ['a','a']);
        deepEqual(_.map([{a:'ab'},{a:'ba'}], f_.getSet('a', f_.replace(/b/,''))), [{a:'a'},{a:'a'}]);
    });

    test("f_.partial", function() {
        equals(f_.partial(i, 1)(), 1);
        equals(f_.partial(add, 1)(2), 3);
        equals(f_.partial(add, 1, 2)(), 3);
    });
    
    test("f_.thread", function() {
        equals(f_.thread(f1)(), 1);
        equals(f_.thread(f1, i)(), 1);
        equals(f_.thread(add)(1, 1), 2);
        equals(f_.thread(add, incr)(1, 1), 3);
    });

    test("f_.zipObject", function() {
        deepEqual(f_.zipObject(keys, vals), o);
        deepEqual(f_.zipObject([], []), {}); 
    });

    test("f_.functionize values", function() {
        equals(f_.functionize(1)(), 1);
        equals(f_.functionize(1)(2), 1);
        equals(f_.functionize("s")(), "s");
        equals(f_.functionize(true)(), true);
    });

    test("f_.functionize functions", function() {
        equals(f_.functionize(f1)(), 1);
        equals(f_.functionize(i)(1), 1);
    });

    test("f_.get", function() {
        var a = f_.get('a'),
            c = f_.get('c');
        equals(a(o), 1);
        equals(c(o), undefined);
    });

    test("f_.getByProperty", function() {
        var readO = f_.getByProperty(o);
        equals(readO('a'), 1);
        equals(readO('c'), undefined);
    });

    test("f_.set", function() {
        var setA = f_.set('a', 2),
            setC = f_.set('c', 3),
            obj = _.clone(o);
        equals(setA(obj), obj);
        equals(obj.a, 2);

        equals(obj.c, undefined);
        equals(setC(obj), obj);
        equals(obj.c, 3);
    });

    test("f_.setByProperty", function() {
        var obj     = _.clone(o),
            setO    = f_.setByProperty(obj, 2);
        equals(setO("a"), obj);
        equals(obj.a, 2);

        equals(obj.c, undefined);
        equals(setO("c"), obj);
        equals(obj.c, 2);
    });

    test("f_.project", function() {
        deepEqual(f_.project([])(o), {});
        deepEqual(f_.project(['a'])(o), { a: 1 });
        deepEqual(f_.project(['a','b'])(o), { a: 1, b: 2 });
        deepEqual(f_.project(['a','b','c'])(o), { a: 1, b: 2, c: undefined });
    });

    test("f_.split", function(){
        deepEqual(f_.split(",")("a,b"), ["a","b"]);
    });

    
    // Unary Tests

    test("f_.increment", function() {
        equals(f_.increment(1)(), 2);
        equals(f_.increment(f_.get('a'))(o), 2);
    });

    test("f_.decrement", function() {
        equals(f_.decrement(1)(), 0);
        equals(f_.decrement(f_.get('a'))(o), 0);
    });

    test("f_.square", function() {
        equals(f_.square(1)(), 1);
        equals(f_.square(2)(), 4);
        equals(f_.square(f_.get('a'))(o), 1);
        equals(f_.square(f_.get('b'))(o), 4);
    });

    test("f_.not", function() {
        equals(f_.not(true)(), false);
        equals(f_.not(false)(), true);
        equals(f_.not(f_.get('t'))(bools), false);
        equals(f_.not(f_.get('f'))(bools), true);
    });

    test("f_.negate", function() {
        equals(f_.negate(1)(), -1);
        equals(f_.negate(2)(), -2);
        equals(f_.negate(f_.get('a'))(o), -1);
        equals(f_.negate(f_.get('b'))(o), -2);
    });

    // Binary Tests

    // Arithmetic

    test("f_.add", function() {
        equals(f_.add(1, 1)(), 2);
        equals(f_.add(1)(1), 2);
        equals(f_.add(f_.get('a'),f_.get('b'))(o), 3);
    });


    test("f_.subtract", function() {
        equals(f_.subtract(1, 1)(), 0);
        equals(f_.subtract(1)(1), 0);
        equals(f_.subtract(f_.get('a'),f_.get('b'))(o), -1);
    });

    test("f_.multiply", function() {
        equals(f_.multiply(2, 3)(), 6);
        equals(f_.multiply(2)(3), 6);
        equals(f_.multiply(3,f_.get('b'))(o), 6);
    });

    test("f_.divide", function() {
        equals(f_.divide(4, 2)(), 2);
        equals(f_.divide(2)(4), 2);
        equals(f_.divide(4,f_.get('b'))(o), 2);
    });

    test("f_.modulo", function() {
        equals(f_.modulo(3, 2)(), 1);
        equals(f_.modulo(2)(3), 1);
        equals(f_.modulo(3,f_.get('b'))(o), 1);
    });

    // String

    test("f_.append", function() {
        equals(f_.append('a', 'b')(), 'ab');
        equals(f_.append('a')('b'), 'ba');
        equals(f_.append(f_.get('a'),f_.get('b'))(o), '12');
    });

    test("f_.prepend", function() {
        equals(f_.prepend('a', 'b')(), 'ba');
        equals(f_.prepend('a')('b'), 'ab');
        equals(f_.prepend(f_.get('a'),f_.get('b'))(o), '21');
    });

    // Relational

    test("f_.greaterThan", function() {
        equals(f_.greaterThan(1, 2)(),  false);
        equals(f_.greaterThan(2, 1)(),  true);
        equals(f_.greaterThan(2)(1),    false);
        equals(f_.greaterThan(1)(2),    true);
        equals(f_.greaterThan(f_.get("a"),f_.get("b"))(o), false);
        equals(f_.greaterThan(f_.get("b"),f_.get("a"))(o), true);
    });

    test("f_.atLeast", function() {
        equals(f_.atLeast(1, 2)(),  false);
        equals(f_.atLeast(2, 1)(),  true);
        equals(f_.atLeast(1, 1)(),  true);
        equals(f_.atLeast(2)(1),    false);
        equals(f_.atLeast(1)(2),    true);
        equals(f_.atLeast(1)(1),    true);
        equals(f_.atLeast(f_.get("a"),f_.get("b"))(o), false);
        equals(f_.atLeast(f_.get("b"),f_.get("a"))(o), true);
        equals(f_.atLeast(f_.get("a"),f_.get("a"))(o), true);
    });

    test("f_.lessThan", function() {
        equals(f_.lessThan(1, 2)(),  true);
        equals(f_.lessThan(2, 1)(),  false);
        equals(f_.lessThan(2)(1),    true);
        equals(f_.lessThan(1)(2),    false);
        equals(f_.lessThan(f_.get("a"),f_.get("b"))(o), true);
        equals(f_.lessThan(f_.get("b"),f_.get("a"))(o), false);
    });

    test("f_.atMost", function() {
        equals(f_.atMost(1, 2)(),  true);
        equals(f_.atMost(2, 1)(),  false);
        equals(f_.atMost(1, 1)(),  true);
        equals(f_.atMost(2)(1),    true);
        equals(f_.atMost(1)(2),    false);
        equals(f_.atMost(1)(1),    true);
        equals(f_.atMost(f_.get("a"),f_.get("b"))(o), true);
        equals(f_.atMost(f_.get("b"),f_.get("a"))(o), false);
        equals(f_.atMost(f_.get("a"),f_.get("a"))(o), true);
    });

    test("f_.isEqual", function() {
        equals(f_.isEqual(1, 1)(), true);
        equals(f_.isEqual(1, 2)(), false);
        equals(f_.isEqual("foo", "foo")(), true);
        equals(f_.isEqual("foo", "bar")(), false);
        equals(f_.isEqual(o, o)(), true);
        equals(f_.isEqual(o, bools)(), false);
        equals(f_.isEqual(1)(1), true);
        equals(f_.isEqual(1)(2), false);
        equals(f_.isEqual(f_.get('a'), 1)(o), true);
        equals(f_.isEqual(f_.get('a'), 2)(o), false);
    });

    test("f_.isNotEqual", function() {
        equals(f_.isNotEqual(1, 1)(), false);
        equals(f_.isNotEqual(1, 2)(), true);
        equals(f_.isNotEqual("foo", "foo")(), false);
        equals(f_.isNotEqual("foo", "bar")(), true);
        equals(f_.isNotEqual(o, o)(), false);
        equals(f_.isNotEqual(o, bools)(), true);
        equals(f_.isNotEqual(1)(1), false);
        equals(f_.isNotEqual(1)(2), true);
        equals(f_.isNotEqual(f_.get('a'), 1)(o), false);
        equals(f_.isNotEqual(f_.get('a'), 2)(o), true);
    });

    test("f_.and", function() {
        equals(f_.and(false,    false)(),   false);
        equals(f_.and(true,     false)(),   false);
        equals(f_.and(false,    true)(),    false);
        equals(f_.and(true,     true)(),    true);
        equals(f_.and(false)(false),        false);
        equals(f_.and(true)(false),         false);
        equals(f_.and(false)(true),         false);
        equals(f_.and(true)(true),          true);
        equals(f_.and(f_.get('f'), f_.get('f'))(bools), false);
        equals(f_.and(f_.get('t'), f_.get('f'))(bools), false);
        equals(f_.and(f_.get('f'), f_.get('t'))(bools), false);
        equals(f_.and(f_.get('t'), f_.get('t'))(bools), true);
    });

    test("f_.neither", function() {
        equals(f_.neither(false,    false)(),   true);
        equals(f_.neither(true,     false)(),   false);
        equals(f_.neither(false,    true)(),    false);
        equals(f_.neither(true,     true)(),    false);
        equals(f_.neither(false)(false),        true);
        equals(f_.neither(true)(false),         false);
        equals(f_.neither(false)(true),         false);
        equals(f_.neither(true)(true),          false);
        equals(f_.neither(f_.get('f'), f_.get('f'))(bools), true);
        equals(f_.neither(f_.get('t'), f_.get('f'))(bools), false);
        equals(f_.neither(f_.get('f'), f_.get('t'))(bools), false);
        equals(f_.neither(f_.get('t'), f_.get('t'))(bools), false);
    });

    test("f_.or", function() {
        equals(f_.or(false,    false)(),   false);
        equals(f_.or(true,     false)(),   true);
        equals(f_.or(false,    true)(),    true);
        equals(f_.or(true,     true)(),    true);
        equals(f_.or(false)(false),        false);
        equals(f_.or(true)(false),         true);
        equals(f_.or(false)(true),         true);
        equals(f_.or(true)(true),          true);
        equals(f_.or(f_.get('f'), f_.get('f'))(bools), false);
        equals(f_.or(f_.get('t'), f_.get('f'))(bools), true);
        equals(f_.or(f_.get('f'), f_.get('t'))(bools), true);
        equals(f_.or(f_.get('t'), f_.get('t'))(bools), true);
    });

    test("f_.xor", function() {
        equals(f_.xor(false,    false)(),   false);
        equals(f_.xor(true,     false)(),   true);
        equals(f_.xor(false,    true)(),    true);
        equals(f_.xor(true,     true)(),    false);
        equals(f_.xor(false)(false),        false);
        equals(f_.xor(true)(false),         true);
        equals(f_.xor(false)(true),         true);
        equals(f_.xor(true)(true),          false);
        equals(f_.xor(f_.get('f'), f_.get('f'))(bools), false);
        equals(f_.xor(f_.get('t'), f_.get('f'))(bools), true);
        equals(f_.xor(f_.get('f'), f_.get('t'))(bools), true);
        equals(f_.xor(f_.get('t'), f_.get('t'))(bools), false);
    });

    test("f_.average", function() {
        var avg = f_.average(f_.getByProperty(o));
        equals(avg(0, 'a'),     0.5);
        equals(avg(1, 'b'),     4/3);
        equals(avg(1.5, 'b'),   1.625);
        equals(_.reduce([2], f_.average()), 2);
        equals(_.reduce([2, 2], f_.average()), 2);
        equals(_.reduce([5,7,1,3,9,2], f_.average()), 4.5);
    });

    test("f_.count", function() {
        var count = f_.count(f_.getByProperty(o));
        equals(_.reduce([2,3,1,4], f_.count(), 0), 4);
    });

    test("f_.min", function() {
        var nums = { a: 5, b: 6, c:3 },
            min = f_.min(f_.getByProperty(nums));
        equals(min(10,  'a'),   5);
        equals(min(5,   'b'),   5);
        equals(min(5,   'c'),   3);
        equals(_.reduce([5,7,1,3,9,2], f_.min()), 1);
    });

    test("f_.max", function() {
        var nums = { a:3, b:2, c:6 },
            max = f_.max(f_.getByProperty(nums));
        equals(max(0, 'a'), 3);
        equals(max(3, 'b'), 3);
        equals(max(3, 'c'), 6);
        equals(_.reduce([5,7,1,3,9,2], f_.max()), 9);
    });

});
