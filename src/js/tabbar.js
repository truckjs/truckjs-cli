$(function() {

  // Fetch data:
  //============
  fetch('./data/music.json')
    .then($.json)
    .then(function(obj) {
      musicView.render(obj);
    });  
  fetch('./data/docs.json')
    .then($.json)
    .then(function(obj) {
      docsView.render(obj);
    });
  fetch('./data/recipes.json')
    .then($.json)
    .then(function(obj) {
      recipesView.render(obj);
    });
  fetch('./data/favorites.json')
    .then($.json)
    .then(function(obj) {
      favoritesView.render(obj);
    });

  // Options for Tab Bar:
  //=====================
  var opts = {
     icons: ["music", "docs", "recipes", "top_rated"],
     labels: ["Music", "Docs", "Recipes", "Favs"],
     selected: 1,
     screens: ["music", "documents", "recipes", "favorites"],
     showIcons: false
  };
  // Init Tab Bar:
  //==============
  $.MyTabbar = $.TabBar(opts);
  // Music View:
  //============
  var musicView = $.View({
    element: "#musicList",
    variable: "music",
    template:
    `<li>
      <img  data-src="{= music.image }" height="80px">
      <div>
        <h3>{= music.title }</h3>
        <h4>{= music.album }</h4>
        <p>{= music.description }</p>
      </div>
    </li>`
  });
  // Docs View:
  //===============
  var docsView = $.View({
    element: "#docsList",
    variable: "doc",
    template:
    `<li class="center-vertical">
      <h3>{= doc.title }</h3>
      <h4>{= doc.subtitle }</h4>
      <aside>
        <span class="counter">{= doc.amount }</span>
      </aside>
    </li>`
  });
  // Recipes View:
  //==================
  var recipesView = $.View({
    element: "#recipesList",
    variable: "recipe",
    template:
    `<li>
      <div>
        <h3>{= recipe.name }</h3>
        <h4>Ingredients</h4>
        <ul>
          {{ recipe.ingredients.forEach(function(ingredient) { }}
            <li>{= ingredient }</li>
          {{ }); }}
        </ul>
        <h4>Directions</h4>
        <ol>
          {{ recipe.directions.forEach(function(direction) { }}
            <li>{= direction }</li>
          {{ }); }}
        </ol>
      </div>
    </li>`
  });
  // Favorites View:
  //====================
  var favoritesView = $.View({
    element: "#favoritesList",
    template:
    `<li>
      <h3>{= data }</h3>
    </li>`
  });
});