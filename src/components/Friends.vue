<template>
    <md-tabs md-alignment="centered" md-active-tab="tab-all">
        <md-tab id="tab-add" md-label="Ajouter un ami">

        </md-tab>
        <md-tab id="tab-all" md-label="Tous">
            <md-list>
                <md-list-item v-for="friend in friends" :key="friend.id" class="friendList">
                    <md-avatar>
                        <img :src="friend.image" :alt="friend.name">
                    </md-avatar>

                    <span class="md-list-item-text">
                        <p>{{friend.name}} <span class="md-primary liltoken">#{{ friend.name_token}}</span></p>
                    </span>

                    <span class="md-list-item-text">
                        <p>{{ friend.statut }}</p>
                    </span>

                    <md-button class="md-icon-button md-list-action" :to="'/chat/friends/' + friend.id">
                        <md-icon title="Envoyer un message" class="md-primary">chat_bubble</md-icon>
                    </md-button>

                    <md-button class="md-icon-button md-list-action">
                        <md-icon title="Supprimer le contact" class="danger-text">clear</md-icon>
                    </md-button>

                </md-list-item>
            </md-list>
        </md-tab>
        <md-tab id="tab-online" md-label="En ligne">

        </md-tab>
        <md-tab id="tab-waiting" md-label="En attente">

        </md-tab>
        <md-tab id="tab-blocked" md-label="Bloqué">

        </md-tab>
    </md-tabs>
</template>

<script>
    export default {
        name: "friends",
        computed: {
           friends() {
                return this.$store.state.friends
            }
        },
        mounted() {
          this.loadFriends();
        },
        methods: {
            loadFriends(){
                if(this.$store.state.user.api_token != '' && this.$store.state.connected === true){
                    this.axios.post('/api/friends',{},{
                        headers:{
                            'Authorization': this.$store.state.user.api_token,
                            'Content-type':'application/x-www-form-urlencoded',
                            'Accepted': 'application/json'
                        }
                    }).then((response) => {
                        console.log(response.data);
                        if(response.data.friends_one){
                            response.data.friends_one.forEach(element => {
                                this.$store.commit('setFriend',element.friend_two);
                            });
                        }
                        if(response.data.friends_two){
                            response.data.friends_two.forEach(element => {
                                this.$store.commit('setFriend',element.friend_one);
                            });
                        }


                    }).catch((err) => {
                        console.log(err)
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .liltoken {
        font-size: 0.75em;
    }
    .friendList {
        border-bottom: 1px solid #cdcdcd;
    }
</style>