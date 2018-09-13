<template>
    <div class="link_container">
        <md-button class="md-primary" to="/">
           Accueil
        </md-button>

        <md-button class="md-primary" to="/ws">
            WS
        </md-button>

        <md-button v-if="!this.$store.state.connected" class="md-primary" to="/login">
           Login
        </md-button>

        <md-button class="md-primary" to="/profil">
                {{ user.name }}
        </md-button>
            <md-avatar>
                <img class="cusAvatar" v-bind:src="user.image" alt="Avatar">
            </md-avatar>

    </div>
</template>


<script>
    import { mapState } from 'vuex'

    export default {
        name: "navbar",
        computed: mapState([
            'user'
        ])
    }
</script>
<style scoped>
    .md-avatar img.cusAvatar {
        height: 35px;
        width: 35px;
        border-radius: 50%;
    }
    .link_container {
        position: absolute;
        right: 10px;
    }
</style>