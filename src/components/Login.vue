<template>
    <div class="centered-container">
        <md-content class="md-elevation-3">

            <div class="title">
                <img src="static/img/logo.png">
                <div class="md-title">Forumental</div>
                <div class="md-body-1">Connecter vous pour accéder à vos forums</div>
            </div>

            <form @submit="auth" id="form">
                <md-field>
                    <label>E-mail</label>
                    <md-input v-model="login.email" autofocus></md-input>
                </md-field>

                <md-field md-has-password>
                    <label>Mot de passe</label>
                    <md-input v-model="login.password" type="password"></md-input>
                </md-field>
            </form>

            <div class="actions md-layout md-alignment-center-space-between">
                <a href="/resetpassword">Mot de passe oublié</a>
                <md-button type="submit" form="form" class="md-raised md-primary" @click="auth">Connexion</md-button>
            </div>

            <div class="loading-overlay" v-if="loading">
                <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
            </div>

        </md-content>
        <div class="background" />

        <ParticlesJS></ParticlesJS>





        <md-snackbar :md-position="position" :md-duration="isInfinity ? Infinity : duration" :md-active.sync="showSnackbar" md-persistent>
            <span>{{ message }}</span>
        </md-snackbar>
    </div>

</template>
<script>
    import ParticlesJS from "./ParticleJS";

    export default {
        components: {ParticlesJS},
        name: "Login",
        data() {
            return {
                loading: false,
                login: {
                    email: "",
                    password: ""
                },
                message: '',
                id: 0,
                showSnackbar: false,
                position: 'center',
                duration: 4000,
                isInfinity: false
            };
        },
        methods: {
            auth(e) {
                e.preventDefault()
                this.loading = true;
                this.axios.post('/api/login', {
                        email: this.login.email,
                        password: this.login.password
                    }
                ).then((response) => {
                    this.$store.commit('login');
                    this.$store.commit('setUser', response.data);
                    this.message = "Connexion réussi. Bienvenue " + response.data.user.name;
                    this.loadForums();
                    this.loadFriends();
                    this.loadChat();
                    this.loadChatViews();
                    this.loadXp();
                    /* My chat room */
                    this.socket_subscription("personal-user-" + response.data.user.id)
                    /** SOCKET SUBSCRIPTION **/
                    this.socket_subscription("user-" + response.data.user.id);
                    this.$socket.emit('online',{room : "user-" + response.data.user.id, data: {id: response.data.user.id, name: response.data.user.name, image: response.data.user.image}});
                    /** **/
                    this.id = response.data.user.id;
                    this.showSnackbar = true;
                    this.loading = false;
                    this.$router.push('home')

                }).catch((err) => {
                    this.message = "Connexion échoué." + err;
                    this.showSnackbar = true;
                    this.loading = false;
                });
                return false
            },
            /** API REQUEST TO GET MY FORUMS */
            loadForums(){
                this.axios.post('/api/forums',{},{
                    headers:{
                        'Authorization': this.$store.state.user.api_token,
                        'Content-type':'application/x-www-form-urlencoded',
                        'Accepted': 'application/json'
                    }
                }).then((response) => {
                    this.$store.commit('set_myForum',response.data.success);
                }).catch((err) => {console.log(err)});
            },
            /** API REQUEST TO GET FRIENDS */
            loadFriends(){
                this.axios.post('/api/friends',{},{
                    headers:{
                        'Authorization': this.$store.state.user.api_token,
                        'Content-type':'application/x-www-form-urlencoded',
                        'Accepted': 'application/json'
                    }
                }).then((response) => {
                    if(response.data.friends_one){
                        response.data.friends_one.forEach(element => {
                            if(element.friend_two){
                                this.$store.commit('setFriend',element.friend_two);
                            }
                        });
                    }
                    if(response.data.friends_two){
                        response.data.friends_two.forEach(element => {
                            if(element.friend_one){
                                this.$store.commit('setFriend',element.friend_one);
                            }
                        });
                    }

                }).catch((err) => {
                    console.log(err)
                });
            },
            /** API REQUEST TO GET CHAT INIT */
            loadChat(){
                this.axios.post('/api/message/init',{},{
                    headers:{
                        'Authorization': this.$store.state.user.api_token,
                        'Content-type':'application/x-www-form-urlencoded',
                        'Accepted': 'application/json'
                    }
                }).then((response) => {
                    console.log(response)
                    this.$store.commit('chat_init',response.data.chat);
                }).catch((err) => {console.log(err)});
            },
            /** API REQUEST TO GET LAST MESSAGE READ FOR EACH CONTACT */
            loadChatViews(){
                this.axios.post('/api/message/initviews',{},{
                    headers:{
                        'Authorization': this.$store.state.user.api_token,
                        'Content-type':'application/x-www-form-urlencoded',
                        'Accepted': 'application/json'
                    }
                }).then((response) => {
                    console.log(response)
                    this.$store.commit('chat_init_views',response.data.views);
                }).catch((err) => {console.log(err)});
            },
            /** GET XP **/
            loadXp(){
                this.axios.post('/api/user/xp',{},{
                    headers:{
                        'Authorization': this.$store.state.user.api_token,
                        'Content-type':'application/x-www-form-urlencoded',
                        'Accepted': 'application/json'
                    }
                }).then((response) => {
                    this.$store.commit('setXp', response.data.data[0].amount);
                    console.log(response);
                    //this.$store.commit('setXp',response);
                }).catch((err) => {console.log(err)});
            },
            socket_subscription(room){
                this.$socket.emit('subscribe', room);
                this.$store.commit('socketSubscribe',room);
            }
        },
        sockets:{
            connect: function(){
                console.log("Socket Connexion");
            }
        },
    };
</script>

<style lang="scss" scoped>
    .centered-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 100vh;
        .title {
            text-align: center;
            margin-bottom: 30px;
            img {
                margin-bottom: 16px;
                max-width: 80px;
            }
        }
        .actions {
            .md-button {
                margin: 0;
            }
        }
        #form {
            margin-bottom: 60px;
        }
        .background {
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            z-index: 0;
        }
        .md-content {
            z-index: 1;
            padding: 40px;
            width: 100%;
            max-width: 400px;
            position: relative;
        }
        .loading-overlay {
            z-index: 10;
            top: 0;
            left: 0;
            right: 0;
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>