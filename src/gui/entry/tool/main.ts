/**
 * Copyright 2022 NTT Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import "material-design-icons-iconfont/dist/material-design-icons.css";
import "leaflet/dist/leaflet.css";
import Vue from "vue";
import "../../plugins/vuetify";
import App from "./App.vue";
import router from "../../router";
import store from "@/store";

Vue.config.productionTip = false;

Vue.prototype.$isViewerMode = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
