/* filePath fetchtemp/scripts/require_e1484b20.js*/

/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.11 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, setTimeout, opera */

var requirejs, require, define;
(function (global) {
    var req, s, head, baseElement, dataMain, src,
        interactiveScript, currentlyAddingScript, mainScript, subPath,
        version = '2.1.11',
        commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//,
        op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty,
        ap = Array.prototype,
        apsp = ap.splice,
        isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document),
        isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
        //PS3 indicates loaded and complete, but need to wait for complete
        //specifically. Sequence is 'loading', 'loaded', execution,
        // then 'complete'. The UA check is unfortunate, but not sure how
        //to feature test w/o causing perf issues.
        readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
                      /^complete$/ : /^(complete|loaded)$/,
        defContextName = '_',
        //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
        contexts = {},
        cfg = {},
        globalDefQueue = [],
        useInteractive = false;

    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }

    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }

    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
    }

    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value === 'object' && value &&
                        !isArray(value) && !isFunction(value) &&
                        !(value instanceof RegExp)) {

                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force, deepStringMixin);
                    } else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }

    //Similar to Function.prototype.bind, but the 'this' object is specified
    //first, since it is easier to read/figure out what 'this' will be.
    function bind(obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
        };
    }

    function scripts() {
        return document.getElementsByTagName('script');
    }

    function defaultOnError(err) {
        throw err;
    }

    //Allow getting a global that is expressed in
    //dot notation, like 'a.b.c'.
    function getGlobal(value) {
        if (!value) {
            return value;
        }
        var g = global;
        each(value.split('.'), function (part) {
            g = g[part];
        });
        return g;
    }

    /**
     * Constructs an error with a pointer to an URL with more information.
     * @param {String} id the error ID that maps to an ID on a web page.
     * @param {String} message human readable error.
     * @param {Error} [err] the original error, if there is one.
     *
     * @returns {Error}
     */
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
        }
        return e;
    }

    if (typeof define !== 'undefined') {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }

    if (typeof requirejs !== 'undefined') {
        if (isFunction(requirejs)) {
            //Do not overwrite and existing requirejs instance.
            return;
        }
        cfg = requirejs;
        requirejs = undefined;
    }

    //Allow for a require config object
    if (typeof require !== 'undefined' && !isFunction(require)) {
        //assume it is a config object.
        cfg = require;
        require = undefined;
    }

    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers,
            checkLoadedTimeoutId,
            config = {
                //Defaults. Do not set a default for map
                //config to speed up normalize(), which
                //will run faster if there is no default.
                waitSeconds: 7,
                baseUrl: './',
                paths: {},
                bundles: {},
                pkgs: {},
                shim: {},
                config: {}
            },
            registry = {},
            //registry of just enabled modules, to speed
            //cycle breaking code when lots of modules
            //are registered, but not activated.
            enabledRegistry = {},
            undefEvents = {},
            defQueue = [],
            defined = {},
            urlFetched = {},
            bundlesMap = {},
            requireCounter = 1,
            unnormalizedCounter = 1;

        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array} ary the array of path segments.
         */
        function trimDots(ary) {
            var i, part, length = ary.length;
            for (i = 0; i < length; i++) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                        //End of the line. Keep at least one non-dot
                        //path segment at the front so it can be mapped
                        //correctly to disk. Otherwise, there is likely
                        //no path mapping for a path starting with '..'.
                        //This can still fail, but catches the most reasonable
                        //uses of ..
                        break;
                    } else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @param {Boolean} applyMap apply the map config to the value. Should
         * only be done if this normalization is for a dependency ID.
         * @returns {String} normalized name
         */
        function normalize(name, baseName, applyMap) {
            var pkgMain, mapValue, nameParts, i, j, nameSegment, lastIndex,
                foundMap, foundI, foundStarMap, starI,
                baseParts = baseName && baseName.split('/'),
                normalizedBaseParts = baseParts,
                map = config.map,
                starMap = map && map['*'];

            //Adjust any relative paths.
            if (name && name.charAt(0) === '.') {
                //If have a base name, try to normalize against it,
                //otherwise, assume it is a top-level require that will
                //be relative to baseUrl in the end.
                if (baseName) {
                    //Convert baseName to array, and lop off the last part,
                    //so that . matches that 'directory' and not name of the baseName's
                    //module. For instance, baseName of 'one/two/three', maps to
                    //'one/two/three.js', but we want the directory, 'one/two' for
                    //this normalization.
                    normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                    name = name.split('/');
                    lastIndex = name.length - 1;

                    // If wanting node ID compatibility, strip .js from end
                    // of IDs. Have to do this here, and not in nameToUrl
                    // because node allows either .js or non .js to map
                    // to same file.
                    if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                        name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                    }

                    name = normalizedBaseParts.concat(name);
                    trimDots(name);
                    name = name.join('/');
                } else if (name.indexOf('./') === 0) {
                    // No baseName, so this is ID is resolved relative
                    // to baseUrl, pull off the leading dot.
                    name = name.substring(2);
                }
            }

            //Apply map config if available.
            if (applyMap && map && (baseParts || starMap)) {
                nameParts = name.split('/');

                outerLoop: for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');

                    if (baseParts) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = getOwn(map, baseParts.slice(0, j).join('/'));

                            //baseName segment has config, find if it has one for
                            //this name.
                            if (mapValue) {
                                mapValue = getOwn(mapValue, nameSegment);
                                if (mapValue) {
                                    //Match, update name to the new value.
                                    foundMap = mapValue;
                                    foundI = i;
                                    break outerLoop;
                                }
                            }
                        }
                    }

                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                        foundStarMap = getOwn(starMap, nameSegment);
                        starI = i;
                    }
                }

                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }

                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
                }
            }

            // If the name points to a package's name, use
            // the package main instead.
            pkgMain = getOwn(config.pkgs, name);

            return pkgMain ? pkgMain : name;
        }

        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function (scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                            scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }
        }

        function hasPathFallback(id) {
            var pathConfig = getOwn(config.paths, id);
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                //Pop off the first array value, since it failed, and
                //retry
                pathConfig.shift();
                context.require.undef(id);
                context.require([id]);
                return true;
            }
        }

        //Turns a plugin!resource to [plugin, resource]
        //with the plugin being undefined if the name
        //did not have a plugin prefix.
        function splitPrefix(name) {
            var prefix,
                index = name ? name.indexOf('!') : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
        }

        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String} name the module name
         * @param {String} [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         * @param {Boolean} isNormalized: is the ID already normalized.
         * This is true if this call is done for a define() module ID.
         * @param {Boolean} applyMap: apply the map config to the ID.
         * Should only be true if this map is for a dependency.
         *
         * @returns {Object}
         */
        function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
            var url, pluginModule, suffix, nameParts,
                prefix = null,
                parentName = parentModuleMap ? parentModuleMap.name : null,
                originalName = name,
                isDefine = true,
                normalizedName = '';

            //If no name, then it means it is a require call, generate an
            //internal name.
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
            }

            nameParts = splitPrefix(name);
            prefix = nameParts[0];
            name = nameParts[1];

            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = getOwn(defined, prefix);
            }

            //Account for relative paths if there is a base name.
            if (name) {
                if (prefix) {
                    if (pluginModule && pluginModule.normalize) {
                        //Plugin is loaded, use its normalize method.
                        normalizedName = pluginModule.normalize(name, function (name) {
                            return normalize(name, parentName, applyMap);
                        });
                    } else {
                        normalizedName = normalize(name, parentName, applyMap);
                    }
                } else {
                    //A regular module.
                    normalizedName = normalize(name, parentName, applyMap);

                    //Normalized name may be a plugin ID due to map config
                    //application in normalize. The map config values must
                    //already be normalized, so do not need to redo that part.
                    nameParts = splitPrefix(normalizedName);
                    prefix = nameParts[0];
                    normalizedName = nameParts[1];
                    isNormalized = true;

                    url = context.nameToUrl(normalizedName);
                }
            }

            //If the id is a plugin id that cannot be determined if it needs
            //normalization, stamp it with a unique ID so two matching relative
            //ids that may conflict can be separate.
            suffix = prefix && !pluginModule && !isNormalized ?
                     '_unnormalized' + (unnormalizedCounter += 1) :
                     '';

            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !!suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                        prefix + '!' + normalizedName :
                        normalizedName) + suffix
            };
        }

        function getModule(depMap) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
            }

            return mod;
        }

        function on(depMap, name, fn) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (hasProp(defined, id) &&
                    (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
                }
            } else {
                mod = getModule(depMap);
                if (mod.error && name === 'error') {
                    fn(mod.error);
                } else {
                    mod.on(name, fn);
                }
            }
        }

        function onError(err, errback) {
            var ids = err.requireModules,
                notified = false;

            if (errback) {
                errback(err);
            } else {
                each(ids, function (id) {
                    var mod = getOwn(registry, id);
                    if (mod) {
                        //Set error on module, so it skips timeout checks.
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                        }
                    }
                });

                if (!notified) {
                    req.onError(err);
                }
            }
        }

        /**
         * Internal method to transfer globalQueue items to this context's
         * defQueue.
         */
        function takeGlobalQueue() {
            //Push all the globalDefQueue items into the context's defQueue
            if (globalDefQueue.length) {
                //Array splice in the values since the context code has a
                //local var ref to defQueue, so cannot just reassign the one
                //on context.
                apsp.apply(defQueue,
                           [defQueue.length, 0].concat(globalDefQueue));
                globalDefQueue = [];
            }
        }

        handlers = {
            'require': function (mod) {
                if (mod.require) {
                    return mod.require;
                } else {
                    return (mod.require = context.makeRequire(mod.map));
                }
            },
            'exports': function (mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    if (mod.exports) {
                        return (defined[mod.map.id] = mod.exports);
                    } else {
                        return (mod.exports = defined[mod.map.id] = {});
                    }
                }
            },
            'module': function (mod) {
                if (mod.module) {
                    return mod.module;
                } else {
                    return (mod.module = {
                        id: mod.map.id,
                        uri: mod.map.url,
                        config: function () {
                            return  getOwn(config.config, mod.map.id) || {};
                        },
                        exports: mod.exports || (mod.exports = {})
                    });
                }
            }
        };

        function cleanRegistry(id) {
            //Clean up machinery used for waiting modules.
            delete registry[id];
            delete enabledRegistry[id];
        }

        function breakCycle(mod, traced, processed) {
            var id = mod.map.id;

            if (mod.error) {
                mod.emit('error', mod.error);
            } else {
                traced[id] = true;
                each(mod.depMaps, function (depMap, i) {
                    var depId = depMap.id,
                        dep = getOwn(registry, depId);

                    //Only force things that have not completed
                    //being defined, so still in the registry,
                    //and only if it has not been matched up
                    //in the module already.
                    if (dep && !mod.depMatched[i] && !processed[depId]) {
                        if (getOwn(traced, depId)) {
                            mod.defineDep(i, defined[depId]);
                            mod.check(); //pass false?
                        } else {
                            breakCycle(dep, traced, processed);
                        }
                    }
                });
                processed[id] = true;
            }
        }

        function checkLoaded() {
            var err, usingPathFallback,
                waitInterval = config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                noLoads = [],
                reqCalls = [],
                stillLoading = false,
                needCycleCheck = true;

            //Do not bother if this call was a result of a cycle break.
            if (inCheckLoaded) {
                return;
            }

            inCheckLoaded = true;

            //Figure out the state of all the modules.
            eachProp(enabledRegistry, function (mod) {
                var map = mod.map,
                    modId = map.id;

                //Skip things that are not enabled or in error state.
                if (!mod.enabled) {
                    return;
                }

                if (!map.isDefine) {
                    reqCalls.push(mod);
                }

                if (!mod.error) {
                    //If the module should be executed, and it has not
                    //been inited and time is up, remember it.
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                        } else {
                            noLoads.push(modId);
                            removeScript(modId);
                        }
                    } else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            //No reason to keep looking for unfinished
                            //loading. If the only stillLoading is a
                            //plugin resource though, keep going,
                            //because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return (needCycleCheck = false);
                        }
                    }
                }
            });

            if (expired && noLoads.length) {
                //If wait time expired, throw error of unloaded modules.
                err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
            }

            //Not expired, check for a cycle.
            if (needCycleCheck) {
                each(reqCalls, function (mod) {
                    breakCycle(mod, {}, {});
                });
            }

            //If still waiting on loads, and the waiting load is something
            //other than a plugin resource, or there are still outstanding
            //scripts, then just try back later.
            if ((!expired || usingPathFallback) && stillLoading) {
                //Something is still waiting to load. Wait for it, but only
                //if a timeout is not already in effect.
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function () {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                    }, 50);
                }
            }

            inCheckLoaded = false;
        }

        Module = function (map) {
            this.events = getOwn(undefEvents, map.id) || {};
            this.map = map;
            this.shim = getOwn(config.shim, map.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0;

            /* this.exports this.factory
               this.depMaps = [],
               this.enabled, this.fetched
            */
        };

        Module.prototype = {
            init: function (depMaps, factory, errback, options) {
                options = options || {};

                //Do not do more inits if already done. Can happen if there
                //are multiple define calls for the same module. That is not
                //a normal, common case, but it is also not unexpected.
                if (this.inited) {
                    return;
                }

                this.factory = factory;

                if (errback) {
                    //Register for errors on this module.
                    this.on('error', errback);
                } else if (this.events.error) {
                    //If no errback already, but there are error listeners
                    //on this module, set up an errback to pass to the deps.
                    errback = bind(this, function (err) {
                        this.emit('error', err);
                    });
                }

                //Do a copy of the dependency array, so that
                //source inputs are not modified. For example
                //"shim" deps are passed in here directly, and
                //doing a direct modification of the depMaps array
                //would affect that config.
                this.depMaps = depMaps && depMaps.slice(0);

                this.errback = errback;

                //Indicate this module has be initialized
                this.inited = true;

                this.ignore = options.ignore;

                //Could have option to init this module in enabled mode,
                //or could have been previously marked as enabled. However,
                //the dependencies are not known until init is called. So
                //if enabled previously, now trigger dependencies as enabled.
                if (options.enabled || this.enabled) {
                    //Enable this module and dependencies.
                    //Will call this.check()
                    this.enable();
                } else {
                    this.check();
                }
            },

            defineDep: function (i, depExports) {
                //Because of cycles, defined callback for a given
                //export can be called more than once.
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
                }
            },

            fetch: function () {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;

                context.startTime = (new Date()).getTime();

                var map = this.map;

                //If the manager is for a plugin managed resource,
                //ask the plugin to load it now.
                if (this.shim) {
                    context.makeRequire(this.map, {
                        enableBuildCallback: true
                    })(this.shim.deps || [], bind(this, function () {
                        return map.prefix ? this.callPlugin() : this.load();
                    }));
                } else {
                    //Regular dependency.
                    return map.prefix ? this.callPlugin() : this.load();
                }
            },

            load: function () {
                var url = this.map.url;

                //Regular dependency.
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
                }
            },

            /**
             * Checks if the module is ready to define itself, and if so,
             * define it.
             */
            check: function () {
                if (!this.enabled || this.enabling) {
                    return;
                }

                var err, cjsModule,
                    id = this.map.id,
                    depExports = this.depExports,
                    exports = this.exports,
                    factory = this.factory;

                if (!this.inited) {
                    this.fetch();
                } else if (this.error) {
                    this.emit('error', this.error);
                } else if (!this.defining) {
                    //The factory could trigger another require call
                    //that would result in checking this module to
                    //define itself again. If already in the process
                    //of doing that, skip this work.
                    this.defining = true;

                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            //If there is an error listener, favor passing
                            //to that instead of throwing an error. However,
                            //only do it for define()'d  modules. require
                            //errbacks should not be called for failures in
                            //their callbacks (#699). However if a global
                            //onError is set, use that.
                            if ((this.events.error && this.map.isDefine) ||
                                req.onError !== defaultOnError) {
                                try {
                                    exports = context.execCb(id, factory, depExports, exports);
                                } catch (e) {
                                    err = e;
                                }
                            } else {
                                exports = context.execCb(id, factory, depExports, exports);
                            }

                            // Favor return value over exports. If node/cjs in play,
                            // then will not have a return value anyway. Favor
                            // module.exports assignment over exports object.
                            if (this.map.isDefine && exports === undefined) {
                                cjsModule = this.module;
                                if (cjsModule) {
                                    exports = cjsModule.exports;
                                } else if (this.usingExports) {
                                    //exports already set the defined value.
                                    exports = this.exports;
                                }
                            }

                            if (err) {
                                err.requireMap = this.map;
                                err.requireModules = this.map.isDefine ? [this.map.id] : null;
                                err.requireType = this.map.isDefine ? 'define' : 'require';
                                return onError((this.error = err));
                            }

                        } else {
                            //Just a literal value
                            exports = factory;
                        }

                        this.exports = exports;

                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;

                            if (req.onResourceLoad) {
                                req.onResourceLoad(context, this.map, this.depMaps);
                            }
                        }

                        //Clean up
                        cleanRegistry(id);

                        this.defined = true;
                    }

                    //Finished the define stage. Allow calling check again
                    //to allow define notifications below in the case of a
                    //cycle.
                    this.defining = false;

                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit('defined', this.exports);
                        this.defineEmitComplete = true;
                    }

                }
            },

            callPlugin: function () {
                var map = this.map,
                    id = map.id,
                    //Map already normalized the prefix.
                    pluginMap = makeModuleMap(map.prefix);

                //Mark this as a dependency for this plugin, so it
                //can be traced for cycles.
                this.depMaps.push(pluginMap);

                on(pluginMap, 'defined', bind(this, function (plugin) {
                    var load, normalizedMap, normalizedMod,
                        bundleId = getOwn(bundlesMap, this.map.id),
                        name = this.map.name,
                        parentName = this.map.parentMap ? this.map.parentMap.name : null,
                        localRequire = context.makeRequire(map.parentMap, {
                            enableBuildCallback: true
                        });

                    //If current map is not normalized, wait for that
                    //normalized name to load instead of continuing.
                    if (this.map.unnormalized) {
                        //Normalize the ID if the plugin allows it.
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function (name) {
                                return normalize(name, parentName, true);
                            }) || '';
                        }

                        //prefix and name should already be normalized, no need
                        //for applying map config again either.
                        normalizedMap = makeModuleMap(map.prefix + '!' + name,
                                                      this.map.parentMap);
                        on(normalizedMap,
                            'defined', bind(this, function (value) {
                                this.init([], function () { return value; }, null, {
                                    enabled: true,
                                    ignore: true
                                });
                            }));

                        normalizedMod = getOwn(registry, normalizedMap.id);
                        if (normalizedMod) {
                            //Mark this as a dependency for this plugin, so it
                            //can be traced for cycles.
                            this.depMaps.push(normalizedMap);

                            if (this.events.error) {
                                normalizedMod.on('error', bind(this, function (err) {
                                    this.emit('error', err);
                                }));
                            }
                            normalizedMod.enable();
                        }

                        return;
                    }

                    //If a paths config, then just load that file instead to
                    //resolve the plugin, as it is built into that paths layer.
                    if (bundleId) {
                        this.map.url = context.nameToUrl(bundleId);
                        this.load();
                        return;
                    }

                    load = bind(this, function (value) {
                        this.init([], function () { return value; }, null, {
                            enabled: true
                        });
                    });

                    load.error = bind(this, function (err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];

                        //Remove temp unnormalized modules for this module,
                        //since they will never be resolved otherwise now.
                        eachProp(registry, function (mod) {
                            if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                cleanRegistry(mod.map.id);
                            }
                        });

                        onError(err);
                    });

                    //Allow plugins to load other code without having to know the
                    //context or how to 'complete' the load.
                    load.fromText = bind(this, function (text, textAlt) {
                        /*jslint evil: true */
                        var moduleName = map.name,
                            moduleMap = makeModuleMap(moduleName),
                            hasInteractive = useInteractive;

                        //As of 2.1.0, support just passing the text, to reinforce
                        //fromText only being called once per resource. Still
                        //support old style of passing moduleName but discard
                        //that moduleName in favor of the internal ref.
                        if (textAlt) {
                            text = textAlt;
                        }

                        //Turn off interactive script matching for IE for any define
                        //calls in the text, then turn it back on at the end.
                        if (hasInteractive) {
                            useInteractive = false;
                        }

                        //Prime the system by creating a module instance for
                        //it.
                        getModule(moduleMap);

                        //Transfer any config to this other module.
                        if (hasProp(config.config, id)) {
                            config.config[moduleName] = config.config[id];
                        }

                        try {
                            req.exec(text);
                        } catch (e) {
                            return onError(makeError('fromtexteval',
                                             'fromText eval for ' + id +
                                            ' failed: ' + e,
                                             e,
                                             [id]));
                        }

                        if (hasInteractive) {
                            useInteractive = true;
                        }

                        //Mark this as a dependency for the plugin
                        //resource
                        this.depMaps.push(moduleMap);

                        //Support anonymous modules.
                        context.completeLoad(moduleName);

                        //Bind the value of that module to the value for this
                        //resource ID.
                        localRequire([moduleName], load);
                    });

                    //Use parentName here since the plugin's name is not reliable,
                    //could be some weird string with no path that actually wants to
                    //reference the parentName's path.
                    plugin.load(map.name, localRequire, load, config);
                }));

                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
            },

            enable: function () {
                enabledRegistry[this.map.id] = this;
                this.enabled = true;

                //Set flag mentioning that the module is enabling,
                //so that immediate calls to the defined callbacks
                //for dependencies do not trigger inadvertent load
                //with the depCount still being zero.
                this.enabling = true;

                //Enable each dependency
                each(this.depMaps, bind(this, function (depMap, i) {
                    var id, mod, handler;

                    if (typeof depMap === 'string') {
                        //Dependency needs to be converted to a depMap
                        //and wired up to this module.
                        depMap = makeModuleMap(depMap,
                                               (this.map.isDefine ? this.map : this.map.parentMap),
                                               false,
                                               !this.skipMap);
                        this.depMaps[i] = depMap;

                        handler = getOwn(handlers, depMap.id);

                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                        }

                        this.depCount += 1;

                        on(depMap, 'defined', bind(this, function (depExports) {
                            this.defineDep(i, depExports);
                            this.check();
                        }));

                        if (this.errback) {
                            on(depMap, 'error', bind(this, this.errback));
                        }
                    }

                    id = depMap.id;
                    mod = registry[id];

                    //Skip special modules like 'require', 'exports', 'module'
                    //Also, don't call enable if it is already enabled,
                    //important in circular dependency cases.
                    if (!hasProp(handlers, id) && mod && !mod.enabled) {
                        context.enable(depMap, this);
                    }
                }));

                //Enable each plugin that is used in
                //a dependency
                eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                    var mod = getOwn(registry, pluginMap.id);
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                    }
                }));

                this.enabling = false;

                this.check();
            },

            on: function (name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
                }
                cbs.push(cb);
            },

            emit: function (name, evt) {
                each(this.events[name], function (cb) {
                    cb(evt);
                });
                if (name === 'error') {
                    //Now that the error handler was triggered, remove
                    //the listeners, since this broken Module instance
                    //can stay around for a while in the registry.
                    delete this.events[name];
                }
            }
        };

        function callGetModule(args) {
            //Skip modules already defined.
            if (!hasProp(defined, args[0])) {
                getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
            }
        }

        function removeListener(node, func, name, ieName) {
            //Favor detachEvent because of IE9
            //issue, see attachEvent/addEventListener comment elsewhere
            //in this file.
            if (node.detachEvent && !isOpera) {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                if (ieName) {
                    node.detachEvent(ieName, func);
                }
            } else {
                node.removeEventListener(name, func, false);
            }
        }

        /**
         * Given an event from a script node, get the requirejs info from it,
         * and then removes the event listeners on the node.
         * @param {Event} evt
         * @returns {Object}
         */
        function getScriptData(evt) {
            //Using currentTarget instead of target for Firefox 2.0's sake. Not
            //all old browsers will be supported, but this one was easy enough
            //to support and still makes sense.
            var node = evt.currentTarget || evt.srcElement;

            //Remove the listeners once here.
            removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');

            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
            };
        }

        function intakeDefines() {
            var args;

            //Any defined modules in the global queue, intake them now.
            takeGlobalQueue();

            //Make sure any remaining defQueue items get properly processed.
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1]));
                } else {
                    //args are id, deps, factory. Should be normalized by the
                    //define() function.
                    callGetModule(args);
                }
            }
        }

        context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            defQueue: defQueue,
            Module: Module,
            makeModuleMap: makeModuleMap,
            nextTick: req.nextTick,
            onError: onError,

            /**
             * Set a configuration for the context.
             * @param {Object} cfg config object to integrate.
             */
            configure: function (cfg) {
                //Make sure the baseUrl ends in a slash.
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                    }
                }

                //Save off the paths since they require special processing,
                //they are additive.
                var shim = config.shim,
                    objs = {
                        paths: true,
                        bundles: true,
                        config: true,
                        map: true
                    };

                eachProp(cfg, function (value, prop) {
                    if (objs[prop]) {
                        if (!config[prop]) {
                            config[prop] = {};
                        }
                        mixin(config[prop], value, true, true);
                    } else {
                        config[prop] = value;
                    }
                });

                //Reverse map the bundles
                if (cfg.bundles) {
                    eachProp(cfg.bundles, function (value, prop) {
                        each(value, function (v) {
                            if (v !== prop) {
                                bundlesMap[v] = prop;
                            }
                        });
                    });
                }

                //Merge shim
                if (cfg.shim) {
                    eachProp(cfg.shim, function (value, id) {
                        //Normalize the structure
                        if (isArray(value)) {
                            value = {
                                deps: value
                            };
                        }
                        if ((value.exports || value.init) && !value.exportsFn) {
                            value.exportsFn = context.makeShimExports(value);
                        }
                        shim[id] = value;
                    });
                    config.shim = shim;
                }

                //Adjust packages if necessary.
                if (cfg.packages) {
                    each(cfg.packages, function (pkgObj) {
                        var location, name;

                        pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;

                        name = pkgObj.name;
                        location = pkgObj.location;
                        if (location) {
                            config.paths[name] = pkgObj.location;
                        }

                        //Save pointer to main module ID for pkg name.
                        //Remove leading dot in main, so main paths are normalized,
                        //and remove any trailing .js, since different package
                        //envs have different conventions: some use a module name,
                        //some use a file name.
                        config.pkgs[name] = pkgObj.name + '/' + (pkgObj.main || 'main')
                                     .replace(currDirRegExp, '')
                                     .replace(jsSuffixRegExp, '');
                    });
                }

                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(registry, function (mod, id) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id);
                    }
                });

                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }
            },

            makeShimExports: function (value) {
                function fn() {
                    var ret;
                    if (value.init) {
                        ret = value.init.apply(global, arguments);
                    }
                    return ret || (value.exports && getGlobal(value.exports));
                }
                return fn;
            },

            makeRequire: function (relMap, options) {
                options = options || {};

                function localRequire(deps, callback, errback) {
                    var id, map, requireMod;

                    if (options.enableBuildCallback && callback && isFunction(callback)) {
                        callback.__requireJsBuild = true;
                    }

                    if (typeof deps === 'string') {
                        if (isFunction(callback)) {
                            //Invalid call
                            return onError(makeError('requireargs', 'Invalid require call'), errback);
                        }

                        //If require|exports|module are requested, get the
                        //value for them from the special handlers. Caveat:
                        //this only works while module is being defined.
                        if (relMap && hasProp(handlers, deps)) {
                            return handlers[deps](registry[relMap.id]);
                        }

                        //Synchronous access to one module. If require.get is
                        //available (as in the Node adapter), prefer that.
                        if (req.get) {
                            return req.get(context, deps, relMap, localRequire);
                        }

                        //Normalize module name, if it contains . or ..
                        map = makeModuleMap(deps, relMap, false, true);
                        id = map.id;

                        if (!hasProp(defined, id)) {
                            return onError(makeError('notloaded', 'Module name "' +
                                        id +
                                        '" has not been loaded yet for context: ' +
                                        contextName +
                                        (relMap ? '' : '. Use require([])')));
                        }
                        return defined[id];
                    }

                    //Grab defines waiting in the global queue.
                    intakeDefines();

                    //Mark all the dependencies as needing to be loaded.
                    context.nextTick(function () {
                        //Some defines could have been added since the
                        //require call, collect them.
                        intakeDefines();

                        requireMod = getModule(makeModuleMap(null, relMap));

                        //Store if map config should be applied to this require
                        //call for dependencies.
                        requireMod.skipMap = options.skipMap;

                        requireMod.init(deps, callback, errback, {
                            enabled: true
                        });

                        checkLoaded();
                    });

                    return localRequire;
                }

                mixin(localRequire, {
                    isBrowser: isBrowser,

                    /**
                     * Converts a module name + .extension into an URL path.
                     * *Requires* the use of a module name. It does not support using
                     * plain URLs like nameToUrl.
                     */
                    toUrl: function (moduleNamePlusExt) {
                        var ext,
                            index = moduleNamePlusExt.lastIndexOf('.'),
                            segment = moduleNamePlusExt.split('/')[0],
                            isRelative = segment === '.' || segment === '..';

                        //Have a file extension alias, and it is not the
                        //dots from a relative path.
                        if (index !== -1 && (!isRelative || index > 1)) {
                            ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                            moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                        }

                        return context.nameToUrl(normalize(moduleNamePlusExt,
                                                relMap && relMap.id, true), ext,  true);
                    },

                    defined: function (id) {
                        return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                    },

                    specified: function (id) {
                        id = makeModuleMap(id, relMap, false, true).id;
                        return hasProp(defined, id) || hasProp(registry, id);
                    }
                });

                //Only allow undef on top level require calls
                if (!relMap) {
                    localRequire.undef = function (id) {
                        //Bind any waiting define() calls to this context,
                        //fix for #408
                        takeGlobalQueue();

                        var map = makeModuleMap(id, relMap, true),
                            mod = getOwn(registry, id);

                        removeScript(id);

                        delete defined[id];
                        delete urlFetched[map.url];
                        delete undefEvents[id];

                        //Clean queued defines too. Go backwards
                        //in array so that the splices do not
                        //mess up the iteration.
                        eachReverse(defQueue, function(args, i) {
                            if(args[0] === id) {
                                defQueue.splice(i, 1);
                            }
                        });

                        if (mod) {
                            //Hold on to listeners in case the
                            //module will be attempted to be reloaded
                            //using a different config.
                            if (mod.events.defined) {
                                undefEvents[id] = mod.events;
                            }

                            cleanRegistry(id);
                        }
                    };
                }

                return localRequire;
            },

            /**
             * Called to enable a module if it is still in the registry
             * awaiting enablement. A second arg, parent, the parent module,
             * is passed in for context, when this method is overridden by
             * the optimizer. Not shown here to keep code compact.
             */
            enable: function (depMap) {
                var mod = getOwn(registry, depMap.id);
                if (mod) {
                    getModule(depMap).enable();
                }
            },

            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String} moduleName the name of the module to potentially complete.
             */
            completeLoad: function (moduleName) {
                var found, args, mod,
                    shim = getOwn(config.shim, moduleName) || {},
                    shExports = shim.exports;

                takeGlobalQueue();

                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        //If already found an anonymous module and bound it
                        //to this name, then this is some other anon module
                        //waiting for its completeLoad to fire.
                        if (found) {
                            break;
                        }
                        found = true;
                    } else if (args[0] === moduleName) {
                        //Found matching define call for this script!
                        found = true;
                    }

                    callGetModule(args);
                }

                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                mod = getOwn(registry, moduleName);

                if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                        } else {
                            return onError(makeError('nodefine',
                                             'No define call for ' + moduleName,
                                             null,
                                             [moduleName]));
                        }
                    } else {
                        //A script that does not call define(), so just simulate
                        //the call for it.
                        callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                    }
                }

                checkLoaded();
            },

            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             * Note that it **does not** call normalize on the moduleName,
             * it is assumed to have already been normalized. This is an
             * internal API, not a public one. Use toUrl for the public API.
             */
            nameToUrl: function (moduleName, ext, skipExt) {
                var paths, syms, i, parentModule, url,
                    parentPath, bundleId,
                    pkgMain = getOwn(config.pkgs, moduleName);

                if (pkgMain) {
                    moduleName = pkgMain;
                }

                bundleId = getOwn(bundlesMap, moduleName);

                if (bundleId) {
                    return context.nameToUrl(bundleId, ext, skipExt);
                }

                //If a colon is in the URL, it indicates a protocol is used and it is just
                //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                //or ends with .js, then assume the user meant to use an url and not a module id.
                //The slash is important for protocol-less URLs as well as full paths.
                if (req.jsExtRegExp.test(moduleName)) {
                    //Just a plain path, not module name lookup, so just return it.
                    //Add extension if it is included. This is a bit wonky, only non-.js things pass
                    //an extension, this method probably needs to be reworked.
                    url = moduleName + (ext || '');
                } else {
                    //A module that needs to be converted to a path.
                    paths = config.paths;

                    syms = moduleName.split('/');
                    //For each module name segment, see if there is a path
                    //registered for it. Start with most specific name
                    //and work up from it.
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');

                        parentPath = getOwn(paths, parentModule);
                        if (parentPath) {
                            //If an array, it means there are a few choices,
                            //Choose the one that is desired
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                            }
                            syms.splice(0, i, parentPath);
                            break;
                        }
                    }

                    //Join the path parts together, then figure out if baseUrl is needed.
                    url = syms.join('/');
                    url += (ext || (/^data\:|\?/.test(url) || skipExt ? '' : '.js'));
                    url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                }

                return config.urlArgs ? url +
                                        ((url.indexOf('?') === -1 ? '?' : '&') +
                                         config.urlArgs) : url;
            },

            //Delegates to req.load. Broken out as a separate function to
            //allow overriding in the optimizer.
            load: function (id, url) {
                req.load(context, id, url);
            },

            /**
             * Executes a module callback function. Broken out as a separate function
             * solely to allow the build system to sequence the files in the built
             * layer in the right sequence.
             *
             * @private
             */
            execCb: function (name, callback, args, exports) {
                return callback.apply(exports, args);
            },

            /**
             * callback for script loads, used to check status of loading.
             *
             * @param {Event} evt the event from the browser for the script
             * that was loaded.
             */
            onScriptLoad: function (evt) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                if (evt.type === 'load' ||
                        (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                    //Reset interactive script so a script node is not held onto for
                    //to long.
                    interactiveScript = null;

                    //Pull out the name of the module and the context.
                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
                }
            },

            /**
             * Callback for script errors.
             */
            onScriptError: function (evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    return onError(makeError('scripterror', 'Script error for: ' + data.id, evt, [data.id]));
                }
            }
        };

        context.require = context.makeRequire();
        return context;
    }

    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = requirejs = function (deps, callback, errback, optional) {

        //Find the right context, use default
        var context, config,
            contextName = defContextName;

        // Determine if have config object in the call.
        if (!isArray(deps) && typeof deps !== 'string') {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = errback;
                errback = optional;
            } else {
                deps = [];
            }
        }

        if (config && config.context) {
            contextName = config.context;
        }

        context = getOwn(contexts, contextName);
        if (!context) {
            context = contexts[contextName] = req.s.newContext(contextName);
        }

        if (config) {
            context.configure(config);
        }

        return context.require(deps, callback, errback);
    };

    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function (config) {
        return req(config);
    };

    /**
     * Execute something after the current tick
     * of the event loop. Override for other envs
     * that have a better solution than setTimeout.
     * @param  {Function} fn function to execute later.
     */
    req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
        setTimeout(fn, 4);
    } : function (fn) { fn(); };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }

    req.version = version;

    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };

    //Create default context.
    req({});

    //Exports some context-sensitive methods on global require.
    each([
        'toUrl',
        'undef',
        'defined',
        'specified'
    ], function (prop) {
        //Reference from contexts instead of early binding to default context,
        //so that during builds, the latest instance of the default context
        //with its config gets used.
        req[prop] = function () {
            var ctx = contexts[defContextName];
            return ctx.require[prop].apply(ctx, arguments);
        };
    });

    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }

    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error} err the error object.
     */
    req.onError = defaultOnError;

    /**
     * Creates the node for the load command. Only used in browser envs.
     */
    req.createNode = function (config, moduleName, url) {
        var node = config.xhtml ?
                document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
                document.createElement('script');
        node.type = config.scriptType || 'text/javascript';
        node.charset = 'utf-8';
        node.async = true;
        return node;
    };

    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object} context the require context to find state.
     * @param {String} moduleName the name of the module.
     * @param {Object} url the URL to the module.
     */
    req.load = function (context, moduleName, url) {
        var config = (context && context.config) || {},
            node;
        if (isBrowser) {
            //In the browser so use a script tag
            node = req.createNode(config, moduleName, url);

            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);

            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                    //Check if node.attachEvent is artificially added by custom script or
                    //natively supported by browser
                    //read https://github.com/jrburke/requirejs/issues/187
                    //if we can NOT find [native code] then it must NOT natively supported.
                    //in IE8, node.attachEvent does not have toString()
                    //Note the test for "[native code" with no closing brace, see:
                    //https://github.com/jrburke/requirejs/issues/273
                    !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                    !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;

                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEventListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
            } else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;

            return node;
        } else if (isWebWorker) {
            try {
                //In a web worker, use importScripts. This is not a very
                //efficient use of importScripts, importScripts will block until
                //its script is downloaded and evaluated. However, if web workers
                //are in play, the expectation that a build has been done so that
                //only one script needs to be loaded anyway. This may need to be
                //reevaluated if other use cases become common.
                importScripts(url);

                //Account for anonymous modules
                context.completeLoad(moduleName);
            } catch (e) {
                context.onError(makeError('importscripts',
                                'importScripts failed for ' +
                                    moduleName + ' at ' + url,
                                e,
                                [moduleName]));
            }
        }
    };

    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
        }

        eachReverse(scripts(), function (script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        });
        return interactiveScript;
    }

    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser && !cfg.skipDataMain) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        eachReverse(scripts(), function (script) {
            //Set the 'head' where we can append children by
            //using the script's parent.
            if (!head) {
                head = script.parentNode;
            }

            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
                //Preserve dataMain in case it is a path (i.e. contains '?')
                mainScript = dataMain;

                //Set final baseUrl if there is not already an explicit one.
                if (!cfg.baseUrl) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = mainScript.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/')  + '/' : './';

                    cfg.baseUrl = subPath;
                }

                //Strip off any trailing .js since mainScript is now
                //like a module name.
                mainScript = mainScript.replace(jsSuffixRegExp, '');

                 //If mainScript is still a path, fall back to dataMain
                if (req.jsExtRegExp.test(mainScript)) {
                    mainScript = dataMain;
                }

                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];

                return true;
            }
        });
    }

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = function (name, deps, callback) {
        var node, context;

        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = null;
        }

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!deps && isFunction(callback)) {
            deps = [];
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function (match, dep) {
                        deps.push(dep);
                    });

                //May be a CommonJS thing even without require calls, but still
                //could use exports, and module. Avoid doing exports and module
                //work though if it just needs require.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
            }
        }

        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
                }
                context = contexts[node.getAttribute('data-requirecontext')];
            }
        }

        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        (context ? context.defQueue : globalDefQueue).push([name, deps, callback]);
    };

    define.amd = {
        jQuery: true
    };


    /**
     * Executes the text. Normally just uses eval, but can be modified
     * to use a better, environment-specific call. Only used for transpiling
     * loader plugins, not for plain JS modules.
     * @param {String} text the text to execute/evaluate.
     */
    req.exec = function (text) {
        /*jslint evil: true */
        return eval(text);
    };

    //Set up with config info.
    req(cfg);
}(this));

/* filePath fetchtemp/scripts/glue-core_9a34a86c_f9222f1d.js*/

/* filePath fetchtemp/scripts/core_16cb3d53.js*/

(function (glue) {
  'use strict';

  var win = window;

  // 将原有的glue备份。无冲突处理
  glue.__old = win.glue;
  win.glue = glue;
  win.__glue = glue;

  var orgDefine = win.define;
  glue.hasDefine = {};
  win.define = function (id) {
    glue.hasDefine[id] = id;
    orgDefine.apply(null, arguments);
  };

  // 修复jquery使用define的条件。
  win.define.amd = {
    jQuery: true
  };

  var toString  = Object.prototype.toString;
  var emptyFn = function () {};

  if (typeof emptyFn.bind !== 'function') {

    Function.prototype.bind = function (scope) {

      if (arguments.length < 2 && scope === void 0) {
        return this;
      }

      var fn = this,
          argv = arguments;

      return function () {
        var args = [],
            i;
        for (i = 1; i < argv.length; i++) {
          args.push(argv[i]);
        }

        for (i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }

        return fn.apply(scope, args);
      };
    };
  }

  glue.extend = function () {
    var orgObject = arguments[0];
    var extendObjects = [].slice.call(arguments, 1);
    var obj;
    var key;

    for (var i = 0, iLen = extendObjects.length; i < iLen; i++) {
      obj = extendObjects[i];

      for (key in obj) {
        orgObject[key] = obj[key];
      }
    }

    return orgObject;
  };

  glue.extend(glue, {
    version: '1.1.11',
    options: {
      comboServer : 'http://localhost:9001/combo/',
      useComboServer : false,  //默认不使用combo server
      prefix : 'g-',   //全局标记前缀
      attrPrefix : 'g-attr-'  //自定义属性前缀
    },

    noConflict: function () {
      var _tempGlue = glue;
      window['glue'] = glue.__old;
      return _tempGlue;
    },

    config: function (config) {
      if (typeof config !== 'undefined' &&  glue.isObject(config)) {
        for (var p in config) {
          glue.options[p] = config[p];
        }
      }
    },

    // 判断是否为标准浏览器
    W3C: win.dispatchEvent,

    isDefined: function (value) {
      return typeof value !== 'undefined';
    },

    isString: function (value) {
      return typeof value === 'string';
    },

    isNumber: function (value) {
      return typeof value === 'number';
    },

    isDate: function (value) {
      return toString.call(value) === '[object Date]';
    },

    isObject: function (value) {
      return value !== null && typeof value === 'object';
    },

    isArray: function (value) {
      return toString.call(value) === '[object Array]';
    },

    isFunction: function (value) {
      return typeof value === 'function';
    },

    isWindow: function (obj) {
      return obj && obj.document && obj.location && obj.alert && obj.setInterval;
    },

    // 抛出一个错误。
    error: function (str, E) {
      E = E || Error;
      throw new E(str);
    },

    isArrayLike: function (obj) {

      if (typeof obj === 'undefined' || obj === null || glue.isWindow(obj)) {
        return false;
      }

      var length = obj.length;

      if (obj.nodeType === 1 && length) {
        return true;
      }

      return glue.isString(obj) || glue.isArray(obj) || length === 0 ||
          typeof length === 'number' && length > 0 && (length - 1) in obj;
    },

    trim: (function () {
      if (!String.prototype.trim) {
        return function (value) {
          return glue.isString(value) ? value.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : value;
        };
      }
      return function (value) {
        return glue.isString(value) ? value.trim() : value;
      };
    }()),

    capitalize: function (str) {
      return str.replace(/(^|\s)([a-z|A-Z])(\w*)/g, function (m, p1, p2, p3) {
        return p1 + p2.toUpperCase() + p3.toLowerCase();
      });
    },

    log: function () {
      if (typeof console !== 'undefined' && typeof console.log === 'function') {
        console.log.apply(console, arguments);
      }
    }
  });

}({}));


/* filePath fetchtemp/scripts/events_9d21380f.js*/

window.glue = (function (glue) {
// Events
  // -----------------
  // Thanks to:
  //  - https://github.com/documentcloud/backbone/blob/master/backbone.js
  //  - https://github.com/joyent/node/blob/master/lib/events.js


  // Regular expression used to split event strings
  var eventSplitter = /\s+/


  // A module that can be mixed in to *any object* in order to provide it
  // with custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = new Events();
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  function Events() {
  }


  // Bind one or more space separated events, `events`, to a `callback`
  // function. Passing `"all"` will bind the callback to all events fired.
  Events.prototype.on = function(events, callback, context) {
    var cache, event, list
    if (!callback) return this

    cache = this.__events || (this.__events = {})
    events = events.split(eventSplitter)

    while (event = events.shift()) {
      list = cache[event] || (cache[event] = [])
      list.push(callback, context)
    }

    return this
  }

  Events.prototype.once = function(events, callback, context) {
    var that = this
    var cb = function() {
      that.off(events, cb)
      callback.apply(this, arguments)
    }
    this.on(events, cb, context)
  }

  // Remove one or many callbacks. If `context` is null, removes all callbacks
  // with that function. If `callback` is null, removes all callbacks for the
  // event. If `events` is null, removes all bound callbacks for all events.
  Events.prototype.off = function(events, callback, context) {
    var cache, event, list, i

    // No events, or removing *all* events.
    if (!(cache = this.__events)) return this
    if (!(events || callback || context)) {
      delete this.__events
      return this
    }

    events = events ? events.split(eventSplitter) : keys(cache)

    // Loop through the callback list, splicing where appropriate.
    while (event = events.shift()) {
      list = cache[event]
      if (!list) continue

      if (!(callback || context)) {
        delete cache[event]
        continue
      }

      for (i = list.length - 2; i >= 0; i -= 2) {
        if (!(callback && list[i] !== callback ||
            context && list[i + 1] !== context)) {
          list.splice(i, 2)
        }
      }
    }

    return this
  }


  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  Events.prototype.trigger = function(events) {
    var cache, event, all, list, i, len, rest = [], args, returned = true;
    if (!(cache = this.__events)) return this

    events = events.split(eventSplitter)

    // Fill up `rest` with the callback arguments.  Since we're only copying
    // the tail of `arguments`, a loop is much faster than Array#slice.
    for (i = 1, len = arguments.length; i < len; i++) {
      rest[i - 1] = arguments[i]
    }

    // For each event, walk through the list of callbacks twice, first to
    // trigger the event, then to trigger any `"all"` callbacks.
    while (event = events.shift()) {
      // Copy callback lists to prevent modification.
      if (all = cache.all) all = all.slice()
      if (list = cache[event]) list = list.slice()

      // Execute event callbacks.
      returned = triggerEvents(list, rest, this) && returned

      // Execute "all" callbacks.
      returned = triggerEvents(all, [event].concat(rest), this) && returned
    }

    return returned
  }

  Events.prototype.emit = Events.prototype.trigger

  // Mix `Events` to object instance or Class function.
  Events.mixTo = function(receiver) {
    receiver = isFunction(receiver) ? receiver.prototype : receiver
    var proto = Events.prototype

    for (var p in proto) {
      if (proto.hasOwnProperty(p)) {
        receiver[p] = proto[p]
      }
    }
  }


  // Helpers
  // -------

  var keys = Object.keys

  if (!keys) {
    keys = function(o) {
      var result = []

      for (var name in o) {
        if (o.hasOwnProperty(name)) {
          result.push(name)
        }
      }
      return result
    }
  }

  // Execute callbacks
  function triggerEvents(list, args, context) {
    var pass = true
    
    if (list) {
      var i = 0, l = list.length, a1 = args[0], a2 = args[1], a3 = args[2]
      // call is faster than apply, optimize less than 3 argu
      // http://blog.csdn.net/zhengyinhui100/article/details/7837127
      switch (args.length) {
        case 0: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context) !== false && pass} break;
        case 1: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1) !== false && pass} break;
        case 2: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1, a2) !== false && pass} break;
        case 3: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1, a2, a3) !== false && pass} break;
        default: for (; i < l; i += 2) {pass = list[i].apply(list[i + 1] || context, args) !== false && pass} break;
      }
    }
    // trigger will return false if one of the callbacks return false
    return pass;
  }

  function isFunction(func) {
    return Object.prototype.toString.call(func) === '[object Function]'
  }

  glue.Events = Events;

  return glue;

}(glue || {}));
/* filePath fetchtemp/scripts/class_fd8b7283.js*/

// class 
window.glue = (function (glue) {

  // The base Class implementation.
  function Class(o) {
    // Convert existed function to Class.
    if (!(this instanceof Class) && isFunction(o)) {
      return classify(o)
    }
  }

  // Create a new Class.
  //
  //  var SuperPig = Class.create({
  //    Extends: Animal,
  //    Implements: Flyable,
  //    initialize: function() {
  //      SuperPig.superclass.initialize.apply(this, arguments)
  //    },
  //    Statics: {
  //      COLOR: 'red'
  //    }
  // })
  //
  Class.create = function(parent, properties) {
    if (!isFunction(parent)) {
      properties = parent
      parent = null
    }

    properties || (properties = {})
    parent || (parent = properties.Extends || Class)
    properties.Extends = parent

    // The created class constructor
    function SubClass() {
      // Call the parent constructor.
      parent.apply(this, arguments)

      // Only call initialize in self constructor.
      if (this.constructor === SubClass && this.initialize) {
        this.initialize.apply(this, arguments)
      }
    }

    // Inherit class (static) properties from parent.
    if (parent !== Class) {
      mix(SubClass, parent, parent.StaticsWhiteList)
    }

    // Add instance properties to the subclass.
    implement.call(SubClass, properties)

    // Make subclass extendable.
    return classify(SubClass)
  }


  function implement(properties) {
    var key, value

    for (key in properties) {
      value = properties[key]

      if (Class.Mutators.hasOwnProperty(key)) {
        Class.Mutators[key].call(this, value)
      } else {
        this.prototype[key] = value
      }
    }
  }


  // Create a sub Class based on `Class`.
  Class.extend = function(properties) {
    properties || (properties = {})
    properties.Extends = this

    return Class.create(properties)
  }


  function classify(cls) {
    cls.extend = Class.extend
    cls.implement = implement
    return cls
  }


  // Mutators define special properties.
  Class.Mutators = {

    'Extends': function(parent) {
      var existed = this.prototype
      var proto = createProto(parent.prototype)

      // Keep existed properties.
      mix(proto, existed)

      // Enforce the constructor to be what we expect.
      proto.constructor = this

      // Set the prototype chain to inherit from `parent`.
      this.prototype = proto

      // Set a convenience property in case the parent's prototype is
      // needed later.
      this.superclass = parent.prototype
    },

    'Implements': function(items) {
      isArray(items) || (items = [items])
      var proto = this.prototype, item

      while (item = items.shift()) {
        mix(proto, item.prototype || item)
      }
    },

    'Statics': function(staticProperties) {
      mix(this, staticProperties)
    }
  }


  // Shared empty constructor function to aid in prototype-chain creation.
  function Ctor() {
  }

  // See: http://jsperf.com/object-create-vs-new-ctor
  var createProto = Object.__proto__ ?
      function(proto) {
        return { __proto__: proto }
      } :
      function(proto) {
        Ctor.prototype = proto
        return new Ctor()
      }


  // Helpers
  // ------------

  function mix(r, s, wl) {
    // Copy "all" properties including inherited ones.
    for (var p in s) {
      if (s.hasOwnProperty(p)) {
        if (wl && indexOf(wl, p) === -1) continue

        // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
        if (p !== 'prototype') {
          r[p] = s[p]
        }
      }
    }
  }


  var toString = Object.prototype.toString

  var isArray = Array.isArray || function(val) {
      return toString.call(val) === '[object Array]'
  }

  var isFunction = function(val) {
    return toString.call(val) === '[object Function]'
  }

  var indexOf = Array.prototype.indexOf ?
      function(arr, item) {
        return arr.indexOf(item)
      } :
      function(arr, item) {
        for (var i = 0, len = arr.length; i < len; i++) {
          if (arr[i] === item) {
            return i
          }
        }
        return -1
      }

  glue.Class = Class;
  return glue;
}(glue || {}));
/* filePath fetchtemp/scripts/dom_11b58078.js*/

window.glue = (function (glue) {
  'use strict';

  var win = window;
  var doc = document;
  var tagWrap = {
    option: ["select"],
    tbody: ["table"],
    thead: ["table"],
    tfoot: ["table"],
    tr: ["table", "tbody"],
    td: ["table", "tbody", "tr"],
    th: ["table", "thead", "tr"],
    legend: ["fieldset"],
    caption: ["table"],
    colgroup: ["table"],
    col: ["table", "colgroup"],
    li: ["ul"]
  };

  var reTag = /<\s*([\w\:]+)/;
  var masterNode = {};
  var masterNum = 0;
  var masterName = "__" + "ToDomId";
  // var documentFragment = doc.createDocumentFragment();

  for (var param in tagWrap) {
    if (tagWrap.hasOwnProperty(param)) {
      var tw = tagWrap[param];
      tw.pre = param === "option" ? '<select multiple="multiple">' : "<" + tw.join("><") + ">";
      tw.post = "</" + tw.reverse().join("></") + ">";
    }
  }

  /**
   * [toDom description]
   * @param  {string} frag 传入的字符串
   * @param  {[type]} doc  [description]
   * @return {[type]}      [description]
   */
  var toDom = function toDom(frag, doc) {

    doc = doc || doc;
    var masterId = doc[masterName];

    if (!masterId) {
      doc[masterName] = masterId = ++masterNum + "";
      masterNode[masterId] = doc.createElement("div");
    }

    frag += "";
    var match = frag.match(reTag);
    var tag = match ? match[1].toLowerCase() : "";
    var master = masterNode[masterId];
    var wrap, i, fc, df;

    if (match && tagWrap[tag]) {
      wrap = tagWrap[tag];
      master.innerHTML = wrap.pre + frag + wrap.post;
      
      for (i = wrap.length; i; --i) {
        master = master.firstChild;
      }
    } else {
      master.innerHTML = frag;
    }

    // one node shortcut => return the node itself
    if (master.childNodes.length === 1) {
      return master.removeChild(master.firstChild); // DOMNode
    }

    // return multiple nodes as a document fragment
    df = doc.createDocumentFragment();
   
    while ((fc = master.firstChild)) { // intentional assignment
      df.appendChild(fc);
    }
    
    return df; // DocumentFragment
  };

  // var clean = function (element) {

  // };

  var createTextNode = function (text) {
    return doc.createTextNode(text);
  };

  var createDocumentFragment = function () {
    return doc.createDocumentFragment();
  };

  glue.dom = {
    'toDom': toDom,
    'createDocumentFragment': createDocumentFragment,
    "createTextNode": createTextNode
  };

  return glue;
}(glue || {}));


/* filePath fetchtemp/scripts/utils_68ca4f5f.js*/

define('F_WidgetBase/utils', [], function () {
  'use strict';

  // @todo 如果以后需要外部配置，需要其可配置。
  var openTag = '{{';
  var closeTag = '}}';

  /**
   * 扫描字符串，将字符串转换成一个token数组
   * 主要用在扫描文本节点，将其中的{{}}标签
   * @param  {String} str 带解析的字符串
   * @return {Object} 解析结果
   * {
   *   value: model中的属性名，可以使用.连写
   *   scope: model名
   *   expr: true | false 是否为 {{}} 的内容
   * }
   * example:
   * var output = scanExpr('{{model.a.b}}');
   * output: 
   * {
   *   value: 'a.b',
   *   scope: 'model',
   *   expr: true
   * }
   */
  var scanExpr = function (str) {
    var tokens = [],
        value, start = 0,
        scope,
        stop;

    do {
      stop = str.indexOf(openTag, start);

      if (stop === -1) {
        break;
      }

      value = str.slice(start, stop);

      if (value) { // {{ 左边的文本
        tokens.push({
          value: value,
          expr: false
        });
      }

      start = stop + openTag.length;
      stop = str.indexOf(closeTag, start);

      if (stop === -1) {
        break;
      }

      value = str.slice(start, stop);

      if (value) { //处理{{ }}插值表达式
        value = value.split('.');
        scope = value.shift();
        value = value.join('.');
        tokens.push({
          value: value,
          scope: scope,
          expr: true
        });
      }

      start = stop + closeTag.length;
    } while (1);

    value = str.slice(start);


    if (value) { //}} 右边的文本
      tokens.push({
        value: value,
        scope: '',
        expr: false
      });
    }

    return tokens;
  };

  /**
   * 转换上下文，主要是将原始上下文转换为一个新的上下文
   * @param  {Object} context       原始上下文
   * @param  {String} propertyNames 以逗号连接的作用域下面的属性名。
   * @return {Object}               新的上下文
   * example:
   * var a = {b: c: {d: 1}};
   * var o = transContext(a, 'b.c');
   * alert(o.d === 1);
   */
  var transContext = function (context, propertyNames) {
    var orgContext = context;
    var propertyName;

    for (var i = 0, iLen = propertyNames.length; i < iLen; i++) {
      propertyName = propertyNames[i];

      if (!(propertyName in context)) {
        var errorMsg = orgContext.type + '组件中不存在' + propertyNames.join('.') + '属性,请检查';
        alert(errorMsg);
        throw new Error(errorMsg);
      }

      context = context[propertyName];
    }

    return context;
  };

  return {
    scanExpr: scanExpr,
    transContext: transContext
  };

});
/* filePath fetchtemp/scripts/device.new_ccbced63.js*/

window.glue = (function (glue) {

  var detector = {};
  var NA_VERSION = "-1";
  var window = this;
  var external;
  var re_msie = /\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/;

  function toString(object){
    return Object.prototype.toString.call(object);
  }
  function isObject(object){
    return toString(object) === "[object Object]";
  }
  function isFunction(object){
    return toString(object) === "[object Function]";
  }
  function each(object, factory, argument){
    for(var i=0,b,l=object.length; i<l; i++){
      if(factory.call(object, object[i], i) === false){break;}
    }
  }

  // 硬件设备信息识别表达式。
  // 使用数组可以按优先级排序。
  var DEVICES = [
    ["nokia", function(ua){
      // 不能将两个表达式合并，因为可能出现 "nokia; nokia 960"
      // 这种情况下会优先识别出 nokia/-1
      if(ua.indexOf("nokia ") !== -1){
        return /\bnokia ([0-9]+)?/;
      }else if(ua.indexOf("noain") !== -1){
        return /\bnoain ([a-z0-9]+)/;
      }else{
        return /\bnokia([a-z0-9]+)?/;
      }
    }],
    // 三星有 Android 和 WP 设备。
    ["samsung", function(ua){
      if(ua.indexOf("samsung") !== -1){
        return /\bsamsung(?:\-gt)?[ \-]([a-z0-9\-]+)/;
      }else{
        return /\b(?:gt|sch)[ \-]([a-z0-9\-]+)/;
      }
    }],
    ["wp", function(ua){
      return ua.indexOf("windows phone ") !== -1 ||
        ua.indexOf("xblwp") !== -1 ||
        ua.indexOf("zunewp") !== -1 ||
        ua.indexOf("windows ce") !== -1;
    }],
    ["pc", "windows"],
    ["ipad", "ipad"],
    // ipod 规则应置于 iphone 之前。
    ["ipod", "ipod"],
    ["iphone", /\biphone\b|\biph(\d)/],
    ["mac", "macintosh"],
    ["mi", /\bmi[ \-]?([a-z0-9 ]+(?= build))/],
    ["aliyun", /\baliyunos\b(?:[\-](\d+))?/],
    ["meizu", /\b(?:meizu\/|m)([0-9]+)\b/],
    ["nexus", /\bnexus ([0-9s.]+)/],
    ["huawei", function(ua){
      var re_mediapad = /\bmediapad (.+?)(?= build\/huaweimediapad\b)/;
      if(ua.indexOf("huawei-huawei") !== -1){
        return /\bhuawei\-huawei\-([a-z0-9\-]+)/;
      }else if(re_mediapad.test(ua)){
        return re_mediapad;
      }else{
        return /\bhuawei[ _\-]?([a-z0-9]+)/;
      }
    }],
    ["lenovo", function(ua){
      if(ua.indexOf("lenovo-lenovo") !== -1){
        return /\blenovo\-lenovo[ \-]([a-z0-9]+)/;
      }else{
        return /\blenovo[ \-]?([a-z0-9]+)/;
      }
    }],
    // 中兴
    ["zte", function(ua){
      if(/\bzte\-[tu]/.test(ua)){
        return /\bzte-[tu][ _\-]?([a-su-z0-9\+]+)/;
      }else{
        return /\bzte[ _\-]?([a-su-z0-9\+]+)/;
      }
    }],
    // 步步高
    ["vivo", /\bvivo(?: ([a-z0-9]+))?/],
    ["htc", function(ua){
      if(/\bhtc[a-z0-9 _\-]+(?= build\b)/.test(ua)){
        return /\bhtc[ _\-]?([a-z0-9 ]+(?= build))/;
      }else{
        return /\bhtc[ _\-]?([a-z0-9 ]+)/;
      }
    }],
    ["oppo", /\boppo[_]([a-z0-9]+)/],
    ["konka", /\bkonka[_\-]([a-z0-9]+)/],
    ["sonyericsson", /\bmt([a-z0-9]+)/],
    ["coolpad", /\bcoolpad[_ ]?([a-z0-9]+)/],
    ["lg", /\blg[\-]([a-z0-9]+)/],
    ["android", /\bandroid\b|\badr\b/],
    ["blackberry", "blackberry"]
  ];
  // 操作系统信息识别表达式
  var OS = [
    ["wp", function(ua){
      if(ua.indexOf("windows phone ") !== -1){
        return /\bwindows phone (?:os )?([0-9.]+)/;
      }else if(ua.indexOf("xblwp") !== -1){
        return /\bxblwp([0-9.]+)/;
      }else if(ua.indexOf("zunewp") !== -1){
        return /\bzunewp([0-9.]+)/;
      }
      return "windows phone";
    }],
    ["windows", /\bwindows nt ([0-9.]+)/],
    ["macosx", /\bmac os x ([0-9._]+)/],
    ["ios", function(ua){
      if(/\bcpu(?: iphone)? os /.test(ua)){
        return /\bcpu(?: iphone)? os ([0-9._]+)/;
      }else if(ua.indexOf("iph os ") !== -1){
        return /\biph os ([0-9_]+)/;
      }else{
        return /\bios\b/;
      }
    }],
    ["yunos", /\baliyunos ([0-9.]+)/],
    ["android", function(ua){
      if(ua.indexOf("android") >= 0){
        return /\bandroid[ \/-]?([0-9.x]+)?/;
      }else if(ua.indexOf("adr") >= 0){
        if(ua.indexOf("mqqbrowser") >= 0){
          return /\badr[ ]\(linux; u; ([0-9.]+)?/;
        }else{
          return /\badr(?:[ ]([0-9.]+))?/;
        }
      }
      return "android";
      //return /\b(?:android|\badr)(?:[\/\- ](?:\(linux; u; )?)?([0-9.x]+)?/;
    }],
    ["chromeos", /\bcros i686 ([0-9.]+)/],
    ["linux", "linux"],
    ["windowsce", /\bwindows ce(?: ([0-9.]+))?/],
    ["symbian", /\bsymbian(?:os)?\/([0-9.]+)/],
    ["blackberry", "blackberry"]
  ];

  /*
   * 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
   * @param {String} ua, userAgent string.
   * @return {Object}
   */
  function IEMode(ua){
    if(!re_msie.test(ua)){return null;}

    var m,
        engineMode, engineVersion,
        browserMode, browserVersion,
        compatible=false;

    // IE8 及其以上提供有 Trident 信息，
    // 默认的兼容模式，UA 中 Trident 版本不发生变化。
    if(ua.indexOf("trident/") !== -1){
      m = /\btrident\/([0-9.]+)/.exec(ua);
      if(m && m.length>=2){
        // 真实引擎版本。
        engineVersion = m[1];
        var v_version = m[1].split(".");
        v_version[0] = parseInt(v_version[0], 10) + 4;
        browserVersion = v_version.join(".");
      }
    }

    m = re_msie.exec(ua);
    browserMode = m[1];
    var v_mode = m[1].split(".");
    if("undefined" === typeof browserVersion){
      browserVersion = browserMode;
    }
    v_mode[0] = parseInt(v_mode[0], 10) - 4;
    engineMode = v_mode.join(".");
    if("undefined" === typeof engineVersion){
      engineVersion = engineMode;
    }

    return {
      browserVersion: browserVersion,
      browserMode: browserMode,
      engineVersion: engineVersion,
      engineMode: engineMode,
      compatible: engineVersion !== engineMode
    };
  }
  /**
   * 针对同源的 TheWorld 和 360 的 external 对象进行检测。
   * @param {String} key, 关键字，用于检测浏览器的安装路径中出现的关键字。
   * @return {Undefined,Boolean,Object} 返回 undefined 或 false 表示检测未命中。
   */
  function checkTW360External(key){
    if(!external){return;} // return undefined.
    try{
      //        360安装路径：
      //        C:%5CPROGRA~1%5C360%5C360se3%5C360SE.exe
      var runpath = external.twGetRunPath.toLowerCase();
      // 360SE 3.x ~ 5.x support.
      // 暴露的 external.twGetVersion 和 external.twGetSecurityID 均为 undefined。
      // 因此只能用 try/catch 而无法使用特性判断。
      var security = external.twGetSecurityID(window);
      var version = external.twGetVersion(security);

      if(runpath && runpath.indexOf(key) === -1){return false;}
      if(version){return {version: version};}
    }catch(ex){}
  }

  var ENGINE = [
    ["trident", re_msie],
    //["blink", /blink\/([0-9.+]+)/],
    ["webkit", /\bapplewebkit[\/]?([0-9.+]+)/],
    ["gecko", /\bgecko\/(\d+)/],
    ["presto", /\bpresto\/([0-9.]+)/],
    ["androidwebkit", /\bandroidwebkit\/([0-9.]+)/],
    ["coolpadwebkit", /\bcoolpadwebkit\/([0-9.]+)/],
    ["u2", /\bu2\/([0-9.]+)/],
    ["u3", /\bu3\/([0-9.]+)/]
  ];
  var BROWSER = [
    // Sogou.
    ["sg", / se ([0-9.x]+)/],
    // TheWorld (世界之窗)
    // 由于裙带关系，TW API 与 360 高度重合。
    // 只能通过 UA 和程序安装路径中的应用程序名来区分。
    // TheWorld 的 UA 比 360 更靠谱，所有将 TheWorld 的规则放置到 360 之前。
    ["tw", function(ua){
      var x = checkTW360External("theworld");
      if(typeof x !== "undefined"){return x;}
      return "theworld";
    }],
    // 360SE, 360EE.
    ["360", function(ua) {
      var x = checkTW360External("360se");
      if(typeof x !== "undefined"){return x;}
      if(ua.indexOf("360 aphone browser") !== -1){
        return /\b360 aphone browser \(([^\)]+)\)/;
      }
      return /\b360(?:se|ee|chrome|browser)\b/;
    }],
    // Maxthon
    ["mx", function(ua){
      try{
        if(external && (external.mxVersion || external.max_version)){
          return {
            version: external.mxVersion || external.max_version
          };
        }
      }catch(ex){}
      return /\bmaxthon(?:[ \/]([0-9.]+))?/;
    }],
    ["qq", /\bm?qqbrowser\/([0-9.]+)/],
    ["green", "greenbrowser"],
    ["tt", /\btencenttraveler ([0-9.]+)/],
    ["lb", function(ua){
      if(ua.indexOf("lbbrowser") === -1){return false;}
      var version;
      try{
        if(external && external.LiebaoGetVersion){
          version = external.LiebaoGetVersion();
        }
      }catch(ex){}
      return {
        version: version || NA_VERSION
      };
    }],
    ["tao", /\btaobrowser\/([0-9.]+)/],
    ["fs", /\bcoolnovo\/([0-9.]+)/],
    ["sy", "saayaa"],
    // 有基于 Chromniun 的急速模式和基于 IE 的兼容模式。必须在 IE 的规则之前。
    ["baidu", /\bbidubrowser[ \/]([0-9.x]+)/],
    // 后面会做修复版本号，这里只要能识别是 IE 即可。
    ["ie", re_msie],
    ["mi", /\bmiuibrowser\/([0-9.]+)/],
    // Opera 15 之后开始使用 Chromniun 内核，需要放在 Chrome 的规则之前。
    ["opera", function(ua){
      var re_opera_old = /\bopera.+version\/([0-9.ab]+)/;
      var re_opera_new = /\bopr\/([0-9.]+)/;
      return re_opera_old.test(ua) ? re_opera_old : re_opera_new;
    }],
    ["yandex", /yabrowser\/([0-9.]+)/],
    // 支付宝手机客户端
    ["ali-ap", function(ua){
      if(ua.indexOf("aliapp") > 0){
        return /\baliapp\(ap\/([0-9.]+)\)/;
      }else{
        return /\balipayclient\/([0-9.]+)\b/;
      }
    }],
    // 支付宝平板客户端
    ["ali-ap-pd", /\baliapp\(ap-pd\/([0-9.]+)\)/],
    // 支付宝商户客户端
    ["ali-am", /\baliapp\(am\/([0-9.]+)\)/],
    // 淘宝手机客户端
    ["ali-tb", /\baliapp\(tb\/([0-9.]+)\)/],
    // 淘宝平板客户端
    ["ali-tb-pd", /\baliapp\(tb-pd\/([0-9.]+)\)/],
    // 天猫手机客户端
    ["ali-tm", /\baliapp\(tm\/([0-9.]+)\)/],
    // 天猫平板客户端
    ["ali-tm-pd", /\baliapp\(tm-pd\/([0-9.]+)\)/],
    ["chrome", / (?:chrome|crios|crmo)\/([0-9.]+)/],
    // UC 浏览器，可能会被识别为 Android 浏览器，规则需要前置。
    ["uc", function(ua){
      if(ua.indexOf("ucbrowser/") >= 0){
        return /\bucbrowser\/([0-9.]+)/;
      }else if(/\buc\/[0-9]/.test(ua)){
        return /\buc\/([0-9.]+)/;
      }else if(ua.indexOf("ucweb") >= 0){
        // `ucweb/2.0` is compony info.
        // `UCWEB8.7.2.214/145/800` is browser info.
        return /\bucweb([0-9.]+)?/;
      }else{
        return /\b(?:ucbrowser|uc)\b/;
      }
    }],
    // Android 默认浏览器。该规则需要在 safari 之前。
    ["android", function(ua){
      if(ua.indexOf("android") === -1){return;}
      return /\bversion\/([0-9.]+(?: beta)?)/;
    }],
    ["safari", /\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//],
    // 如果不能被识别为 Safari，则猜测是 WebView。
    ["webview", /\bcpu(?: iphone)? os (?:[0-9._]+).+\bapplewebkit\b/],
    ["firefox", /\bfirefox\/([0-9.ab]+)/],
    ["nokia", /\bnokiabrowser\/([0-9.]+)/]
  ];

  /**
   * UserAgent Detector.
   * @param {String} ua, userAgent.
   * @param {Object} expression
   * @return {Object}
   *    返回 null 表示当前表达式未匹配成功。
   */
  function detect(name, expression, ua){
    var expr = isFunction(expression) ? expression.call(null, ua) : expression;
    if(!expr){return null;}
    var info = {
      name: name,
      version: NA_VERSION,
      codename: ""
    };
    var t = toString(expr);
    if(expr === true){
      return info;
    }else if(t === "[object String]"){
      if(ua.indexOf(expr) !== -1){
        return info;
      }
    }else if(isObject(expr)){ // Object
      if(expr.hasOwnProperty("version")){
        info.version = expr.version;
      }
      return info;
    }else if(expr.exec){ // RegExp
      var m = expr.exec(ua);
      if(m){
        if(m.length >= 2 && m[1]){
          info.version = m[1].replace(/_/g, ".");
        }else{
          info.version = NA_VERSION;
        }
        return info;
      }
    }
  }

  var na = {name:"na", version:NA_VERSION};
  // 初始化识别。
  function init(ua, patterns, factory, detector){
    var detected = na;
    each(patterns, function(pattern){
      var d = detect(pattern[0], pattern[1], ua);
      if(d){
        detected = d;
        return false;
      }
    });
    factory.call(detector, detected.name, detected.version);
  }

  /**
   * 解析 UserAgent 字符串
   * @param {String} ua, userAgent string.
   * @return {Object}
   */
  var parse = function(ua){
    ua = (ua || "").toLowerCase();
    var d = {};

    init(ua, DEVICES, function(name, version){
      var v = parseFloat(version);
      d.device = {
        name: name,
        version: v,
        fullVersion: version
      };
      d.device[name] = v;
    }, d);

    init(ua, OS, function(name, version){
      var v = parseFloat(version);
      d.os = {
        name: name,
        version: v,
        fullVersion: version
      };
      d.os[name] = v;
    }, d);

    var ieCore = IEMode(ua);

    init(ua, ENGINE, function(name, version){
      var mode = version;
      // IE 内核的浏览器，修复版本号及兼容模式。
      if(ieCore){
        version = ieCore.engineVersion || ieCore.engineMode;
        mode = ieCore.engineMode;
      }
      var v = parseFloat(version);
      d.engine = {
        name: name,
        version: v,
        fullVersion: version,
        mode: parseFloat(mode),
        fullMode: mode,
        compatible: ieCore ? ieCore.compatible : false
      };
      d.engine[name] = v;
    }, d);

    init(ua, BROWSER, function(name, version){
      var mode = version;
      // IE 内核的浏览器，修复浏览器版本及兼容模式。
      if(ieCore){
        // 仅修改 IE 浏览器的版本，其他 IE 内核的版本不修改。
        if(name === "ie"){
          version = ieCore.browserVersion;
        }
        mode = ieCore.browserMode;
      }
      var v = parseFloat(version);
      d.browser = {
        name: name,
        version: v,
        fullVersion: version,
        mode: parseFloat(mode),
        fullMode: mode,
        compatible: ieCore ? ieCore.compatible : false
      };
      d.browser[name] = v;
    }, d);
    return d;
  };


  // NodeJS.
  if(typeof process === "object" && process.toString() === "[object process]"){

    // 加载更多的规则。
    var morerule = module["require"]("./morerule");
    [].unshift.apply(DEVICES, morerule.DEVICES || []);
    [].unshift.apply(OS,      morerule.OS      || []);
    [].unshift.apply(BROWSER, morerule.BROWSER || []);
    [].unshift.apply(ENGINE,  morerule.ENGINE  || []);

  }else{

    var userAgent = navigator.userAgent || "";
    //var platform = navigator.platform || "";
    var appVersion = navigator.appVersion || "";
    var vendor = navigator.vendor || "";
    external = window.external;

    detector = parse(userAgent + " " + appVersion + " " + vendor);

  }


  detector.parse = parse;


  var device = {
    type: 'pc'
  }

  var ua = navigator.userAgent;
  var de = detector.device.name;
  var os = detector.os.name;
  var browser = detector.browser.name;
  var devices = '|pc|mac|na|';
  var tablet = !!(de === 'ipad' ||
      (os === 'android' && !ua.match(/Mobile/)) ||
      (browser === 'firefox' && ua.match(/Tablet/)));
  var phone = !!(!tablet && (devices.indexOf('|' + de + '|') < 0) && os !== 'linux');

  if (tablet) {
    device.type = 'pad';
  }

  if (phone) {
    device.type = 'mobile';
  }

  device.config = detector;

  glue.device = device;
  window.device = device;

  return glue;

}(glue || {}));

/* filePath fetchtemp/scripts/modelFactory_35e4aa29.js*/

window.glue = (function (glue) {
  'use strict';

  var win = window;

  //===================修复浏览器对Object.defineProperties的支持=================
  var defineProperty = Object.defineProperty;
  var defineProperties;
  //如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
  //标准浏览器使用__defineGetter__, __defineSetter__实现
  try {
    defineProperty({}, "_", {
      value: "x"
    });
    defineProperties = Object.defineProperties;
  } catch (e) {
    defineProperty = function (obj, prop, desc) {

      if ('value' in desc) {
        obj[prop] = desc.value;
      }

      if ("get" in desc) {
        obj.__defineGetter__(prop, desc.get);
      }

      if ('set' in desc) {
        obj.__defineSetter__(prop, desc.set);
      }

      return obj;
    };

    defineProperties = function (obj, descs) {
      
      for (var prop in descs) {

        if (descs.hasOwnProperty(prop)) {
          defineProperty(obj, prop, descs[prop]);
        }
      }

      return obj;
    };
  }


  //VBScript下的属性监控
  if (window.VBArray && window.execScript) {  //IE 11 已经不支持vbscript了
    var expose = new Date() - 0;
    window.execScript([
      "Function parseVB(code)",
      "\tExecuteGlobal(code)",
      "End Function"
    ].join("\n"), "VBScript");

    //这里是属性变换时的代理方法
    var VBMediator = function (accessingProperties, name, value) {
      var accessor = accessingProperties[name];
      if (arguments.length === 3) {
        accessor(value);
      } else {
        return accessor();
      }
    };

    defineProperties = function (name, accessingProperties, normalProperties) {
      var className = "VBClass" + setTimeout("1"),
          buffer = [];
      buffer.push(
        "Class " + className,
        "\tPrivate [__data__], [__proxy__]",
        "\tPublic Default Function [__const__](d, p)",
        "\t\tSet [__data__] = d: set [__proxy__] = p",
        "\t\tSet [__const__] = Me", //链式调用
        "\tEnd Function");

      //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
      for (name in normalProperties) {
        buffer.push("\tPublic [" + name + "]");
      }

      buffer.push("\tPublic [" + 'hasOwnProperty' + "]");

        //添加访问器属性 
      for (name in accessingProperties) {

        if (!(name in normalProperties)) { //防止重复定义
          buffer.push(
            //由于不知对方会传入什么,因此set, let都用上
            "\tPublic Property Let [" + name + "](val" + expose + ")", //setter
            "\t\tCall [__proxy__]([__data__], \"" + name + "\", val" + expose + ")",
            "\tEnd Property",
            "\tPublic Property Set [" + name + "](val" + expose + ")", //setter
            "\t\tCall [__proxy__]([__data__], \"" + name + "\", val" + expose + ")",
            "\tEnd Property",
            "\tPublic Property Get [" + name + "]", //getter
            "\tOn Error Resume Next", //必须优先使用set语句,否则它会误将数组当字符串返回
            "\t\tSet[" + name + "] = [__proxy__]([__data__],\"" + name + "\")",
            "\tIf Err.Number <> 0 Then",
            "\t\t[" + name + "] = [__proxy__]([__data__],\"" + name + "\")",
            "\tEnd If",
            "\tOn Error Goto 0",
            "\tEnd Property");
        }
      }

      buffer.push("End Class"); //类定义完毕
      buffer.push(
        "Function " + className + "Factory(a, b)", //创建实例并传入两个关键的参数
        "\tDim o",
        "\tSet o = (New " + className + ")(a, b)",
        "\tSet " + className + "Factory = o",
        "End Function");
      window.parseVB(buffer.join("\r\n")); //先创建一个VB类工厂
      return window[className + "Factory"](accessingProperties, VBMediator); //得到其产品
    };
  }


  /**
   * dataModel工厂,使用司徒的双向绑定
   * @param {function}modelFn 模型的方法，这是为了实现Vbscript兼容，只能这样，有点不符合javascript的语义。
   * @return 模型对象
   */
  var define = function (modelFn) {

    if (!glue.isFunction(modelFn)) {
      glue.error('modelFn必须是个方法或数组！');
    }

    var model = {}; //内置的对象
    modelFn(model); //初始化obj对象
    return createModel(model);
  };

  var createModel = function (model) {
         
    //model中的属性如果是数组需要封装成可见听的数组，监听数组的基本功能
    if (glue.isArray(model)) {
      return new ArrayProxy(model);
    }
         
    for (var p in model) { //设置属性变化时的触发方法

      if (glue.isObject(model[p]) || glue.isArray(model[p])) {
        model[p] =  createModel(model[p]);
      }
    }
         
    model.$events = {};  //属性监听回调事件列表
    model.$watch = function () {};
    model.$unWatch = function () {};
    model.$orgModel = {};

    var normalProperties = {};
    var propertiesAccessor = {};
    var vmodelRef = {};
    var orgModel = {};

    for (var pName in model) { //设置属性变化时的触发方法

      if (pName.substring(0, 1) !== '$' && !glue.isFunction(model[pName])) {
        orgModel[pName] = model[pName];
        propertiesAccessor[pName] = (function (pName) {
          return function (/* obj */) {
            var p, val, i, fn, events;
            var vmodel = vmodelRef.vmodel;

            if (arguments.length > 0) { //setting
              var value = arguments[0];
              var oldValue = vmodel.$orgModel[pName];

              if (value !== oldValue) {   //如果值相等，不做处理

                if (glue.isArray(oldValue)) {
                  val = vmodel[pName];
                  val.clear();         //清空数组
                  
                  // for (i = 0 ; i < value.length; i++) {  //重新设置值 
                  //   val.push(value[i]);
                  // }
                  // 将数组一次性push到数组中。
                  val.push.apply(val, value);

                } else if (glue.isObject(oldValue)) {
                  val = vmodel[pName];

                  for (p in value) {  //__const__  __data__ __proxy__ 都是vb里申明的，这里不能调用

                    if (p.substring(0, 1) !== '$' &&
                        p !== '__const__' &&
                        p !== '__data__' &&
                        p !== '__proxy__' &&
                        p !== 'hasOwnProperty' &&
                        !glue.isFunction(value[p])) {
                      val[p] = value[p];
                    }
                  }

                  events = vmodel.$events[pName] || [];

                  for (i = 0; i < events.length; i++) {
                    fn = events[i].callback;
                    fn.call(events[i].context, value);
                  }

                } else {
                  vmodel.$orgModel[pName] = value;
                  events = vmodel.$events[pName];

                  if (typeof events !== 'undefined') {

                    for (i = 0; i < events.length; i++) {
                      fn = events[i].callback;
                      fn.call(events[i].context, value);
                    }
                  }

                  return;
                }

                if (value.$watch && vmodel.$orgModel[pName].$watch) { //引用赋值，是否出现作用域问题？
                  /* 
                     新值是一个可监控对象并且原始也是一个可监控对象，
                     则需要将原始对象的监听事件拷贝到新值中
                   */
                  events = vmodel.$orgModel[pName].$events;

                  for (p in events) {
                    value.$watch(p, events[p].callback, events[p].context);
                  }

                  vmodel.$orgModel[pName] = value;
                }
              }
            } else { //getting
              return vmodel.$orgModel[pName];
            }
          };
        })(pName);

      } else {
        normalProperties[pName] = model[pName];
      }
    }
         
    //!(window.VBArray && window.execScript) 判断是不是IE 11版本以下
    var descriptorFactory = !(win.VBArray && win.execScript) ?
      function (obj) { //这里主要是为了适配definedProperty
        var descriptors = {};
        for (var i in obj) {
          descriptors[i] = {
            get: obj[i],   //这里的方法其实就是 propertiesAccessor
            set: obj[i]
          };
        }
        return descriptors;
      } : function (a) {
        return a;
      };
         
    var vmodel = defineProperties(model, descriptorFactory(propertiesAccessor), normalProperties);
    vmodelRef.vmodel = vmodel;  //为访问器提供对封装过的model引用
    vmodel.$events = {};      //属性监听回调事件列表
    vmodel.$watch = function () {};
    vmodel.$unWatch = function () {};
    vmodel.$orgModel = orgModel;

    /* 添加属性监听事件
    * @param propertyName 属性名称
    * @param changeFn     回调方法
    */
    var addPropertyChangeListener = function (propertyName, changeFn, context) {

      if (typeof this.$events[propertyName] === 'undefined') {
        this.$events[propertyName] = [];
      }

      this.$events[propertyName].push({callback: changeFn, context: context || this}); //注册属性的监听事件
    };

    // @todo 这里如果使用this.model.$unWatch的时候，只能去掉model下面所有属性的监听函数
    // 无法去掉model.property下面属性的监听函数，是否要递归进去做删除呢？
    // 暂时不做。
    var removePropertyChangeListener = function (propertyName, changeFn, context) {

      // 如果某个参数没有定义，则表示过滤时此参数直接通过。
      propertyName = propertyName || '*';
      changeFn = changeFn || '*';
      context = context || '*';
      var eventList;
      var oneEvent;
      var i;
      var p;

      if (glue.isArray(this) || glue.isObject(this)) {
        for (p in this) {  //__const__  __data__ __proxy__ 都是vb里申明的，这里不能调用

          if (p.substring(0, 1) !== '$' &&
              p !== '__const__' &&
              p !== '__data__' &&
              p !== '__proxy__' &&
              p !== 'hasOwnProperty' &&
              !glue.isFunction(this[p])) {
            removePropertyChangeListener.bind(this[p])(propertyName, changeFn, context);
          }
        }
      }

      // 遍历events对象，将其中符合条件的条目移除
      for (var key in this.$events) {

        if (key === propertyName || propertyName === '*') {
          eventList = this.$events[key];

          // 从后往前移除数组内内容，防止正向遍历移除后i指向出现问题。
          for (i = eventList.length - 1; i >= 0; i--) {
            oneEvent = eventList[i];

            if ((oneEvent.callback === changeFn || changeFn === '*') &&
                (oneEvent.context === context || context === '*')) {
              eventList.splice(i, 1);
            }
          }

          if (eventList.length === 0) {
            delete this.$events[key];
          }
        }
      }

    };

    vmodel.$unWatch = removePropertyChangeListener.bind(vmodel);
    vmodel.$watch = addPropertyChangeListener.bind(vmodel);
    return vmodel;
  };
    
  //数组代理
  var ArrayProxy = function (array) {
      
    //array.$orgModel = array;
    array.$events = {};

    array.$unWatch = function (fnName, notifyFn, context) {

      // 如果某个参数没有定义，则表示过滤时此参数直接通过。
      fnName = fnName || '*';
      notifyFn = notifyFn || '*';
      context = context || '*';
      var eventList;
      var oneEvent;
      var i;

      // 遍历events对象，将其中符合条件的条目移除
      for (var key in this.$events) {

        if (key === fnName || fnName === '*') {
          eventList = this.$events[key];

          // 从后往前移除数组内内容，防止正向遍历移除后i指向出现问题。
          for (i = eventList.length - 1; i >= 0; i--) {
            oneEvent = eventList[i];

            if ((oneEvent.callback === notifyFn || notifyFn === '*') &&
                (oneEvent.context === context || context === '*')) {
              eventList.splice(i, 1);
            }
          }

          if (eventList.length === 0) {
            delete this.$events[key];
          }
        }
      }

    };

    array.$watch = function (fnName, notifyFn, context) {

      if (typeof this.$events[fnName] === 'undefined') {
        this.$events[fnName] = [];
      }

      this.$events[fnName].push({callback: notifyFn, context: context || this});
    };

    array.push = function () {
      var length = Array.prototype.push.apply(this, arguments);
      var args = [].slice.call(arguments);
      this.$fire('push', args);
      return length;
    };

    array.pop = function () {
      var last = Array.prototype.pop.apply(this, arguments);
      this.$fire('pop', last);
      return last;
    };

    array.unshift = function () {
      var length = Array.prototype.unshift.apply(this, arguments);
      var args = [].slice.call(arguments);
      this.$fire('unshift', args);
      return length;
    };

    array.shift = function () {
      var first = Array.prototype.shift.apply(this, arguments);
      this.$fire('shift', first);
      return first;
    };

    array.clear = function () {
      this.length = 0; //清空数组
      this.$fire('clear');
      return this;
    };

    array.unshift = function () {
      var length = Array.prototype.unshift.apply(this, arguments);
      var args = [].slice.call(arguments);
      this.$fire('unshift', args);
      return length;
    };

    array.$fire = function (fnName) {
      var args = [].slice.call(arguments);
      var eventList = this.$events[fnName];
      var oneEvent;
      if (typeof eventList !== 'undefined') {

        for (var i = 0; i < eventList.length; i++) {
          oneEvent = eventList[i];
          if (args.length > 1) {
            oneEvent.callback.call(oneEvent.context, args[1]);
          } else {
            oneEvent.callback.call(oneEvent.context, args[1]);
          }
        }
      }
    };
         
    return array;
  };

  var modelFactory = {'define' : define, 'defineArray': ArrayProxy};

  glue.modelFactory = modelFactory;

  return glue;
}(glue || {}));

/* filePath fetchtemp/scripts/widgetManage_5df7d743.js*/

window.glue = (function (glue) {
  'use strict';

  var widgets = {};
  var allUuid = {};

  var uuid = 0;

  glue.extend(glue, {
    
    // 创建一个uuid;
    createWidgetUuid: function () {
      uuid++;
      return '__glue_widget_' + uuid;
    },

    // 添加一个组件
    addWidget: function (widget) {

      if (typeof widget.uuid === 'undefined') {
        widget.uuid = glue.createWidgetUuid();
      }

      widgets[widget.uuid] = widget;
    },

    // 移除一个组件
    removeWidget: function (uuid) {

      if (typeof uuid !== 'string') {
        uuid = uuid.uuid;
      }

      var widget = widgets[uuid];
      delete widgets[uuid];
      widget.destroy();
    },

    // 获得一个组件
    getWidget: function (uuid) {

      if (typeof uuid !== 'string') {
        uuid = uuid.uuid;
      }

      return widgets[uuid];
    },

    // 获得所有组件
    getAllWidget: function () {
      return widgets;
    },

    // 检查uuid是否重复。
    checkUuid: function (uuid) {

      if (allUuid[uuid] === true) {
        var errMsg = '组件的Uuid冲突，请检查你设置的uuid值是否重复，冲突uuid: ' + uuid;
        glue.log(errMsg);
        return false;
      }

      return true;


    },

    regUuid: function (uuid) {
      allUuid[uuid] = true;
    }
  });

  return glue;

}(glue || {}));
/* filePath fetchtemp/scripts/widgetMessage_5c02039a.js*/

window.glue = (function (glue) {
  
  'use strict';

  var win = window;
  var messages = {};

  // 创建一个自定义事件，用于做glue上的消息的基础对象。
  var events = new glue.Events();
  var eventSplitter = /\s+/;

  glue.extend(glue, {

    /**
     * 注册一个消息
     * @param  {String }   name    消息名称
     * @param  {Function} callback 该事件的回调函数
     * @param  {Object}   context  回调函数执行的上下文，如果没有传入的话，会指向window
     */
    observer: function (name, callback, context) {
      context = context || win;
      var message;
      var names = name.split(eventSplitter);
      events.on(name, callback, context);

      for (var i = 0, iLen = names.length; i < iLen; i++) {
        message = this.getMessage(names[i]);

        if (message.length > 0) {
          callback.apply(context, message[message.length - 1]);
        }

      }
    },

    /**
     * 注销一个消息
     * @param  {String}   name     消息名称
     * @param  {Function} callback 对应的函数，如果没有传入的话，
     *                             则会将此自定义事件名下的所有注册函数都注销掉
     *                             如果有多次注册的函数，也会一次全部注销
     */
    unObserver: function (name, callback, context) {
      events.off(name, callback, context);
    },


    /**
     * 发送一条消息
     * @param  {String} name 事件名称
     * 其他参数为消息内容。
     */
    notify: function (name) {
      var names = name.split(eventSplitter);
      var params = [].slice.call(arguments, 1);

      for (var i = 0, iLen = names.length; i < iLen; i++) {
        this.addMessage(names[i], params);
      }

      events.trigger.apply(events, arguments);
    },

    /**
     * 获取消息回调列表列表
     * @param  {String} name 需要获取的消息名称，如果不传，则获取所有消息回调的列表
     */
    getObserver: function (name) {
      
      if (typeof name === 'undefined') {
        return events;
      }

      return events.__events[name] || [];
    },

    /**
     * 添加一条消息
     * @param {String} name    消息名称
     * @param {Array}  message 消息对应的参数，以数组形式返回。
     */
    addMessage: function (name, message) {

      if (typeof messages[name] === 'undefined') {
        messages[name] = [];
      }

      messages[name].push(message);
    },

    /**
     * 获取消息
     * @param  {String} name 消息名称，如果没有传，则获取所有消息
     */
    getMessage: function (name) {

      if (typeof name === 'undefined') {
        return messages;
      }

      return messages[name] || [];
    }

  });

  return glue;
}(glue || {}));
/* filePath fetchtemp/scripts/widgetRegist_f2bae040.js*/

window.glue = (function (glue) {
  'use strict';

  var doc = document;
  var win = window;

  /**
   * 检查注册组件的版本是否正确
   * @param  {String} cid     组件id
   * @param  {String} cname   组件名称
   * @param  {String} version 组件版本号，没有会传入一个空值
   * @return {[type]}         [description]
   */
  // var checkVersion = function (cid, cname, version) {

  //   // 哪种状态需要version？
  //   // 1.在本地调试状态
  //   // 2.在combo的时候
  //   // 存在以下情况之一
  //   // 1.version为空，并且在glueComponentVerMap中也没有定义
  //   // 2.version存在，但是和glueComponentVerMap的不一致
  //   // 需要对开发者进行提示

  //   var debugConfigGet = glue.debug.debugConfigGet() || {};
  //   var isLocal = debugConfigGet.isLocal;
  //   var useComboServer = glue.options.useComboServer;

  //   if (isLocal !== true && useComboServer !== true) {
  //     return;
  //   }

  //   var map = typeof glueComponentVerMap === 'undefined' ? {} : glueComponentVerMap;
  //   var outVersion = map[cname];
  //   var errMsg1 = '组件' + cname + '(id: ' + cid + ')未定义版本，请检查';
  //   var errMsg2 = '组件' + cname + '(id: ' + cid + ')' +
  //       '版本信息 ( ' + version + ' ) 与页面上glueComponentVerMap中定义的版本信息 ( ' +
  //       outVersion + ' ) 不一致，请检查';

  //   // version未定义的情况，在发布环境里面，这么提示会不会太粗鲁了。
  //   if (typeof version === 'undefined' && typeof outVersion === 'undefined') {
  //     alert(errMsg1);
  //     throw new Error(errMsg1);
  //   }

  //   if ((typeof version !== 'undefined' && typeof outVersion !== 'undefined') &&
  //       version !== outVersion) {
  //     alert(errMsg2);
  //     throw new Error(errMsg2);
  //   }
  // };

  // @todo 将其中和注册无关的参数移动到相应的文件中（widgetRun.js widgetScan.js）
  // 这个文件和run文件以及scan文件里面最大的问题是变量命名不够清晰。回头要仔细梳理一下。
  glue.extend(glue, {

    // 组件注册表，主要用于记录注册对象信息
    regWidgetList: {/*id : widget*/},

    // 组件注册表，基于优先级进行注册，
    // 注意：每次在run的时候，都会将此对象进行重置，防止重复实例化组件。
    regWidgetPriorityList: {/*priority: [widget, widget]*/},


    // 组件名称表，用于记录注册的组件名称
    // 注意：如果使用combo服务，则每次combo的时候，都要将此表中的数据，
    //      移动到regWidgetComboedNames中防止重复注册
    regWidgetUnComboNames: {},

    // 用于记录注册组件的名称，该对象包含所有注册过的组件名称。
    regWidgetAllNames: {},

    // 已经通过combo服务加载过的组件。
    // @todo，回头还需要将页面上没有通过combo服务加载的组件也放进来。
    // 这个要如何实现呢？忘了。
    regWidgetComboedNames: {},


    // 组件依赖列表，放置那些需要被依赖组件(depId)进行操作才能实例化的组件
    depWidgetList: {/*depId : [widget, ..]*/},

    /**
     * 注册一个组件
     * @param {String} container 组件所在容器
     * @param {String} cid 组件实例id
     * @param {String} cname 组件类型
     * @param {String} depId 依赖组件
     * @param {Number} priority 优先级
     * @param {object} options 实例create时传入的参数
     * @param {object} parent 创建实例的父实例，如果没有，传入glue。
     */
    widgetRegist: function (container, cid, cname, depId, priority, options, parent) {

      // 对cname进行处理
      // var temps = cname.split('#');
      // cname = temps[0];
      // var version = temps[1];

      // checkVersion(cid, cname, version);

      // // 将版本注册到glueComponentVerMap中
      // if (typeof version !== 'undefined') {

      //   if (typeof glueComponentVerMap === 'undefined') {
      //     win.glueComponentVerMap = {};
      //   }

      //   glueComponentVerMap[cname] = version;
      // }

      // 处理优先级
      if (typeof priority === 'undefined' || priority === null) {
        priority = 1;
      }

      // 将组件名注册到regWidgetAllNames中。
      // 用于在glue.debug中获取注册组件的名称列表。
      glue.regWidgetAllNames[cname] = cname;

      // 如果在regWidgetComboedNames对象中（已经进行过combo的组件名数组，
      // 都会在regWidgetComboedNames进行记录，避免重复加载）不存在此组件，
      // 并且在hasDefine对象中（使用define定义过的组件都会在hasDefine中记录）不存在此组件
      // 将其组件名加入glue.regWidgetUnComboNames中，为以后combo加载脚本做准备。
      if (typeof glue.regWidgetComboedNames[cname] === 'undefined' &&
          typeof glue.hasDefine[cname] === 'undefined') {
        glue.regWidgetUnComboNames[cname] = cname;
      }

      // 在注册时，先通过传入的参数，创建一个对象，
      // 将这个对象分别注册到组件优先级对象(regWidgetPriorityList)上
      // 和组件注册列表对象(regWidgetPriorityList)上
      // 这两者的区别是：
      // regWidgetPriorityList用在glue.run中，注册到里面的widget对象在glue.run的时候，会从里面进行移除
      // regWidgetList是一个记录和查询注册组件的地方。
      var widgetDefine = {
        'id': cid,  //组件id
        'priority': priority, //优先级
        'nexts': [],  //依赖该widget的组件
        'instance': null,  //widget实例
        'depId': depId,  //该widget依赖的组件的id
        'cname': cname,
        'regTime': new Date().valueOf(),
        'startTime': '',
        'createTime': '',
        'start': function () {  //组件启动
          widgetDefine.startTime = new Date().valueOf();
          parent = parent || glue;

          try {
            require([cname], function (Widget) {
              var widget =  new Widget(parent, cid);
              widget.create(container, options);
              widgetDefine.instance = widget;
              widgetDefine.createTime = new Date().valueOf();
            });
          } catch (error) {
            glue.log('require ：cname ' + error);
          }
        }
      };
           
      if (typeof depId !== 'undefined' && depId !== null) {

        if (typeof glue.depWidgetList[depId] === 'undefined') {
          // 创建一个依赖数组
          glue.depWidgetList[depId] = [];
        }

        glue.depWidgetList[depId].push(widgetDefine);
      } else {

        if (typeof glue.regWidgetPriorityList[priority] === 'undefined') {
          // 创建一个优先级数组
          glue.regWidgetPriorityList[priority] = [];
        }

        glue.regWidgetPriorityList[priority].push(widgetDefine);
      }

      // ?? 这个按照逻辑，放到优先级注册里面比较好。否则有的组件要被注册两次
      glue.regWidgetList[cid] = widgetDefine;
    }

  });

  return glue;
}(glue || {}));
/* filePath fetchtemp/scripts/widgetScan_88423c3e.js*/

window.glue = (function (glue) {
  'use strict';

  var doc = document;
  var root = doc.documentElement;

  glue.extend(glue, {

    /**
     * 扫描方法，用来识别组件.
     * @param element 需要扫描的范围
     */
    scan: function (element) {
      element = element || root;  //如果没有指定则扫描全部
      //1、分析出所有有cid的
      scanNodes(element);
    }

  });

  /**
   * 扫描所有节点，碰到g-cid的组件后退出，由组件自身去完成初始化工作
   * @param element  扫描的节点
   * @param model 节点的数据对象
   */
  var scanNodes = function (element) {
    var options = glue.options;
    var cid = element.getAttribute(options.prefix + 'cid');     //组件实例id
    var cname = element.getAttribute(options.prefix + 'cname'); //组件名称
    var priority = element.getAttribute(options.prefix + 'priority');  //组件的优先调用时间
    var depWidgetId = element.getAttribute(options.prefix + 'depId'); //依赖启动的组件
    var isRegister = element.getAttribute(options.prefix + 'isRegister');
   
    if (glue.isString(cid) && glue.isString(cname) && isRegister !== 'registered') {
      element.setAttribute('g-isRegister', 'registered');
      glue.widgetRegist(element, cid, cname, depWidgetId, priority);
      // 这里如果不return的话，会对组件内部的dom节点进行继续扫描。
      return;
    }

    var node = element.firstChild;

    while (node) {
      var nextNode = node.nextSibling;

      if (node.nodeType === 1) {
        scanNodes(node); //扫描元素节点
      }

      node = nextNode;
    }
  };

  return glue;
}(glue || {}));
/* filePath fetchtemp/scripts/widgetRun_c26d65f8.js*/

window.glue = (function (glue) {
  'use strict';

  var doc = document;
  var runTimer = null;

  // 组件注册列表的权重集合，用于对权重做排序。
  var regPriorityArray = [];

  glue.extend(glue, {

    // 等待执行的combo任务的队列，
    // 因为如果一个页面进行多次combo请求的话，为了避免后面的combo比前面的先完成，
    // 导致请求的文件缺少依赖，combo请求只能以队列的形式按顺序逐一进行请求发送，
    comboQuestList: [],

    // combo状态，false代表没进行combo请求，true代表正在进行combo请求
    isComboing: false,

    // 运行注册组件的状态，false代表没运行，true代表正在运行
    isRunRegWidgets: false,

    run: function () {

      //1、装载所有组件依赖文件（暂时先本地装载）
      //2、初始化组件。调用组件的create构造组件
      installDepWidget();
      sortPriority();

      if (glue.options.useComboServer) {
        loadWidgetScript(function () {
          runRegWidgets();
        });
      } else {
        runRegWidgets();
      }
    },

    /**
     * 将widgetInstance上注册的依赖组件导入执行列表进行组件实例化。
     * @param  {widgetInstance} widget 一个组件实例
     */
    notifyDepExce: function (widget) {
      
      var widgetDefine = glue.regWidgetList[widget.uuid];

      if (typeof widgetDefine !== 'undefined') {
        var priority = widgetDefine.priority;
        var list = glue.regWidgetPriorityList[priority];
        var nexts = widgetDefine.nexts;

        // 将依赖此组件的组件注册表跟优先级组件注册表合并
        list.push.apply(list, nexts);

        //清除列表，避免重复注册
        widgetDefine.nexts = [];

        // for (var i = 0; i < nexts.length; i++) {
        //   //将依赖启动的组件放置到当前组件所在的优先组中,这里忽略依赖启动的组件创建顺序
        //   list.push(nexts[i]);
        // }

        //如果当前nexts长度大于0并且没有运行实例化注册组件，则执行runRegWidgets开始注册组件
        if (nexts.length > 0 && glue.isRunRegWidgets === false) {
          runRegWidgets();
        }
      }
    }
  });

  /**
   * 将需要依赖启动的组件注册到相应的依赖组件上
   */
  var installDepWidget = function () {
    var widgetDefine;

    for (var p in glue.depWidgetList) {

      widgetDefine = glue.regWidgetList[p];
      if (typeof glue.regWidgetList[p] !== 'undefined') {

        // 这里需要将数组进行合并，避免多次执行run的时候，对nexts进行覆盖的问题出现。
        widgetDefine.nexts = widgetDefine.nexts.concat(glue.depWidgetList[p]);

        // 置空依赖列表，防止重复注册
        glue.depWidgetList[p] = [];

        // 如果组件已经实例化，并且组件已经启用了依赖他的组件
        if (widgetDefine.instance && widgetDefine.instance.isDependWidgetRun === true) {
          glue.notifyDepExce(widgetDefine.instance);
        }
      }
    }
  };

  // var serializeWidgetName = function (regWidgetUnComboNames) {

  //   var result = [];
  //   var widgetName;
  //   var version;
  //   var widgetMap = win.glueComponentVerMap || {};

  //   for (var i = 0, iLen = regWidgetUnComboNames.length; i < iLen; i++) {
  //     widgetName = regWidgetUnComboNames[i];
  //     version = widgetMap[widgetName] || '';
  //     result.push(widgetName + '#' + version);
  //   }

  //   return result.join(',');
  // };

  // 序列化组件名。
  var serializeWidgetName = function (comboNames) {
    return comboNames.join(',');
  };

  /**
   * 装载组件相关的脚本。使用combo方式时候使用
   * @param {Function} callback 脚本装载完的回调
   */
  var loadWidgetScript = function (callback) {

    if (glue.isComboing === true) {
      glue.comboQuestList.push(callback);
      return;
    }

    glue.isComboing = true;

    //将需要导入的Widget装配为请求地址
    var unComboedNames = [];
    var comboedNames = [];
    var options = glue.options;
    var head = doc.head || doc.getElementsByTagName("head")[0];

    for (var key in glue.regWidgetComboedNames) {
      comboedNames.push(key);
    }

    for (var cname in glue.regWidgetUnComboNames) {
      unComboedNames.push(cname);
      // 将相应组件加入到已combo对象列表中，防止重复加载。
      glue.regWidgetComboedNames[cname] = cname;
    }

    // 将待combo数组清空，防止重复加载。
    glue.regWidgetUnComboNames = {};

    // 如果没有需要加载的组件，则直接调用回调
    if (unComboedNames.length === 0) {

      if (callback) {
        callback();//直接回调  
      }

      // 调用下一个脚本加载
      loadWidgetScriptNext();
      return;
    }

    //将canme排序，不同转载顺序的组件请求的地址一样
    unComboedNames.sort();
    comboedNames.sort();

    //生成待请求的脚本地址
    //参数含义：
    //c= 需要合并的组件
    //f= 需要过滤的组件
    //isCompress 是否压缩 (true 是 | false否)
    var url = options.comboServer + '?c=' + encodeURIComponent(serializeWidgetName(unComboedNames)) +
        '&f=' + encodeURIComponent(serializeWidgetName(comboedNames));

    // 根据debug设置，处理压缩参数。
    var debugConfig = glue.debug.debugConfigGet();

    if (debugConfig.isCompress === false) {
      url = url + '&isCompress=false';
    } else {
      url = url + '&isCompress=true';
    }

    // 设置
    url = url + '&device=' + glue.device.type;

    //通过script节点加载目标模块
    var node = doc.createElement("script");

    node[glue.W3C ? "onload" : "onreadystatechange"] = function () {

      if (glue.W3C || /loaded|complete/i.test(node.readyState)) {
        glue.isComboing = false;
        if (callback) {
          callback();
        }

        // 调用下一个脚本加载
        loadWidgetScriptNext();
      }
    };

    node.onerror = function () {
      alert('装载失败！');
    };

    node.src = url; //插入到head的第一个节点前，防止IE6下head标签没闭合前使用appendChild抛错
    head.insertBefore(node, head.firstChild); //chrome下第二个参数不能为null        
  };

  var loadWidgetScriptNext = function () {

    var comboCallback;

    if (glue.comboQuestList.length > 0) {
      comboCallback = glue.comboQuestList.shift();
      loadWidgetScript(comboCallback);
    }

  };

  var sortPriority = function () {

    regPriorityArray = [];

    //对优先级队列排序
    for (var priority in glue.regWidgetPriorityList) {
      regPriorityArray.push(priority);
    }

    regPriorityArray.sort(function (a, b) {
      return b - a;  //降序
    });
  };

  /**
   * 按照组件优先级装载组件
   */
  var runRegWidgets = function () {

    clearTimeout(runTimer);
    runTimer = setTimeout(function () {

      //找到优先级最高的widgetDefine进行
      var hasWidgetDefine = false;
      var widgetsDefine, widgetDefine;
      var i, iLen;

      for (i = 0, iLen = regPriorityArray.length; i < iLen; i++) {
        widgetsDefine = glue.regWidgetPriorityList[regPriorityArray[i]];

        // for (j = 0, jLen = widgetsDefine.length; j < jLen; j++) {
        //   widget = widgetsDefine[j];

        //   // 如果未启用脚本的combo服务，或者当前组件已经加载了。
        //   // 其实这个判断逻辑好像有点多余。
        //   if (glue.options.useComboServer === false || glue.hasDefine[widget.cname]) {
        //     widgetsDefine.splice(j, 1);
        //     widget.start();
        //     hasWidgetDefine = true;
        //     break;
        //   }
        // }

        if (widgetsDefine.length > 0) {
          widgetDefine = widgetsDefine.shift();
          widgetDefine.start(); //启动脚本
          hasWidgetDefine = true;
          break;
        }
      }

      if (hasWidgetDefine) {
        glue.isRunRegWidgets = true;
        runRegWidgets();
      } else {
        glue.isRunRegWidgets = false;
      }
    }, 50);
  };

  return glue;
}(glue || {}));
/* filePath fetchtemp/scripts/resolveObject_457e670a.js*/

window.glue = (function (glue) {
  'use strict';

  var win = window;

  glue.extend(glue, {

    /**
     * 解析对象
     * @param scope 对象作用域
     * @param objPathExpr 对象路径
     * @param resolveComplete 对象解析完成后的回调
     * @return {object}
                value : 表达式值
                $watch : 表达式属性的监听方法
                $set   : 表达式的赋值方法
     */
    resolveObject: function (scope, objPathExpr, resolveComplete) {
      var ret = resolveObject(scope, objPathExpr);
      resolveComplete(ret);
    }

  });

  /**
   * 解析对象
   * @param scope 对象作用域
   * @param objPathExpr 对象路径
   * @return {object}
              value : 表达式值
              $watch : 表达式属性的监听方法
              $set   : 表达式的赋值方法
   */
  var resolveObject = function (scope, objPathExpr, parentObj) {
    var splitArray = objPathExpr.split('.');
    var firstName = splitArray.shift();

    if (!glue.isDefined(scope) || scope === null) {
      // 暂时不考虑使用组件中数据的情况。
      // 这样会导致有时组件还没有实例化就需要获取其中的属性数据，导致一些逻辑上的错误
      // 本着规则尽量简单的原则，所有关联数据都直接在外部定义。
      // scope = (Widgets[firstName] && Widgets[firstName].instance) || win[firstName];
      scope = win[firstName];
    } else {
      parentObj = scope;
      scope = scope[firstName];
    }

    if (splitArray.length === 0) {
      
      if (parentObj && parentObj.$watch) { //可监控的对象
        return {
          value: scope,

          $watch: (function (firstName, parentObj) {
              return function (fn) {
                parentObj.$watch(firstName, fn);
              };
            }(firstName, parentObj)),

          $set: (function (firstName, parentObj) {
              return function (val) {
                parentObj[firstName] = val;
              };
            }(firstName, parentObj))
        };
      }
      return {value : scope};
    } else {
      return resolveObject(scope, splitArray.join('.'), scope);
    }
  };

  return glue;
}(glue || {}));
/* filePath fetchtemp/scripts/glue_06c2909a.js*/

define('F_glue', [], function () {
  return __glue;
});
/* filePath fetchtemp/scripts/debug_54afec74.js*/

window.glue = (function (glue) {
  'use strict';

  var win = window;
  var doc = document;

/*********dom操作**********/

  var getDom = function (id) {
    return doc.getElementById(id);
  };

  var addEventListener = (function () {
    
    if (win.addEventListener) {
      return function (elm, eventType, fn) {
        elm.addEventListener(eventType, fn, false);
      };
    } else {
      return function (elm, eventType, fn) {
        elm.attachEvent('on' + eventType, fn);
      };
    }

  }());

/*********时间处理**********/

  var formatTime = function (iTime) {
    if (iTime === '') {
      return '---';
    }
    var oDate = new Date(iTime);
    return oDate.getMinutes() + ':' + oDate.getSeconds() + ':' + oDate.getMilliseconds();
  };

  var getEndTime = function () {
    var endTime = 0;
    var time;

    for (var key in glue.regWidgetList) {
      time = glue.regWidgetList[key].createTime;
      if (time > endTime) {
        endTime = time;
      }
    }

    return endTime;
  };

  var getBeginTime = function () {
    var beginTime = new Date().valueOf();
    var time;

    for (var key in glue.regWidgetList) {
      time = glue.regWidgetList[key].startTime || beginTime;
      if (time < beginTime) {
        beginTime = time;
      }
    }

    return beginTime;
  };

  // 对组件注册对象按照开始执行时间进行排序
  var sortList = function () {
    var list = [];

    for (var key in glue.regWidgetList) {
      list.push(glue.regWidgetList[key]);
    }

    list.sort(function (a, b) {
      var nowTime = new Date().valueOf();
      var aTime = a.startTime || nowTime;
      var bTime = b.startTime || nowTime;
      return aTime - bTime;
    });

    return list;
  };

/***********字符串处理**********/

  var simpleStringToJson = function (sValue) {

    // 对于空字符串，之间返回空字符串
    if (sValue === '') {
      return '';
    }

    try {
      return eval('1,' + sValue);
    } catch (e) {
      alert(sValue + ' 无法转换成Json，请重新输入内容');
    }
  };

  var simpleJsonToString = function (json) {

    // 对于未定义的输入，直接返回空字符串
    if (typeof json === 'undefined') {
      return '';
    }

    var result = [];
    var temp;

    for (var key in json) {
      temp = json[key];

      // 将双引号转成转义后的
      if (typeof temp === 'string') {
        temp = '"' + temp.replace(/["]/gi, "\\windflowers").replace(/windflowers/gi, "\"") + '"';
      }

      result.push('"' + key + '": ' + temp);
    }

    return '{' + result.join(',') + '}';
  };

  var simpleJsonToArrayString = function (json) {

    // 对于未定义的输入，直接返回空字符串
    if (typeof json === 'undefined') {
      return '';
    }

    var result = [];

    for (var key in json) {
      result.push('"' + key + '"');
    }

    return '[' + result.join(',') + ']';
  };

/*******扩展requirejs的config文件*****/

  var extendRequireConfig = function (isCompress, pathMaps) {
    var map = simpleStringToJson(pathMaps);
    var configTemp = win.requirejs.config;

    win.requirejs.config = function (options) {
      var paths = options.paths;
      var path;

      if (typeof paths !== "undefined") {

        for (var key in paths) {
          path = paths[key];

          // 如果有文件映射，则使用映射路径，否则如果关闭压缩，
          // 则将路径上的.min去掉。
          if (typeof map[path] !== "undefined") {
            options.paths[key] = map[path];
          } else if (isCompress === false) {
            options.paths[key] = path.replace(/\.min/, "");
          }
        }
      }

      configTemp.call(win.requirejs, options);
    };
  };

  // 创建合并请求链接
  // var createComboLink = function (maps, localUrl) {
  //   var url = localUrl || 'http://localhost:9001/';
  //   maps = simpleStringToJson(maps);
  //   // maps = maps || win.glueComponentVerMap || {};
  //   maps = maps || {};
  //   var params = [];

  //   for (var key in maps) {
  //     params.push(key + '#' + maps[key]);
  //   }

  //   url = url + 'combo?c=' + encodeURIComponent(params.join(',')) + '&isDebug=true';
  //   document.write('<script src=' + url + '><\/script>');
  // };

  // 创建合并请求链接
  var createComboLink = function (maps, localUrl) {
    var url = localUrl || 'http://localhost:9001/';
    maps = simpleStringToJson(maps);
    maps = maps || [];
    url = url + 'combo?c=' + encodeURIComponent(maps.join(',')) + '&isDebug=true&device=' + glue.device.type;
    document.write('<script src=' + url + '><\/script>');
  };

  var getCookie = function (name) {
    var headerTag = name + '=';
    var cookie = doc.cookie;
    var begin = cookie.indexOf(headerTag);
    var end;
    var result;

    if (begin > -1) {
      end = cookie.indexOf(';', begin);

      if (end === -1) {
        result = cookie.substring(begin + headerTag.length);
      } else {
        result = cookie.substring(begin + headerTag.length, end);
      }
      result = decodeURIComponent(result);
    } else {
      result = '';
    }

    return result;
  };

  var setCookie = function (key, value) {
    doc.cookie = key + '=' + encodeURIComponent(value) + ';expires=' +
        new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * 10).toUTCString();
  };

  var clearCookie = function (key) {
    doc.cookie = key + '=null;expires=' + new Date(new Date().valueOf() - 1000 * 60 * 10).toUTCString();
  };

/*****调试代码主体******/

  var debug = {

    init: function () {
      var showDebugTools = win.location.href.indexOf('f_debug=true') > -1;

      // 获取调试设置
      var debugConfig = this.debugConfigGet();

      // 创建调试工具
      if (showDebugTools) {
        addEventListener(win, "load", function () {
          debug.creatDebugConsole(debugConfig);
        });
      }

      // 如果没有设置，则直接返回
      if (typeof debugConfig === '') {
        return;
      }

      // 路径映射的处理
      if (debugConfig.isCompress === false ||
          (typeof debugConfig.pathMaps !== 'undefined' && debugConfig.pathMaps !== '')) {
        extendRequireConfig(debugConfig.isCompress, debugConfig.pathMaps);
      }

      // 本地映射的处理
      if (debugConfig.isLocal === true) {
        createComboLink(debugConfig.compMaps, debugConfig.localUrl);
      }
    },

    debugConfigGet: function () {
      return simpleStringToJson(getCookie('f_debug'));
    },

    debugConfigSet: function (isLocal, isCompress, localUrl, pathMaps, compMaps) {
      var map = {
        'isLocal': isLocal,
        'isCompress': isCompress,
        'localUrl': localUrl || '',
        'pathMaps': pathMaps || '',
        'compMaps': compMaps || ''
      };

      var sMap = simpleJsonToString(map);
      setCookie('f_debug', sMap);
    },

    debugConfigClear: function () {
      clearCookie('f_debug');
    },

    creatDebugConsole: function (debugConfig) {
      var div = doc.createElement('div');
      div.id = 'fDebugBox';
      var html = '<div style="position: fixed; _position: absolute; right: 5px; font-size: 12px; bottom: 5px; ' +
            'background: #CCC; z-index=2147483647">' +
        '<div id="f_debugBoxIn" style="display: none; padding: 5px; border: 1px solid #999; background: #CCC;">' +
          '<div style="margin-bottom: 5px;">' +
            '<label style="margin-right: 100px;">本地调试：<input type="checkbox" id="f_debug_isLocal" /></label>' +
            '<label>取消压缩：<input type="checkbox" id="f_debug_isCompress" /></label>' +
          '</div>' +
          '<div style="margin-bottom: 5px;">' +
            '<label>服务地址：<input type="text" id="f_debug_localUrl" style="width: 304px; border: 1px solid #999; ' +
                'background: #FFF;" value="http://localhost:9001/" /></label>' +
          '</div>' +
          '<div style="overflow: hidden; *zoom: 1;">' +
            '<div style="float: left;">组件映射：</div>' +
            '<textarea id="f_debug_compMaps" style="width: 300px; height: 50px; border: 1px solid #999; ' +
                'background: #FFF;"></textarea>' +
          '</div>' +
          '<div style="overflow: hidden; *zoom:1; margin-bottom: 5px;">' +
            '<div style="float: left">路径映射：</div>' +
            '<textarea id="f_debug_pathMaps" style="width: 300px; height: 50px; border: 1px solid #999; ' +
                'background: #FFF;"></textarea>' +
          '</div>' +
          '<div style="text-align: right;">' +
            '<button id="f_debug_bt1" type="button">开启调试</button>' +
            '<button id="f_debug_bt2" type="button">关闭调试</button>' +
            '<button id="f_debug_bt3" type="button">获取组件映射</button>' +
            '<button id="f_debug_bt4" type="button">注册列表</button>' +
            '<button id="f_debug_bt5" type="button">时间轴</button>' +
          '</div>' +
        '</div>' +
        '<div id="f_debugBoxShowHide" data-toggle="hide" style = "border: 1px solid #999; background: #FFC; ' +
            'padding: 5px; cursor: pointer; text-align: right; border-top: 1px solid #CCC;">显示调试</div>' +
      '</div>';

      div.innerHTML = html;
      doc.body.appendChild(div);
      var showBtn = getDom('f_debugBoxShowHide');
      var debugBoxIn = getDom('f_debugBoxIn');
      var debugBtn1 = getDom('f_debug_bt1');
      var debugBtn2 = getDom('f_debug_bt2');
      var debugBtn3 = getDom('f_debug_bt3');
      var debugBtn4 = getDom('f_debug_bt4');
      var debugBtn5 = getDom('f_debug_bt5');
      var debugIsLocal = getDom('f_debug_isLocal');
      var debugIsCompress = getDom('f_debug_isCompress');
      var debugLocalUrl = getDom('f_debug_localUrl');
      var debugPathMaps = getDom('f_debug_pathMaps');
      var debugCompMaps = getDom('f_debug_compMaps');

      if (debugConfig !== '') {
        debugIsLocal.checked = debugConfig.isLocal;
        debugIsCompress.checked = !debugConfig.isCompress;
        debugLocalUrl.value = debugConfig.localUrl;
        debugPathMaps.value = debugConfig.pathMaps;
        debugCompMaps.value = debugConfig.compMaps;
      }

      // 显示隐藏调试台
      showBtn.onclick = function () {
        if (this.getAttribute('data-toggle') === 'hide') {
          debugBoxIn.style.display = '';
          this.setAttribute('data-toggle', 'show');
          this.innerHTML = '隐藏调试';
        } else {
          debugBoxIn.style.display = 'none';
          this.setAttribute('data-toggle', 'hide');
          this.innerHTML = '显示调试';
        }
      };

      // 设置配置
      debugBtn1.onclick = function () {
        debug.debugConfigSet(debugIsLocal.checked, !debugIsCompress.checked,
            debugLocalUrl.value, debugPathMaps.value, debugCompMaps.value);
        alert('调试配置保存成功，请刷新页面查看效果');
      };

      // 清空配置置
      debugBtn2.onclick = function () {
        debug.debugConfigClear();
        debugIsLocal.checked = false;
        debugIsCompress.checked = false;
        debugLocalUrl.value = '';
        debugPathMaps.value = '';
        debugCompMaps.value = '';
        alert('调试设置已清除，请刷新页面查看效果');
      };

      // 获取组件配置
      debugBtn3.onclick = function () {
        debugCompMaps.value = simpleJsonToArrayString(glue.regWidgetAllNames);
      };

      // 获取组件列表
      debugBtn4.onclick = function () {
        debug.drawViewList();
      };

      // 获取组件瀑布流列表
      debugBtn5.onclick = function () {
        debug.drawTimeLine();
      };
    },

    drawViewList: function () {
      var aList = glue.regWidgetList;
      var oTasker;
      var elmDiv = doc.createElement('div');
      elmDiv.setAttribute('style', 'position: fixed; _position: absolute; background: #FFF; ' +
          'z-index:2147483647; bottom: 5px; right: 5px;');
      elmDiv.setAttribute('id', 'taskerViewList');

      var sHtml = '<table cellspacing="0" cellpadding="3" border="1">';
      sHtml += '<thead><tr><th>组件名</th><th>组件类型</th><th>优先级</th><th>注册时间</th><th>初始化时间</th><th>完成时间</th></tr>';
      
      for (var key in aList) {
        oTasker = aList[key];
        sHtml += '<tr>';
        sHtml += '<td style="width: 200px;">' + oTasker.id + '</td>';
        sHtml += '<td style="width: 200px;">' + oTasker.cname + '</td>';
        sHtml += '<td>' + oTasker.priority + '</td>';
        sHtml += '<td>' + formatTime(oTasker.regTime) + '</td>';
        sHtml += '<td>' + formatTime(oTasker.startTime) + '</td>';
        sHtml += '<td>' + formatTime(oTasker.createTime) + '</td>';
        sHtml += '</tr>';
      }
      
      sHtml += '</table>';
      sHtml += '<button onclick="document.body.removeChild(document.getElementById(\'taskerViewList\'))">关闭</button>';
      doc.body.appendChild(elmDiv);
      elmDiv.innerHTML = sHtml;
    },

    drawTimeLine: function () {
      var aList = sortList();
      var oTasker;
      var sIntro;
      var beginTime = getBeginTime();
      var endTime = getEndTime();
      var timeRange = endTime - beginTime;
      var iDistance =  timeRange > 0 ? 600 / timeRange : 0;
      var elmDiv = document.createElement('div');
      elmDiv.setAttribute('style', 'position: fixed; _position: absolute; background: #FFF; ' +
          'z-index:2147483647; bottom: 5px; right: 5px;');
      elmDiv.setAttribute('id', 'taskerTimeLine');

      var sHtml = '<table cellspacing="0" cellpadding="3" border="1">';
      sHtml += '<thead><tr><th>组件名</th><th>优先级</th><th>注册时间</th><th>时间轴</th></tr>';

      var blockTime, blockWidth, executeTime, executeWidth;

      for (var i = 0, iLen = aList.length; i < iLen; i++) {
        oTasker = aList[i];

        if (oTasker.startTime !== '') {
          blockTime = oTasker.startTime - beginTime;
          blockWidth = iDistance * blockTime;
        } else {
          blockWidth = 0;
          blockTime = 0;
        }

        if (oTasker.createTime !== '') {
          executeTime = oTasker.createTime - oTasker.startTime;
          executeWidth = iDistance * executeTime;
          executeWidth = executeWidth < 1 ? 1 : executeWidth;
        } else {
          executeWidth = 0;
          executeTime = 0;
        }

        sIntro = oTasker.id;
        sHtml += '<tr>';
        sHtml += '<td>' + sIntro + '</td>';
        sHtml += '<td>' + oTasker.priority + '</td>';
        sHtml += '<td>' + formatTime(oTasker.regTime) + '</td>';
        sHtml += '<td>';
        sHtml += '<div style="display: inline-block; height: 10px; background: #CCC; width: ' +
            blockWidth + 'px" title="' + blockTime + '"></div>';
        sHtml += '<div style="display: inline-block; height: 10px; background: #C60; width: ' +
            executeWidth + 'px" title="' + executeTime + '"></div>';
        sHtml += '</td>';
        sHtml += '</tr>';
      }
      
      sHtml += '</table>';
      sHtml += '<button onclick="document.body.removeChild(document.getElementById(\'taskerTimeLine\'))">关闭</button>';
      document.body.appendChild(elmDiv);
      elmDiv.innerHTML = sHtml;
    }
  };

  glue.extend(glue, {
    debug: debug
  });

  // 调试初始化。
  glue.debug.init();

  return glue;
}(glue || {}));
/* filePath fetchtemp/scripts/widgetBase_9faabb3a.js*/

/**
 *
 * 组件基类
 * example
 * <script>
 *  var obj = {a:1 , b:2}
 *  var arr = [1,2,3]
 * </script>
 * <div   g-attr-xxx="a" g-attr-xxx1 ="b" g-attr-xxx2="obj.a" 
          g-attr-xxx3="obj.b" g-attr-xxx4="{a:1,b:2}" g-attr-xxx5="[1,2,3]"
          g-attr-xxx6="arr"
   ></div>
                     
 * 数据有三个作用域 window 、widget、local.
 * 数据路径的查找顺序 local-->widget-->window , 没有找到则抛出异常            
 * g-init-data 会覆盖外部的定义
 */
define('F_WidgetBase', ["F_glue", 'F_WidgetBase/utils'], function (glue, utils) {
  'use strict';

  var win = window;
  var doc = document;

  var emptyFn = function () {};
  /**
  * 基类的构造函数
  * @
  */
  var WidgetBase = glue.Class.create({


    /**
     * 组件初始化，子类在对其进行扩展的时候，禁止将this.create放置在里面，
     * 以免影响对于组件的自动化组装流程
     * @param  {Object} parent 实例化这个组件的父组件，如果不是其他组件实例化的，则parent为glue
     * @param  {String} uuid   组件唯一标识，可选，如果不传，则会在内部生成一个。
     */
    initialize: function (parent, uuid) {

      // 为了避免组件的层次关系出现问题，这里强制必须设置parent参数。
      if (typeof parent === 'undefined' ||
          !(parent instanceof WidgetBase || parent === glue)) {
        var errorMsg = '请设置组件的父组件，如果没有被其他组件包含，则将parent设置为glue';
        alert(errorMsg);
        throw new Error(errorMsg);
      }

      // 组件是否创建
      this.isCreate = false;
      // 组件是否执行了触发依赖组件的操作
      this.isDependWidgetRun = false;
      // 设置uuid
      this.uuid = uuid || glue.createWidgetUuid();

      // 检查uuid是否重复。
      if (!glue.checkUuid(this.uuid)) {
        return;
      }
      glue.regUuid(this.uuid);

      this.parent = parent;
      this.parent.addWidget(this);
      this.widgets = {};
    },

   /**
    * 开始进行组件真正的创建。
    * @param container 外部容器dom对象 container
    * @param properties 传入到组件中的配置对象
    * @return {Object} 返回实例本身，用于链式调用。
    */
    create: function (container, /*Object*/properties) {
      
      // 组件不能重复创建。
      if (this.isCreate) {
        return;
      }

      // 包含Widget组件的dom对象
      this.container = container || null;
      // Widget的dom对象
      this.ownerNode = null;
      // 构造models与实例属性
      this.createModel();
      // 混合ownerNode对象上的属性数据到实例中
      this.mixElementProperties();
      // 混合参数中的数据到实例中
      this.mixProperties(properties);
      // 创建模板
      this.resolveTemplate();
      // 解析文本节点，将文本数据中的{{}}替换成新的文本节点并将节点监听数据变化事件
      this.resolveVariables();
      // 绑定dom事件
      this.bindDomEvent();
      // 为数据模型绑定数据监听事件
      this.bindDataEvent();
      // 绑定自定义事件。
      this.bindCustomEvent();
      // 绑定消息注册
      this.bindObserver();
      // 渲染组件
      this.renderer();
      // 组件创建完成后
      this.createComplete();
      this.isCreate = true;
      return this;
    },

    
    // 构造数据模型，由子类实现
     
    createModel: emptyFn,

    /**
     * 混合标记上的属性
     */
    mixElementProperties: function () {

      var container = this.container;

      // 如果传入的container是字符串，则认为他是dom节点的id
      if (typeof container === 'string') {
        container = doc.getElementById(container);
      }

      if (!container) {
        return;
      }

      // 如果coantainer没有nodeType属性，则认为他不是domElement元素，
      // 尝试取他的数组的第一个元素（认为他是一个jquery对象）
      // @todo，如果container传入的是window对象，这里会出现问题。
      if (container.nodeType !== 1) {
        container = container[0];
      }

      // 再次判断container是否被定义并且是一个domElement元素。
      if (typeof container === 'undefined' || container.nodeType !== 1) {
        return;
      }

      var expr = container.getAttribute('g-options');

      if (expr) {
        var properties = new Function('return ' + expr)();
        this.mixProperties(properties);
      }

    },

    mixProperties: function (properties) {
      var propertyNames, lasePropertyName;
      var context;

      if (!glue.isDefined(properties)) {
        return;
      }

      for (var propertyName in properties) {
        var objValue = properties[propertyName];

        if (typeof objValue === 'string' && /^[@]{2,2}/.test(objValue)) {
          this.mixModel(propertyName, objValue);
        } else {
          propertyNames = propertyName.split('.');
          lasePropertyName = propertyNames.pop();
          context = utils.transContext(this, propertyNames);
          context[lasePropertyName] = objValue;
        }
      }
    },

    // 对模型进行混合，注意，外部model只能定义在全局作用域中。
    mixModel: function (propertyName, value) {
      value = value.substring(2);
      var values = value.split('.');
      var scope = win[values.shift()];
      var expr = values.join('.');
      var _self = this;

      // ie下面需要把下面的属性也过滤掉
      var filterString = '|__const__|__data__|__proxy__|hasOwnProperty|';

      // 如果表达式为空，则表示需要对整个model进行遍历，对每个属性都要进行混合
      if (expr === '') {

        for (expr in scope) {

          if (typeof expr !== 'undefined' &&
              !/^[$]/.test(expr) &&
              filterString.indexOf('|' + expr + '|') < 0) {

            // 返回表达式的值对象
            glue.resolveObject(scope, expr, (function (propertyName) {
              return function (exprValueObj) {
                _self.bibind(propertyName, exprValueObj);
              };

            }(propertyName + '.' + expr)));

          }
        }
      } else {

        glue.resolveObject(scope, expr, (function (propertyName) {
          return function (exprValueObj) {
            _self.bibind(propertyName, exprValueObj);
          };
        }(propertyName))); //返回表达式的值对象

      }
    },

    bibind: function (propertyName, exprValueObj) {
      var propertyNames = propertyName.split('.');
      propertyName = propertyNames.pop();
      var context = utils.transContext(this, propertyNames);
      context[propertyName] = exprValueObj.value;

      if (glue.isFunction(exprValueObj.$watch)) { //属性绑定

        //外部通知组件发生变化
        exprValueObj.$watch((function (propertyName) {
          return function (newvalue) {
            context[propertyName] = typeof newvalue === 'undefined' ? '' : newvalue;
          };
        }(propertyName)));

        //组件内部修改，通知外部对象数据
        if (context.$watch) {
          context.$watch(propertyName, (function (exprValueObj) {
            return function (newvalue) {
              exprValueObj.$set(newvalue);
            };
          }(exprValueObj)));
        }
      }
    },

    /*
     * 解析模板，由子类实现
     */
    resolveTemplate: emptyFn,

    resolveVariables: function () {

      if (!this.ownerNode) {
        return;
      }

      var _self = this;

      var parseTextNode = function (parent) {

        if (parent.nodeType === 3) { //文本节点
          var text = parent.nodeValue;  //得到文本节点
          var tokens = utils.scanExpr(text);
          var fragment =  glue.dom.createDocumentFragment();
          // var bindExec = [];

          for (var i = 0 ; i < tokens.length; i++) {
            var token =  tokens[i];
            var _node = glue.dom.createTextNode(token.value);

            if (token.expr) { //如果是表达式
              glue.resolveObject(_self[token.scope], token.value, function (ret) {
                _node.nodeValue = ret.value;

                if (glue.isFunction(ret.$watch)) { //绑定数据变化
                  (function (_node) {
                    ret.$watch(function (newvalue) {
                      _node.nodeValue = typeof newvalue === 'undefined' ? '' : newvalue;
                    });
                  }(_node));
                }
              });
            }

            fragment.appendChild(_node);
          }

          parent.parentNode.replaceChild(fragment, parent);
          return;
        }

        var node = parent.firstChild;

        while (node) {
          var nextNode = node.nextSibling;
          parseTextNode(node);
          node = nextNode;
        }
      };

      parseTextNode(this.ownerNode);
    },

    // 监听model数据变化，由子类实现
    bindDataEvent: emptyFn,

    // 绑定dom事件，由子类实现
    bindDomEvent: emptyFn,

    // 绑定自定义事件，由子类实现
    bindCustomEvent: emptyFn,

    // 绑定消息注册，由子类实现
    bindObserver: emptyFn,

    // 渲染组件，由子类实现
    renderer: emptyFn,

    // 组件创建完成，由子类实现
    createComplete: emptyFn,

    /**
     * 为数据模型添加一个监听函数
     * 此方法为modelFactory的$watch方法的封装。
     * 方法内部将组件作为context参数传给$watch。
     * 一方面用于方便回调方法使用this，
     * 更为重要的是在$unWatch会使用context时候进行过滤，防止将非此组件的监听函数移除。
     * 
     * @param  {ModelFactory}   model    数据模型对象
     * @param  {String}   key      监听属性，对象是属性名，数组是方法名(push, pop, shift, unshift), 可选
     * @param  {Function} callback 回调函数，可选
     */
    watch: function (model, key, callback) {

      if (model && model.$watch) {
        model.$watch(key, callback, this);
      }

    },

    /**
     * 将数据模型的监听函数进行移除。
     * 此方法为modelFactory的$unWatch方法的封装。
     * 方法内部将组件作为context参数传给$watch。
     * 主要是为了限制$unWatch的范围，防止将非此组件的监听函数移除
     * @param  {ModelFactory}   model    数据模型对象
     * @param  {String}   key      监听属性，对象是属性名，数组是方法名(push, pop, shift, unshift), 可选
     * @param  {Function} callback 回调函数，可选
     */
    unWatch: function (model, key, callback) {

      if (model && model.$unWatch) {
        model.$unWatch(key, callback, this);
      }

    },

    // 添加子组件
    addWidget: function (widget) {
      this.widgets[widget.uuid] = widget;
    },

    // 移除子组件
    removeWidget: function (uuid) {

      if (typeof uuid !== 'string') {
        uuid = uuid.uuid;
      }

      var widget = this.widget[uuid];

      if (typeof widget !== 'undefined') {
        delete this.widgets[uuid];
        widget.destroy();
      }
    },

    // 获取子组件
    getWidget: function (uuid) {

      if (typeof uuid !== 'string') {
        uuid = uuid.uuid;
      }

      return this.widget[uuid];
    },

    // 获取所有子组件
    getAllWidget: function () {
      return this.widgets;
    },

    // 发送通知给glue
    // 支持发多个参数
    // name, message1, message2
    notify: function () {
      // 将arguments转换为数组
      var params = [].slice.call(arguments, 0);
      // 增加两个参数，发送消息组件的uuid，发送消息组件的类型
      params.push(this.uuid, this.type);
      if (typeof glue !== 'undefined') {
        glue.notify.apply(glue, params);
      }
    },

    // 订阅glue的通知
    // 订阅时的context这里默认为实例自身，这里有两个原因
    // 1.本身方便回调调用的实例本身的方法
    // 2.在unObserver的时候，避免注销了其他组件的消息。
    observer: function (name, callback) {
      if (typeof glue !== 'undefined') {
        glue.observer.call(glue, name, callback, this);
      }
    },

    // 取消订阅glue的通知
    // 取消订阅时的context这里默认为实例自身，这里有两个原因
    // 避免在注销消息时，将其他组件的消息也注销了。
    unObserver: function (name, callback) {
      if (typeof glue !== 'undefined') {
        glue.unObserver.call(glue, name, callback, this);
      }
    },

    // 销毁组件
    // 销毁组件需要组以下事情：
    // 1.销毁子组件
    // 2.移除此组件上的所有数据模型的监控事件
    // 3.移除此组件上的所有自定义事件
    // 4.移除此组件上的所有消息
    destroy: function () {
      for (var i in this.widgets) {
        this.widgets[i].destroy();
      }
    },

    // 运行依赖此组件的其他组件
    runDependWidget: function () {

      // 判断状态，如果没有运行过，则调用glue的notifyDepExce方法，
      // 将依赖此组件的其他组件注册并执行。
      if (this.isDependWidgetRun === false) {
        glue.notifyDepExce(this);
        this.isDependWidgetRun = true;
      }
    }

  });

  glue.Events.mixTo(WidgetBase);

  // 组件版本
  WidgetBase.version = '1.1.11@';
  // 组件类型
  WidgetBase.type = 'widgetBase';
  return WidgetBase;
});
