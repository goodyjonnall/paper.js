/*
 * Paper.js
 *
 * This file is part of Paper.js, a JavaScript Vector Graphics Library,
 * based on Scriptographer.org and designed to be largely API compatible.
 * http://paperjs.org/
 * http://scriptographer.org/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * Copyright (c) 2011, Juerg Lehni & Jonathan Puckey
 * http://lehni.org/ & http://jonathanpuckey.com/
 *
 * All rights reserved.
 */

/**
 * Define internal PaperScope class that handles all the fields available on the
 * global paper object, which simply is a pointer to the currently active scope.
 */
var PaperScope = this.PaperScope = Base.extend({
	beans: true,

	initialize: function(id) {
		this.document = null;
		this.documents = [];
		this.tools = [];
		this.id = id;
		PaperScope._scopes[id] = this;
	},

	/**
	 * A short-cut to the currently active view of the active document.
	 */
	getView: function() {
		return this.document.activeView;
	},

	/**
	 * A short-cut to the currently active layer of the active document.
	 */
	getLayer: function() {
		return this.document.activeLayer;
	},

	evaluate: function(code) {
		return PaperScript.evaluate(code, this);
	},

	/**
	 * Installs the paper scope into any other given scope. Can be used for
	 * examle to inject the currently active PaperScope into the window's global
	 * scope, to emulate PaperScript-style globally accessible Paper classes:
	 *
	 * paper.install(window);
	 */
	install: function(scope) {
		// Use scope as side-car (= 'this' inside iterator), and have it
		// returned at the end.
		return Base.each(this, function(value, key) {
			this[key] = value;
		}, scope);
	},

	clear: function() {
		// Remove all documents and tools.
		for (var i = this.documents.length - 1; i >= 0; i--)
			this.documents[i].remove();
		for (var i = this.tools.length - 1; i >= 0; i--)
			this.tools[i].remove();
	},

	remove: function() {
		this.clear();
		delete PaperScope._scopes[this.id];
	},

	statics: {
		_scopes: {},

		get: function(id) {
			// If a script tag is passed, get the id from it.
			if (typeof id === 'object')
				id = id.getAttribute('id');
			return this._scopes[id] || null;
		}
	}
});