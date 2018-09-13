<template>
        <div class="md-layout">
            <div v-if="this.$store.state.connected" class="md-layout-item">
                <p>Derniers threads proposés sur les forums que vous suivez</p>
                <md-list class="md-triple-line">
                    <md-list-item v-for="thread in threads" :key="thread.id">
                        <md-avatar>
                            <img src="https://placeimg.com/40/40/people/1" alt="People">
                        </md-avatar>
                        <div class="md-list-item-text">
                            <span>{{ thread.creator.name }}</span>
                            <span>{{ thread.title }}</span>
                            <p>{{ thread.body }}</p>
                        </div>

                        <md-button class="md-icon-button md-list-action">
                            <md-icon class="md-primary">star</md-icon>
                        </md-button>
                    </md-list-item>
                </md-list>
            </div>
            <div class="md-layout-item" v-else>
                <md-empty-state
                        md-icon="devices_other"
                        md-label="Rejoignez-nous !"
                        md-description="Si vous souhaitez contribuer à se forum vous devez vous connecter.">
                    <md-button class="md-primary md-raised"><router-link to="/login">Login</router-link></md-button>
                </md-empty-state>
            </div>
        </div>
</template>

<script>

    export default {
        name: "home",
        data () {
            return {
                threads: []
            }
        },
        mounted () {
            if(this.$store.state.user.api_token != ''){
                this.axios.post('/api/threads/index',{},{
                    headers:{
                        'Authorization': this.$store.state.user.api_token,
                        'Content-type':'application/x-www-form-urlencoded',
                        'Accepted': 'application/json'
                    }
                }).then((response) => {
                    this.threads = response.data.success;
                });
            }


        }

    }

</script>

<style scoped>
    #categories_navigation {
        min-width: 340px;
    }
</style>