/* jshint node: true */
'use strict';

var path = require('path'),
  util = require('util'),
  extend = util._extend,
  mergeTrees = require('broccoli-merge-trees'),
  Funnel = require('broccoli-funnel');

var defaultOptions = {
  importBootstrapTheme: false,
  importBootstrapCSS: true,
  importBootstrapFont: true
};

module.exports = {
  name: 'ember-bootstrap',

  included: function included(app, parentAddon) {
    this._super.included.apply(this, arguments);

    var target = parentAddon || app;

    if (target.app) {
      target = target.app;
    }
    target.options = target.options || {};

    this.app = target;

    var options = extend(defaultOptions, target.options['ember-bootstrap']);
    var bootstrapPath = path.join(target.bowerDirectory, 'bootstrap/dist');

    // Import css from bootstrap
    if (options.importBootstrapCSS) {
      target.import(path.join(bootstrapPath, 'css/bootstrap.css'));
      target.import(path.join(bootstrapPath, 'css/bootstrap.css.map'), {destDir: 'assets'});
    }

    if (options.importBootstrapTheme) {
      target.import(path.join(bootstrapPath, 'css/bootstrap-theme.css'));
      target.import(path.join(bootstrapPath, 'css/bootstrap-theme.css.map'), {destDir: 'assets'});
    }

    // Import glyphicons
    if (options.importBootstrapFont) {
      target.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.eot'), {destDir: '/fonts'});
      target.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.svg'), {destDir: '/fonts'});
      target.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.ttf'), {destDir: '/fonts'});
      target.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.woff'), {destDir: '/fonts'});
      target.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.woff2'), {destDir: '/fonts'});
    }

    if (!process.env.EMBER_CLI_FASTBOOT) {
      target.import('vendor/transition.js');
    }
  },

  treeForStyles: function treeForStyles(tree) {
    var styleTrees = [];

    if (this.app.project.findAddonByName('ember-cli-less')) {
      var lessTree = new Funnel(path.join(this.app.bowerDirectory, 'bootstrap/less'), {
        destDir: 'ember-bootstrap'
      });
      styleTrees.push(lessTree);
    }
    
    if (tree) {
      styleTrees.push(tree);
    }
    
    return mergeTrees(styleTrees, { overwrite: true });
  }
};
