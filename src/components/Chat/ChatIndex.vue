<template>
    <div>
        <div>
            <md-button to="/chat/friends">Chat Amis</md-button>
            <md-button to="/chat/forums">Chat Forum</md-button>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>


    export default {
        name: "chat-index",
        data: () => ({

        })
    }
</script>

<style scoped lang="scss">
    @import "../../assets/main.scss";
    .md-tab {
        position: relative;
        height: calc(100vh - 88px);
    }
    .router-link-active {
        color: md-theme(primary) !important;
    }
</style>