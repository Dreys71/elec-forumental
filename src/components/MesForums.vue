<template>
    <div>
        <!-- RECHERCHER -->
        <md-autocomplete v-model="value" :md-options="autocomplete" @md-changed="getList" @md-opened="getList">
            <label>Rechercher</label>

            <template slot="md-autocomplete-item" slot-scope="{ item }">{{ item.name }}</template>
        </md-autocomplete>
        <!-- MES FORUMS -->
        <p>Vos Forums</p>
        <md-card v-for="my_forum in my_forums" :key="my_forum.identificator">
            <md-card-header>
                <md-card-header-text>
                    <div class="md-title">
                        <router-link class="md-primary" :to="{path: '/forum/' + my_forum.identificator}">{{ my_forum.name }}</router-link>
                    </div>
                    <div class="md-subhead">
                        Lang : {{ my_forum.lang }}<br />
                        Privé : {{ my_forum.is_private }}<br />
                        Membres : {{ my_forum.users.length }}
                    </div>
                </md-card-header-text>

                <md-card-media>
                    <img v-bind:src="my_forum.image" alt="People">
                </md-card-media>
            </md-card-header>

            <md-card-actions>
                <md-button>Inviter</md-button>
                <md-button>Quitter</md-button>
            </md-card-actions>
        </md-card>
        <!-- FORUMS PUBLIQUES -->
        <p>Les forums publics</p>
        <md-card v-for="forum in forums_list" :key="forum.id">
            <md-card-header>
                <md-card-header-text>
                    <div class="md-title">
                        {{ forum.name }}
                    </div>
                    <div class="md-subhead">
                        Lang : {{ forum.lang }}<br />
                        Privé : {{ forum.is_private }}<br />
                        Membres : {{ forum.users.length }}
                    </div>
                </md-card-header-text>

                <md-card-media>
                    <img v-bind:src="forum.image" alt="People">
                </md-card-media>
            </md-card-header>

            <md-card-actions>
                <md-button>Rejoindre</md-button>
            </md-card-actions>
        </md-card>
    </div>
</template>

<script>
    export default {
        name: "mes-forums",
        data () {
            return {
                value: null,
                selected_forum: null,
                my_forums: {},
                forums_list: {},
                autocomplete: []
            }
        },
        methods: {
            getList(searchTerm) {
                this.autocomplete = new Promise(resolve => {
                    window.setTimeout(() => {
                        if (!searchTerm) {
                            resolve(this.forums_list)
                        } else {
                            const term = searchTerm.toLowerCase()
                            resolve(this.forums_list.filter(({name}) => name.toLowerCase().includes(term)))
                        }
                    }, 500)
                })
            }
        },
        created() {
            this.my_forums = this.$store.state.myForums;
            this.forums_list = this.$store.state.forumsList;
        },
        mounted() {

            if(this.$store.state.user.api_token != ''){
                /* Récupérer les forums actifs */
                if(Object.keys(this.my_forums).length === 0 && this.my_forums.constructor === Object){
                //if(!this.my_forums){
                    this.axios.post('/api/forums',{},{
                        headers:{
                            'Authorization': this.$store.state.user.api_token,
                            'Content-type':'application/x-www-form-urlencoded',
                            'Accepted': 'application/json'
                        }
                    }).then((response) => {
                        this.my_forums = response.data.success;
                        this.$store.commit('set_myForum',this.my_forums);
                    }).catch((err) => {console.log(err)});
                }
                /* Récupération des forums public */
                if(Object.keys(this.forums_list).length === 0 && this.forums_list.constructor === Object){

                    this.axios.post('/api/forums_public',{},{
                        headers:{
                            'Authorization': this.$store.state.user.api_token,
                            'Content-type':'application/x-www-form-urlencoded',
                            'Accepted': 'application/json'
                        }
                    }).then((response) => {
                        this.forums_list = response.data.success;
                        this.$store.commit('set_forumsList',this.forums_list);
                    }).catch((err) => {console.log(err)});
                }
            }
            else {
                this.$router.push('login');
            }


        }
    }

</script>

<style scoped lang="scss">
    @import "../assets/main.scss";
    .md-card {
        width: 320px;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
    }
</style>