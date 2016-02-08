# truckjs
NPM module for TruckJS

Truck is an MVC framework to help you create poweful and complex apps with less work. You'll feel like you're driving a big truck on the information highway. To learn more about TruckJS, please visit [its site](http://truckjs.io).

This module lets you create an app shell so you can get started quickly.


##Install

To install on Mac OS X, you'll need to run it with ```sudo```. This will require you to provide your password to complete the installation:


```
sudo npm install truckjs -g
```

For Windows or Linux run:


```
npm install truckjs -g
```

###Parameters

- **name** or **n** The name for your app. This is required. This will create a folder with this name, and, depending on the type of app, may also update app info to display it.
- **path** or **p** The path where you want your project to be. If none is provided, it will be output to your desktop in a folder with your project's name.
- **os** or **o** The operating system you wish to target. If none is provided it defaults to iOS. The expected values are: "ios", "android", "windows".
- **type** or **t** The type of app that will be created. The default is a page with a simple list, no specific functionality. You can choose any of the following types: "navigation": a dynamic navigation list, "tabbar": a tabbar interface, "slideout": a dynamic slideout menu system.

When using names or paths that have spaces, you will need to quote those to get the correct result.

###Usage


```
// Create a simple Android app in the folder Fruits in ~/Documents/Dev:
truckjs --name Fruits --path ~/Documents/Dev/ --os android 

// or create iOS tabbar interface in Fruits on the desktop:
truckjs --name Fruits --os ios --type tabbar

// or create a slide out menu for Windows Phone in Fruits on the desktop:
truckjs --name Fruits --os windows --type slideout
```


You can also use shortened versions of the command flags: <code>n</code> for <code>name</code>, <code>p</code></code> for <code>path</code>, <code>o</code> for <code>os, and <code>t</code> for <code>type</code>. <strong>When using these, you must use a single hyphen</strong>:

- -n The name for your project.
- -p The path for your project. If not provided, will put on desktop.
- -o The OS theme to use. If none provided, will use iOS.
- -t The type of project: navigation, slideout, tabbar. If none provided, will create a default shell with a simple list.


```
// Create a simple Android app in the folder Fruits in ~/Documents/Dev:
truckjs -n Fruits -p ~/Documents/Dev/ -o android 

// or create iOS tabbar interface in Fruits on the desktop:
truckjs -n Fruits -o ios -t tabbar

// or create a slide out menu for Windows Phone in Fruits on the desktop:
truckjs -n Fruits -o windows -t slideout
```

##Browserify, Babelify &amp; LiveReload

You can also create a Browserify project with Livereload and Babelify. This allows you to write your app's code using ES6 that gets transpiled to ES5. We use this so you can take advantage of ES6 template literals when defining your app's views. You can also use comprehensions, classes and arrow functions in your code if you want to. To build your project with these features, just use the `--browserify` or `-b` flags with your command:

```
truckjs -n Fruits -o windows -t slideout --browserify

// or
truckjs -n Fruits -o windows -t slideout -b
```

This will create the following directory structure:

```
- data
- dev
- dist
gulpfile.js
- images
index.html
package.json
```
After creating your app, `cd` to the folder and run:

```
npm install
```

####App.js, The Core of Your App
The `dev` folder holds a file called `app.js`. This is the development version of your app's JavaScript. Because this project also has Babelify. When you run a build or serve command, this file gets transpiled to ES5.


When the install is done, you have two options. You can run a build script or a server script. When you run the build script, it take the app.js file and converts it to valid ES5 an outputs it to the `dist` folder. Your `index.html` references it from the `dist` folder. When you run the server script, it first runs the build script and then starts up a server instance and opens your default browser. You can change which browser it opens by editing the browserSynch browser property in the `gulpfile`. Currently it is commented out:

```
// ,browser: ['chrome']
```

Uncomment it and put whatever browser you want to use (Chrome, IE, Edge, Safari, Firefox). 

To build your project, run the following command in your project folder:

```
gulp build
```

To run a server instance with your project, run:

```
gulp server
// or just:
gulp
```

This will first build the project, then start up a server instance and load your project in your defaut browser. This also starts up a watch task for your `index.html`, `app.js` and data files. As soon as you edit any of these, your app will automatically reload in the browser without you needing to reload it yourself. Please be aware that if you do something that throws an exception in either the browser or the server instance, you will need to run the server command again. Sometimes when an error is throw, the server stays alive but can't respond. In that case, hold the command key and hit the C key. This will abort the server, allowing you to restart it.

####Using Template Literals

Because this setup is using Babelify, you can use ES6 code styles in your `app.js` file. By default all templates in the `app.js` use ES6 template literals. These simplify how to write view templates. Just enclose the template between an opening and closing back tick, no need to escape new lines or quotes:

```
var MusicView = $.View({
  element: '#musicList',
  variable: "song",
  // Use template literal:
  template: 
  `<li>
    <img src='{= song.image }'>
    <div>
      <h3>{= song.title }</h3>
      <h4>{= song.album }</h4>
      <p>{= song.description }</p>
    </div>
  </li>`
});

```

####Project Structure

- data
- dev

The folder `data` holds the data that the project uses. For navigation, slideout and tabbar, the `app.js` file uses the fetch API to get the json data in the data folder. Once this data is retrieved, `app.js` renders the views.

While developing your app, you'll work on the `app.js` file in the `dev` folder. When you build or run the server, the task transpiles `app.js` into standard ES5 and places in the `dist` folder. The `index.html` file references `app.js` in `dist`. 

####Watch

If you want to enable editing of other files to trigger a reload, you'll need to watch them as well. You might do this, for example, with a separate CSS file, or with an images folder. To add a new watch, open the gulpfile.js and add a watch command towards the end of the file like this:

```
gulp.watch('images/*.*', ['default']);
```

###Troubleshooting

If for some reason your path isn't working, check that you are using the correct path delimiters for your platform (Mac or Windows). Check to see if a name in the path has a space. If it has any spaces, enclose the path in quotes, single or double.

If you are trying to create an app for Android or Windows and you keep getting iOS, check the os flag. It needs two hyphens: ```truckjs --os android```, or ```truckjs --os windows```. Similarly, if you are using the single letter flags, it should be: ```truckjs -o android```, or ```truckjs -o windows```.

If after running a command you get this error:

```
throw new TypeError('Arguments to path.join must be strings');
```
Check your hyphens. You're missing a double hyphen for an argument that needs them somewhere. Only single letter flags can use one hyphen. Two hyphens are required in all other cases.
