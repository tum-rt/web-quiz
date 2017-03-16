declare var require: any;

// Load global CSS files
require("spectre.css/dist/spectre.min.css");
require("./fontello/css/webquiz.css");
require("./quiz.css");

import Vue from "vue";
import config from "./config";
import {prewarmTagsWithCountCache} from "./api";
const VueI18n = require("vue-i18n");
const App = require("./components/App.vue").default;

prewarmTagsWithCountCache([], JSON.parse(document.getElementById("tags_with_count").innerHTML));

document.title = config.title;

Vue.use(VueI18n);
(<any>Vue.config).lang = config.lang;
(<any>Vue).locale("en", require("json-loader!./i18n/en.json"));
(<any>Vue).locale("de", require("json-loader!./i18n/de.json"));
(<any>Vue).locale("ru", require("json-loader!./i18n/ru.json"));
(<any>Vue).locale("es", require("json-loader!./i18n/es.json"));
(<any>Vue).locale("bar", require("json-loader!./i18n/bar.json"));

new Vue({
    el: "#app",
    //components: { App },
    render: h => h(App)
});
