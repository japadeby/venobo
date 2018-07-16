module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var filename = require("path").join(__dirname, "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if (err) {
/******/ 				if (__webpack_require__.onError) return __webpack_require__.oe(err);
/******/ 				throw err;
/******/ 			}
/******/ 			var chunk = {};
/******/ 			require("vm").runInThisContext(
/******/ 				"(function(exports) {" + content + "\n})",
/******/ 				{ filename: filename }
/******/ 			)(chunk);
/******/ 			hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		var filename = require("path").join(__dirname, "" + hotCurrentHash + ".hot-update.json");
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 				if (err) return resolve();
/******/ 				try {
/******/ 					var update = JSON.parse(content);
/******/ 				} catch (e) {
/******/ 					return reject(e);
/******/ 				}
/******/ 				resolve(update);
/******/ 			});
/******/ 		});
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "3bd79fde5be82ae431dc"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js":
/*!*************************************************************************!*\
  !*** ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(/*! source-map-support/source-map-support.js */ \"source-map-support/source-map-support.js\").install();\n\nconst socketPath = process.env.ELECTRON_HMR_SOCKET_PATH;\n\nif (socketPath == null) {\n  throw new Error(`[HMR] Env ELECTRON_HMR_SOCKET_PATH is not set`);\n} // module, but not relative path must be used (because this file is used as entry)\n\n\nconst HmrClient = __webpack_require__(/*! electron-webpack/out/electron-main-hmr/HmrClient */ \"electron-webpack/out/electron-main-hmr/HmrClient\").HmrClient; // tslint:disable:no-unused-expression\n\n\nnew HmrClient(socketPath, module.hot, () => {\n  return __webpack_require__.h();\n}); \n//# sourceMappingURL=main-hmr.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvZWxlY3Ryb24tbWFpbi1obXIvbWFpbi1obXIuanM/MWJkYyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7O0FBR0QsNEpBQXdGOzs7QUFHeEY7QUFDQTtBQUNBLENBQUMsRTtBQUNEIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL21haW4taG1yLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCIpLmluc3RhbGwoKTtcblxuY29uc3Qgc29ja2V0UGF0aCA9IHByb2Nlc3MuZW52LkVMRUNUUk9OX0hNUl9TT0NLRVRfUEFUSDtcblxuaWYgKHNvY2tldFBhdGggPT0gbnVsbCkge1xuICB0aHJvdyBuZXcgRXJyb3IoYFtITVJdIEVudiBFTEVDVFJPTl9ITVJfU09DS0VUX1BBVEggaXMgbm90IHNldGApO1xufSAvLyBtb2R1bGUsIGJ1dCBub3QgcmVsYXRpdmUgcGF0aCBtdXN0IGJlIHVzZWQgKGJlY2F1c2UgdGhpcyBmaWxlIGlzIHVzZWQgYXMgZW50cnkpXG5cblxuY29uc3QgSG1yQ2xpZW50ID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKS5IbXJDbGllbnQ7IC8vIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC1leHByZXNzaW9uXG5cblxubmV3IEhtckNsaWVudChzb2NrZXRQYXRoLCBtb2R1bGUuaG90LCAoKSA9PiB7XG4gIHJldHVybiBfX3dlYnBhY2tfaGFzaF9fO1xufSk7IFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi1obXIuanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js\n");

/***/ }),

/***/ "./src/common/events.ts":
/*!******************************!*\
  !*** ./src/common/events.ts ***!
  \******************************/
/*! exports provided: APP_QUIT, IPC_READY, ON_PLAYER_OPEN, ON_PLAYER_CLOSE, ON_PLAYER_PLAY, ON_PLAYER_PAUSE, OPEN_EXTERNAL, OPEN_ITEM, SHOW_ITEM_IN_FOLDER, MOVE_ITEM_TO_TRASH, CHECK_FOR_EXTERNAL_PLAYER, EXTERNAL_PLAYER_NOT_FOUND, OPEN_EXTERNAL_PLAYER, QUIT_EXTERNAL_PLAYER, RENDERER_FINISHED_PRELOADING, RENDERER_FINISHED_LOADING, RENDERER_CONTINUE_LOADING */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"APP_QUIT\", function() { return APP_QUIT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"IPC_READY\", function() { return IPC_READY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ON_PLAYER_OPEN\", function() { return ON_PLAYER_OPEN; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ON_PLAYER_CLOSE\", function() { return ON_PLAYER_CLOSE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ON_PLAYER_PLAY\", function() { return ON_PLAYER_PLAY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ON_PLAYER_PAUSE\", function() { return ON_PLAYER_PAUSE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"OPEN_EXTERNAL\", function() { return OPEN_EXTERNAL; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"OPEN_ITEM\", function() { return OPEN_ITEM; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SHOW_ITEM_IN_FOLDER\", function() { return SHOW_ITEM_IN_FOLDER; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MOVE_ITEM_TO_TRASH\", function() { return MOVE_ITEM_TO_TRASH; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"CHECK_FOR_EXTERNAL_PLAYER\", function() { return CHECK_FOR_EXTERNAL_PLAYER; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"EXTERNAL_PLAYER_NOT_FOUND\", function() { return EXTERNAL_PLAYER_NOT_FOUND; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"OPEN_EXTERNAL_PLAYER\", function() { return OPEN_EXTERNAL_PLAYER; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"QUIT_EXTERNAL_PLAYER\", function() { return QUIT_EXTERNAL_PLAYER; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RENDERER_FINISHED_PRELOADING\", function() { return RENDERER_FINISHED_PRELOADING; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RENDERER_FINISHED_LOADING\", function() { return RENDERER_FINISHED_LOADING; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RENDERER_CONTINUE_LOADING\", function() { return RENDERER_CONTINUE_LOADING; });\nconst APP_QUIT = 'app-quit';\nconst IPC_READY = 'ipc-ready';\nconst ON_PLAYER_OPEN = 'on-player-open';\nconst ON_PLAYER_CLOSE = 'on-player-close';\nconst ON_PLAYER_PLAY = 'on-player-play';\nconst ON_PLAYER_PAUSE = 'on-player-pause';\nconst OPEN_EXTERNAL = 'open-external';\nconst OPEN_ITEM = 'open-item';\nconst SHOW_ITEM_IN_FOLDER = 'show-item-in-folder';\nconst MOVE_ITEM_TO_TRASH = 'move-item-to-trash';\nconst CHECK_FOR_EXTERNAL_PLAYER = 'check-for-external-player';\nconst EXTERNAL_PLAYER_NOT_FOUND = 'external-player-not-found';\nconst OPEN_EXTERNAL_PLAYER = 'open-external-player';\nconst QUIT_EXTERNAL_PLAYER = 'quit-external-player';\nconst RENDERER_FINISHED_PRELOADING = 'renderer-finished-preloading';\nconst RENDERER_FINISHED_LOADING = 'renderer-finished-loading';\nconst RENDERER_CONTINUE_LOADING = 'renderer-continue-loading';\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2V2ZW50cy50cz9kOWYzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFPLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQztBQUM1QixNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUM7QUFDOUIsTUFBTSxjQUFjLEdBQUcsZ0JBQWdCLENBQUM7QUFDeEMsTUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQUM7QUFDMUMsTUFBTSxjQUFjLEdBQUcsZ0JBQWdCLENBQUM7QUFDeEMsTUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQUM7QUFDMUMsTUFBTSxhQUFhLEdBQUcsZUFBZSxDQUFDO0FBQ3RDLE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQztBQUM5QixNQUFNLG1CQUFtQixHQUFHLHFCQUFxQixDQUFDO0FBQ2xELE1BQU0sa0JBQWtCLEdBQUcsb0JBQW9CLENBQUM7QUFDaEQsTUFBTSx5QkFBeUIsR0FBRywyQkFBMkIsQ0FBQztBQUM5RCxNQUFNLHlCQUF5QixHQUFHLDJCQUEyQixDQUFDO0FBQzlELE1BQU0sb0JBQW9CLEdBQUcsc0JBQXNCLENBQUM7QUFDcEQsTUFBTSxvQkFBb0IsR0FBRyxzQkFBc0IsQ0FBQztBQUNwRCxNQUFNLDRCQUE0QixHQUFHLDhCQUE4QixDQUFDO0FBQ3BFLE1BQU0seUJBQXlCLEdBQUcsMkJBQTJCLENBQUM7QUFDOUQsTUFBTSx5QkFBeUIsR0FBSSwyQkFBMkIsQ0FBQyIsImZpbGUiOiIuL3NyYy9jb21tb24vZXZlbnRzLnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IEFQUF9RVUlUID0gJ2FwcC1xdWl0JztcclxuZXhwb3J0IGNvbnN0IElQQ19SRUFEWSA9ICdpcGMtcmVhZHknO1xyXG5leHBvcnQgY29uc3QgT05fUExBWUVSX09QRU4gPSAnb24tcGxheWVyLW9wZW4nO1xyXG5leHBvcnQgY29uc3QgT05fUExBWUVSX0NMT1NFID0gJ29uLXBsYXllci1jbG9zZSc7XHJcbmV4cG9ydCBjb25zdCBPTl9QTEFZRVJfUExBWSA9ICdvbi1wbGF5ZXItcGxheSc7XHJcbmV4cG9ydCBjb25zdCBPTl9QTEFZRVJfUEFVU0UgPSAnb24tcGxheWVyLXBhdXNlJztcclxuZXhwb3J0IGNvbnN0IE9QRU5fRVhURVJOQUwgPSAnb3Blbi1leHRlcm5hbCc7XHJcbmV4cG9ydCBjb25zdCBPUEVOX0lURU0gPSAnb3Blbi1pdGVtJztcclxuZXhwb3J0IGNvbnN0IFNIT1dfSVRFTV9JTl9GT0xERVIgPSAnc2hvdy1pdGVtLWluLWZvbGRlcic7XHJcbmV4cG9ydCBjb25zdCBNT1ZFX0lURU1fVE9fVFJBU0ggPSAnbW92ZS1pdGVtLXRvLXRyYXNoJztcclxuZXhwb3J0IGNvbnN0IENIRUNLX0ZPUl9FWFRFUk5BTF9QTEFZRVIgPSAnY2hlY2stZm9yLWV4dGVybmFsLXBsYXllcic7XHJcbmV4cG9ydCBjb25zdCBFWFRFUk5BTF9QTEFZRVJfTk9UX0ZPVU5EID0gJ2V4dGVybmFsLXBsYXllci1ub3QtZm91bmQnO1xyXG5leHBvcnQgY29uc3QgT1BFTl9FWFRFUk5BTF9QTEFZRVIgPSAnb3Blbi1leHRlcm5hbC1wbGF5ZXInO1xyXG5leHBvcnQgY29uc3QgUVVJVF9FWFRFUk5BTF9QTEFZRVIgPSAncXVpdC1leHRlcm5hbC1wbGF5ZXInO1xyXG5leHBvcnQgY29uc3QgUkVOREVSRVJfRklOSVNIRURfUFJFTE9BRElORyA9ICdyZW5kZXJlci1maW5pc2hlZC1wcmVsb2FkaW5nJztcclxuZXhwb3J0IGNvbnN0IFJFTkRFUkVSX0ZJTklTSEVEX0xPQURJTkcgPSAncmVuZGVyZXItZmluaXNoZWQtbG9hZGluZyc7XHJcbmV4cG9ydCBjb25zdCBSRU5ERVJFUl9DT05USU5VRV9MT0FESU5HICA9ICdyZW5kZXJlci1jb250aW51ZS1sb2FkaW5nJzsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/common/events.ts\n");

/***/ }),

/***/ "./src/main/external-player.ts":
/*!*************************************!*\
  !*** ./src/main/external-player.ts ***!
  \*************************************/
/*! exports provided: ExternalPlayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ExternalPlayer\", function() { return ExternalPlayer; });\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! child_process */ \"child_process\");\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var vlc_command__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vlc-command */ \"vlc-command\");\n/* harmony import */ var vlc_command__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(vlc_command__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _common_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/events */ \"./src/common/events.ts\");\n\n\n\n\nclass ExternalPlayer {\n    constructor(venobo, playerPath) {\n        this.venobo = venobo;\n        this.playerPath = playerPath;\n        this.proc = null;\n    }\n    checkInstall() {\n        // check for VLC if external player has not been specified by the user\n        // otherwise assume the player is installed\n        return new Promise(resolve => {\n            if (!this.playerPath)\n                return vlc_command__WEBPACK_IMPORTED_MODULE_2__(resolve);\n            process.nextTick(() => resolve());\n        });\n    }\n    spawn(url, title) {\n        if (!this.playerPath)\n            return this.spawnExternal([url]);\n        // Try to find and use VLC if external player is not specified\n        vlc_command__WEBPACK_IMPORTED_MODULE_2__((err, vlcPath) => {\n            if (err)\n                return this.venobo.mainWindow.emit(_common_events__WEBPACK_IMPORTED_MODULE_3__[\"EXTERNAL_PLAYER_NOT_FOUND\"]);\n            return this.spawnExternal([\n                '--play-and-exit',\n                '--video-on-top',\n                '--quiet',\n                `--meta-title=${JSON.stringify(title)}`\n            ], vlcPath);\n        });\n    }\n    kill() {\n        if (!this.proc)\n            return;\n        this.proc.kill('SIGKILL');\n        this.proc = null;\n    }\n    spawnExternal(args, playerPath = this.playerPath) {\n        if (process.platform === 'darwin' && path__WEBPACK_IMPORTED_MODULE_1__[\"extname\"](playerPath) === '.app') {\n            // Mac: Use executable in packaged .app bundle\n            playerPath += '/Contents/MacOS/' + path__WEBPACK_IMPORTED_MODULE_1__[\"basename\"](playerPath, '.app');\n        }\n        this.proc = Object(child_process__WEBPACK_IMPORTED_MODULE_0__[\"spawn\"])(playerPath, args, { stdio: 'ignore' });\n        // If it works, close the modal after a second\n        const closeModal = this.closeModalTimeout();\n        this.proc.on('close', (code) => {\n            clearTimeout(closeModal);\n            if (!this.proc)\n                return;\n            this.proc = null;\n            return code === 0\n                ? this.venobo.mainWindow.emit('backToList')\n                : this.venobo.mainWindow.emit(_common_events__WEBPACK_IMPORTED_MODULE_3__[\"EXTERNAL_PLAYER_NOT_FOUND\"]);\n        });\n    }\n    closeModalTimeout() {\n        return setTimeout(() => {\n            this.venobo.mainWindow.emit('exitModal');\n        }, 1000);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9leHRlcm5hbC1wbGF5ZXIudHM/OWI0OCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBb0Q7QUFDdkI7QUFDYTtBQUVtQjtBQUd2RDtJQUlGLFlBQTZCLE1BQWMsRUFBbUIsVUFBa0I7UUFBbkQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFtQixlQUFVLEdBQVYsVUFBVSxDQUFRO1FBRnhFLFNBQUksR0FBd0IsSUFBSSxDQUFDO0lBRTBDLENBQUM7SUFFN0UsWUFBWTtRQUNmLHNFQUFzRTtRQUN0RSwyQ0FBMkM7UUFDM0MsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVU7Z0JBQUUsT0FBTyx3Q0FBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxLQUFLLENBQUMsR0FBVyxFQUFFLEtBQWE7UUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO1lBQUUsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUV2RCw4REFBOEQ7UUFDOUQsd0NBQVUsQ0FBQyxDQUFDLEdBQVEsRUFBRSxPQUFlLEVBQUUsRUFBRTtZQUNyQyxJQUFJLEdBQUc7Z0JBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsd0VBQXlCLENBQUMsQ0FBQztZQUV2RSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7Z0JBQ3RCLGlCQUFpQjtnQkFDakIsZ0JBQWdCO2dCQUNoQixTQUFTO2dCQUNULGdCQUFnQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO2FBQzFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sSUFBSTtRQUNQLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU87UUFFdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVPLGFBQWEsQ0FBQyxJQUFjLEVBQUUsYUFBcUIsSUFBSSxDQUFDLFVBQVU7UUFDdEUsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsSUFBSSw0Q0FBWSxDQUFDLFVBQVUsQ0FBQyxLQUFLLE1BQU0sRUFBRTtZQUN0RSw4Q0FBOEM7WUFDOUMsVUFBVSxJQUFJLGtCQUFrQixHQUFHLDZDQUFhLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3hFO1FBRUQsSUFBSSxDQUFDLElBQUksR0FBRywyREFBSyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUV6RCw4Q0FBOEM7UUFDOUMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDM0IsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtnQkFBRSxPQUFPO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBRWpCLE9BQU8sSUFBSSxLQUFLLENBQUM7Z0JBQ2IsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQzNDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsd0VBQXlCLENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxpQkFBaUI7UUFDckIsT0FBTyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3QyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDYixDQUFDO0NBRUoiLCJmaWxlIjoiLi9zcmMvbWFpbi9leHRlcm5hbC1wbGF5ZXIudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzcGF3biwgQ2hpbGRQcm9jZXNzIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCAqIGFzIHZsY0NvbW1hbmQgZnJvbSAndmxjLWNvbW1hbmQnO1xyXG5cclxuaW1wb3J0IHsgRVhURVJOQUxfUExBWUVSX05PVF9GT1VORCB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xyXG5pbXBvcnQgeyBWZW5vYm8gfSBmcm9tICcuL21haW4nO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV4dGVybmFsUGxheWVyIHtcclxuXHJcbiAgICBwcml2YXRlIHByb2M6IENoaWxkUHJvY2VzcyB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdmVub2JvOiBWZW5vYm8sIHByaXZhdGUgcmVhZG9ubHkgcGxheWVyUGF0aDogc3RyaW5nKSB7fVxyXG5cclxuICAgIHB1YmxpYyBjaGVja0luc3RhbGwoKSB7XHJcbiAgICAgICAgLy8gY2hlY2sgZm9yIFZMQyBpZiBleHRlcm5hbCBwbGF5ZXIgaGFzIG5vdCBiZWVuIHNwZWNpZmllZCBieSB0aGUgdXNlclxyXG4gICAgICAgIC8vIG90aGVyd2lzZSBhc3N1bWUgdGhlIHBsYXllciBpcyBpbnN0YWxsZWRcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbGF5ZXJQYXRoKSByZXR1cm4gdmxjQ29tbWFuZChyZXNvbHZlKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiByZXNvbHZlKCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzcGF3bih1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghdGhpcy5wbGF5ZXJQYXRoKSByZXR1cm4gdGhpcy5zcGF3bkV4dGVybmFsKFt1cmxdKTtcclxuXHJcbiAgICAgICAgLy8gVHJ5IHRvIGZpbmQgYW5kIHVzZSBWTEMgaWYgZXh0ZXJuYWwgcGxheWVyIGlzIG5vdCBzcGVjaWZpZWRcclxuICAgICAgICB2bGNDb21tYW5kKChlcnI6IGFueSwgdmxjUGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHJldHVybiB0aGlzLnZlbm9iby5tYWluV2luZG93LmVtaXQoRVhURVJOQUxfUExBWUVSX05PVF9GT1VORCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zcGF3bkV4dGVybmFsKFtcclxuICAgICAgICAgICAgICAgICctLXBsYXktYW5kLWV4aXQnLFxyXG4gICAgICAgICAgICAgICAgJy0tdmlkZW8tb24tdG9wJyxcclxuICAgICAgICAgICAgICAgICctLXF1aWV0JyxcclxuICAgICAgICAgICAgICAgIGAtLW1ldGEtdGl0bGU9JHtKU09OLnN0cmluZ2lmeSh0aXRsZSl9YFxyXG4gICAgICAgICAgICBdLCB2bGNQYXRoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMga2lsbCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMucHJvYykgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLnByb2Mua2lsbCgnU0lHS0lMTCcpO1xyXG4gICAgICAgIHRoaXMucHJvYyA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzcGF3bkV4dGVybmFsKGFyZ3M6IHN0cmluZ1tdLCBwbGF5ZXJQYXRoOiBzdHJpbmcgPSB0aGlzLnBsYXllclBhdGgpIHtcclxuICAgICAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicgJiYgcGF0aC5leHRuYW1lKHBsYXllclBhdGgpID09PSAnLmFwcCcpIHtcclxuICAgICAgICAgICAgLy8gTWFjOiBVc2UgZXhlY3V0YWJsZSBpbiBwYWNrYWdlZCAuYXBwIGJ1bmRsZVxyXG4gICAgICAgICAgICBwbGF5ZXJQYXRoICs9ICcvQ29udGVudHMvTWFjT1MvJyArIHBhdGguYmFzZW5hbWUocGxheWVyUGF0aCwgJy5hcHAnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucHJvYyA9IHNwYXduKHBsYXllclBhdGgsIGFyZ3MsIHsgc3RkaW86ICdpZ25vcmUnIH0pO1xyXG5cclxuICAgICAgICAvLyBJZiBpdCB3b3JrcywgY2xvc2UgdGhlIG1vZGFsIGFmdGVyIGEgc2Vjb25kXHJcbiAgICAgICAgY29uc3QgY2xvc2VNb2RhbCA9IHRoaXMuY2xvc2VNb2RhbFRpbWVvdXQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9jLm9uKCdjbG9zZScsIChjb2RlKSA9PiB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChjbG9zZU1vZGFsKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnByb2MpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5wcm9jID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb2RlID09PSAwXHJcbiAgICAgICAgICAgICAgICA/IHRoaXMudmVub2JvLm1haW5XaW5kb3cuZW1pdCgnYmFja1RvTGlzdCcpXHJcbiAgICAgICAgICAgICAgICA6IHRoaXMudmVub2JvLm1haW5XaW5kb3cuZW1pdChFWFRFUk5BTF9QTEFZRVJfTk9UX0ZPVU5EKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsb3NlTW9kYWxUaW1lb3V0KCkge1xyXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52ZW5vYm8ubWFpbldpbmRvdy5lbWl0KCdleGl0TW9kYWwnKTtcclxuICAgICAgICB9LCAxMDAwKTtcclxuICAgIH1cclxuXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/external-player.ts\n");

/***/ }),

/***/ "./src/main/index.ts":
/*!***************************!*\
  !*** ./src/main/index.ts ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var electron_log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron-log */ \"electron-log\");\n/* harmony import */ var electron_log__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron_log__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./main */ \"./src/main/main.ts\");\n\n\n(async () => {\n    // Enable auto updater\n    __webpack_require__(/*! update-electron-app */ \"update-electron-app\")({\n        repo: 'marcus-sa/venobo',\n        updateInterval: '6 hours',\n        logger: (electron_log__WEBPACK_IMPORTED_MODULE_0___default()),\n    });\n    const venobo = new _main__WEBPACK_IMPORTED_MODULE_1__[\"Venobo\"]();\n    await venobo.start();\n})();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC50cz8wNWI2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBa0M7QUFDRjtBQUVoQyxDQUFDLEtBQUssSUFBSSxFQUFFO0lBRVYsc0JBQXNCO0lBQ3RCLG1CQUFPLENBQUMsZ0RBQXFCLENBQUMsQ0FBQztRQUM3QixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLGNBQWMsRUFBRSxTQUFTO1FBQ3pCLDZEQUFNO0tBQ1AsQ0FBQyxDQUFDO0lBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSw0Q0FBTSxFQUFFLENBQUM7SUFFNUIsTUFBTSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsImZpbGUiOiIuL3NyYy9tYWluL2luZGV4LnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxvZ2dlciBmcm9tICdlbGVjdHJvbi1sb2cnO1xyXG5pbXBvcnQgeyBWZW5vYm8gfSBmcm9tICcuL21haW4nO1xyXG5cclxuKGFzeW5jICgpID0+IHtcclxuXHJcbiAgLy8gRW5hYmxlIGF1dG8gdXBkYXRlclxyXG4gIHJlcXVpcmUoJ3VwZGF0ZS1lbGVjdHJvbi1hcHAnKSh7XHJcbiAgICByZXBvOiAnbWFyY3VzLXNhL3Zlbm9ibycsXHJcbiAgICB1cGRhdGVJbnRlcnZhbDogJzYgaG91cnMnLFxyXG4gICAgbG9nZ2VyLFxyXG4gIH0pO1xyXG5cclxuICBjb25zdCB2ZW5vYm8gPSBuZXcgVmVub2JvKCk7XHJcblxyXG4gIGF3YWl0IHZlbm9iby5zdGFydCgpO1xyXG59KSgpOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/index.ts\n");

/***/ }),

/***/ "./src/main/ipc.ts":
/*!*************************!*\
  !*** ./src/main/ipc.ts ***!
  \*************************/
/*! exports provided: setupIpcListeners */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setupIpcListeners\", function() { return setupIpcListeners; });\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _external_player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./external-player */ \"./src/main/external-player.ts\");\n/* harmony import */ var _common_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/events */ \"./src/common/events.ts\");\n\n\n\nfunction setupIpcListeners(venobo) {\n    const externalPlayer = new _external_player__WEBPACK_IMPORTED_MODULE_1__[\"ExternalPlayer\"](venobo, '');\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].once(_common_events__WEBPACK_IMPORTED_MODULE_2__[\"IPC_READY\"], () => {\n        venobo.ipcReady = true;\n        electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].emit(_common_events__WEBPACK_IMPORTED_MODULE_2__[\"IPC_READY\"]);\n    });\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on(_common_events__WEBPACK_IMPORTED_MODULE_2__[\"APP_QUIT\"], () => electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].quit());\n    // Renderer\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on(_common_events__WEBPACK_IMPORTED_MODULE_2__[\"RENDERER_FINISHED_LOADING\"], () => {\n        console.error(_common_events__WEBPACK_IMPORTED_MODULE_2__[\"RENDERER_FINISHED_LOADING\"]);\n        venobo.mainWindow.show();\n        venobo.loadingWindow.close();\n    });\n    /*ipcMain.on(ON_PLAYER_OPEN, () => {\n  \n    });\n  \n    ipcMain.on(ON_PLAYER_CLOSE, () => {\n  \n    });*/\n    /**\n     * Shell\n     */\n    /**\n     * External media player\n     */\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on(_common_events__WEBPACK_IMPORTED_MODULE_2__[\"CHECK_FOR_EXTERNAL_PLAYER\"], async () => {\n        const error = await externalPlayer.checkInstall();\n        venobo.mainWindow.emit(_common_events__WEBPACK_IMPORTED_MODULE_2__[\"CHECK_FOR_EXTERNAL_PLAYER\"], !error);\n    });\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on(_common_events__WEBPACK_IMPORTED_MODULE_2__[\"QUIT_EXTERNAL_PLAYER\"], () => externalPlayer.kill());\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pcGMudHM/MTliYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBd0M7QUFHVztBQU96QjtBQUVwQiwyQkFBNEIsTUFBYztJQUM5QyxNQUFNLGNBQWMsR0FBRyxJQUFJLCtEQUFjLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRXRELGdEQUFPLENBQUMsSUFBSSxDQUFDLHdEQUFTLEVBQUUsR0FBRyxFQUFFO1FBQzNCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLDRDQUFHLENBQUMsSUFBSSxDQUFDLHdEQUFTLENBQUMsQ0FBQztJQUN0QixDQUFDLENBQUMsQ0FBQztJQUVILGdEQUFPLENBQUMsRUFBRSxDQUFDLHVEQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsNENBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRXZDLFdBQVc7SUFDWCxnREFBTyxDQUFDLEVBQUUsQ0FBQyx3RUFBeUIsRUFBRSxHQUFHLEVBQUU7UUFDekMsT0FBTyxDQUFDLEtBQUssQ0FBQyx3RUFBeUIsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMvQixDQUFDLENBQUMsQ0FBQztJQUVIOzs7Ozs7U0FNSztJQUVMOztPQUVHO0lBRUg7O09BRUc7SUFDSCxnREFBTyxDQUFDLEVBQUUsQ0FBQyx3RUFBeUIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMvQyxNQUFNLEtBQUssR0FBRyxNQUFNLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVsRCxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyx3RUFBeUIsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVELENBQUMsQ0FBQyxDQUFDO0lBRUgsZ0RBQU8sQ0FBQyxFQUFFLENBQUMsbUVBQW9CLEVBQUUsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDaEUsQ0FBQyIsImZpbGUiOiIuL3NyYy9tYWluL2lwYy50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFwcCwgaXBjTWFpbiB9IGZyb20gJ2VsZWN0cm9uJztcclxuXHJcbmltcG9ydCB7IFZlbm9ibyB9IGZyb20gJy4vbWFpbic7XHJcbmltcG9ydCB7IEV4dGVybmFsUGxheWVyIH0gZnJvbSAnLi9leHRlcm5hbC1wbGF5ZXInO1xyXG5pbXBvcnQge1xyXG4gIElQQ19SRUFEWSxcclxuICBBUFBfUVVJVCxcclxuICBDSEVDS19GT1JfRVhURVJOQUxfUExBWUVSLFxyXG4gIFFVSVRfRVhURVJOQUxfUExBWUVSLFxyXG4gIFJFTkRFUkVSX0ZJTklTSEVEX0xPQURJTkdcclxufSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXR1cElwY0xpc3RlbmVycyh2ZW5vYm86IFZlbm9ibykge1xyXG4gIGNvbnN0IGV4dGVybmFsUGxheWVyID0gbmV3IEV4dGVybmFsUGxheWVyKHZlbm9ibywgJycpO1xyXG5cclxuICBpcGNNYWluLm9uY2UoSVBDX1JFQURZLCAoKSA9PiB7XHJcbiAgICB2ZW5vYm8uaXBjUmVhZHkgPSB0cnVlO1xyXG4gICAgYXBwLmVtaXQoSVBDX1JFQURZKTtcclxuICB9KTtcclxuXHJcbiAgaXBjTWFpbi5vbihBUFBfUVVJVCwgKCkgPT4gYXBwLnF1aXQoKSk7XHJcblxyXG4gIC8vIFJlbmRlcmVyXHJcbiAgaXBjTWFpbi5vbihSRU5ERVJFUl9GSU5JU0hFRF9MT0FESU5HLCAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmVycm9yKFJFTkRFUkVSX0ZJTklTSEVEX0xPQURJTkcpO1xyXG4gICAgdmVub2JvLm1haW5XaW5kb3cuc2hvdygpO1xyXG4gICAgdmVub2JvLmxvYWRpbmdXaW5kb3cuY2xvc2UoKTtcclxuICB9KTtcclxuXHJcbiAgLyppcGNNYWluLm9uKE9OX1BMQVlFUl9PUEVOLCAoKSA9PiB7XHJcblxyXG4gIH0pO1xyXG5cclxuICBpcGNNYWluLm9uKE9OX1BMQVlFUl9DTE9TRSwgKCkgPT4ge1xyXG5cclxuICB9KTsqL1xyXG5cclxuICAvKipcclxuICAgKiBTaGVsbFxyXG4gICAqL1xyXG5cclxuICAvKipcclxuICAgKiBFeHRlcm5hbCBtZWRpYSBwbGF5ZXJcclxuICAgKi9cclxuICBpcGNNYWluLm9uKENIRUNLX0ZPUl9FWFRFUk5BTF9QTEFZRVIsIGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IGVycm9yID0gYXdhaXQgZXh0ZXJuYWxQbGF5ZXIuY2hlY2tJbnN0YWxsKCk7XHJcblxyXG4gICAgdmVub2JvLm1haW5XaW5kb3cuZW1pdChDSEVDS19GT1JfRVhURVJOQUxfUExBWUVSLCAhZXJyb3IpO1xyXG4gIH0pO1xyXG5cclxuICBpcGNNYWluLm9uKFFVSVRfRVhURVJOQUxfUExBWUVSLCAoKSA9PiBleHRlcm5hbFBsYXllci5raWxsKCkpO1xyXG59Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/ipc.ts\n");

/***/ }),

/***/ "./src/main/main.ts":
/*!**************************!*\
  !*** ./src/main/main.ts ***!
  \**************************/
/*! exports provided: Venobo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Venobo\", function() { return Venobo; });\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _windows__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./windows */ \"./src/main/windows/index.ts\");\n/* harmony import */ var _ipc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ipc */ \"./src/main/ipc.ts\");\n\n\n\nclass Venobo {\n    constructor() {\n        this.shouldQuit = false;\n        //public isReady: boolean = false;\n        this.ipcReady = false;\n        this.shouldQuit = electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].makeSingleInstance(() => null);\n    }\n    async start() {\n        if (this.shouldQuit)\n            return electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].quit();\n        process.on('uncaughtException', (err) => {\n            console.error(err);\n            this.mainWindow.emit('uncaughtError', err);\n        });\n        electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('ready', async () => {\n            this.mainWindow = await _windows__WEBPACK_IMPORTED_MODULE_1__[\"MainWindow\"].create();\n            this.loadingWindow = await _windows__WEBPACK_IMPORTED_MODULE_1__[\"LoadingWindow\"].create();\n            Object(_ipc__WEBPACK_IMPORTED_MODULE_2__[\"setupIpcListeners\"])(this);\n            //this.mainWindow.show();\n        });\n        electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('activate', async () => {\n            if (!this.loadingWindow) {\n                this.loadingWindow = await _windows__WEBPACK_IMPORTED_MODULE_1__[\"LoadingWindow\"].create();\n            }\n            if (!this.mainWindow) {\n                this.mainWindow = await _windows__WEBPACK_IMPORTED_MODULE_1__[\"MainWindow\"].create();\n            }\n        });\n        electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('window-all-closed', () => {\n            if (process.platform !== 'darwin') {\n                electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].quit();\n            }\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tYWluLnRzPzE1MzQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQThDO0FBRVE7QUFDWjtBQUVwQztJQVNKO1FBUE8sZUFBVSxHQUFZLEtBQUssQ0FBQztRQUNuQyxrQ0FBa0M7UUFDM0IsYUFBUSxHQUFZLEtBQUssQ0FBQztRQU0vQixJQUFJLENBQUMsVUFBVSxHQUFHLDRDQUFHLENBQUMsa0JBQWtCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVNLEtBQUssQ0FBQyxLQUFLO1FBQ2hCLElBQUksSUFBSSxDQUFDLFVBQVU7WUFBRSxPQUFPLDRDQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFdkMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ3RDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO1FBRUgsNENBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxtREFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxzREFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRWxELDhEQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXhCLHlCQUF5QjtRQUMzQixDQUFDLENBQUMsQ0FBQztRQUVILDRDQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLHNEQUFhLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDbkQ7WUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLG1EQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDN0M7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILDRDQUFHLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtZQUNoQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO2dCQUNqQyw0Q0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ1o7UUFDRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FFRiIsImZpbGUiOiIuL3NyYy9tYWluL21haW4udHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhcHAsIEJyb3dzZXJXaW5kb3cgfSBmcm9tICdlbGVjdHJvbic7XHJcblxyXG5pbXBvcnQgeyBNYWluV2luZG93LCBMb2FkaW5nV2luZG93IH0gZnJvbSAnLi93aW5kb3dzJztcclxuaW1wb3J0IHsgc2V0dXBJcGNMaXN0ZW5lcnMgfSBmcm9tICcuL2lwYyc7XHJcblxyXG5leHBvcnQgY2xhc3MgVmVub2JvIHtcclxuXHJcbiAgcHVibGljIHNob3VsZFF1aXQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAvL3B1YmxpYyBpc1JlYWR5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGlwY1JlYWR5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgLy9wdWJsaWMgaXNRdWl0dGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBsb2FkaW5nV2luZG93ITogQnJvd3NlcldpbmRvdztcclxuICBwdWJsaWMgbWFpbldpbmRvdyE6IEJyb3dzZXJXaW5kb3c7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zaG91bGRRdWl0ID0gYXBwLm1ha2VTaW5nbGVJbnN0YW5jZSgoKSA9PiBudWxsKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzdGFydCgpIHtcclxuICAgIGlmICh0aGlzLnNob3VsZFF1aXQpIHJldHVybiBhcHAucXVpdCgpO1xyXG5cclxuICAgIHByb2Nlc3Mub24oJ3VuY2F1Z2h0RXhjZXB0aW9uJywgKGVycikgPT4ge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgIHRoaXMubWFpbldpbmRvdy5lbWl0KCd1bmNhdWdodEVycm9yJywgZXJyKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFwcC5vbigncmVhZHknLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRoaXMubWFpbldpbmRvdyA9IGF3YWl0IE1haW5XaW5kb3cuY3JlYXRlKCk7XHJcbiAgICAgIHRoaXMubG9hZGluZ1dpbmRvdyA9IGF3YWl0IExvYWRpbmdXaW5kb3cuY3JlYXRlKCk7XHJcblxyXG4gICAgICBzZXR1cElwY0xpc3RlbmVycyh0aGlzKTtcclxuXHJcbiAgICAgIC8vdGhpcy5tYWluV2luZG93LnNob3coKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFwcC5vbignYWN0aXZhdGUnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIGlmICghdGhpcy5sb2FkaW5nV2luZG93KSB7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nV2luZG93ID0gYXdhaXQgTG9hZGluZ1dpbmRvdy5jcmVhdGUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF0aGlzLm1haW5XaW5kb3cpIHtcclxuICAgICAgICB0aGlzLm1haW5XaW5kb3cgPSBhd2FpdCBNYWluV2luZG93LmNyZWF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgKCkgPT4ge1xyXG4gICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xyXG4gICAgICAgYXBwLnF1aXQoKTtcclxuICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/main.ts\n");

/***/ }),

/***/ "./src/main/windows/index.ts":
/*!***********************************!*\
  !*** ./src/main/windows/index.ts ***!
  \***********************************/
/*! exports provided: MainWindow, LoadingWindow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _main_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main.window */ \"./src/main/windows/main.window.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MainWindow\", function() { return _main_window__WEBPACK_IMPORTED_MODULE_0__[\"MainWindow\"]; });\n\n/* harmony import */ var _loading_window__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loading.window */ \"./src/main/windows/loading.window.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"LoadingWindow\", function() { return _loading_window__WEBPACK_IMPORTED_MODULE_1__[\"LoadingWindow\"]; });\n\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi93aW5kb3dzL2luZGV4LnRzPzgwYWIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUE4QjtBQUNHIiwiZmlsZSI6Ii4vc3JjL21haW4vd2luZG93cy9pbmRleC50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCAqIGZyb20gJy4vbWFpbi53aW5kb3cnO1xyXG5leHBvcnQgKiBmcm9tICcuL2xvYWRpbmcud2luZG93JzsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/windows/index.ts\n");

/***/ }),

/***/ "./src/main/windows/loading.window.ts":
/*!********************************************!*\
  !*** ./src/main/windows/loading.window.ts ***!
  \********************************************/
/*! exports provided: LoadingWindow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"LoadingWindow\", function() { return LoadingWindow; });\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! url */ \"url\");\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nvar LoadingWindow;\n(function (LoadingWindow) {\n    async function create() {\n        const loadingWindow = new electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"]({\n            width: 800,\n            height: 600,\n            titleBarStyle: 'hiddenInset',\n            useContentSize: true,\n            frame: false,\n            movable: true,\n            resizable: false,\n            closable: false,\n            alwaysOnTop: true,\n        });\n        const startUrl = url__WEBPACK_IMPORTED_MODULE_2__[\"format\"]({\n            pathname: path__WEBPACK_IMPORTED_MODULE_1__[\"join\"](process.cwd(), 'static', 'loading.html'),\n            protocol: 'file:',\n            slashes: true,\n        });\n        loadingWindow.loadURL(startUrl);\n        return loadingWindow;\n    }\n    LoadingWindow.create = create;\n})(LoadingWindow || (LoadingWindow = {}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi93aW5kb3dzL2xvYWRpbmcud2luZG93LnRzPzViYmIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBeUM7QUFDWjtBQUNGO0FBRXJCLElBQVcsYUFBYSxDQTBCN0I7QUExQkQsV0FBaUIsYUFBYTtJQUVyQixLQUFLO1FBQ1YsTUFBTSxhQUFhLEdBQUcsSUFBSSxzREFBYSxDQUFDO1lBQ3RDLEtBQUssRUFBRSxHQUFHO1lBQ1YsTUFBTSxFQUFFLEdBQUc7WUFDWCxhQUFhLEVBQUUsYUFBYTtZQUM1QixjQUFjLEVBQUUsSUFBSTtZQUNwQixLQUFLLEVBQUUsS0FBSztZQUNaLE9BQU8sRUFBRSxJQUFJO1lBQ2IsU0FBUyxFQUFFLEtBQUs7WUFDaEIsUUFBUSxFQUFFLEtBQUs7WUFDZixXQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRywwQ0FBVSxDQUFDO1lBQzFCLFFBQVEsRUFBRSx5Q0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDO1lBQzVELFFBQVEsRUFBRSxPQUFPO1lBQ2pCLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQyxDQUFDO1FBRUgsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVoQyxPQUFPLGFBQWEsQ0FBQztJQUN2QixDQUFDO0lBdEJxQixvQkFBTSxTQXNCM0I7QUFFSCxDQUFDLEVBMUJnQixhQUFhLEtBQWIsYUFBYSxRQTBCN0IiLCJmaWxlIjoiLi9zcmMvbWFpbi93aW5kb3dzL2xvYWRpbmcud2luZG93LnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnJvd3NlcldpbmRvdyB9IGZyb20gJ2VsZWN0cm9uJztcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0ICogYXMgdXJsIGZyb20gJ3VybCc7XHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIExvYWRpbmdXaW5kb3cge1xyXG5cclxuICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlKCkge1xyXG4gICAgY29uc3QgbG9hZGluZ1dpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcclxuICAgICAgd2lkdGg6IDgwMCxcclxuICAgICAgaGVpZ2h0OiA2MDAsXHJcbiAgICAgIHRpdGxlQmFyU3R5bGU6ICdoaWRkZW5JbnNldCcsXHJcbiAgICAgIHVzZUNvbnRlbnRTaXplOiB0cnVlLFxyXG4gICAgICBmcmFtZTogZmFsc2UsXHJcbiAgICAgIG1vdmFibGU6IHRydWUsXHJcbiAgICAgIHJlc2l6YWJsZTogZmFsc2UsXHJcbiAgICAgIGNsb3NhYmxlOiBmYWxzZSxcclxuICAgICAgYWx3YXlzT25Ub3A6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBzdGFydFVybCA9IHVybC5mb3JtYXQoe1xyXG4gICAgICBwYXRobmFtZTogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzdGF0aWMnLCAnbG9hZGluZy5odG1sJyksXHJcbiAgICAgIHByb3RvY29sOiAnZmlsZTonLFxyXG4gICAgICBzbGFzaGVzOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgbG9hZGluZ1dpbmRvdy5sb2FkVVJMKHN0YXJ0VXJsKTtcclxuXHJcbiAgICByZXR1cm4gbG9hZGluZ1dpbmRvdztcclxuICB9XHJcblxyXG59Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/windows/loading.window.ts\n");

/***/ }),

/***/ "./src/main/windows/main.window.ts":
/*!*****************************************!*\
  !*** ./src/main/windows/main.window.ts ***!
  \*****************************************/
/*! exports provided: MainWindow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MainWindow\", function() { return MainWindow; });\n/* harmony import */ var electron_devtools_installer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron-devtools-installer */ \"electron-devtools-installer\");\n/* harmony import */ var electron_devtools_installer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron_devtools_installer__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var electron_is_dev__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! electron-is-dev */ \"electron-is-dev\");\n/* harmony import */ var electron_is_dev__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(electron_is_dev__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! url */ \"url\");\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nvar MainWindow;\n(function (MainWindow) {\n    async function create() {\n        // Create the browser window.\n        const mainWindow = new electron__WEBPACK_IMPORTED_MODULE_2__[\"BrowserWindow\"]({\n            width: 800,\n            height: 600,\n            show: electron_is_dev__WEBPACK_IMPORTED_MODULE_1___default.a,\n            titleBarStyle: 'hiddenInset',\n            useContentSize: true,\n            webPreferences: {\n                webSecurity: false,\n            },\n        });\n        if (electron_is_dev__WEBPACK_IMPORTED_MODULE_1___default.a) {\n            mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);\n        }\n        else {\n            mainWindow.loadURL(url__WEBPACK_IMPORTED_MODULE_4__[\"format\"]({\n                pathname: path__WEBPACK_IMPORTED_MODULE_3__[\"join\"](__dirname, '..', 'index.html'),\n                protocol: 'file:',\n                slashes: true,\n            }));\n        }\n        if (electron_is_dev__WEBPACK_IMPORTED_MODULE_1___default.a) {\n            await electron_devtools_installer__WEBPACK_IMPORTED_MODULE_0___default()(electron_devtools_installer__WEBPACK_IMPORTED_MODULE_0__[\"REACT_DEVELOPER_TOOLS\"]);\n            mainWindow.webContents.openDevTools({ mode: 'detach' });\n        }\n        return mainWindow;\n    }\n    MainWindow.create = create;\n})(MainWindow || (MainWindow = {}));\n\n/* WEBPACK VAR INJECTION */}.call(this, \"src\\\\main\\\\windows\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi93aW5kb3dzL21haW4ud2luZG93LnRzP2E1ODEiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQXNGO0FBQzlDO0FBQ0M7QUFDWjtBQUNGO0FBRXJCLElBQVcsVUFBVSxDQW1DMUI7QUFuQ0QsV0FBaUIsVUFBVTtJQUVsQixLQUFLO1FBQ1YsNkJBQTZCO1FBQzdCLE1BQU0sVUFBVSxHQUFHLElBQUksc0RBQWEsQ0FBQztZQUNuQyxLQUFLLEVBQUUsR0FBRztZQUNWLE1BQU0sRUFBRSxHQUFHO1lBQ1gsSUFBSSxFQUFFLHNEQUFTO1lBQ2YsYUFBYSxFQUFFLGFBQWE7WUFDNUIsY0FBYyxFQUFFLElBQUk7WUFDcEIsY0FBYyxFQUFFO2dCQUNkLFdBQVcsRUFBRSxLQUFLO2FBQ25CO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxzREFBUyxFQUFFO1lBQ2IsVUFBVSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUM7U0FDakY7YUFBTTtZQUNMLFVBQVUsQ0FBQyxPQUFPLENBQ2hCLDBDQUFVLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLHlDQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLENBQUM7Z0JBQ2xELFFBQVEsRUFBRSxPQUFPO2dCQUNqQixPQUFPLEVBQUUsSUFBSTthQUNkLENBQUMsQ0FDSCxDQUFDO1NBQ0g7UUFFRCxJQUFJLHNEQUFTLEVBQUU7WUFDYixNQUFNLGtFQUFnQixDQUFDLGlGQUFxQixDQUFDLENBQUM7WUFDOUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUN6RDtRQUVELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUEvQnFCLGlCQUFNLFNBK0IzQjtBQUVILENBQUMsRUFuQ2dCLFVBQVUsS0FBVixVQUFVLFFBbUMxQiIsImZpbGUiOiIuL3NyYy9tYWluL3dpbmRvd3MvbWFpbi53aW5kb3cudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW5zdGFsbEV4dGVuc2lvbiwgeyBSRUFDVF9ERVZFTE9QRVJfVE9PTFMgfSBmcm9tICdlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXInO1xyXG5pbXBvcnQgaXNEZXZNb2RlIGZyb20gJ2VsZWN0cm9uLWlzLWRldic7XHJcbmltcG9ydCB7IEJyb3dzZXJXaW5kb3cgfSBmcm9tICdlbGVjdHJvbic7XHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSBNYWluV2luZG93IHtcclxuXHJcbiAgZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZSgpIHtcclxuICAgIC8vIENyZWF0ZSB0aGUgYnJvd3NlciB3aW5kb3cuXHJcbiAgICBjb25zdCBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xyXG4gICAgICB3aWR0aDogODAwLFxyXG4gICAgICBoZWlnaHQ6IDYwMCxcclxuICAgICAgc2hvdzogaXNEZXZNb2RlLFxyXG4gICAgICB0aXRsZUJhclN0eWxlOiAnaGlkZGVuSW5zZXQnLFxyXG4gICAgICB1c2VDb250ZW50U2l6ZTogdHJ1ZSxcclxuICAgICAgd2ViUHJlZmVyZW5jZXM6IHtcclxuICAgICAgICB3ZWJTZWN1cml0eTogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoaXNEZXZNb2RlKSB7XHJcbiAgICAgIG1haW5XaW5kb3cubG9hZFVSTChgaHR0cDovL2xvY2FsaG9zdDoke3Byb2Nlc3MuZW52LkVMRUNUUk9OX1dFQlBBQ0tfV0RTX1BPUlR9YCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtYWluV2luZG93LmxvYWRVUkwoXHJcbiAgICAgICAgdXJsLmZvcm1hdCh7XHJcbiAgICAgICAgICBwYXRobmFtZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ2luZGV4Lmh0bWwnKSxcclxuICAgICAgICAgIHByb3RvY29sOiAnZmlsZTonLFxyXG4gICAgICAgICAgc2xhc2hlczogdHJ1ZSxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc0Rldk1vZGUpIHtcclxuICAgICAgYXdhaXQgaW5zdGFsbEV4dGVuc2lvbihSRUFDVF9ERVZFTE9QRVJfVE9PTFMpO1xyXG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scyh7IG1vZGU6ICdkZXRhY2gnIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtYWluV2luZG93O1xyXG4gIH1cclxuXHJcbn0iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/windows/main.window.ts\n");

/***/ }),

/***/ 0:
/*!************************************************************************************************!*\
  !*** multi ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr ./src/main/index.ts ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! E:\Git\venobo\node_modules\electron-webpack\out\electron-main-hmr\main-hmr */"./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js");
module.exports = __webpack_require__(/*! E:\Git\venobo\src\main\index.ts */"./src/main/index.ts");


/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"child_process\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjaGlsZF9wcm9jZXNzXCI/M2RhNyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJjaGlsZF9wcm9jZXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///child_process\n");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzA0ZjMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZWxlY3Ryb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron\n");

/***/ }),

/***/ "electron-devtools-installer":
/*!**********************************************!*\
  !*** external "electron-devtools-installer" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-devtools-installer\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIj9jZThjIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlclwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-devtools-installer\n");

/***/ }),

/***/ "electron-is-dev":
/*!**********************************!*\
  !*** external "electron-is-dev" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-is-dev\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi1pcy1kZXZcIj85M2M3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLWlzLWRldi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLWlzLWRldlwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-is-dev\n");

/***/ }),

/***/ "electron-log":
/*!*******************************!*\
  !*** external "electron-log" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-log\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi1sb2dcIj9jOGM0Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLWxvZ1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-log\n");

/***/ }),

/***/ "electron-webpack/out/electron-main-hmr/HmrClient":
/*!*******************************************************************!*\
  !*** external "electron-webpack/out/electron-main-hmr/HmrClient" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-webpack/out/electron-main-hmr/HmrClient\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi13ZWJwYWNrL291dC9lbGVjdHJvbi1tYWluLWhtci9IbXJDbGllbnRcIj9kZTY3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-webpack/out/electron-main-hmr/HmrClient\n");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NzRiYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJwYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///path\n");

/***/ }),

/***/ "source-map-support/source-map-support.js":
/*!***********************************************************!*\
  !*** external "source-map-support/source-map-support.js" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"source-map-support/source-map-support.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCI/OWM1ZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///source-map-support/source-map-support.js\n");

/***/ }),

/***/ "update-electron-app":
/*!**************************************!*\
  !*** external "update-electron-app" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"update-electron-app\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cGRhdGUtZWxlY3Ryb24tYXBwXCI/MDlkYyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJ1cGRhdGUtZWxlY3Ryb24tYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXBkYXRlLWVsZWN0cm9uLWFwcFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///update-electron-app\n");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"url\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cmxcIj82MWU4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6InVybC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVybFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///url\n");

/***/ }),

/***/ "vlc-command":
/*!******************************!*\
  !*** external "vlc-command" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"vlc-command\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ2bGMtY29tbWFuZFwiP2E2MDgiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoidmxjLWNvbW1hbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ2bGMtY29tbWFuZFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///vlc-command\n");

/***/ })

/******/ });