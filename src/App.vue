<template>
  <div id="app">
    <div class="page-container">
      <md-app :md-theme="this.$store.state.theme">
        <md-app-toolbar class="md-primary" md-elevation="0">
          <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible && this.$store.state.connected">
            <md-icon>menu</md-icon>
          </md-button>
          <span class="md-title">Forumental</span>
          <!--<navbar></navbar>-->
        </md-app-toolbar>

        <md-app-drawer :md-fixed="true" v-if="this.$store.state.connected" :md-active.sync="menuVisible" md-persistent="mini">
          <!-- <md-toolbar class="md-transparent" md-elevation="0">
               <span>Navigation</span>

               <div class="md-toolbar-section-end">
                   <md-button class="md-icon-button md-dense" @click="toggleMenu">
                       <md-icon>keyboard_arrow_left</md-icon>
                   </md-button>
               </div>
           </md-toolbar>
           -->
          <md-list>
            <md-list-item v-if="menuVisible === true" @click="toggleMenu">
              <md-icon>keyboard_arrow_left</md-icon>
              <span class="md-list-item-text">Rétrécir le menu</span>
            </md-list-item>
            <drawer></drawer>
          </md-list>


        </md-app-drawer>

        <md-app-content>
          <div class="md-layout">
            <!-- CONTENT -->
            <div class="md-layout-item">
              <router-view></router-view>
            </div>

            <md-snackbar md-position="left" :md-duration="notification.duration" :md-active.sync="notification.show" md-persistent>
              <p>
                <span>{{ notification.name }}</span>
                <br>
                {{ notification.text }}
              </p>
              <md-avatar>
                <img :src="notification.img" :alt="notification.name + ' image'">
              </md-avatar>

              <md-button v-if="notification.link.length > 0" class="md-primary" :to="notification.link">
                <md-icon>send</md-icon>
              </md-button>
            </md-snackbar>
          </div>
        </md-app-content>


      </md-app>
    </div>
  </div>
</template>

<script>
    import Navbar from './components/Header.vue'
    import Drawer from "./components/Drawer.vue"
    export default {
        name: 'app',
        components: {
            Drawer,
            Navbar,
        },
        sockets:{
            connect: function(){
                console.log('Connexion au serveur WS Nodejs réussit')
            }
        },
        data: () => ({
            menuVisible: false,
            notification: {
                show: false,
                name: '',
                img: '',
                text: '',
                link: '',
                duration: 2000
            }
        }),
        created: function() {
            let self = this
            this.$material.theming.theme = this.$store.state.theme;
            this.$store.commit('socketReconnect');

            this.$socket.on('receipt_message', function(msg) {
                if(msg.to){
                    self.$store.commit("send_message", {user: msg.to, content: msg.message})
                }
                else if(msg.from) {
                    self.$store.commit("send_message", {user: msg.from.id, content: msg.message})
                    if(self.$route.name == "Chat.friends.id") {
                        if(parseInt(self.$route.params.id) !== msg.from.id){
                            /** NOTIFICATION **/
                            self.notification.name = msg.from.name;
                            self.notification.img = msg.from.image;
                            self.notification.show = true;
                            self.notification.text = msg.message.content;
                            self.notification.link = "chat/friends/" + msg.from.id;
                            setTimeout(() => {
                                self.notification.name = "";
                                self.notification.img = "";
                                self.notification.show = false;
                                self.notification.name = "";
                                self.notification.link = "";
                            }, self.notification.duration);
                            /** END NOTIF **/
                        }
                    }
                    else {
                        /** NOTIFICATION **/
                        self.notification.name = msg.from.name;
                        self.notification.img = msg.from.image;
                        self.notification.show = true;
                        self.notification.text = msg.message.content;
                        self.notification.link = "chat/friends/" + msg.from.id;
                        setTimeout(() => {
                            self.notification.name = "";
                            self.notification.img = "";
                            self.notification.show = false;
                            self.notification.name = "";
                            self.notification.link = "";
                        }, self.notification.duration);
                        /** END NOTIF **/
                    }
                }
            });
            this.$socket.on('receipt_message_id', function (msg) {
                /* msg : {chat_key, temp_id, true_id} */
                self.$store.commit('update_message_id', msg)
            })
            this.$socket.on('online', (msg) => {
                if(msg.data.id != self.$store.state.user.id){
                    this.notification.name = msg.data.name;
                    this.notification.img = msg.data.image;
                    self.$store.commit('friend_is_connected',msg.data.id);
                    this.notification.show = true;
                    this.notification.text = "est en ligne";
                    setTimeout(() => {
                        this.notification.name = "";
                        this.notification.img = "";
                        this.notification.show = false;
                        this.notification.name = "";
                    }, this.notification.duration);
                }
            });
            this.$socket.on('error', (msg) => {
            });
            this.$socket.on('new_profile_picture', (data) => {
                console.log('new_profile_picture', data)
                self.$store.commit('friend_change_pp', data);
            });
        },
        methods: {
            toggleMenu() {
                this.menuVisible = !this.menuVisible
            }
        }
    }
</script>
<style lang="scss">
  @import "assets/main.scss";

  main.md-app-container {
    overflow-y: hidden!important;
  }
  .md-toolbar {
    min-height: 32px!important;
  }
  .md-drawer {
    top: -24px !important;
  }
  .md-drawer.md-active {
    top: 0!important;
  }
  .fnav {
    max-width: fit-content;
    border-right: 1px solid;
    border-right: 1px solid #535353;
    height: calc(100vh - 64px);
  }
  @include md-theme-component() {
    @if md-get-theme-mode() == light {
      .fnav {
        border-right-color:#e0e0e0;
      }
    } @else {
      .fnav {
        border-right-color:#535353;
      }
    }
  }
  .md-app {
    height: 100vh;
  }
  .md-app-content {
    padding: 0!important;
  }
</style>