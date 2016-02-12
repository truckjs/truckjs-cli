#!/usr/bin/env node
var fs = require('fs');
var writefile = require('writefile');
var ncp = require('ncp').ncp;
var p = require("path");
var replace = require('replace-in-file');
var argv = require('yargs').usage('Usage: --name "Icecream" --path "~/Documents/myWebApp" --os: (ios, android, win) --type (plain, navigation, tab, slideout').argv;
var name = argv.name || argv.n;
var type = argv.type || argv.t || 'default';
var homedir = (process.platform === "win32") ? process.env.HOMEPATH : process.env.HOME;
var path = argv.path || argv.p || p.join(homedir, 'Desktop');
var os = argv.os || argv.o || 'ios';
var pkg = require('./package.json');
var browserify = argv.browserify || argv.b;
var mkdirp = require('mkdirp');

var noop = function() {};

if (!name) {
  console.log('Please provide a name for the project using "--name" or "--n": truckjs --name Buzzaz.');
  return;
}

//=======================================================
// Define function to create directories and write files:
//=======================================================
var createProject = function() {
  if (browserify) {
    if (name) {
      ncp.limit = 16;
      mkdirp(p.join(path, name), noop);
      
      // Copy files:
      ncp(p.join(__dirname, 'dist', 'truck'), p.join(path, name, 'dist'), noop);
      ncp(p.join(__dirname, 'dist', 'styles', os), p.join(path, name, 'dist', 'styles'), noop);
      ncp(p.join(__dirname, 'dist', 'typings'), p.join(path, name, 'dist', 'typings'), noop);
      ncp(p.join(__dirname, 'src', 'package.json'), p.join(path, name, 'package.json'), noop);
      ncp(p.join(__dirname, 'src', 'gulpfile.js'), p.join(path, name, 'gulpfile.js'), noop);

      mkdirp(p.join(path, name, 'dev'), noop);


      switch(type) {
        case 'default':
          mkdirp(p.join(path, name, 'dev'), noop);
          ncp(p.join('src', 'html', 'browserify', 'default.html'), p.join(path, name, 'index.html'), noop);
          ncp(p.join('src', 'js', 'default.js'), p.join(path, name, 'dev', 'app.js'), noop);
          break;
        case 'navigation':
          mkdirp(p.join(path, name, 'dev'), noop);
          mkdirp(p.join(path, name, 'data'), noop);
          mkdirp(p.join(path, name, 'images'), noop);
          ncp(p.join(__dirname, 'src', 'html', 'browserify', 'navigation.html'), p.join(path, name, 'index.html'), noop);
          ncp(p.join(__dirname, 'src', 'js', 'navigation.js'), p.join(path, name, 'dev', 'app.js'), noop);
          ncp(p.join(__dirname, 'src', 'data', 'lums.json'), p.join(path, name, 'data', 'lums.json'), noop);
          ncp(p.join(__dirname, 'dist', 'images', 'luminaries'), p.join(path, name, 'images'), noop);
          break;
        case 'slideout':
          mkdirp(p.join(path, name, 'dev'), noop);
          mkdirp(p.join(path, name, 'images', 'music'), noop);
          mkdirp(p.join(path, name, 'data'), noop);
          ncp(p.join(__dirname, 'src', 'html', 'browserify', 'slideout.html'), p.join(path, name, 'index.html'), noop);
          ncp(p.join(__dirname, 'src', 'js', 'slideout.js'), p.join(path, name, 'dev', 'app.js'), noop);
          ncp(p.join(__dirname, 'dist', 'images'), p.join(path, name, 'images'), noop);
          ncp(p.join(__dirname, 'src', 'data', 'docs.json'), p.join(path, name, 'data', 'docs.json'), noop);
          ncp(p.join(__dirname, 'src', 'data', 'favorites.json'), p.join(path, name, 'data', 'favorites.json'), noop);
          ncp(p.join(__dirname, 'src', 'data', 'music.json'), p.join(path, name, 'data', 'music.json'), noop);
          ncp(p.join(__dirname, 'src', 'data', 'recipes.json'), p.join(path, name, 'data', 'recipes.json'), noop);
          ncp(p.join(__dirname, 'dist', 'images', 'music'), p.join(path, name, 'images', 'music'), noop);
          break;
        case 'tabbar':
          mkdirp(p.join(path, name, 'dev'), noop);
          mkdirp(p.join(path, name, 'data'), noop);
          mkdirp(p.join(path, name, 'images', 'music'), noop);
          mkdirp(p.join(path, name, 'images', 'icons'), noop);
          ncp(p.join(__dirname, 'src', 'html', 'browserify', 'tabbar.html'), p.join(path, name, 'index.html'), noop);
          ncp(p.join(__dirname, 'src', 'js', 'tabbar.js'), p.join(path, name, 'dev', 'app.js'), noop);
          ncp(p.join(__dirname, 'src', 'data', 'docs.json'), p.join(path, name, 'data', 'docs.json'), noop);
          ncp(p.join(__dirname, 'src', 'data', 'favorites.json'), p.join(path, name, 'data', 'favorites.json'), noop);
          ncp(p.join(__dirname, 'src', 'data', 'music.json'), p.join(path, name, 'data', 'music.json'), noop);
          ncp(p.join(__dirname, 'src', 'data', 'recipes.json'), p.join(path, name, 'data', 'recipes.json'), noop);
          setTimeout(function() {
            ncp(p.join(__dirname, 'dist', 'images', 'icons'), p.join(path, name, 'images', 'icons'), noop);
          }, 100);
          setTimeout(function() {
            ncp(p.join(__dirname, 'dist', 'images', 'music'), p.join(path, name, 'images', 'music'), noop);
          }, 200);
          break;
        default:
          mkdirp(p.join(path, name, 'dev'), noop);
          ncp(p.join(__dirname, 'src', 'html', 'browserify', 'default.html'), p.join(path, name, 'index.html'), noop);
          ncp(p.join(__dirname, 'src', 'js', 'default.js'), p.join(path, name, 'dev', 'app.js'), noop);
          break;
      }
    }

  } else {
    if (name) {
      ncp.limit = 16;
      mkdirp(p.join(path, name), noop);
      
      // Copy files:
      ncp(p.join(__dirname, 'dist', 'truck'), p.join(path, name, 'dist'), noop);
      ncp(p.join(__dirname, 'dist', 'styles', os), p.join(path, name, 'dist', 'styles'), noop);
      ncp(p.join(__dirname, 'dist', 'typings'), p.join(path, name, 'dist', 'typings'), noop);

      // Create project:
      switch(type) {
        case 'default':
          ncp(p.join(__dirname, 'src', 'html', 'defaults', 'default.html'), p.join(path, name, 'index.html'), noop);
          break;
        case 'navigation':
          ncp(p.join(__dirname, 'src', 'html', 'defaults', 'navigation.html'), p.join(path, name, 'index.html'), noop);
          break;
        case 'slideout':
          ncp(p.join(__dirname, 'src', 'html', 'defaults', 'slideout.html'), p.join(path, name, 'index.html'), noop);
          break;
        case 'tabbar':
          ncp(p.join(__dirname, 'src', 'html', 'defaults', 'tabbar.html'), p.join(path, name, 'index.html'), noop);
          ncp(p.join(__dirname, 'dist', 'images'), p.join(path, name, 'images'), noop);
          break;
        default:
          ncp(p.join(__dirname, 'src', 'html', 'defaults', 'default.html'), p.join(path, name, 'index.html'), noop);
          break;
      }
    }
  }

  setTimeout(function() {
    replace({
      replace: /APP_NAME/g,
      with: name,
      files: [
        p.join(path, name, 'index.html'),
        p.join(path, name, 'package.json')
      ],
    });
  }, 50);
  setTimeout(function() {
    replace({
      replace: /OS_THEME/g,
      with: os,
      files: p.join(path, name, 'index.html')
    });
  }, 150);

  console.log("We're done. Go check out your app project.");
}

createProject();