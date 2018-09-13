<template>
    <div id="chatcontainer">
        <md-list class="friends_container md-scrollbar" v-if="friends.length">
            <div v-for="friend in friends" :key="friend.id">
                <md-list-item @click="current_friend = friend.id" :to="'/chat/friends/' + friend.id">
                    <md-avatar>
                        <img :src="friend.image" :alt="'Photo de' + friend.name">
                    </md-avatar>
                    <div class="md-list-item-text">
                        <span>{{ friend.name }}</span>
                    </div>
                </md-list-item>
            </div>
        </md-list>
        <md-list class="friends_container md-scrollbar" v-else>
            <md-list-item>
                <div class="md-list-item-text">
                    <span>Vous n'avez aucun amis</span>
                </div>
            </md-list-item>
        </md-list>

        <div class="md-accent">
            <router-view></router-view>
        </div>

        <form v-if="current_friend != null" id="form" @submit="submit">
            <div class="channelTextArea channelTextArea">
                <div class="inner flex innerNoAutocomplete">
                    <div class="flex horizontal directionRow justifyStart alignStretch noWrap"
                         style="flex: 1 1 auto;">
                        <button tabindex="3" type="submit" class="attachButton button lookBlank colorBrand grow">
                            <div class="attachButtonInner">
                                <i class="material-icons">send</i>
                            </div>
                        </button>
                        <div class="attachButtonDivider"></div>
                    </div>
                    <div class="uploadInput">
                        <input class="file-input" type="file" tabindex="-1" multiple=""
                               style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                    </div>
                    <textarea v-model="message" id="taChat" rows="1" placeholder="Envoyer un message" tabindex="1"
                              class="textArea scrollbarGhostHairline scrollbar"
                              style="height: auto;"></textarea>

                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "chat-friends",
        data() {
            return {
                messages: [],
                message: '',
                socket: null,
                current_friend: 0,
                friends: []
            }
        },
        sockets:{
            connect: function(){
                console.log('socket connected')
            }
        },
        methods: {
            submit() {
                if(this.message.length > 0){
                    this.$socket.emit('send_message', {
                        token : this.$store.state.user.api_token,
                        to: this.current_friend,
                        message: this.message,
                        author: {
                            id: this.$store.state.user.id,
                            name: this.$store.state.user.name,
                            image: this.$store.state.user.image}
                    });
                    setTimeout(() => {
                        document.getElementById('taChat').value = "";
                    }, 200);
                }
            },
            action(ta, e) {
                if(e.altKey){
                    ta.value += '\n';
                    return false
                }
                else {
                    this.submit();
                }
            }
        },
        created() {
            this.$socket.on('sending_temp_id', (temp) => {
                this.$store.commit('sending_temp_id', temp)
            });
            this.$socket.on('sending_true_id', (temp) => {
                this.$store.commit('sending_true_id', temp)
            });

            this.friends = this.$store.state.friends;
            if(this.$route.name == "Chat.friends.id"){
                this.current_friend = this.$route.params.id;
            }
        },
        mounted(){
            let self = this;
            /** TEXTAREA SUBMIT TECH */
            let ta = document.getElementById('taChat');
            ta.onkeydown = function (event) {
                if (event.defaultPrevented) {
                    return;
                }
                var handled = false;
                if (event.key !== undefined) {
                    if (event.key === 'Enter') {
                        self.action(ta, event);
                    }
                }
                else if (event.keyIdentifier !== undefined) {
                    if (event.keyIdentifier === "Enter") {
                        self.action(ta, event);
                    }
                }
                else if (event.keyCode !== undefined) {
                    if (event.keyCode === 13 ) {
                        self.action(ta, event);
                    }
                }
                if (handled) {
                    event.preventDefault();
                }

            };
        },
        watch:{
            '$route' (to, from){
                if(to.name == "Chat.friends"){
                    this.current_friend = null;
                }
            }
        }

    }
</script>

<style scoped lang="scss">
    @import "../../assets/main.scss";
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        font: 13px Helvetica, Arial;
    }
    #chatcontainer {
        position: relative;
        height: calc(100vh - 88px);
    }
    #form {
        position: absolute;
        bottom: 0;
        display: block;
        left: 0;
        z-index: 1;
        right: 0;
        padding-left: 200px;
    }
    .md-content {
        width: 200px;
        height: 200px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
    .md-list-content-content {
        min-height: inherit!important;
    }
    ul.md-list {
        overflow-y: scroll;
        padding-bottom: 25px ;
    }
    .author {
        color: md-theme(accent);
    }
    /************/
    form {
        //   background-color: #36393f;
        flex-shrink: 0;
        margin-left: 20px;
        margin-right: 20px;
        display: flex;
        position: relative;
        border: 0;
        font-family: inherit;
        font-size: 100%;
        font-style: inherit;
        font-weight: inherit;
        padding: 0;
        vertical-align: baseline;
    }
    .channelTextArea {
        border-top: 1px solid hsla(0,0%,100%,.06);
        margin-bottom: 10px;
        padding-top: 20px;
        position: relative;
        transition: opacity .2s ease;
        width: 100%
    }
    .inner {
        background-color: rgba(114,118,125,.3);
        border-radius: 5px;
        display: flex;
        position: relative;
    }
    .directionRow {
        -webkit-box-direction: normal;
        -webkit-box-orient: horizontal;
        flex-direction: row;
    }
    .noWrap {
        flex-wrap: nowrap;
    }
    .justifyStart {
        -webkit-box-pack: start;
        justify-content: flex-start;
    }
    .alignStretch {
        -webkit-box-align: stretch;
        align-items: stretch
    }
    button {
        cursor: pointer;
        padding: 10px;
        width: auto;
        background: transparent;
        border: 0;
        color: currentColor;
        margin: 0;
        -webkit-box-align: center;
        -webkit-box-pack: center;
        align-items: center;
        border-radius: 3px;
        box-sizing: border-box;
        display: flex;
        font-size: 14px;
        font-weight: 500;
        justify-content: center;
        line-height: 16px;
        position: relative;
        user-select: none;
        outline: 0;
    }
    .attachButtonInner{
        height: 24px;
    }
    .attachButtonInner i {
        color: #212121;
        height: 24px;
        opacity: .3;
        transform-origin: 50% 50%;
        transition: opacity .1s ease,transform .1s ease,-webkit-transform .1s ease;
        width: 24px;
    }
    .attachButtonDivider{
        background-color: hsla(0,0%,100%,.1);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        height: 80%;
        position: relative;
        top: 10%;
        width: 1px;
    }
    .uploadInput {
        height: 0;
        pointer-events: none;
        position: relative;
        width: 0;
    }
    .textArea {
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        background-color: transparent;
        color: #212121;
        border: none;
        font-size: 0.9375rem;
        font-weight: 400;
        letter-spacing: -0.025rem;
        line-height: 1.25rem;
        margin: 2px 2px 2px 0;
        max-height: 144px;
        min-height: 20px;
        padding: 10px 38px 10px 10px;
        resize: none;
        width: 100%;
    }
    /****/
    #chatcontainer .md-list.friends_container {
        max-width: 200px;
        height: calc(100vh - 125px);
        overflow: auto;
        position: absolute;
        border-right: 1px solid md-theme(primary);
        top: 0;
        left: 0;
    }
    #chatcontainer .md-list.friends_container .md-avatar {
        width: 20px;
        min-width: 20px;
        height: 20px
    }
</style>