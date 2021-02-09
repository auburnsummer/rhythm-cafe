/**
 * This is a compiled version of sql.js with FTS5 support: see https://github.com/sql-js/sql.js#compiling
 */


// We are modularizing this manually because the current modularize setting in Emscripten has some issues:
// https://github.com/kripken/emscripten/issues/5820
// In addition, When you use emcc's modularization, it still expects to export a global object called `Module`,
// which is able to be used/called before the WASM is loaded.
// The modularization below exports a promise that loads and resolves to the actual sql.js module.
// That way, this module can't be used before the WASM is finished loading.

// We are going to define a function that a user will call to start loading initializing our Sql.js library
// However, that function might be called multiple times, and on subsequent calls, we don't actually want it to instantiate a new instance of the Module
// Instead, we want to return the previously loaded module

// TODO: Make this not declare a global if used in the browser
var initSqlJsPromise = undefined;

var initSqlJs = function (moduleConfig) {

    if (initSqlJsPromise){
      return initSqlJsPromise;
    }
    // If we're here, we've never called this function before
    initSqlJsPromise = new Promise(function (resolveModule, reject) {

        // We are modularizing this manually because the current modularize setting in Emscripten has some issues:
        // https://github.com/kripken/emscripten/issues/5820

        // The way to affect the loading of emcc compiled modules is to create a variable called `Module` and add
        // properties to it, like `preRun`, `postRun`, etc
        // We are using that to get notified when the WASM has finished loading.
        // Only then will we return our promise

        // If they passed in a moduleConfig object, use that
        // Otherwise, initialize Module to the empty object
        var Module = typeof moduleConfig !== 'undefined' ? moduleConfig : {};

        // EMCC only allows for a single onAbort function (not an array of functions)
        // So if the user defined their own onAbort function, we remember it and call it
        var originalOnAbortFunction = Module['onAbort'];
        Module['onAbort'] = function (errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort));
            if (originalOnAbortFunction){
              originalOnAbortFunction(errorThatCausedAbort);
            }
        };

        Module['postRun'] = Module['postRun'] || [];
        Module['postRun'].push(function () {
            // When Emscripted calls postRun, this promise resolves with the built Module
            resolveModule(Module);
        });

        // There is a section of code in the emcc-generated code below that looks like this:
        // (Note that this is lowercase `module`)
        // if (typeof module !== 'undefined') {
        //     module['exports'] = Module;
        // }
        // When that runs, it's going to overwrite our own modularization export efforts in shell-post.js!
        // The only way to tell emcc not to emit it is to pass the MODULARIZE=1 or MODULARIZE_INSTANCE=1 flags,
        // but that carries with it additional unnecessary baggage/bugs we don't want either.
        // So, we have three options:
        // 1) We undefine `module`
        // 2) We remember what `module['exports']` was at the beginning of this function and we restore it later
        // 3) We write a script to remove those lines of code as part of the Make process.
        //
        // Since those are the only lines of code that care about module, we will undefine it. It's the most straightforward
        // of the options, and has the side effect of reducing emcc's efforts to modify the module if its output were to change in the future.
        // That's a nice side effect since we're handling the modularization efforts ourselves
        module = undefined;

        // The emcc-generated code and shell-post.js code goes below,
        // meaning that all of it runs inside of this promise. If anything throws an exception, our promise will abort

var e;e||(e=typeof Module !== 'undefined' ? Module : {});null;
e.onRuntimeInitialized=function(){function a(h,l){this.Ra=h;this.db=l;this.Qa=1;this.lb=[]}function b(h,l){this.db=l;l=ba(h)+1;this.eb=ca(l);if(null===this.eb)throw Error("Unable to allocate memory for the SQL string");k(h,m,this.eb,l);this.jb=this.eb;this.$a=this.pb=null}function c(h){this.filename="dbfile_"+(4294967295*Math.random()>>>0);if(null!=h){var l=this.filename,p=l?r("//"+l):"/";l=da(!0,!0);p=ea(p,(void 0!==l?l:438)&4095|32768,0);if(h){if("string"===typeof h){for(var q=Array(h.length),B=
0,ha=h.length;B<ha;++B)q[B]=h.charCodeAt(B);h=q}fa(p,l|146);q=v(p,577);ka(q,h,0,h.length,0,void 0);la(q);fa(p,l)}}this.handleError(g(this.filename,d));this.db=x(d,"i32");kc(this.db);this.fb={};this.Xa={}}var d=y(4),f=e.cwrap,g=f("sqlite3_open","number",["string","number"]),n=f("sqlite3_close_v2","number",["number"]),t=f("sqlite3_exec","number",["number","string","number","number","number"]),w=f("sqlite3_changes","number",["number"]),u=f("sqlite3_prepare_v2","number",["number","string","number","number",
"number"]),C=f("sqlite3_sql","string",["number"]),H=f("sqlite3_normalized_sql","string",["number"]),aa=f("sqlite3_prepare_v2","number",["number","number","number","number","number"]),lc=f("sqlite3_bind_text","number",["number","number","number","number","number"]),rb=f("sqlite3_bind_blob","number",["number","number","number","number","number"]),mc=f("sqlite3_bind_double","number",["number","number","number"]),nc=f("sqlite3_bind_int","number",["number","number","number"]),oc=f("sqlite3_bind_parameter_index",
"number",["number","string"]),pc=f("sqlite3_step","number",["number"]),qc=f("sqlite3_errmsg","string",["number"]),rc=f("sqlite3_column_count","number",["number"]),sc=f("sqlite3_data_count","number",["number"]),tc=f("sqlite3_column_double","number",["number","number"]),uc=f("sqlite3_column_text","string",["number","number"]),vc=f("sqlite3_column_blob","number",["number","number"]),wc=f("sqlite3_column_bytes","number",["number","number"]),xc=f("sqlite3_column_type","number",["number","number"]),yc=
f("sqlite3_column_name","string",["number","number"]),zc=f("sqlite3_reset","number",["number"]),Ac=f("sqlite3_clear_bindings","number",["number"]),Bc=f("sqlite3_finalize","number",["number"]),Cc=f("sqlite3_create_function_v2","number","number string number number number number number number number".split(" ")),Dc=f("sqlite3_value_type","number",["number"]),Ec=f("sqlite3_value_bytes","number",["number"]),Fc=f("sqlite3_value_text","string",["number"]),Gc=f("sqlite3_value_blob","number",["number"]),
Hc=f("sqlite3_value_double","number",["number"]),Ic=f("sqlite3_result_double","",["number","number"]),sb=f("sqlite3_result_null","",["number"]),Jc=f("sqlite3_result_text","",["number","string","number","number"]),Kc=f("sqlite3_result_blob","",["number","number","number","number"]),Lc=f("sqlite3_result_int","",["number","number"]),tb=f("sqlite3_result_error","",["number","string","number"]),kc=f("RegisterExtensionFunctions","number",["number"]);a.prototype.bind=function(h){if(!this.Ra)throw"Statement closed";
this.reset();return Array.isArray(h)?this.Bb(h):null!=h&&"object"===typeof h?this.Cb(h):!0};a.prototype.step=function(){if(!this.Ra)throw"Statement closed";this.Qa=1;var h=pc(this.Ra);switch(h){case 100:return!0;case 101:return!1;default:throw this.db.handleError(h);}};a.prototype.Ib=function(h){null==h&&(h=this.Qa,this.Qa+=1);return tc(this.Ra,h)};a.prototype.Jb=function(h){null==h&&(h=this.Qa,this.Qa+=1);return uc(this.Ra,h)};a.prototype.getBlob=function(h){null==h&&(h=this.Qa,this.Qa+=1);var l=
wc(this.Ra,h);h=vc(this.Ra,h);for(var p=new Uint8Array(l),q=0;q<l;q+=1)p[q]=z[h+q];return p};a.prototype.get=function(h){null!=h&&this.bind(h)&&this.step();h=[];for(var l=sc(this.Ra),p=0;p<l;p+=1)switch(xc(this.Ra,p)){case 1:case 2:h.push(this.Ib(p));break;case 3:h.push(this.Jb(p));break;case 4:h.push(this.getBlob(p));break;default:h.push(null)}return h};a.prototype.getColumnNames=function(){for(var h=[],l=rc(this.Ra),p=0;p<l;p+=1)h.push(yc(this.Ra,p));return h};a.prototype.getAsObject=function(h){h=
this.get(h);for(var l=this.getColumnNames(),p={},q=0;q<l.length;q+=1)p[l[q]]=h[q];return p};a.prototype.getSQL=function(){return C(this.Ra)};a.prototype.getNormalizedSQL=function(){return H(this.Ra)};a.prototype.run=function(h){null!=h&&this.bind(h);this.step();return this.reset()};a.prototype.Fb=function(h,l){null==l&&(l=this.Qa,this.Qa+=1);h=ma(h);var p=na(h);this.lb.push(p);this.db.handleError(lc(this.Ra,l,p,h.length-1,0))};a.prototype.Ab=function(h,l){null==l&&(l=this.Qa,this.Qa+=1);var p=na(h);
this.lb.push(p);this.db.handleError(rb(this.Ra,l,p,h.length,0))};a.prototype.Eb=function(h,l){null==l&&(l=this.Qa,this.Qa+=1);this.db.handleError((h===(h|0)?nc:mc)(this.Ra,l,h))};a.prototype.Db=function(h){null==h&&(h=this.Qa,this.Qa+=1);rb(this.Ra,h,0,0,0)};a.prototype.tb=function(h,l){null==l&&(l=this.Qa,this.Qa+=1);switch(typeof h){case "string":this.Fb(h,l);return;case "number":case "boolean":this.Eb(h+0,l);return;case "object":if(null===h){this.Db(l);return}if(null!=h.length){this.Ab(h,l);return}}throw"Wrong API use : tried to bind a value of an unknown type ("+
h+").";};a.prototype.Cb=function(h){var l=this;Object.keys(h).forEach(function(p){var q=oc(l.Ra,p);0!==q&&l.tb(h[p],q)});return!0};a.prototype.Bb=function(h){for(var l=0;l<h.length;l+=1)this.tb(h[l],l+1);return!0};a.prototype.reset=function(){return 0===Ac(this.Ra)&&0===zc(this.Ra)};a.prototype.freemem=function(){for(var h;void 0!==(h=this.lb.pop());)oa(h)};a.prototype.free=function(){var h=0===Bc(this.Ra);delete this.db.fb[this.Ra];this.Ra=0;return h};b.prototype.next=function(){if(null===this.eb)return{done:!0};
null!==this.$a&&(this.$a.free(),this.$a=null);if(!this.db.db)throw this.nb(),Error("Database closed");var h=pa(),l=y(4);qa(d);qa(l);try{this.db.handleError(aa(this.db.db,this.jb,-1,d,l));this.jb=x(l,"i32");var p=x(d,"i32");if(0===p)return this.nb(),{done:!0};this.$a=new a(p,this.db);this.db.fb[p]=this.$a;return{value:this.$a,done:!1}}catch(q){throw this.pb=A(this.jb),this.nb(),q;}finally{ra(h)}};b.prototype.nb=function(){oa(this.eb);this.eb=null};b.prototype.getRemainingSQL=function(){return null!==
this.pb?this.pb:A(this.jb)};"function"===typeof Symbol&&"symbol"===typeof Symbol.iterator&&(b.prototype[Symbol.iterator]=function(){return this});c.prototype.run=function(h,l){if(!this.db)throw"Database closed";if(l){h=this.prepare(h,l);try{h.step()}finally{h.free()}}else this.handleError(t(this.db,h,0,0,d));return this};c.prototype.exec=function(h,l){if(!this.db)throw"Database closed";var p=pa(),q=null;try{var B=ba(h)+1,ha=y(B);k(h,z,ha,B);var D=ha;var ia=y(4);for(h=[];0!==x(D,"i8");){qa(d);qa(ia);
this.handleError(aa(this.db,D,-1,d,ia));var ja=x(d,"i32");D=x(ia,"i32");if(0!==ja){B=null;q=new a(ja,this);for(null!=l&&q.bind(l);q.step();)null===B&&(B={columns:q.getColumnNames(),values:[]},h.push(B)),B.values.push(q.get());q.free()}}return h}catch(E){throw q&&q.free(),E;}finally{ra(p)}};c.prototype.each=function(h,l,p,q){"function"===typeof l&&(q=p,p=l,l=void 0);h=this.prepare(h,l);try{for(;h.step();)p(h.getAsObject())}finally{h.free()}if("function"===typeof q)return q()};c.prototype.prepare=function(h,
l){qa(d);this.handleError(u(this.db,h,-1,d,0));h=x(d,"i32");if(0===h)throw"Nothing to prepare";var p=new a(h,this);null!=l&&p.bind(l);return this.fb[h]=p};c.prototype.iterateStatements=function(h){return new b(h,this)};c.prototype["export"]=function(){Object.values(this.fb).forEach(function(l){l.free()});Object.values(this.Xa).forEach(sa);this.Xa={};this.handleError(n(this.db));var h=ta(this.filename);this.handleError(g(this.filename,d));this.db=x(d,"i32");return h};c.prototype.close=function(){null!==
this.db&&(Object.values(this.fb).forEach(function(h){h.free()}),Object.values(this.Xa).forEach(sa),this.Xa={},this.handleError(n(this.db)),ua("/"+this.filename),this.db=null)};c.prototype.handleError=function(h){if(0===h)return null;h=qc(this.db);throw Error(h);};c.prototype.getRowsModified=function(){return w(this.db)};c.prototype.create_function=function(h,l){Object.prototype.hasOwnProperty.call(this.Xa,h)&&(sa(this.Xa[h]),delete this.Xa[h]);var p=va(function(q,B,ha){for(var D,ia=[],ja=0;ja<B;ja+=
1){var E=x(ha+4*ja,"i32"),S=Dc(E);if(1===S||2===S)E=Hc(E);else if(3===S)E=Fc(E);else if(4===S){S=E;E=Ec(S);S=Gc(S);for(var wb=new Uint8Array(E),Ba=0;Ba<E;Ba+=1)wb[Ba]=z[S+Ba];E=wb}else E=null;ia.push(E)}try{D=l.apply(null,ia)}catch(Oc){tb(q,Oc,-1);return}switch(typeof D){case "boolean":Lc(q,D?1:0);break;case "number":Ic(q,D);break;case "string":Jc(q,D,-1,-1);break;case "object":null===D?sb(q):null!=D.length?(B=na(D),Kc(q,B,D.length,-1),oa(B)):tb(q,"Wrong API use : tried to return a value of an unknown type ("+
D+").",-1);break;default:sb(q)}});this.Xa[h]=p;this.handleError(Cc(this.db,h,l.length,1,0,p,0,0,0));return this};e.Database=c};var wa={},F;for(F in e)e.hasOwnProperty(F)&&(wa[F]=e[F]);var xa="./this.program",ya=!1,za=!1,Aa=!1,Ca=!1;ya="object"===typeof window;za="function"===typeof importScripts;Aa="object"===typeof process&&"object"===typeof process.versions&&"string"===typeof process.versions.node;Ca=!ya&&!Aa&&!za;var G="",Da,Ea,Fa,Ga,Ha;
if(Aa)G=za?require("path").dirname(G)+"/":__dirname+"/",Da=function(a,b){Ga||(Ga=require("fs"));Ha||(Ha=require("path"));a=Ha.normalize(a);return Ga.readFileSync(a,b?null:"utf8")},Fa=function(a){a=Da(a,!0);a.buffer||(a=new Uint8Array(a));assert(a.buffer);return a},1<process.argv.length&&(xa=process.argv[1].replace(/\\/g,"/")),process.argv.slice(2),"undefined"!==typeof module&&(module.exports=e),e.inspect=function(){return"[Emscripten Module object]"};else if(Ca)"undefined"!=typeof read&&(Da=function(a){return read(a)}),
Fa=function(a){if("function"===typeof readbuffer)return new Uint8Array(readbuffer(a));a=read(a,"binary");assert("object"===typeof a);return a},"undefined"!==typeof print&&("undefined"===typeof console&&(console={}),console.log=print,console.warn=console.error="undefined"!==typeof printErr?printErr:print);else if(ya||za)za?G=self.location.href:"undefined"!==typeof document&&document.currentScript&&(G=document.currentScript.src),G=0!==G.indexOf("blob:")?G.substr(0,G.lastIndexOf("/")+1):"",Da=function(a){var b=
new XMLHttpRequest;b.open("GET",a,!1);b.send(null);return b.responseText},za&&(Fa=function(a){var b=new XMLHttpRequest;b.open("GET",a,!1);b.responseType="arraybuffer";b.send(null);return new Uint8Array(b.response)}),Ea=function(a,b,c){var d=new XMLHttpRequest;d.open("GET",a,!0);d.responseType="arraybuffer";d.onload=function(){200==d.status||0==d.status&&d.response?b(d.response):c()};d.onerror=c;d.send(null)};var Ia=e.print||console.log.bind(console),I=e.printErr||console.warn.bind(console);
for(F in wa)wa.hasOwnProperty(F)&&(e[F]=wa[F]);wa=null;e.thisProgram&&(xa=e.thisProgram);var Ja=[],Ka;function sa(a){Ka.delete(J.get(a));Ja.push(a)}
function va(a){if(!Ka){Ka=new WeakMap;for(var b=0;b<J.length;b++){var c=J.get(b);c&&Ka.set(c,b)}}if(Ka.has(a))a=Ka.get(a);else{if(Ja.length)b=Ja.pop();else{try{J.grow(1)}catch(g){if(!(g instanceof RangeError))throw g;throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";}b=J.length-1}try{J.set(b,a)}catch(g){if(!(g instanceof TypeError))throw g;if("function"===typeof WebAssembly.Function){var d={i:"i32",j:"i64",f:"f32",d:"f64"},f={parameters:[],results:[]};for(c=1;4>c;++c)f.parameters.push(d["viii"[c]]);
c=new WebAssembly.Function(f,a)}else{d=[1,0,1,96];f={i:127,j:126,f:125,d:124};d.push(3);for(c=0;3>c;++c)d.push(f["iii"[c]]);d.push(0);d[1]=d.length-2;c=new Uint8Array([0,97,115,109,1,0,0,0].concat(d,[2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0]));c=new WebAssembly.Module(c);c=(new WebAssembly.Instance(c,{e:{f:a}})).exports.f}J.set(b,c)}Ka.set(a,b);a=b}return a}var La;e.wasmBinary&&(La=e.wasmBinary);var noExitRuntime;e.noExitRuntime&&(noExitRuntime=e.noExitRuntime);"object"!==typeof WebAssembly&&K("no native wasm support detected");
function qa(a){var b="i32";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":z[a>>0]=0;break;case "i8":z[a>>0]=0;break;case "i16":Ma[a>>1]=0;break;case "i32":L[a>>2]=0;break;case "i64":M=[0,(N=0,1<=+Math.abs(N)?0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];L[a>>2]=M[0];L[a+4>>2]=M[1];break;case "float":Na[a>>2]=0;break;case "double":Oa[a>>3]=0;break;default:K("invalid type for setValue: "+b)}}
function x(a,b){b=b||"i8";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":return z[a>>0];case "i8":return z[a>>0];case "i16":return Ma[a>>1];case "i32":return L[a>>2];case "i64":return L[a>>2];case "float":return Na[a>>2];case "double":return Oa[a>>3];default:K("invalid type for getValue: "+b)}return null}var Pa,Qa=!1;function assert(a,b){a||K("Assertion failed: "+b)}function Ra(a){var b=e["_"+a];assert(b,"Cannot call unknown function "+a+", make sure it is exported");return b}
function Sa(a,b,c,d){var f={string:function(u){var C=0;if(null!==u&&void 0!==u&&0!==u){var H=(u.length<<2)+1;C=y(H);k(u,m,C,H)}return C},array:function(u){var C=y(u.length);z.set(u,C);return C}},g=Ra(a),n=[];a=0;if(d)for(var t=0;t<d.length;t++){var w=f[c[t]];w?(0===a&&(a=pa()),n[t]=w(d[t])):n[t]=d[t]}c=g.apply(null,n);c=function(u){return"string"===b?A(u):"boolean"===b?!!u:u}(c);0!==a&&ra(a);return c}var Ta=0,Ua=1;
function na(a){var b=Ta==Ua?y(a.length):ca(a.length);a.subarray||a.slice?m.set(a,b):m.set(new Uint8Array(a),b);return b}var Va="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0;
function Wa(a,b,c){var d=b+c;for(c=b;a[c]&&!(c>=d);)++c;if(16<c-b&&a.subarray&&Va)return Va.decode(a.subarray(b,c));for(d="";b<c;){var f=a[b++];if(f&128){var g=a[b++]&63;if(192==(f&224))d+=String.fromCharCode((f&31)<<6|g);else{var n=a[b++]&63;f=224==(f&240)?(f&15)<<12|g<<6|n:(f&7)<<18|g<<12|n<<6|a[b++]&63;65536>f?d+=String.fromCharCode(f):(f-=65536,d+=String.fromCharCode(55296|f>>10,56320|f&1023))}}else d+=String.fromCharCode(f)}return d}function A(a,b){return a?Wa(m,a,b):""}
function k(a,b,c,d){if(!(0<d))return 0;var f=c;d=c+d-1;for(var g=0;g<a.length;++g){var n=a.charCodeAt(g);if(55296<=n&&57343>=n){var t=a.charCodeAt(++g);n=65536+((n&1023)<<10)|t&1023}if(127>=n){if(c>=d)break;b[c++]=n}else{if(2047>=n){if(c+1>=d)break;b[c++]=192|n>>6}else{if(65535>=n){if(c+2>=d)break;b[c++]=224|n>>12}else{if(c+3>=d)break;b[c++]=240|n>>18;b[c++]=128|n>>12&63}b[c++]=128|n>>6&63}b[c++]=128|n&63}}b[c]=0;return c-f}
function ba(a){for(var b=0,c=0;c<a.length;++c){var d=a.charCodeAt(c);55296<=d&&57343>=d&&(d=65536+((d&1023)<<10)|a.charCodeAt(++c)&1023);127>=d?++b:b=2047>=d?b+2:65535>=d?b+3:b+4}return b}function Xa(a){var b=ba(a)+1,c=ca(b);c&&k(a,z,c,b);return c}var Ya,z,m,Ma,L,Na,Oa;
function Za(){var a=Pa.buffer;Ya=a;e.HEAP8=z=new Int8Array(a);e.HEAP16=Ma=new Int16Array(a);e.HEAP32=L=new Int32Array(a);e.HEAPU8=m=new Uint8Array(a);e.HEAPU16=new Uint16Array(a);e.HEAPU32=new Uint32Array(a);e.HEAPF32=Na=new Float32Array(a);e.HEAPF64=Oa=new Float64Array(a)}var J,$a=[],ab=[],bb=[],cb=[];ab.push({Hb:function(){db()}});function eb(){var a=e.preRun.shift();$a.unshift(a)}var fb=0,gb=null,hb=null;e.preloadedImages={};e.preloadedAudios={};
function K(a){if(e.onAbort)e.onAbort(a);I(a);Qa=!0;throw new WebAssembly.RuntimeError("abort("+a+"). Build with -s ASSERTIONS=1 for more info.");}function ib(a){var b=O;return String.prototype.startsWith?b.startsWith(a):0===b.indexOf(a)}function jb(){return ib("data:application/octet-stream;base64,")}var O="sql-wasm.wasm";if(!jb()){var kb=O;O=e.locateFile?e.locateFile(kb,G):G+kb}
function lb(){var a=O;try{if(a==O&&La)return new Uint8Array(La);if(Fa)return Fa(a);throw"both async and sync fetching of the wasm failed";}catch(b){K(b)}}
function mb(){if(!La&&(ya||za)){if("function"===typeof fetch&&!ib("file://"))return fetch(O,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+O+"'";return a.arrayBuffer()}).catch(function(){return lb()});if(Ea)return new Promise(function(a,b){Ea(O,function(c){a(new Uint8Array(c))},b)})}return Promise.resolve().then(function(){return lb()})}var N,M;
function nb(a){for(;0<a.length;){var b=a.shift();if("function"==typeof b)b(e);else{var c=b.Hb;"number"===typeof c?void 0===b.mb?J.get(c)():J.get(c)(b.mb):c(void 0===b.mb?null:b.mb)}}}function ob(a){return a.replace(/\b_Z[\w\d_]+/g,function(b){return b===b?b:b+" ["+b+"]"})}
function pb(){function a(n){return(n=n.toTimeString().match(/\(([A-Za-z ]+)\)$/))?n[1]:"GMT"}if(!qb){qb=!0;var b=(new Date).getFullYear(),c=new Date(b,0,1),d=new Date(b,6,1);b=c.getTimezoneOffset();var f=d.getTimezoneOffset(),g=Math.max(b,f);L[ub()>>2]=60*g;L[vb()>>2]=Number(b!=f);c=a(c);d=a(d);c=Xa(c);d=Xa(d);f<b?(L[xb()>>2]=c,L[xb()+4>>2]=d):(L[xb()>>2]=d,L[xb()+4>>2]=c)}}var qb;
function yb(a,b){for(var c=0,d=a.length-1;0<=d;d--){var f=a[d];"."===f?a.splice(d,1):".."===f?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c;c--)a.unshift("..");return a}function r(a){var b="/"===a.charAt(0),c="/"===a.substr(-1);(a=yb(a.split("/").filter(function(d){return!!d}),!b).join("/"))||b||(a=".");a&&c&&(a+="/");return(b?"/":"")+a}
function zb(a){var b=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);a=b[0];b=b[1];if(!a&&!b)return".";b&&(b=b.substr(0,b.length-1));return a+b}function Ab(a){if("/"===a)return"/";a=r(a);a=a.replace(/\/$/,"");var b=a.lastIndexOf("/");return-1===b?a:a.substr(b+1)}
function Bb(){if("object"===typeof crypto&&"function"===typeof crypto.getRandomValues){var a=new Uint8Array(1);return function(){crypto.getRandomValues(a);return a[0]}}if(Aa)try{var b=require("crypto");return function(){return b.randomBytes(1)[0]}}catch(c){}return function(){K("randomDevice")}}
function Cb(){for(var a="",b=!1,c=arguments.length-1;-1<=c&&!b;c--){b=0<=c?arguments[c]:"/";if("string"!==typeof b)throw new TypeError("Arguments to path.resolve must be strings");if(!b)return"";a=b+"/"+a;b="/"===b.charAt(0)}a=yb(a.split("/").filter(function(d){return!!d}),!b).join("/");return(b?"/":"")+a||"."}var Db=[];function Eb(a,b){Db[a]={input:[],output:[],cb:b};Fb(a,Gb)}
var Gb={open:function(a){var b=Db[a.node.rdev];if(!b)throw new P(43);a.tty=b;a.seekable=!1},close:function(a){a.tty.cb.flush(a.tty)},flush:function(a){a.tty.cb.flush(a.tty)},read:function(a,b,c,d){if(!a.tty||!a.tty.cb.xb)throw new P(60);for(var f=0,g=0;g<d;g++){try{var n=a.tty.cb.xb(a.tty)}catch(t){throw new P(29);}if(void 0===n&&0===f)throw new P(6);if(null===n||void 0===n)break;f++;b[c+g]=n}f&&(a.node.timestamp=Date.now());return f},write:function(a,b,c,d){if(!a.tty||!a.tty.cb.qb)throw new P(60);
try{for(var f=0;f<d;f++)a.tty.cb.qb(a.tty,b[c+f])}catch(g){throw new P(29);}d&&(a.node.timestamp=Date.now());return f}},Hb={xb:function(a){if(!a.input.length){var b=null;if(Aa){var c=Buffer.zb?Buffer.zb(256):new Buffer(256),d=0;try{d=Ga.readSync(process.stdin.fd,c,0,256,null)}catch(f){if(-1!=f.toString().indexOf("EOF"))d=0;else throw f;}0<d?b=c.slice(0,d).toString("utf-8"):b=null}else"undefined"!=typeof window&&"function"==typeof window.prompt?(b=window.prompt("Input: "),null!==b&&(b+="\n")):"function"==
typeof readline&&(b=readline(),null!==b&&(b+="\n"));if(!b)return null;a.input=ma(b,!0)}return a.input.shift()},qb:function(a,b){null===b||10===b?(Ia(Wa(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(Ia(Wa(a.output,0)),a.output=[])}},Ib={qb:function(a,b){null===b||10===b?(I(Wa(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(I(Wa(a.output,0)),a.output=[])}},Q={Va:null,Wa:function(){return Q.createNode(null,
"/",16895,0)},createNode:function(a,b,c,d){if(24576===(c&61440)||4096===(c&61440))throw new P(63);Q.Va||(Q.Va={dir:{node:{Ua:Q.Ma.Ua,Ta:Q.Ma.Ta,lookup:Q.Ma.lookup,gb:Q.Ma.gb,rename:Q.Ma.rename,unlink:Q.Ma.unlink,rmdir:Q.Ma.rmdir,readdir:Q.Ma.readdir,symlink:Q.Ma.symlink},stream:{Za:Q.Na.Za}},file:{node:{Ua:Q.Ma.Ua,Ta:Q.Ma.Ta},stream:{Za:Q.Na.Za,read:Q.Na.read,write:Q.Na.write,sb:Q.Na.sb,hb:Q.Na.hb,ib:Q.Na.ib}},link:{node:{Ua:Q.Ma.Ua,Ta:Q.Ma.Ta,readlink:Q.Ma.readlink},stream:{}},ub:{node:{Ua:Q.Ma.Ua,
Ta:Q.Ma.Ta},stream:Jb}});c=Kb(a,b,c,d);R(c.mode)?(c.Ma=Q.Va.dir.node,c.Na=Q.Va.dir.stream,c.Oa={}):32768===(c.mode&61440)?(c.Ma=Q.Va.file.node,c.Na=Q.Va.file.stream,c.Sa=0,c.Oa=null):40960===(c.mode&61440)?(c.Ma=Q.Va.link.node,c.Na=Q.Va.link.stream):8192===(c.mode&61440)&&(c.Ma=Q.Va.ub.node,c.Na=Q.Va.ub.stream);c.timestamp=Date.now();a&&(a.Oa[b]=c,a.timestamp=c.timestamp);return c},Sb:function(a){return a.Oa?a.Oa.subarray?a.Oa.subarray(0,a.Sa):new Uint8Array(a.Oa):new Uint8Array(0)},vb:function(a,
b){var c=a.Oa?a.Oa.length:0;c>=b||(b=Math.max(b,c*(1048576>c?2:1.125)>>>0),0!=c&&(b=Math.max(b,256)),c=a.Oa,a.Oa=new Uint8Array(b),0<a.Sa&&a.Oa.set(c.subarray(0,a.Sa),0))},Pb:function(a,b){if(a.Sa!=b)if(0==b)a.Oa=null,a.Sa=0;else{var c=a.Oa;a.Oa=new Uint8Array(b);c&&a.Oa.set(c.subarray(0,Math.min(b,a.Sa)));a.Sa=b}},Ma:{Ua:function(a){var b={};b.dev=8192===(a.mode&61440)?a.id:1;b.ino=a.id;b.mode=a.mode;b.nlink=1;b.uid=0;b.gid=0;b.rdev=a.rdev;R(a.mode)?b.size=4096:32768===(a.mode&61440)?b.size=a.Sa:
40960===(a.mode&61440)?b.size=a.link.length:b.size=0;b.atime=new Date(a.timestamp);b.mtime=new Date(a.timestamp);b.ctime=new Date(a.timestamp);b.Gb=4096;b.blocks=Math.ceil(b.size/b.Gb);return b},Ta:function(a,b){void 0!==b.mode&&(a.mode=b.mode);void 0!==b.timestamp&&(a.timestamp=b.timestamp);void 0!==b.size&&Q.Pb(a,b.size)},lookup:function(){throw Lb[44];},gb:function(a,b,c,d){return Q.createNode(a,b,c,d)},rename:function(a,b,c){if(R(a.mode)){try{var d=Mb(b,c)}catch(g){}if(d)for(var f in d.Oa)throw new P(55);
}delete a.parent.Oa[a.name];a.parent.timestamp=Date.now();a.name=c;b.Oa[c]=a;b.timestamp=a.parent.timestamp;a.parent=b},unlink:function(a,b){delete a.Oa[b];a.timestamp=Date.now()},rmdir:function(a,b){var c=Mb(a,b),d;for(d in c.Oa)throw new P(55);delete a.Oa[b];a.timestamp=Date.now()},readdir:function(a){var b=[".",".."],c;for(c in a.Oa)a.Oa.hasOwnProperty(c)&&b.push(c);return b},symlink:function(a,b,c){a=Q.createNode(a,b,41471,0);a.link=c;return a},readlink:function(a){if(40960!==(a.mode&61440))throw new P(28);
return a.link}},Na:{read:function(a,b,c,d,f){var g=a.node.Oa;if(f>=a.node.Sa)return 0;a=Math.min(a.node.Sa-f,d);if(8<a&&g.subarray)b.set(g.subarray(f,f+a),c);else for(d=0;d<a;d++)b[c+d]=g[f+d];return a},write:function(a,b,c,d,f,g){b.buffer===z.buffer&&(g=!1);if(!d)return 0;a=a.node;a.timestamp=Date.now();if(b.subarray&&(!a.Oa||a.Oa.subarray)){if(g)return a.Oa=b.subarray(c,c+d),a.Sa=d;if(0===a.Sa&&0===f)return a.Oa=b.slice(c,c+d),a.Sa=d;if(f+d<=a.Sa)return a.Oa.set(b.subarray(c,c+d),f),d}Q.vb(a,f+
d);if(a.Oa.subarray&&b.subarray)a.Oa.set(b.subarray(c,c+d),f);else for(g=0;g<d;g++)a.Oa[f+g]=b[c+g];a.Sa=Math.max(a.Sa,f+d);return d},Za:function(a,b,c){1===c?b+=a.position:2===c&&32768===(a.node.mode&61440)&&(b+=a.node.Sa);if(0>b)throw new P(28);return b},sb:function(a,b,c){Q.vb(a.node,b+c);a.node.Sa=Math.max(a.node.Sa,b+c)},hb:function(a,b,c,d,f,g){if(0!==b)throw new P(28);if(32768!==(a.node.mode&61440))throw new P(43);a=a.node.Oa;if(g&2||a.buffer!==Ya){if(0<d||d+c<a.length)a.subarray?a=a.subarray(d,
d+c):a=Array.prototype.slice.call(a,d,d+c);d=!0;g=16384*Math.ceil(c/16384);for(b=ca(g);c<g;)z[b+c++]=0;c=b;if(!c)throw new P(48);z.set(a,c)}else d=!1,c=a.byteOffset;return{Ob:c,kb:d}},ib:function(a,b,c,d,f){if(32768!==(a.node.mode&61440))throw new P(43);if(f&2)return 0;Q.Na.write(a,b,0,d,c,!1);return 0}}},Nb=null,Ob={},T=[],Pb=1,U=null,Qb=!0,V={},P=null,Lb={};
function W(a,b){a=Cb("/",a);b=b||{};if(!a)return{path:"",node:null};var c={wb:!0,rb:0},d;for(d in c)void 0===b[d]&&(b[d]=c[d]);if(8<b.rb)throw new P(32);a=yb(a.split("/").filter(function(n){return!!n}),!1);var f=Nb;c="/";for(d=0;d<a.length;d++){var g=d===a.length-1;if(g&&b.parent)break;f=Mb(f,a[d]);c=r(c+"/"+a[d]);f.ab&&(!g||g&&b.wb)&&(f=f.ab.root);if(!g||b.Ya)for(g=0;40960===(f.mode&61440);)if(f=Rb(c),c=Cb(zb(c),f),f=W(c,{rb:b.rb}).node,40<g++)throw new P(32);}return{path:c,node:f}}
function Sb(a){for(var b;;){if(a===a.parent)return a=a.Wa.yb,b?"/"!==a[a.length-1]?a+"/"+b:a+b:a;b=b?a.name+"/"+b:a.name;a=a.parent}}function Tb(a,b){for(var c=0,d=0;d<b.length;d++)c=(c<<5)-c+b.charCodeAt(d)|0;return(a+c>>>0)%U.length}function Ub(a){var b=Tb(a.parent.id,a.name);if(U[b]===a)U[b]=a.bb;else for(b=U[b];b;){if(b.bb===a){b.bb=a.bb;break}b=b.bb}}
function Mb(a,b){var c;if(c=(c=Vb(a,"x"))?c:a.Ma.lookup?0:2)throw new P(c,a);for(c=U[Tb(a.id,b)];c;c=c.bb){var d=c.name;if(c.parent.id===a.id&&d===b)return c}return a.Ma.lookup(a,b)}function Kb(a,b,c,d){a=new Wb(a,b,c,d);b=Tb(a.parent.id,a.name);a.bb=U[b];return U[b]=a}function R(a){return 16384===(a&61440)}var Xb={r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090};function Yb(a){var b=["r","w","rw"][a&3];a&512&&(b+="w");return b}
function Vb(a,b){if(Qb)return 0;if(-1===b.indexOf("r")||a.mode&292){if(-1!==b.indexOf("w")&&!(a.mode&146)||-1!==b.indexOf("x")&&!(a.mode&73))return 2}else return 2;return 0}function Zb(a,b){try{return Mb(a,b),20}catch(c){}return Vb(a,"wx")}function $b(a,b,c){try{var d=Mb(a,b)}catch(f){return f.Pa}if(a=Vb(a,"wx"))return a;if(c){if(!R(d.mode))return 54;if(d===d.parent||"/"===Sb(d))return 10}else if(R(d.mode))return 31;return 0}
function ac(a){var b=4096;for(a=a||0;a<=b;a++)if(!T[a])return a;throw new P(33);}function bc(a,b){cc||(cc=function(){},cc.prototype={});var c=new cc,d;for(d in a)c[d]=a[d];a=c;b=ac(b);a.fd=b;return T[b]=a}var Jb={open:function(a){a.Na=Ob[a.node.rdev].Na;a.Na.open&&a.Na.open(a)},Za:function(){throw new P(70);}};function Fb(a,b){Ob[a]={Na:b}}
function dc(a,b){var c="/"===b,d=!b;if(c&&Nb)throw new P(10);if(!c&&!d){var f=W(b,{wb:!1});b=f.path;f=f.node;if(f.ab)throw new P(10);if(!R(f.mode))throw new P(54);}b={type:a,Tb:{},yb:b,Mb:[]};a=a.Wa(b);a.Wa=b;b.root=a;c?Nb=a:f&&(f.ab=b,f.Wa&&f.Wa.Mb.push(b))}function ea(a,b,c){var d=W(a,{parent:!0}).node;a=Ab(a);if(!a||"."===a||".."===a)throw new P(28);var f=Zb(d,a);if(f)throw new P(f);if(!d.Ma.gb)throw new P(63);return d.Ma.gb(d,a,b,c)}
function X(a,b){return ea(a,(void 0!==b?b:511)&1023|16384,0)}function ec(a,b,c){"undefined"===typeof c&&(c=b,b=438);ea(a,b|8192,c)}function fc(a,b){if(!Cb(a))throw new P(44);var c=W(b,{parent:!0}).node;if(!c)throw new P(44);b=Ab(b);var d=Zb(c,b);if(d)throw new P(d);if(!c.Ma.symlink)throw new P(63);c.Ma.symlink(c,b,a)}
function ua(a){var b=W(a,{parent:!0}).node,c=Ab(a),d=Mb(b,c),f=$b(b,c,!1);if(f)throw new P(f);if(!b.Ma.unlink)throw new P(63);if(d.ab)throw new P(10);try{V.willDeletePath&&V.willDeletePath(a)}catch(g){I("FS.trackingDelegate['willDeletePath']('"+a+"') threw an exception: "+g.message)}b.Ma.unlink(b,c);Ub(d);try{if(V.onDeletePath)V.onDeletePath(a)}catch(g){I("FS.trackingDelegate['onDeletePath']('"+a+"') threw an exception: "+g.message)}}
function Rb(a){a=W(a).node;if(!a)throw new P(44);if(!a.Ma.readlink)throw new P(28);return Cb(Sb(a.parent),a.Ma.readlink(a))}function hc(a,b){a=W(a,{Ya:!b}).node;if(!a)throw new P(44);if(!a.Ma.Ua)throw new P(63);return a.Ma.Ua(a)}function ic(a){return hc(a,!0)}function fa(a,b){var c;"string"===typeof a?c=W(a,{Ya:!0}).node:c=a;if(!c.Ma.Ta)throw new P(63);c.Ma.Ta(c,{mode:b&4095|c.mode&-4096,timestamp:Date.now()})}
function jc(a){var b;"string"===typeof a?b=W(a,{Ya:!0}).node:b=a;if(!b.Ma.Ta)throw new P(63);b.Ma.Ta(b,{timestamp:Date.now()})}function Mc(a,b){if(0>b)throw new P(28);var c;"string"===typeof a?c=W(a,{Ya:!0}).node:c=a;if(!c.Ma.Ta)throw new P(63);if(R(c.mode))throw new P(31);if(32768!==(c.mode&61440))throw new P(28);if(a=Vb(c,"w"))throw new P(a);c.Ma.Ta(c,{size:b,timestamp:Date.now()})}
function v(a,b,c,d){if(""===a)throw new P(44);if("string"===typeof b){var f=Xb[b];if("undefined"===typeof f)throw Error("Unknown file open mode: "+b);b=f}c=b&64?("undefined"===typeof c?438:c)&4095|32768:0;if("object"===typeof a)var g=a;else{a=r(a);try{g=W(a,{Ya:!(b&131072)}).node}catch(n){}}f=!1;if(b&64)if(g){if(b&128)throw new P(20);}else g=ea(a,c,0),f=!0;if(!g)throw new P(44);8192===(g.mode&61440)&&(b&=-513);if(b&65536&&!R(g.mode))throw new P(54);if(!f&&(c=g?40960===(g.mode&61440)?32:R(g.mode)&&
("r"!==Yb(b)||b&512)?31:Vb(g,Yb(b)):44))throw new P(c);b&512&&Mc(g,0);b&=-131713;d=bc({node:g,path:Sb(g),flags:b,seekable:!0,position:0,Na:g.Na,Rb:[],error:!1},d);d.Na.open&&d.Na.open(d);!e.logReadFiles||b&1||(Nc||(Nc={}),a in Nc||(Nc[a]=1,I("FS.trackingDelegate error on read file: "+a)));try{V.onOpenFile&&(g=0,1!==(b&2097155)&&(g|=1),0!==(b&2097155)&&(g|=2),V.onOpenFile(a,g))}catch(n){I("FS.trackingDelegate['onOpenFile']('"+a+"', flags) threw an exception: "+n.message)}return d}
function la(a){if(null===a.fd)throw new P(8);a.ob&&(a.ob=null);try{a.Na.close&&a.Na.close(a)}catch(b){throw b;}finally{T[a.fd]=null}a.fd=null}function Pc(a,b,c){if(null===a.fd)throw new P(8);if(!a.seekable||!a.Na.Za)throw new P(70);if(0!=c&&1!=c&&2!=c)throw new P(28);a.position=a.Na.Za(a,b,c);a.Rb=[]}
function Qc(a,b,c,d,f){if(0>d||0>f)throw new P(28);if(null===a.fd)throw new P(8);if(1===(a.flags&2097155))throw new P(8);if(R(a.node.mode))throw new P(31);if(!a.Na.read)throw new P(28);var g="undefined"!==typeof f;if(!g)f=a.position;else if(!a.seekable)throw new P(70);b=a.Na.read(a,b,c,d,f);g||(a.position+=b);return b}
function ka(a,b,c,d,f,g){if(0>d||0>f)throw new P(28);if(null===a.fd)throw new P(8);if(0===(a.flags&2097155))throw new P(8);if(R(a.node.mode))throw new P(31);if(!a.Na.write)throw new P(28);a.seekable&&a.flags&1024&&Pc(a,0,2);var n="undefined"!==typeof f;if(!n)f=a.position;else if(!a.seekable)throw new P(70);b=a.Na.write(a,b,c,d,f,g);n||(a.position+=b);try{if(a.path&&V.onWriteToFile)V.onWriteToFile(a.path)}catch(t){I("FS.trackingDelegate['onWriteToFile']('"+a.path+"') threw an exception: "+t.message)}return b}
function ta(a){var b={encoding:"binary"};b=b||{};b.flags=b.flags||0;b.encoding=b.encoding||"binary";if("utf8"!==b.encoding&&"binary"!==b.encoding)throw Error('Invalid encoding type "'+b.encoding+'"');var c,d=v(a,b.flags);a=hc(a).size;var f=new Uint8Array(a);Qc(d,f,0,a,0);"utf8"===b.encoding?c=Wa(f,0):"binary"===b.encoding&&(c=f);la(d);return c}
function Rc(){P||(P=function(a,b){this.node=b;this.Qb=function(c){this.Pa=c};this.Qb(a);this.message="FS error"},P.prototype=Error(),P.prototype.constructor=P,[44].forEach(function(a){Lb[a]=new P(a);Lb[a].stack="<generic error, no stack>"}))}var Sc;function da(a,b){var c=0;a&&(c|=365);b&&(c|=146);return c}
function Tc(a,b,c){a=r("/dev/"+a);var d=da(!!b,!!c);Uc||(Uc=64);var f=Uc++<<8|0;Fb(f,{open:function(g){g.seekable=!1},close:function(){c&&c.buffer&&c.buffer.length&&c(10)},read:function(g,n,t,w){for(var u=0,C=0;C<w;C++){try{var H=b()}catch(aa){throw new P(29);}if(void 0===H&&0===u)throw new P(6);if(null===H||void 0===H)break;u++;n[t+C]=H}u&&(g.node.timestamp=Date.now());return u},write:function(g,n,t,w){for(var u=0;u<w;u++)try{c(n[t+u])}catch(C){throw new P(29);}w&&(g.node.timestamp=Date.now());return u}});
ec(a,d,f)}var Uc,Y={},cc,Nc,Vc={};
function Wc(a,b,c){try{var d=a(b)}catch(f){if(f&&f.node&&r(b)!==r(Sb(f.node)))return-54;throw f;}L[c>>2]=d.dev;L[c+4>>2]=0;L[c+8>>2]=d.ino;L[c+12>>2]=d.mode;L[c+16>>2]=d.nlink;L[c+20>>2]=d.uid;L[c+24>>2]=d.gid;L[c+28>>2]=d.rdev;L[c+32>>2]=0;M=[d.size>>>0,(N=d.size,1<=+Math.abs(N)?0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];L[c+40>>2]=M[0];L[c+44>>2]=M[1];L[c+48>>2]=4096;L[c+52>>2]=d.blocks;L[c+56>>2]=d.atime.getTime()/1E3|0;L[c+60>>2]=
0;L[c+64>>2]=d.mtime.getTime()/1E3|0;L[c+68>>2]=0;L[c+72>>2]=d.ctime.getTime()/1E3|0;L[c+76>>2]=0;M=[d.ino>>>0,(N=d.ino,1<=+Math.abs(N)?0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];L[c+80>>2]=M[0];L[c+84>>2]=M[1];return 0}var Xc=void 0;function Yc(){Xc+=4;return L[Xc-4>>2]}function Z(a){a=T[a];if(!a)throw new P(8);return a}var Zc;
Aa?Zc=function(){var a=process.hrtime();return 1E3*a[0]+a[1]/1E6}:"undefined"!==typeof dateNow?Zc=dateNow:Zc=function(){return performance.now()};var $c={};function ad(){if(!bd){var a={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"===typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:xa||"./this.program"},b;for(b in $c)a[b]=$c[b];var c=[];for(b in a)c.push(b+"="+a[b]);bd=c}return bd}var bd;
function Wb(a,b,c,d){a||(a=this);this.parent=a;this.Wa=a.Wa;this.ab=null;this.id=Pb++;this.name=b;this.mode=c;this.Ma={};this.Na={};this.rdev=d}Object.defineProperties(Wb.prototype,{read:{get:function(){return 365===(this.mode&365)},set:function(a){a?this.mode|=365:this.mode&=-366}},write:{get:function(){return 146===(this.mode&146)},set:function(a){a?this.mode|=146:this.mode&=-147}}});Rc();U=Array(4096);dc(Q,"/");X("/tmp");X("/home");X("/home/web_user");
(function(){X("/dev");Fb(259,{read:function(){return 0},write:function(b,c,d,f){return f}});ec("/dev/null",259);Eb(1280,Hb);Eb(1536,Ib);ec("/dev/tty",1280);ec("/dev/tty1",1536);var a=Bb();Tc("random",a);Tc("urandom",a);X("/dev/shm");X("/dev/shm/tmp")})();
(function(){X("/proc");var a=X("/proc/self");X("/proc/self/fd");dc({Wa:function(){var b=Kb(a,"fd",16895,73);b.Ma={lookup:function(c,d){var f=T[+d];if(!f)throw new P(8);c={parent:null,Wa:{yb:"fake"},Ma:{readlink:function(){return f.path}}};return c.parent=c}};return b}},"/proc/self/fd")})();function ma(a,b){var c=Array(ba(a)+1);a=k(a,c,0,c.length);b&&(c.length=a);return c}
var fd={a:function(a,b,c,d){K("Assertion failed: "+A(a)+", at: "+[b?A(b):"unknown filename",c,d?A(d):"unknown function"])},t:function(a,b){pb();a=new Date(1E3*L[a>>2]);L[b>>2]=a.getSeconds();L[b+4>>2]=a.getMinutes();L[b+8>>2]=a.getHours();L[b+12>>2]=a.getDate();L[b+16>>2]=a.getMonth();L[b+20>>2]=a.getFullYear()-1900;L[b+24>>2]=a.getDay();var c=new Date(a.getFullYear(),0,1);L[b+28>>2]=(a.getTime()-c.getTime())/864E5|0;L[b+36>>2]=-(60*a.getTimezoneOffset());var d=(new Date(a.getFullYear(),6,1)).getTimezoneOffset();
c=c.getTimezoneOffset();a=(d!=c&&a.getTimezoneOffset()==Math.min(c,d))|0;L[b+32>>2]=a;a=L[xb()+(a?4:0)>>2];L[b+40>>2]=a;return b},k:function(a,b){try{a=A(a);if(b&-8)var c=-28;else{var d;(d=W(a,{Ya:!0}).node)?(a="",b&4&&(a+="r"),b&2&&(a+="w"),b&1&&(a+="x"),c=a&&Vb(d,a)?-2:0):c=-44}return c}catch(f){return"undefined"!==typeof Y&&f instanceof P||K(f),-f.Pa}},y:function(a,b){try{return a=A(a),fa(a,b),0}catch(c){return"undefined"!==typeof Y&&c instanceof P||K(c),-c.Pa}},G:function(a){try{return a=A(a),
jc(a),0}catch(b){return"undefined"!==typeof Y&&b instanceof P||K(b),-b.Pa}},z:function(a,b){try{var c=T[a];if(!c)throw new P(8);fa(c.node,b);return 0}catch(d){return"undefined"!==typeof Y&&d instanceof P||K(d),-d.Pa}},H:function(a){try{var b=T[a];if(!b)throw new P(8);jc(b.node);return 0}catch(c){return"undefined"!==typeof Y&&c instanceof P||K(c),-c.Pa}},b:function(a,b,c){Xc=c;try{var d=Z(a);switch(b){case 0:var f=Yc();return 0>f?-28:v(d.path,d.flags,0,f).fd;case 1:case 2:return 0;case 3:return d.flags;
case 4:return f=Yc(),d.flags|=f,0;case 12:return f=Yc(),Ma[f+0>>1]=2,0;case 13:case 14:return 0;case 16:case 8:return-28;case 9:return L[cd()>>2]=28,-1;default:return-28}}catch(g){return"undefined"!==typeof Y&&g instanceof P||K(g),-g.Pa}},C:function(a,b){try{var c=Z(a);return Wc(hc,c.path,b)}catch(d){return"undefined"!==typeof Y&&d instanceof P||K(d),-d.Pa}},l:function(a,b,c){try{var d=T[a];if(!d)throw new P(8);if(0===(d.flags&2097155))throw new P(28);Mc(d.node,c);return 0}catch(f){return"undefined"!==
typeof Y&&f instanceof P||K(f),-f.Pa}},j:function(a,b){try{if(0===b)return-28;if(b<ba("/")+1)return-68;k("/",m,a,b);return a}catch(c){return"undefined"!==typeof Y&&c instanceof P||K(c),-c.Pa}},F:function(){return 0},d:function(){return 42},x:function(a,b){try{return a=A(a),Wc(ic,a,b)}catch(c){return"undefined"!==typeof Y&&c instanceof P||K(c),-c.Pa}},A:function(a,b){try{return a=A(a),a=r(a),"/"===a[a.length-1]&&(a=a.substr(0,a.length-1)),X(a,b),0}catch(c){return"undefined"!==typeof Y&&c instanceof
P||K(c),-c.Pa}},w:function(a,b,c,d,f,g){try{a:{g<<=12;var n=!1;if(0!==(d&16)&&0!==a%16384)var t=-28;else{if(0!==(d&32)){var w=dd(16384,b);if(!w){t=-48;break a}ed(w,0,b);n=!0}else{var u=T[f];if(!u){t=-8;break a}var C=g;if(0!==(c&2)&&0===(d&2)&&2!==(u.flags&2097155))throw new P(2);if(1===(u.flags&2097155))throw new P(2);if(!u.Na.hb)throw new P(43);var H=u.Na.hb(u,a,b,C,c,d);w=H.Ob;n=H.kb}Vc[w]={Lb:w,Kb:b,kb:n,fd:f,Nb:c,flags:d,offset:g};t=w}}return t}catch(aa){return"undefined"!==typeof Y&&aa instanceof
P||K(aa),-aa.Pa}},v:function(a,b){try{if(-1===(a|0)||0===b)var c=-28;else{var d=Vc[a];if(d&&b===d.Kb){var f=T[d.fd];if(f&&d.Nb&2){var g=d.flags,n=d.offset,t=m.slice(a,a+b);f&&f.Na.ib&&f.Na.ib(f,t,n,b,g)}Vc[a]=null;d.kb&&oa(d.Lb)}c=0}return c}catch(w){return"undefined"!==typeof Y&&w instanceof P||K(w),-w.Pa}},u:function(a,b,c){Xc=c;try{var d=A(a),f=c?Yc():0;return v(d,b,f).fd}catch(g){return"undefined"!==typeof Y&&g instanceof P||K(g),-g.Pa}},I:function(a,b,c){try{a=A(a);if(0>=c)var d=-28;else{var f=
Rb(a),g=Math.min(c,ba(f)),n=z[b+g];k(f,m,b,c+1);z[b+g]=n;d=g}return d}catch(t){return"undefined"!==typeof Y&&t instanceof P||K(t),-t.Pa}},D:function(a){try{a=A(a);var b=W(a,{parent:!0}).node,c=Ab(a),d=Mb(b,c),f=$b(b,c,!0);if(f)throw new P(f);if(!b.Ma.rmdir)throw new P(63);if(d.ab)throw new P(10);try{V.willDeletePath&&V.willDeletePath(a)}catch(g){I("FS.trackingDelegate['willDeletePath']('"+a+"') threw an exception: "+g.message)}b.Ma.rmdir(b,c);Ub(d);try{if(V.onDeletePath)V.onDeletePath(a)}catch(g){I("FS.trackingDelegate['onDeletePath']('"+
a+"') threw an exception: "+g.message)}return 0}catch(g){return"undefined"!==typeof Y&&g instanceof P||K(g),-g.Pa}},e:function(a,b){try{return a=A(a),Wc(hc,a,b)}catch(c){return"undefined"!==typeof Y&&c instanceof P||K(c),-c.Pa}},J:function(a){try{return a=A(a),ua(a),0}catch(b){return"undefined"!==typeof Y&&b instanceof P||K(b),-b.Pa}},n:function(a,b,c){m.copyWithin(a,b,b+c)},c:function(a){a>>>=0;var b=m.length;if(2147483648<a)return!1;for(var c=1;4>=c;c*=2){var d=b*(1+.2/c);d=Math.min(d,a+100663296);
d=Math.max(16777216,a,d);0<d%65536&&(d+=65536-d%65536);a:{try{Pa.grow(Math.min(2147483648,d)-Ya.byteLength+65535>>>16);Za();var f=1;break a}catch(g){}f=void 0}if(f)return!0}return!1},r:function(a){for(var b=Zc();Zc()-b<a;);},p:function(a,b){try{var c=0;ad().forEach(function(d,f){var g=b+c;f=L[a+4*f>>2]=g;for(g=0;g<d.length;++g)z[f++>>0]=d.charCodeAt(g);z[f>>0]=0;c+=d.length+1});return 0}catch(d){return"undefined"!==typeof Y&&d instanceof P||K(d),d.Pa}},q:function(a,b){try{var c=ad();L[a>>2]=c.length;
var d=0;c.forEach(function(f){d+=f.length+1});L[b>>2]=d;return 0}catch(f){return"undefined"!==typeof Y&&f instanceof P||K(f),f.Pa}},f:function(a){try{var b=Z(a);la(b);return 0}catch(c){return"undefined"!==typeof Y&&c instanceof P||K(c),c.Pa}},o:function(a,b){try{var c=Z(a);z[b>>0]=c.tty?2:R(c.mode)?3:40960===(c.mode&61440)?7:4;return 0}catch(d){return"undefined"!==typeof Y&&d instanceof P||K(d),d.Pa}},h:function(a,b,c,d){try{a:{for(var f=Z(a),g=a=0;g<c;g++){var n=L[b+(8*g+4)>>2],t=Qc(f,z,L[b+8*g>>
2],n,void 0);if(0>t){var w=-1;break a}a+=t;if(t<n)break}w=a}L[d>>2]=w;return 0}catch(u){return"undefined"!==typeof Y&&u instanceof P||K(u),u.Pa}},m:function(a,b,c,d,f){try{var g=Z(a);a=4294967296*c+(b>>>0);if(-9007199254740992>=a||9007199254740992<=a)return-61;Pc(g,a,d);M=[g.position>>>0,(N=g.position,1<=+Math.abs(N)?0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];L[f>>2]=M[0];L[f+4>>2]=M[1];g.ob&&0===a&&0===d&&(g.ob=null);return 0}catch(n){return"undefined"!==
typeof Y&&n instanceof P||K(n),n.Pa}},i:function(a){try{var b=Z(a);return b.Na&&b.Na.fsync?-b.Na.fsync(b):0}catch(c){return"undefined"!==typeof Y&&c instanceof P||K(c),c.Pa}},E:function(a,b,c,d){try{a:{for(var f=Z(a),g=a=0;g<c;g++){var n=ka(f,z,L[b+8*g>>2],L[b+(8*g+4)>>2],void 0);if(0>n){var t=-1;break a}a+=n}t=a}L[d>>2]=t;return 0}catch(w){return"undefined"!==typeof Y&&w instanceof P||K(w),w.Pa}},g:function(a){var b=Date.now();L[a>>2]=b/1E3|0;L[a+4>>2]=b%1E3*1E3|0;return 0},B:function(a){switch(a){case 30:return 16384;
case 85:return 131072;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:return 200809;case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:case 80:case 81:case 79:return-1;
case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1E3;case 89:return 700;case 71:return 256;
case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:return"object"===typeof navigator?navigator.hardwareConcurrency||1:1}L[cd()>>2]=28;return-1},K:function(a){var b=Date.now()/1E3|0;a&&(L[a>>2]=b);return b},s:function(a,b){if(b){var c=b+8;b=1E3*L[c>>2];b+=L[c+4>>2]/1E3}else b=Date.now();a=A(a);try{var d=W(a,{Ya:!0}).node;d.Ma.Ta(d,{timestamp:Math.max(b,b)});var f=0}catch(g){if(!(g instanceof P)){b:{f=Error();if(!f.stack){try{throw Error();
}catch(n){f=n}if(!f.stack){f="(no stack trace available)";break b}}f=f.stack.toString()}e.extraStackTrace&&(f+="\n"+e.extraStackTrace());f=ob(f);throw g+" : "+f;}f=g.Pa;L[cd()>>2]=f;f=-1}return f}};
(function(){function a(f){e.asm=f.exports;Pa=e.asm.L;Za();J=e.asm.Da;fb--;e.monitorRunDependencies&&e.monitorRunDependencies(fb);0==fb&&(null!==gb&&(clearInterval(gb),gb=null),hb&&(f=hb,hb=null,f()))}function b(f){a(f.instance)}function c(f){return mb().then(function(g){return WebAssembly.instantiate(g,d)}).then(f,function(g){I("failed to asynchronously prepare wasm: "+g);K(g)})}var d={a:fd};fb++;e.monitorRunDependencies&&e.monitorRunDependencies(fb);if(e.instantiateWasm)try{return e.instantiateWasm(d,
a)}catch(f){return I("Module.instantiateWasm callback failed with error: "+f),!1}(function(){return La||"function"!==typeof WebAssembly.instantiateStreaming||jb()||ib("file://")||"function"!==typeof fetch?c(b):fetch(O,{credentials:"same-origin"}).then(function(f){return WebAssembly.instantiateStreaming(f,d).then(b,function(g){I("wasm streaming compile failed: "+g);I("falling back to ArrayBuffer instantiation");return c(b)})})})();return{}})();
var db=e.___wasm_call_ctors=function(){return(db=e.___wasm_call_ctors=e.asm.M).apply(null,arguments)},ed=e._memset=function(){return(ed=e._memset=e.asm.N).apply(null,arguments)};e._sqlite3_free=function(){return(e._sqlite3_free=e.asm.O).apply(null,arguments)};var cd=e.___errno_location=function(){return(cd=e.___errno_location=e.asm.P).apply(null,arguments)};e._sqlite3_finalize=function(){return(e._sqlite3_finalize=e.asm.Q).apply(null,arguments)};
e._sqlite3_reset=function(){return(e._sqlite3_reset=e.asm.R).apply(null,arguments)};e._sqlite3_clear_bindings=function(){return(e._sqlite3_clear_bindings=e.asm.S).apply(null,arguments)};e._sqlite3_value_blob=function(){return(e._sqlite3_value_blob=e.asm.T).apply(null,arguments)};e._sqlite3_value_text=function(){return(e._sqlite3_value_text=e.asm.U).apply(null,arguments)};e._sqlite3_value_bytes=function(){return(e._sqlite3_value_bytes=e.asm.V).apply(null,arguments)};
e._sqlite3_value_double=function(){return(e._sqlite3_value_double=e.asm.W).apply(null,arguments)};e._sqlite3_value_int=function(){return(e._sqlite3_value_int=e.asm.X).apply(null,arguments)};e._sqlite3_value_type=function(){return(e._sqlite3_value_type=e.asm.Y).apply(null,arguments)};e._sqlite3_result_blob=function(){return(e._sqlite3_result_blob=e.asm.Z).apply(null,arguments)};e._sqlite3_result_double=function(){return(e._sqlite3_result_double=e.asm._).apply(null,arguments)};
e._sqlite3_result_error=function(){return(e._sqlite3_result_error=e.asm.$).apply(null,arguments)};e._sqlite3_result_int=function(){return(e._sqlite3_result_int=e.asm.aa).apply(null,arguments)};e._sqlite3_result_int64=function(){return(e._sqlite3_result_int64=e.asm.ba).apply(null,arguments)};e._sqlite3_result_null=function(){return(e._sqlite3_result_null=e.asm.ca).apply(null,arguments)};e._sqlite3_result_text=function(){return(e._sqlite3_result_text=e.asm.da).apply(null,arguments)};
e._sqlite3_step=function(){return(e._sqlite3_step=e.asm.ea).apply(null,arguments)};e._sqlite3_column_count=function(){return(e._sqlite3_column_count=e.asm.fa).apply(null,arguments)};e._sqlite3_data_count=function(){return(e._sqlite3_data_count=e.asm.ga).apply(null,arguments)};e._sqlite3_column_blob=function(){return(e._sqlite3_column_blob=e.asm.ha).apply(null,arguments)};e._sqlite3_column_bytes=function(){return(e._sqlite3_column_bytes=e.asm.ia).apply(null,arguments)};
e._sqlite3_column_double=function(){return(e._sqlite3_column_double=e.asm.ja).apply(null,arguments)};e._sqlite3_column_text=function(){return(e._sqlite3_column_text=e.asm.ka).apply(null,arguments)};e._sqlite3_column_type=function(){return(e._sqlite3_column_type=e.asm.la).apply(null,arguments)};e._sqlite3_column_name=function(){return(e._sqlite3_column_name=e.asm.ma).apply(null,arguments)};e._sqlite3_bind_blob=function(){return(e._sqlite3_bind_blob=e.asm.na).apply(null,arguments)};
e._sqlite3_bind_double=function(){return(e._sqlite3_bind_double=e.asm.oa).apply(null,arguments)};e._sqlite3_bind_int=function(){return(e._sqlite3_bind_int=e.asm.pa).apply(null,arguments)};e._sqlite3_bind_text=function(){return(e._sqlite3_bind_text=e.asm.qa).apply(null,arguments)};e._sqlite3_bind_parameter_index=function(){return(e._sqlite3_bind_parameter_index=e.asm.ra).apply(null,arguments)};e._sqlite3_sql=function(){return(e._sqlite3_sql=e.asm.sa).apply(null,arguments)};
e._sqlite3_normalized_sql=function(){return(e._sqlite3_normalized_sql=e.asm.ta).apply(null,arguments)};e._sqlite3_errmsg=function(){return(e._sqlite3_errmsg=e.asm.ua).apply(null,arguments)};e._sqlite3_exec=function(){return(e._sqlite3_exec=e.asm.va).apply(null,arguments)};e._sqlite3_prepare_v2=function(){return(e._sqlite3_prepare_v2=e.asm.wa).apply(null,arguments)};e._sqlite3_changes=function(){return(e._sqlite3_changes=e.asm.xa).apply(null,arguments)};
e._sqlite3_close_v2=function(){return(e._sqlite3_close_v2=e.asm.ya).apply(null,arguments)};e._sqlite3_create_function_v2=function(){return(e._sqlite3_create_function_v2=e.asm.za).apply(null,arguments)};e._sqlite3_open=function(){return(e._sqlite3_open=e.asm.Aa).apply(null,arguments)};var ca=e._malloc=function(){return(ca=e._malloc=e.asm.Ba).apply(null,arguments)},oa=e._free=function(){return(oa=e._free=e.asm.Ca).apply(null,arguments)};
e._RegisterExtensionFunctions=function(){return(e._RegisterExtensionFunctions=e.asm.Ea).apply(null,arguments)};
var xb=e.__get_tzname=function(){return(xb=e.__get_tzname=e.asm.Fa).apply(null,arguments)},vb=e.__get_daylight=function(){return(vb=e.__get_daylight=e.asm.Ga).apply(null,arguments)},ub=e.__get_timezone=function(){return(ub=e.__get_timezone=e.asm.Ha).apply(null,arguments)},pa=e.stackSave=function(){return(pa=e.stackSave=e.asm.Ia).apply(null,arguments)},ra=e.stackRestore=function(){return(ra=e.stackRestore=e.asm.Ja).apply(null,arguments)},y=e.stackAlloc=function(){return(y=e.stackAlloc=e.asm.Ka).apply(null,
arguments)},dd=e._memalign=function(){return(dd=e._memalign=e.asm.La).apply(null,arguments)};e.cwrap=function(a,b,c,d){c=c||[];var f=c.every(function(g){return"number"===g});return"string"!==b&&f&&!d?Ra(a):function(){return Sa(a,b,c,arguments)}};e.UTF8ToString=A;e.stackSave=pa;e.stackRestore=ra;e.stackAlloc=y;var gd;hb=function hd(){gd||id();gd||(hb=hd)};
function id(){function a(){if(!gd&&(gd=!0,e.calledRun=!0,!Qa)){e.noFSInit||Sc||(Sc=!0,Rc(),e.stdin=e.stdin,e.stdout=e.stdout,e.stderr=e.stderr,e.stdin?Tc("stdin",e.stdin):fc("/dev/tty","/dev/stdin"),e.stdout?Tc("stdout",null,e.stdout):fc("/dev/tty","/dev/stdout"),e.stderr?Tc("stderr",null,e.stderr):fc("/dev/tty1","/dev/stderr"),v("/dev/stdin",0),v("/dev/stdout",1),v("/dev/stderr",1));nb(ab);Qb=!1;nb(bb);if(e.onRuntimeInitialized)e.onRuntimeInitialized();if(e.postRun)for("function"==typeof e.postRun&&
(e.postRun=[e.postRun]);e.postRun.length;){var b=e.postRun.shift();cb.unshift(b)}nb(cb)}}if(!(0<fb)){if(e.preRun)for("function"==typeof e.preRun&&(e.preRun=[e.preRun]);e.preRun.length;)eb();nb($a);0<fb||(e.setStatus?(e.setStatus("Running..."),setTimeout(function(){setTimeout(function(){e.setStatus("")},1);a()},1)):a())}}e.run=id;if(e.preInit)for("function"==typeof e.preInit&&(e.preInit=[e.preInit]);0<e.preInit.length;)e.preInit.pop()();noExitRuntime=!0;id();


        // The shell-pre.js and emcc-generated code goes above
        return Module;
    }); // The end of the promise being returned

  return initSqlJsPromise;
} // The end of our initSqlJs function

// This bit below is copied almost exactly from what you get when you use the MODULARIZE=1 flag with emcc
// However, we don't want to use the emcc modularization. See shell-pre.js
if (typeof exports === 'object' && typeof module === 'object'){
    module.exports = initSqlJs;
    // This will allow the module to be used in ES6 or CommonJS
    module.exports.default = initSqlJs;
}
else if (typeof define === 'function' && define['amd']) {
    define([], function() { return initSqlJs; });
}
else if (typeof exports === 'object'){
    exports["Module"] = initSqlJs;
}
/* global initSqlJs */
/* eslint-env worker */
/* eslint no-restricted-globals: ["error"] */

"use strict";

var db;

function onModuleReady(SQL) {
    function createDb(data) {
        if (db != null) db.close();
        db = new SQL.Database(data);
        return db;
    }

    var buff; var data; var result;
    data = this["data"];
    switch (data && data["action"]) {
        case "open":
            buff = data["buffer"];
            createDb(buff && new Uint8Array(buff));
            return postMessage({
                id: data["id"],
                ready: true
            });
        case "exec":
            if (db === null) {
                createDb();
            }
            if (!data["sql"]) {
                throw "exec: Missing query string";
            }
            return postMessage({
                id: data["id"],
                results: db.exec(data["sql"], data["params"])
            });
        case "each":
            if (db === null) {
                createDb();
            }
            var callback = function callback(row) {
                return postMessage({
                    id: data["id"],
                    row: row,
                    finished: false
                });
            };
            var done = function done() {
                return postMessage({
                    id: data["id"],
                    finished: true
                });
            };
            return db.each(data["sql"], data["params"], callback, done);
        case "export":
            buff = db["export"]();
            result = {
                id: data["id"],
                buffer: buff
            };
            try {
                return postMessage(result, [result]);
            } catch (error) {
                return postMessage(result);
            }
        case "close":
            if (db) {
                db.close();
            }
            return postMessage({
                id: data["id"]
            });
        default:
            throw new Error("Invalid action : " + (data && data["action"]));
    }
}

function onError(err) {
    return postMessage({
        id: this["data"]["id"],
        error: err["message"]
    });
}

if (typeof importScripts === "function") {
    db = null;
    var sqlModuleReady = initSqlJs();
    self.onmessage = function onmessage(event) {
        return sqlModuleReady
            .then(onModuleReady.bind(event))
            .catch(onError.bind(event));
    };
}
