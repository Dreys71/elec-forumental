
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'vue-material/dist/vue-material.min.css'
import VueMaterial from 'vue-material'
//import 'vue-material/dist/theme/default.css'
//import 'vue-material/dist/theme/default-dark.css'
import router from './router'
import store from './store'

import VueSocketio from 'vue-socket.io';
Vue.use(VueSocketio, 'http://localhost:8070');

import FileUpload from 'v-file-upload'
Vue.use(FileUpload)
Vue.config.productionTip = false
/*Vue.use(Pusher,{
    api_key: '63245cbe1b0cdeb66684',
    options: {
        cluster: 'eu',
        encrypted: true,
    }});
*/
axios.defaults.baseURL = "http://localhost:8000";
Vue.use(VueAxios, axios);

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueMaterial);



new Vue({
    router,
    store,
    render: createEle => createEle(App)
}).$mount('#app');