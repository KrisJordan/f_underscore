// f_underscore.js 0.0.1
// (c) 2012 Kris Jordan
// `f_underscore` is freely distributable under the MIT license.
// For all details and documentation:
// http://krisjordan.com/f_underscore
(function(){var a={};if(typeof exports!=="undefined"){var e=require("underscore");exports.f_=a}else this.f_=a,e=this._;a.VERSION="0.0.1";a.I=a.i=e.identity;a.zipObject=function(a,b){var c=e.zip(a,b),g={};e.each(c,function(a){g[a[0]]=a[1]});return g};a.partial=function(a){var b=e.rest(arguments,1);return function(){return a.apply(this,b.concat([].slice.apply(arguments)))}};a.thread=function(){var a=arguments;return function(){for(var b=[].slice.apply(arguments),c=0;c<a.length;c++)b=[a[c].apply(this,
b)];return b[0]}};a.functionize=function(a){return e.isFunction(a)?a:function(){return a}};a.get=function(a){return function(b){return b[a]}};a.getByProperty=function(a){return function(b){return a[b]}};a.set=function(d,b){var c=a.functionize(b);return function(a){a[d]=c(a);return a}};a.setByProperty=function(d,b){var c=a.functionize(b);return function(a){d[a]=c(d,a);return d}};a.project=function(d){return function(b){return a.zipObject(d,e.map(d,a.getByProperty(b)))}};a.unaryExpr=function(d,b){var c=
a.functionize(b);return function(a){return d(c(a))}};a.binaryExpr=function(d,b,c){if(c===void 0)c=b,b=a.i;var g=a.functionize(b),e=a.functionize(c);return function(a){return d(g(a),e(a))}};a.ternaryExpr=function(d,b,c,e){var j=a.functionize(b),k=a.functionize(c),f=a.functionize(e);return function(a){return d(j(a),k(a),f(a))}};var f=function(a,b){return a+b},h=function(a,b){return a*b},i=function(a){return a+1};greaterThan=function(a,b){return a>b};atLeast=function(a,b){return a>=b};lessThan=function(a,
b){return a<b};atMost=function(a,b){return a<=b};greaterOf=function(a,b){return a>b?a:b};lesserOf=function(a,b){return a<b?a:b};equality=e.isEqual;inequality=function(){return!equality.apply(this,arguments)};and=function(a,b){return a&&b};neither=function(a,b){return!a&&!b};or=function(a,b){return a||b};xor=function(a,b){return a&&!b||!a&&b};not=function(a){return!a};ternary=function(a,b,c){return a?b:c};a.incr=a.increment=a.partial(a.unaryExpr,i);a.decr=a.decrement=a.partial(a.unaryExpr,function(a){return a-
1});a.sqr=a.square=a.partial(a.unaryExpr,function(a){return a*a});a.not=a.partial(a.unaryExpr,not);a.neg=a.negate=a.partial(a.unaryExpr,function(a){return a*-1});a.add=a.partial(a.binaryExpr,f);a.sub=a.subtract=a.partial(a.binaryExpr,function(a,b){return a-b});a.mul=a.multiply=a.partial(a.binaryExpr,h);a.div=a.divide=a.partial(a.binaryExpr,function(a,b){return a/b});a.mod=a.modulo=a.partial(a.binaryExpr,function(a,b){return a%b});a.concat=a.append=a.partial(a.binaryExpr,function(a,b){return""+a+b});
a.gt=a.greaterThan=a.partial(a.binaryExpr,greaterThan);a.gte=a.atLeast=a.partial(a.binaryExpr,atLeast);a.lt=a.lessThan=a.partial(a.binaryExpr,lessThan);a.lte=a.atMost=a.partial(a.binaryExpr,atMost);a.greaterOf=a.partial(a.binaryExpr,greaterOf);a.lesserOf=a.partial(a.binaryExpr,lesserOf);a.eq=a.equality=a.partial(a.binaryExpr,equality);a.neq=a.inequality=a.partial(a.binaryExpr,inequality);a.and=a.partial(a.binaryExpr,and);a.neither=a.partial(a.binaryExpr,neither);a.or=a.partial(a.binaryExpr,or);a.xor=
a.partial(a.binaryExpr,xor);a.ternary=a.partial(a.ternaryExpr,ternary);a.reduceExpr=function(d,b){var c;c=b===void 0?a.i:a.functionize(b);return function(a,b){return d(a,c(b))}};a.sum=a.partial(a.reduceExpr,f);a.product=a.partial(a.reduceExpr,h);a.count=a.partial(a.reduceExpr,i);a.min=a.partial(a.reduceExpr,lesserOf);a.max=a.partial(a.reduceExpr,greaterOf);a.avg=a.average=function(d){var b=1;return a.reduceExpr(function(a,d){var e=a*b+d,f=++b;return e/f},d)}}).call(this);
