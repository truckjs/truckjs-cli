#!/usr/bin/env node
var fs = require('fs');
var mkdirp = require('mkdirp');
var writefile = require('writefile');
var cpr = require('cpr');
var ncp = require('ncp').ncp;
var p = require("path");
var argv = require('yargs').usage('Usage: --name "Icecream" --path "~/Documents/myWebApp" --os: (ios, android, win) --type (plain, navigation, tab, slideout').argv;
var name = argv.name || argv.n;
var type = argv.type || argv.t || 'default';
var homedir = (process.platform === "win32") ? process.env.HOMEPATH : process.env.HOME;
var path = argv.path || argv.p || p.join(homedir, 'Desktop');
var os = argv.os || argv.o || 'ios';

var pkg = require('./package.json');

var noop = function() {};

if (!name) {
  console.log('Please provide a name for the project using "--name" or "--n": truckjs --name Buzzaz.');
  return;
}

var template = '<!DOCTYPE html>\n\
<html lang="en">\n\
<head>\n\
  <meta charset="utf-8">\n\
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n\
  <meta name="apple-mobile-web-app-capable" content="yes">\n\
  <meta name="mobile-web-app-capable" content="yes">\n\
  <meta name="msapplication-tap-highlight" content="no">\n\
  <title>' + name + '</title>\n\
  <link rel="stylesheet" href="./dist/styles/truck-' + os + '.min.css">\n\
  <script src="./dist/truck.min.js"></script>\n\
  <script>\n\
    /// <reference path="typings/tsd.d.ts" />\n\
    $(function() {\n\
      var ListView = $.View({\n\
        element: "#list",\n\
        template: "<li><h3>Item ${ data }</h3></li>"\n\
      });\n\
      ListView.render(["One","Two","Three"])\n\
    });\n\
  </script>\n\
</head>\n\
<body>\n\
<screen class="current" id="main">\n\
  <nav class="current">\n\
    <h1>' + name + '</h1>\n\
  </nav>\n\
  <section>\n\
    <h2>List</h2>\n\
    <ul id="list" class="list"></ul>\n\
    \n\
  </section>\n\
</screen>\n\
</body>\n\
</html>';


var navigation = '<!DOCTYPE html>\n\
<html lang="en">\n\
<head>\n\
  <meta charset="utf-8">\n\
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n\
  <meta name="apple-mobile-web-app-capable" content="yes">\n\
  <meta name="mobile-web-app-capable" content="yes">\n\
  <meta name="msapplication-tap-highlight" content="no">\n\
  <title>' + name + '</title>\n\
  <link rel="stylesheet" href="./dist/styles/truck-' + os + '.min.css">\n\
  <script src="./dist/truck.min.js"></script>\n\
</head>\n\
<body>\n\
  <screen id="main" class="current">\n\
    <nav id="nav1">\n\
      <h1>' + name + '</h1>\n\
    </nav>\n\
    <section>\n\
      <h2>Luminaries</h2>\n\
      <ul class="list cloak" id="arrayTemplate1"></ul>\n\
    </section>\n\
  </screen>\n\
  \n\
  <screen id="detail" class="next">\    <nav>\n\
      <button class="back">Back</button>\n\
      <h1>Detail</h1>\n\
    </nav>\n\
    <section>\n\
      <h2 id="chosenPerson">Chosen Person</h2>\n\
      <ul class="list" id="chosenPersonList"></ul>\n\
    </section>\n\
  </screen>\n\
  <script>\n\
    $(function() {\n\
      // Array data:\n\
      //=============\n\
      var lums = [\n\
        {guid: "N356f953-2c3c-4a72-b4e7-5955662ec80f", firstName: "Stephen", lastName: "Hawking", age: 20},\n\
        {guid: "Ca0fe1ed-afd8-4c98-8110-e863820ab35f", firstName: "Albert", lastName: "Einstein", age: 31},\n\
        {guid: "a51a1852-bcd1-44e3-9114-3c0c742b66f9", firstName: "Leonardo", lastName: "Da Vinci", age: 100},\n\
        {guid: "k4657925-fdc3-45b0-8c12-6a31c4b83152", firstName: "Galileo", lastName: "Galilei", age: 40},\n\
        {guid: "F3b2bd1f-346b-4970-a272-11124927a6e6", firstName: "Nicholas", lastName: "Copernicus", age: 32}\n\
      ];\n\
\n\
      // Create model:\n\
      //==============\n\
      var LumsModel = $.Model(lums, "luminaries-handle");\n\
      \n\
      // Call Garbage Collector:\n\
      lums = null;\n\
\n\
      // Init views:\n\
      //=============\n\
      var App = {\n\
        VIPView: $.View({\n\
          name: "VIPView1",\n\
          element: "#arrayTemplate1", \n\
          model: LumsModel,\n\
          startIndexFrom: 1,\n\
          events: [{\n\
            event: "tap",\n\
            element: "li",\n\
            callback: function() {\n\
              console.log($(this).text());\n\
            }\n\
          }],\n\
          template: "<li data-goto=\'detail:${ data.guid }\'><h3>${ $.view.index }: ${ data.firstName } ${ data.lastName }</h3><aside><disclosure></disclosure></aside></li>"\n\
        }),\n\
        \n\
        chosenPersonView: $.View({\n\
          name: "chosenPersonView",\n\
          element: "#chosenPersonList",\n\
          template: "<li><h3>First Name: ${ data.firstName }</h3></li><li><h3>Last Name: ${ data.lastName }</h3></li>"\n\
        })\n\
      };\n\
\n\
      // Render views:\n\
      //==============\n\
      App.VIPView.render();\n\
\n\
\n\
      // Setup Router:\n\
      //==============\n\
      $.App = $.Router();\n\
\n\
      // Define Routes:\n\
      //===============\n\
      $.App.addRoute([\n\
        {\n\
          // Route for detail screen:\n\
          route: "detail",\n\
\n\
          // Capture id in callback:\n\
          callback: function(id) {\n\
            // Get current view model:\n\
            var model = App.VIPView.getModel().getData();\n\
            // Filter model with id passed in route:\n\
            var whichPerson = model.filter(function(person) {\n\
              return person.guid === id;\n\
            })[0];\n\
            // Output peron"s name:\n\
            $("#chosenPerson").text("Welcome, " + whichPerson.firstName + ".");\n\
            // Output full route:\n\
            $(".fullRoute").text($.TruckRoutes.getFullRoute());\n\
            App.chosenPersonView.empty();\n\
            App.chosenPersonView.render(whichPerson);\n\
          }\n\
        }\n\
      ]);\n\
    });\n\
  </script>  \n\
</body>';

var slideout = '<!DOCTYPE html>\n\
<html lang="en">\n\
<head>\n\
  <meta charset="utf-8">\n\
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n\
  <meta name="apple-mobile-web-app-capable" content="yes">\n\
  <meta name="mobile-web-app-capable" content="yes">\n\
  <meta name="msapplication-tap-highlight" content="no">\n\
  <title>' + name + '</title>\n\
  <link rel="stylesheet" href="./dist/styles/truck-' + os + '.min.css">\n\
  <script src="./dist/truck.min.js"></script>\n\
</head>\n\
<body>\n\
  <!-- Main Screen for Slide Out Choices -->\n\
  <screen id="choice" class="show">\n\
    <nav>\n\
      <h1>' + name + '</h1>\n\
    </nav>\n\
    <section>\n\
      <!-- List Element -->\n\
      <ul id="myList" class="list"></ul>\n\
    </section>\n\
  </screen>\n\
\n\
\n\
  <!-- Script Music Template -->\n\
  <script id="music-template" type="text/x-template">\n\
    <li>\n\
      <div>\n\
        <h3>${ data.title }</h3>\n\
        <h4>${ data.album }</h4>\n\
        <p>${ data.description }</p>\n\
      </div>\n\
    </li>\n\
  </script>\n\
\n\
  <!-- Script Documents Template -->\n\
  <script id="documents-template" type="text/x-template">\n\
    <li class="center-vertical">\n\
      <h3>${ data.title }</h3>\n\
      <h4>${ data.subtitle }</h4>\n\
      <aside>\n\
        <span class="counter">${ data.amount }</span>\n\
      </aside>\n\
    </li>\n\
  </script>\n\
\n\
  <!-- Script Recipes Template -->\n\
  <script id="recipes-template" type="text/x-template">\n\
    <li>\n\
      <div>\n\
        <h3>${ data.name }</h3>\n\
        <h4>Ingredients</h4>\n\
        <ul>\n\
          {{ data.ingredients.forEach(function(ingredient) { }}\n\
            <li>${ ingredient }</li>\n\
          {{ }); }}\n\
        </ul>\n\
        <h4>Directions</h4>\n\
        <ol>\n\
          {{ data.directions.forEach(function(direction) { }}\n\
            <li>${ direction }</li>\n\
          {{ }); }}\n\
        </ol>\n\
      </div>\n\
    </li>\n\
  </script>\n\
\n\
  <!-- Script Favorites Template -->\n\
  <script id="favorites-template" type="text/x-template">\n\
    <li>\n\
       <h3>${ data }</h3>\n\
    </li> \n\
  </script>\n\
  \n\
  <script>\n\
    $(function() {\n\
      var music = [\n\
        {\n\
          title: "Imagine Dragons",\n\
          album: "Radioactive",\n\
          description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."\n\
        },\n\
        {\n\
          title: "The Hurry and the Harm",\n\
          album: "Hurt",\n\
          description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae."\n\
        },\n\
        {\n\
          title: "David Cook",\n\
          album: "Permanent",\n\
          description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem."\n\
        },\n\
        {\n\
          title: "Kiss",\n\
          album: "This Kiss",\n\
          description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas."\n\
        },\n\
        {\n\
          title: "Willy Moon",\n\
          album: "Yeah Yeah",\n\
          description: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non."\n\
        }\n\
      ];\n\
\n\
      var docs = [\n\
        {\n\
          title: "Receipts",\n\
          subtitle: "Lunch",\n\
          amount: 24\n\
        },\n\
        {\n\
          title: "Receipts",\n\
          subtitle: "Gas",\n\
          amount: 12\n\
        },\n\
        {\n\
          title: "Receipts",\n\
          subtitle: "Groceries",\n\
          amount: 6\n\
        },\n\
        {\n\
          title: "Utilities",\n\
          subtitle: "Electiricity",\n\
          amount: 1\n\
        },\n\
        {\n\
          title: "Rent",\n\
          subtitle: "Receipt",\n\
          amount: 10\n\
        },\n\
        {\n\
          title: "Legal",\n\
          subtitle: "Car",\n\
          amount: 5\n\
        },\n\
        {\n\
          title: "Family",\n\
          subtitle: "Legal",\n\
          amount: 3\n\
        },\n\
        {\n\
          title: "Personal",\n\
          subtitle: "Will",\n\
          amount: 1\n\
        },\n\
        {\n\
          title: "Personal",\n\
          subtitle: "Health Care",\n\
          amount: 16\n\
        }\n\
      ]; \n\
\n\
      var recipes = [\n\
        {\n\
          name: "Italian Style Meatloaf",\n\
          ingredients: [\n\
            "1 1/2 pounds ground beef",\n\
            "2 eggs, beaten",\n\
            "3/4 cup dry bread crumbs",\n\
            "1/4 cup ketchup",\n\
            "1 teaspoon Italian-style seasoning",\n\
            "1 teaspoon garlic salt",\n\
            "1 (14.5 ounce) can diced tomatoes, drained"\n\
          ],\n\
          directions: [\n\
          \n\
            "Preheat oven to 350 degrees F (175 degrees C).",\n\
            "In a large bowl, mix together ground beef, eggs, bread crumbs and ketchup. Season with Italian-style seasoning, oregano, basil, garlic salt, diced tomatoes and cheese. Press into a 9x5 inch loaf pan, and cover loosely with foil.",\n\
            "Bake in the preheated oven approximately 1 hour, or until internal temperature reaches 160 degrees F (70 degrees C)."\n\
          ]\n\
        },\n\
        {\n\
          name: "Chicken Marsala",\n\
          ingredients: [\n\
            "1/4 cup all-purpose flour for coating",\n\
            "1/2 teaspoon salt",\n\
            "1/4 teaspoon ground black pepper",\n\
            "1/2 teaspoon dried oregano",\n\
            "4 skinless, boneless chicken breast halves - pounded 1/4 inch thick",\n\
            "4 tablespoons butter",\n\
            "4 tablespoons olive oil",\n\
            "1 cup sliced mushrooms",\n\
            "1/2 cup Marsala wine",\n\
            "1/4 cup cooking sherry"\n\
          ],\n\
          directions: [\n\
          \n\
            "In a shallow dish or bowl, mix together the flour, salt, pepper and oregano. Coat chicken pieces in flour mixture.",\n\
            "In a large skillet, melt butter in oil over medium heat. Place chicken in the pan, and lightly brown. Turn over chicken pieces, and add mushrooms. Pour in wine and sherry. Cover skillet; simmer chicken 10 minutes, turning once, until no longer pink and juices run clear."\n\
          ]\n\
        },\n\
        {\n\
          name: "Chicken Breasts with Lime Sauce",\n\
          ingredients: [\n\
            "4 skinless, boneless chicken breast halves - pounded to 1/4 inch thickness",\n\
            "1 egg, beaten",\n\
            "2/3 cup dry bread crumbs",\n\
            "2 tablespoons olive oil",\n\
            "1 lime, juiced",\n\
            "6 tablespoons butter",\n\
            "1 teaspoon minced fresh chives",\n\
            "1/2 teaspoon dried dill weed"\n\
          ],\n\
          directions: [\n\
          \n\
            "Coat chicken breasts with egg, and dip in bread crumbs. Place on a wire rack, and allow to dry for about 10 minutes.",\n\
            "Heat olive oil in a large skillet over medium heat. Place chicken into the skillet, and fry for 3 to 5 minutes on each side. Remove to a platter, and keep warm.",\n\
            "Drain grease from the skillet, and squeeze in lime juice. Cook over low heat until it boils. Add butter, and stir until melted. Season with chives and dill. Spoon sauce over chicken, and serve immediately."\n\
          ]\n\
        },\n\
        {\n\
          name: "Lemon Rosemary Salmon",\n\
          ingredients: [\n\
            "1 lemon, thinly sliced",\n\
            "4 sprigs fresh rosemary",\n\
            "2 salmon fillets, bones and skin removed coarse salt to taste",\n\
            "1 tablespoon olive oil, or as needed"\n\
          ],\n\
          directions: [\n\
          \n\
            "Preheat oven to 400 degrees F (200 degrees C).",\n\
            "Arrange half the lemon slices in a single layer in a baking dish. Layer with 2 sprigs rosemary, and top with salmon fillets. Sprinkle salmon with salt, layer with remaining rosemary sprigs, and top with remaining lemon slices. Drizzle with olive oil.",\n\
            "Bake 20 minutes in the preheated oven, or until fish is easily flaked with a fork."\n\
          ]\n\
        },\n\
        {\n\
          name: "Strawberry Angel Food Dessert",\n\
          ingredients: [\n\
            "1 (10 inch) angel food cake",\n\
            "2 (8 ounce) packages cream cheese, softened",\n\
            "1 cup white sugar",\n\
            "1 (8 ounce) container frozen whipped topping, thawed",\n\
            "1 quart fresh strawberries, sliced",\n\
            "1 (18 ounce) jar strawberry glaze"\n\
          ],\n\
          directions: [\n\
          \n\
            "Crumble the cake into a 9x13 inch dish.",\n\
            "Beat the cream cheese and sugar in a medium bowl until light and fluffy. Fold in whipped topping. Mash the cake down with your hands and spread the cream cheese mixture over the cake.",\n\
            "In a bowl, combine strawberries and glaze until strawberries are evenly coated. Spread over cream cheese layer. Chill until serving."\n\
          ]\n\
        }\n\
      ];\n\
\n\
      var favorites = [\n\
        "Pizza",\n\
        "Ice Cream",\n\
        "Software Development",\n\
        "Baseball",\n\
        "Movies",\n\
        "Computer Games",\n\
        "Music",\n\
        "Debugging Code",\n\
        "Hiking",\n\
        "Puzzles"\n\
      ];\n\
      var templates = [];\n\
\n\
      templates[0] = $("#music-template").html();\n\
      templates[1] = $("#documents-template").html();\n\
      templates[2] = $("#recipes-template").html();\n\
      templates[3] = $("#favorites-template").html();\n\
   \n\
      // Define initial state of View:\n\
      //==============================\n\
      var listView = $.View({name: "listView"});\n\
      listView.setTemplate(templates[0]);\n\
      listView.setElement("#myList");\n\
      listView.render(music);\n\
\n\
      // Setup Slide Out:\n\
      //=================\n\
      var AppSlideOut = $.SlideOut();\n\
      // Notice names have `:` to \n\
      // indicate id for routing.\n\
      // Id will be used to render view.\n\
      AppSlideOut.populate([\n\
        { "choice:music": "Music" },\n\
        { "choice:documents": "Documents"},\n\
        { "choice:recipes": "Recipes" },\n\
        { "choice:favorites": "Favorites" }\n\
      ]);\n\
\n\
      // Define Routes:\n\
      //===============\n\
      var App = $.Router();\n\
      // Define routes to handle ids\n\
      // from slide out menu items:\n\
      App.addRoute([\n\
        {\n\
          // The route:\n\
          route: "choice", \n\
          // Callback to handle passed id:\n\
          callback: function(id) {\n\
            // Method to render templates in switch statement:\n\
            var renderChosenTemplate = function(template, item) {\n\
              listView.setTemplate(template);\n\
              listView.render(item);\n\
            };\n\
            // Handle passed id:\n\
            switch (id) {\n\
              case "music":\n\
                renderChosenTemplate(templates[0], music);\n\
                break;\n\
              case "documents":\n\
                renderChosenTemplate(templates[1], docs);\n\
                break;\n\
              case "recipes":\n\
                renderChosenTemplate(templates[2], recipes);\n\
                break;\n\
              case "favorites":\n\
                renderChosenTemplate(templates[3], favorites);\n\
                break;\n\
            }\n\
          }\n\
        }\n\
      ]);\n\
    });\n\
  </script>  \n\
</body>\n\
</html>';


var tabbar ='<!DOCTYPE html>\n\
<html lang="en">\n\
<head>\n\
  <meta charset="utf-8">\n\
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n\
  <meta name="apple-mobile-web-app-capable" content="yes">\n\
  <meta name="mobile-web-app-capable" content="yes">\n\
  <meta name="msapplication-tap-highlight" content="no">\n\
  <title>' + name + '</title>\n\
  <link rel="stylesheet" href="./dist/styles/truck-' + os + '.min.css">\n\
  <script src="./dist/truck.min.js"></script>\n\
  <style>\n\
    tabbar > button {\n\
      background-color: #fafafa;\n\
    }\n\
    tabbar > button:hover,\n\
    tabbar > button.selected {\n\
      color: #007aff !important;\n\
      background-color: #f0f0f0;\n\
      opacity: 1 !important;\n\
    }\n\
    tabbar > button > .icon {\n\
      background-position: center center;\n\
      background-size: 100%;\n\
      background-repeat: no-repeat;\n\
    }\n\
    tabbar > button.music > .icon  {\n\
      background-image: url("images/icons/Head_phones.svg");\n\
    }\n\
    tabbar > button.docs > .icon {\n\
      background-image: url("images/icons/Documents.svg");\n\
    }\n\
    tabbar > button.recipes > .icon  {\n\
      background-image: url("images/icons/Download.svg");\n\
    }\n\
    tabbar > button.top_rated > .icon {\n\
      background-image: url("images/icons/Favorite.svg");\n\
    }\n\
  </style>\n\
</head>\n\
<body id="TabbarExample">\n\
\n\
  <screen role="article" id="music" class="next">\n\
    <nav>\n\
      <h1>Music</h1>\n\
    </nav>\n\
    <section>\n\
      <ul class="list" id="musicList">\n\
        <li>\n\
          <img  data-src="${ music.image }" height="80px">\n\
          <div>\n\
            <h3>${ music.title }</h3>\n\
            <h4>${ music.album }</h4>\n\
            <p>${ music.description }</p>\n\
          </div>\n\
        </li>\n\
      </ul>\n\
    </section>\n\
  </screen>\n\
\n\
  <screen role="article" id="documents" class="next">\n\
    <nav>\n\
      <h1>Documents</h1>\n\
    </nav>\n\
    <section>\n\
      <ul class="list" id="docsList">\n\
        <script type="text/x-template">\n\
          <li class="center-vertical">\n\
            <h3>${ doc.title }</h3>\n\
            <h4>${ doc.subtitle }</h4>\n\
            <aside>\n\
              <span class="counter">${ doc.amount }</span>\n\
            </aside>\n\
          </li>\n\
        </script>\n\
      </ul>\n\
    </section>\n\
  </screen>\n\
\n\
  <screen role="article" id="recipes" class="next">\n\
    <nav>\n\
      <h1>Recipes</h1>\n\
    </nav>\n\
    <section>\n\
      <h2>Special Dishes</h2>\n\
      <ul class="list" id="recipesList">\n\
        <script type="text/x-template">\n\
          <li>\n\
            <div>\n\
              <h3>${ recipe.name }</h3>\n\
              <h4>Ingredients</h4>\n\
              <ul>\n\
                {{ recipe.ingredients.forEach(function(ingredient) { }}\n\
                  <li>${ ingredient }</li>\n\
                {{ }); }}\n\
              </ul>\n\
              <h4>Directions</h4>\n\
              <ol>\n\
                {{ recipe.directions.forEach(function(direction) { }}\n\
                  <li>${ direction }</li>\n\
                {{ }); }}\n\
              </ol>\n\
            </div>\n\
          </li>\n\
        </script>\n\
      </ul>\n\
    </section>\n\
  </screen>\n\
\n\
  <screen role="article" id="favorites" class="next">\n\
    <nav>\n\
      <h1>Favorites</h1>\n\
    </nav>\n\
    <section>\n\
      <ul class="list" id="favoritesList">\n\
        <li>\n\
           <h3>${ data }</h3>\n\
        </li>  \n\
       </ul>\n\
    </section>\n\
  </screen>\n\
  <script>\n\
    $(function() {\n\
      var music = [\n\
        {\n\
          image: "images/music/Imagine Dragons.jpg",\n\
          title: "Imagine Dragons",\n\
          album: "Radioactive",\n\
          description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."\n\
        },\n\
        {\n\
          image: "images/music/Hurry and Harm.jpg",\n\
          title: "The Hurry and the Harm",\n\
          album: "Hurt",\n\
          description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae."\n\
        },\n\
        {\n\
          image: "images/music/Permanent.jpg",\n\
          title: "David Cook",\n\
          album: "Permanent",\n\
          description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem."\n\
        },\n\
        {\n\
          image: "images/music/Kiss.jpg",\n\
          title: "Kiss",\n\
          album: "This Kiss",\n\
          description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas."\n\
        },\n\
        {\n\
          image: "images/music/Willy Moon.jpg",\n\
          title: "Willy Moon",\n\
          album: "Yeah Yeah",\n\
          description: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non."\n\
        }\n\
      ];\n\
      var docs = [\n\
        {\n\
          title: "Receipts",\n\
          subtitle: "Lunch",\n\
          amount: 24\n\
        },\n\
        {\n\
          title: "Receipts",\n\
          subtitle: "Gas",\n\
          amount: 12\n\
        },\n\
        {\n\
          title: "Receipts",\n\
          subtitle: "Groceries",\n\
          amount: 6\n\
        },\n\
        {\n\
          title: "Utilities",\n\
          subtitle: "Electiricity",\n\
          amount: 1\n\
        },\n\
        {\n\
          title: "Rent",\n\
          subtitle: "Receipt",\n\
          amount: 10\n\
        },\n\
        {\n\
          title: "Legal",\n\
          subtitle: "Car",\n\
          amount: 5\n\
        },\n\
        {\n\
          title: "Family",\n\
          subtitle: "Legal",\n\
          amount: 3\n\
        },\n\
        {\n\
          title: "Personal",\n\
          subtitle: "Will",\n\
          amount: 1\n\
        },\n\
        {\n\
          title: "Personal",\n\
          subtitle: "Health Care",\n\
          amount: 16\n\
        }\n\
      ]; \n\
      var recipes = [\n\
        {\n\
          name: "Italian Style Meatloaf",\n\
          ingredients: [\n\
            "1 1/2 pounds ground beef",\n\
            "2 eggs, beaten",\n\
            "3/4 cup dry bread crumbs",\n\
            "1/4 cup ketchup",\n\
            "1 teaspoon Italian-style seasoning",\n\
            "1 teaspoon garlic salt",\n\
            "1 (14.5 ounce) can diced tomatoes, drained"\n\
          ],\n\
          directions: [\n\
            "Preheat oven to 350 degrees F (175 degrees C).",\n\
            "In a large bowl, mix together ground beef, eggs, bread crumbs and ketchup. Season with Italian-style seasoning, oregano, basil, garlic salt, diced tomatoes and cheese. Press into a 9x5 inch loaf pan, and cover loosely with foil.",\n\
            "Bake in the preheated oven approximately 1 hour, or until internal temperature reaches 160 degrees F (70 degrees C)."\n\
          ]\n\
        },\n\
        {\n\
          name: "Chicken Marsala",\n\
          ingredients: [\n\
            "1/4 cup all-purpose flour for coating",\n\
            "1/2 teaspoon salt",\n\
            "1/4 teaspoon ground black pepper",\n\
            "1/2 teaspoon dried oregano",\n\
            "4 skinless, boneless chicken breast halves - pounded 1/4 inch thick",\n\
            "4 tablespoons butter",\n\
            "4 tablespoons olive oil",\n\
            "1 cup sliced mushrooms",\n\
            "1/2 cup Marsala wine",\n\
            "1/4 cup cooking sherry"\n\
          ],\n\
          directions: [\n\
            "In a shallow dish or bowl, mix together the flour, salt, pepper and oregano. Coat chicken pieces in flour mixture.",\n\
            "In a large skillet, melt butter in oil over medium heat. Place chicken in the pan, and lightly brown. Turn over chicken pieces, and add mushrooms. Pour in wine and sherry. Cover skillet; simmer chicken 10 minutes, turning once, until no longer pink and juices run clear."\n\
          ]\n\
        },\n\
        {\n\
          name: "Chicken Breasts with Lime Sauce",\n\
          ingredients: [\n\
            "4 skinless, boneless chicken breast halves - pounded to 1/4 inch thickness",\n\
            "1 egg, beaten",\n\
            "2/3 cup dry bread crumbs",\n\
            "2 tablespoons olive oil",\n\
            "1 lime, juiced",\n\
            "6 tablespoons butter",\n\
            "1 teaspoon minced fresh chives",\n\
            "1/2 teaspoon dried dill weed"\n\
          ],\n\
          directions: [\n\
            "Coat chicken breasts with egg, and dip in bread crumbs. Place on a wire rack, and allow to dry for about 10 minutes.",\n\
            "Heat olive oil in a large skillet over medium heat. Place chicken into the skillet, and fry for 3 to 5 minutes on each side. Remove to a platter, and keep warm.",\n\
            "Drain grease from the skillet, and squeeze in lime juice. Cook over low heat until it boils. Add butter, and stir until melted. Season with chives and dill. Spoon sauce over chicken, and serve immediately."\n\
          ]\n\
        },\n\
        {\n\
          name: "Lemon Rosemary Salmon",\n\
          ingredients: [\n\
            "1 lemon, thinly sliced",\n\
            "4 sprigs fresh rosemary",\n\
            "2 salmon fillets, bones and skin removed coarse salt to taste",\n\
            "1 tablespoon olive oil, or as needed"\n\
          ],\n\
          directions: [\n\
            "Preheat oven to 400 degrees F (200 degrees C).",\n\
            "Arrange half the lemon slices in a single layer in a baking dish. Layer with 2 sprigs rosemary, and top with salmon fillets. Sprinkle salmon with salt, layer with remaining rosemary sprigs, and top with remaining lemon slices. Drizzle with olive oil.",\n\
            "Bake 20 minutes in the preheated oven, or until fish is easily flaked with a fork."\n\
          ]\n\
        },\n\
        {\n\
          name: "Strawberry Angel Food Dessert",\n\
          ingredients: [\n\
            "1 (10 inch) angel food cake",\n\
            "2 (8 ounce) packages cream cheese, softened",\n\
            "1 cup white sugar",\n\
            "1 (8 ounce) container frozen whipped topping, thawed",\n\
            "1 quart fresh strawberries, sliced",\n\
            "1 (18 ounce) jar strawberry glaze"\n\
          ],\n\
          directions: [\n\
            "Crumble the cake into a 9x13 inch dish.",\n\
            "Beat the cream cheese and sugar in a medium bowl until light and fluffy. Fold in whipped topping. Mash the cake down with your hands and spread the cream cheese mixture over the cake.",\n\
            "In a bowl, combine strawberries and glaze until strawberries are evenly coated. Spread over cream cheese layer. Chill until serving."\n\
          ]\n\
        }\n\
      ];\n\
      var favorites = [\n\
        "Pizza",\n\
        "Ice Cream",\n\
        "Software Development",\n\
        "Baseball",\n\
        "Movies",\n\
        "Computer Games",\n\
        "Music",\n\
        "Debugging Code",\n\
        "Hiking",\n\
        "Puzzles"\n\
      ];\n\
      // Options for Tab Bar:\n\
      //=====================\n\
      var opts = {\n\
         icons: ["music", "docs", "recipes", "top_rated"],\n\
         labels: ["Music", "Docs", "Recipes", "Favs"],\n\
         selected: 1,\n\
         screens: ["music", "documents", "recipes", "favorites"],\n\
         showIcons: false\n\
      };\n\
      // Init Tab Bar:\n\
      //==============\n\
      $.MyTabbar = $.TabBar(opts);\n\
      // Music View:\n\
      //============\n\
      var musicView = $.View({\n\
        element: "#musicList",\n\
        variable: "music"\n\
      });\n\
      musicView.render(music);\n\
      // Docs View:\n\
      //===============\n\
      var docsView = $.View({\n\
        element: "#docsList",\n\
        variable: "doc"\n\
      });\n\
      docsView.render(docs);\n\
      // Recipes View:\n\
      //==================\n\
      var recipesView = $.View({\n\
        element: "#recipesList",\n\
        variable: "recipe"\n\
      });\n\
      recipesView.render(recipes);\n\
      // Favorites View:\n\
      //====================\n\
      favoritesView = $.View({\n\
        element: "#favoritesList"\n\
      });\n\
      favoritesView.render(favorites);\n\
    });\n\
  </script>\n\
</body>\n\
</html>';

//=======================================================
// Define function to create directories and write files:
//=======================================================
var createProject = function() {
  if (name) {
    ncp.limit = 16;
    mkdirp(p.join(path, name), noop);
    
    // Copy files:
    ncp(p.join(__dirname, 'dist', 'truck'), p.join(path, name, 'dist'), noop);
    ncp(p.join(__dirname, 'dist', 'styles', os), p.join(path, name, 'dist', 'styles'), noop);
    ncp(p.join(__dirname, 'dist', 'typings'), p.join(path, name, 'dist', 'typings'), noop);

    // Create file

    switch(type) {
      case 'default':
        writefile(p.join(path, name, 'index.html'), template, noop);
        break;
      case 'navigation':
        writefile(p.join(path, name, 'index.html'), navigation, noop);
        break;
      case 'slideout':
        writefile(p.join(path, name, 'index.html'), slideout, noop);
        break;
      case 'tabbar':
        writefile(p.join(path, name, 'index.html'), tabbar, noop);
        ncp(p.join(__dirname, 'dist', 'images'), p.join(path, name, 'images'), noop);
        break;
      default:
        writefile(p.join(path, name, 'index.html'), template, noop);
        break;
    }

    console.log('We\'re done. Go check out your app project.');
  }
}

createProject();