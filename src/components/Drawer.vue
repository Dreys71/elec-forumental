<template>
    <div>
        <md-list-item id="progressionDrawer">
            <md-avatar :title="'Vous êtes niveau ' + this.$store.state.user.lvl + ' à ' + this.$store.state.user.lvl_percent + '%'">
                <span class="xpavance-drawer">{{
                this.$store.state.user.lvl
                    }}</span>
                    <md-progress-spinner md-mode="determinate" :md-value="this.$store.state.user.lvl_percent">
                </md-progress-spinner>
            </md-avatar>
            <span class="md-list-item-text">Vous êtes niveau {{ this.$store.state.user.lvl }} à {{ this.$store.state.user.lvl_percent }}%</span>
        </md-list-item>

        <md-list-item to="/profil" id="profillink">
            <md-avatar>
                <img class="cusAvatar" v-bind:src="user.image" alt="Avatar">
            </md-avatar>
            <span class="md-list-item-text">{{ user.name }}</span>
        </md-list-item>

        <md-list-item to="/">
            <md-icon>explore</md-icon>
            <span class="md-list-item-text">Place publique</span>
        </md-list-item>

        <md-list-item to="/chat">
            <md-icon>chat_bubble</md-icon>
            <span class="md-list-item-text">Chat</span>
        </md-list-item>

        <md-list-item to="/forums">
            <md-icon>forum</md-icon>
            <span class="md-list-item-text">Mes Forums</span>
        </md-list-item>

        <md-list-item to="/friends">
            <md-icon>face</md-icon>
            <span class="md-list-item-text">Mes amis</span>
        </md-list-item>

        <md-list-item to="/settings">
            <md-icon>build</md-icon>
            <span class="md-list-item-text">Réglages</span>
        </md-list-item>

        <md-list-item to="/vip">
            <md-icon class="yellow-text">star</md-icon>
            <span class="md-list-item-text">Premium</span>
        </md-list-item>

        <md-list-item to="/help">
            <md-icon>help</md-icon>
            <span class="md-list-item-text">Besoin d'aide ?</span>
        </md-list-item>

        <md-list-item to="/bug">
            <md-icon>bug_report</md-icon>
            <span class="md-list-item-text">Reporter un bug</span>
        </md-list-item>

        <md-divider></md-divider>

        <md-list-item @click="disconnect">
            <md-icon class="md-accent">power_settings_new</md-icon>
            <span class="md-list-item-text">Déconnexion</span>
        </md-list-item>


    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        name: "drawer",
        computed: mapState([
            'user'
        ]),
        methods: {
            disconnect(){
                this.$store.commit('disconnect');
                this.$router.push('/login');
            }
        }
    }
</script>

<style>
    #progressionDrawer .xpavance-drawer {
        position: absolute;
        margin-left: -1px;
        font-size: 14px;
    }
    .yellow-text {
        color: #ff9c00 !important;
    }
    #progressionDrawer svg {
        width: 32px!important;
        height: 32px!important;
    }
    .md-drawer.md-active #progressionDrawer .md-list-item-content {
        padding-left: 8px;
    }
    .md-drawer.md-active #progressionDrawer .md-list-item-content .md-avatar {
        margin-right: 24px;
    }
    #progressionDrawer .md-list-item-content {
        padding-left: 16px;
    }
   #profillink .md-avatar {
       min-width: 24px;
       width: 24px;
       height: 24px;
       margin-right: 32px;
   }
</style>