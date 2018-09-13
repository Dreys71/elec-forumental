<template>
    <div>
        <md-list id="messagescontainer" v-if="messages.length > 0" class="md-scrollbar">
            <div v-for="(message, key) in messages" :key="key">
                <div v-if="renderNewMessage(message[0].id) === true">
                    <new-message></new-message>
                </div>
                <div v-else>
                    <md-divider></md-divider>
                </div>

                <md-list-item>
                    <md-avatar>
                        <img :src="person[message[0].sender].image" alt="People">
                    </md-avatar>

                    <div class="md-list-item-text">
                        <span class="sender">
                            <span class="name">{{ person[message[0].sender].name }}</span>
                            <span class="date">{{ chatDate(message[0].created_at) }}</span>
                        </span>

                        <div v-for="mess in message" :key="mess.id">
                            <div v-if="renderNewMessage(mess.id) == true" :key="mess.id" style="width: 100%">
                                <new-message></new-message>
                            </div>
                            <div :title="mess.id" v-html="compiledMarkdown(mess.content)"></div>
                        </div>
                    </div>
                </md-list-item>
            </div>
            <md-divider></md-divider>
        </md-list>
        <md-list id="nomessage" v-else>
            <md-list-item>
                <div class="md-list-item-text">
                    Aucun message
                </div>
            </md-list-item>
        </md-list>
    </div>

</template>

<script>
    import newMessage from './newMessage';
    import marked from 'marked'
    export default {
        name: "user-chat",
        props: ['id'],
        data() {
            return {
               today: new Date(),
               with: this.id,
               messages: [],
               lastmessageview:0,
               person: {},
                printNewMess: false,
                currentNew: -1
            }
        },
        methods: {
            chatDate(date_str){
                let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                let date = new Date(date_str)
                if(date.getMonth() === this.today.getMonth() && date.getFullYear() == this.today.getFullYear()){
                    if(date.getDate() === this.today.getDate()){
                        // TODAY
                        return "Aujourd'hui à " + date.getHours() + "h" + date.getMinutes()
                    }
                    else if(date.getDate() === this.today.getDate() - 1){
                        // Yesterday
                        return "Hier à " + date.getHours() + "h" + date.getMinutes()
                    }
                    else {
                        return date.toLocaleDateString('fr-FR', options)
                    }
                }
                else {
                    return date.toLocaleDateString('fr-FR', options)
                }

            },
            compiledMarkdown(text) {
                if(text){
                    return marked(text, {
                        renderer: new marked.Renderer(),
                        gfm: true,
                        tables: true,
                        breaks: true,
                        pedantic: false,
                        sanitize: true,
                        smartLists: true,
                        smartypants: false
                    });
                }
            },
            renderNewMessage(id){
                if((this.printNewMess === false || this.currentNew === id) && id > this.lastmessageview){
                    this.printNewMess = true
                    this.currentNew = id
                    return true
                }
                else {
                    return false
                }
            },
            loadLastView(){
                // We need to update value in db but and store but not in the template :
                // Load last_messages_view from store
                // Get new_last_messages, send it to store/api
                // Don't update template variable
                // ****************************************************

                // LOADING LAST VIEW FROM STORE
                if(this.lastmessageview == 0 && this.$store.state.chat_views[this.with]){
                    this.lastmessageview = this.$store.state.chat_views[this.with]
                }
            }
        },

        components: {
            newMessage
        },
        created() {
            console.log('UserChat created')
            let self = this
            // Chat With Object
            if(this.$route.name == "Chat.friends.id"){
                this.with = this.$route.params.id;
                let ff = this.$store.state.friends.findIndex(x => x.id == parseInt(this.with))
                this.person[this.with] = this.$store.state.friends[ff]
            }
            // Load Messages
            this.messages = this.$store.state.chat[this.with];
            // Load Last Message view
            this.loadLastView()
            // Me
            this.person[this.$store.state.user.id] = this.$store.state.user;

        },
        mounted() {
            console.log('UserChat mounted')
            // Chat With Object
            let ff = this.$store.state.friends.findIndex(x => x.id == parseInt(this.with))
            this.person[this.with] = this.$store.state.friends[ff]

            // Load Messages
            this.messages = this.$store.state.chat[this.with];
            // Load Last Message view
            this.lastmessageview = this.$store.state.chat_views[this.with]
            // Me
            this.person[this.$store.state.user.id] = this.$store.state.user;
        },
        watch: {
            id: function (val) {
                console.log('UserChat watch id')
                // Trigger when we stay on the same url but not same param id
                let self = this
                // With who
                this.with = val;
                let ff = this.$store.state.friends.findIndex(x => x.id == parseInt(val))
                this.person[val] = this.$store.state.friends[ff]
                // Loading Message
                this.messages = this.$store.state.chat[val]
                this.lastmessageview = this.$store.state.chat_views[this.with]
            },
            messages: function () {
                console.log('UserChat watch messages')
                let self = this
                // Scroll down after new message
                let container = this.$el.querySelector("#messagescontainer");
                if(container && container.scrollHeight){
                    container.scrollTop = container.scrollHeight - container.clientHeight;
                }
                // UPDATE LAST MESSAGE VIEW
                this.$socket.emit('update last chat view', {from: this.with, token: this.$store.state.user.api_token});
                this.$store.commit('update_views', this.with);
            }

        }
    }
</script>

<style lang="scss">
    @import "../../assets/main.scss";
    #messagescontainer .md-list-item-content {
        align-items: normal!important;
    }
    #messagescontainer, #nomessage {
        padding-bottom: 80px!important;
        padding-left: 200px;
        height: calc(100vh - 150px);
        overflow: auto;
    }
    #messagescontainer .sender .name{
        font-weight: bold;
        color: md-theme(primary);
        margin-right: 5px;
    }
    #messagescontainer .sender .date{
        font-size: 10px;
    }
</style>