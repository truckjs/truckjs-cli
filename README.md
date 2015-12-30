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


You can also use shortened versions of the command flags: <code>n</code> for <code>name</code>, <code>p</code></code> for <code>path</code>, <code>o</code> for <code>os, and <code>t</code> for <code>type</code>. When using these, you can also use just a single hyphen:


```
// Create a simple Android app in the folder Fruits in ~/Documents/Dev:
truckjs -n Fruits -p ~/Documents/Dev/ -o android 

// or create iOS tabbar interface in Fruits on the desktop:
truckjs -n Fruits -o ios -t tabbar

// or create a slide out menu for Windows Phone in Fruits on the desktop:
truckjs -n Fruits -o windows -t slideout
```

###Troubleshooting

If for some reason your path isn't working, check that you are using the correct path delimiters for your platform (Mac or Windows). Check to see if a name in the path has a space. If it has any spaces, enclose the path in quotes, single or double.

If you are trying to create an app for Android or Windows and you keep getting iOS, check the os flag. It needs two hyphens: ```truckjs --os android```, or ```truckjs --os windows```. Similarly, if you are using the single letter flags, it should be: ```truckjs -o android```, or ```truckjs -o windows```.

If after running a command you get this error:

```
throw new TypeError('Arguments to path.join must be strings');
```
Check your hyphens. You're missing a double hyphen for an argument that needs them somewhere. Only single letter flags can use one hyphen. Two hyphens are required in all other cases.
