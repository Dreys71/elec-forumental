<template>
    <div>
        <md-tabs md-sync-route :md-active-tab="activeTab">
            <md-tab id="forum" md-label="Forum" :to="'/forum/' + forum_key">
                <div class="lilPadding" v-if="forum">
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item">
                            <h1>{{ forum.name }}</h1>
                        </div>
                        <div class="md-layout-item">
                            <md-button class="md-raised md-primary">
                                Créer une invitation
                            </md-button>
                        </div>
                    </div>
                    <div v-for="category in forum.categories" :key="category.id">
                        <md-table>
                            <md-table-toolbar>
                                <h1 class="md-title" :title="category.description">
                                    <router-link :to="{name: 'Category', params: {cat: category.id}}">{{ category.title
                                        }}
                                    </router-link>
                                    <span class="categoryDesc">{{ category.description }}</span>
                                </h1>
                            </md-table-toolbar>

                            <md-table-row md-selectable="single" v-for="subcategory in category.subcategories"
                                          :key="subcategory.id">
                                <md-table-cell>
                                    <md-icon v-if="subcategory.icon">
                                        {{ subcategory.icon }}
                                    </md-icon>
                                    {{ subcategory.title }}
                                </md-table-cell>
                                <md-table-cell>{{ subcategory.threads.length }} thread(s)</md-table-cell>
                                <md-table-cell>{{ subcategory.description }}</md-table-cell>
                                <md-table-cell>
                                    <md-button class="md-icon-button md-primary"
                                               :to="{name: 'Subcategories', params: {cat: category.id, subcat: subcategory.id}}">
                                        <md-icon>visibility</md-icon>
                                    </md-button>
                                </md-table-cell>
                            </md-table-row>
                        </md-table>
                    </div>
                </div>
                <div v-else>
                    <md-progress-bar md-mode="indeterminate"></md-progress-bar>
                </div>
            </md-tab>
            <md-tab
                    :md-disabled="disabledCat"
                    id="category"
                    md-label="Sous catégories"
                    :to="'/forum/' + forum_key + '/' + cat">
            </md-tab>


            <md-tab
                    :md-disabled="disabledSubcat"
                    id="subcategories"
                    md-label="Threads"
                    :to="'/forum/' + forum_key + '/' + cat + '/' + subcat">
            </md-tab>

            <md-tab
                    :md-disabled="disabledThread"
                    id="thread"
                    md-label="Thread"
                    :to="'/forum/' + forum_key + '/' + cat + '/' + subcat + '/' + thread">
            </md-tab>
        </md-tabs>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "forum",
        data() {
            return {
                activeTab: 'forum',
                forum_key: null,
                store_forum_key: null,
                forum: {},
                cat: 0,
                subcat: 0,
                thread: 0,
                disabledCat: true,
                disabledSubcat: true,
                disabledThread: true
            }
        },
        methods: {
          tabsRoute(){
              if(this.$route.name == "Category"){
                  this.cat = this.$route.params.cat
                  this.subcat = 0
                  this.thread = 0

                  this.disabledCat = false
                  this.disabledSubcat = true
                  this.disabledThread = true

                  this.activeTab = 'category'
              }
              else if(this.$route.name == "Subcategories"){
                  this.cat = this.$route.params.cat
                  this.subcat = this.$route.params.subcat
                  this.thread = 0

                  this.disabledCat = false
                  this.disabledSubcat = false
                  this.disabledThread = true
                  this.activeTab = 'subcategories'
              }
              else if(this.$route.name == 'thread'){
                  this.cat = this.$route.params.cat
                  this.subcat = this.$route.params.subcat
                  this.thread = this.$route.params.thread

                  this.disabledCat = false
                  this.disabledSubcat = false
                  this.disabledThread = false
                  this.activeTab = 'thread'
              }
              else {
                  this.cat = 0
                  this.subcat = 0
                  this.thread = 0

                  this.disabledCat = true
                  this.disabledSubcat = true
                  this.disabledThread = true
                  this.activeTab = 'forum'
              }
          }
        },
        created() {
            this.tabsRoute()
            this.forum_key = this.$route.params.key;
        },
        mounted() {
            this.tabsRoute()
            if (this.store_forum_key === null) {
                let forumKey = this.$store.state.myForums.findIndex(x => x.identificator == this.forum_key);
                console.log(forumKey)
                if (forumKey !== -1) {
                    this.store_forum_key = forumKey
                    this.forum = this.$store.state.myForums[forumKey];
                }
            }
            else {
                this.forum = this.$store.state.myForums[store_forum_key];
            }

            /** REFRESH **/
            if (this.$store.state.user.api_token != '' && this.forum_key != null) {
                this.axios.post('/api/forum/' + this.forum_key, {}, {
                    headers: {
                        'Authorization': this.$store.state.user.api_token,
                        'Content-type': 'application/x-www-form-urlencoded',
                        'Accepted': 'application/json'
                    }
                }).then((response) => {
                    this.$store.commit('update_myForum',response.data.forum);
                    this.forum = response.data.forum;
                }).catch((err) => {
                    console.log(err)
                });

            }
            else {
                this.$router.push('/login');
            }

        },
        watch: {
            '$route' : function () {
                this.tabsRoute()
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../assets/main.scss";
    .categoryDesc {
        font-size: 10px;
        color: #212121;
        margin-left: 5px;
    }
    .menu {
        border: 1px solid #efefef;
    }
    .categoryTitle {
        font-weight: bold;

        width: 100%;
        padding: 5px 5px 5px 10px;
        font-size: 1.2em;
        margin: 0;
    }
    .menuitem {
        padding-left: 0!important;
        margin: 0;
    }
    .subcategoryTitle p {
        margin: 0;
        width: 100%;
    }
    .subcategoryTitle {
        padding: 5px 5px 5px 10px;
        font-size: 1.2em;
        cursor: pointer;
        transition: padding-left 1s;
        -webkit-transition: padding-left 1s;
        list-style-type: none;
    }
    .subcategoryTitle:hover {
        border-radius: 8px;
        padding-left: 20px;

    }
    .lilPadding {
        padding: 5px
    }
</style>