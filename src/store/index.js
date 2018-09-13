import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
// import axios from 'axios'

Vue.use(Vuex);

let level_array = [0];
let i = 1;
while(i<=100){
    let tmp = (i-1)*100*((0.75*i)*(0.75*i))
    level_array.push(tmp)
    i++
}
const levels_xp = level_array;
const store = new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        connected:false,
        user: {
            id: 0,
            name: "Anonyme",
            email: "",
            image: "https://cdn.dribbble.com/users/968424/screenshots/2287311/2015_10_12_flatlandscape_800x600_v01.jpg",
            api_token: '',
            exp:0,
            lvl_percent: 0,
            lvl:1,
            shards:0,
            name_token: '',
            created_at: ''
        },
        myForums : [],
        forumsList: [],
        socket_rooms: [],
        theme: "default",
        friends: [],
        config: {
            notification: {
                friend: null,
                friendPM: null,
                newThread: null,
                mention: null,
            }
        },
        chat: [],
        chat_views: []
    },
    mutations: {
        login(state){
          state.connected = true;
        },
        WS_ONLINE(){
            this._vm.$socket.emit('USER_ONLINE', this.state.user.id);
        },
        setUser(state,data){
            state.user.id = data.user.id
            state.user.email = data.user.email
            state.user.name = data.user.name
            state.user.api_token = 'Bearer ' + data.success.token
            state.user.image = data.user.image
            state.user.shards = data.user.shards
            state.user.name_token = data.user.name_token
            state.user.created_at = data.user.created_at
        },
        change_my_image(state, image) {
            state.user.image = image
        },
        friend_change_pp(state, data){
            if(data.id != state.user.id){
                let foundIndex = state.friends.findIndex(x => x.id == data.id);
                if(foundIndex){
                    state.friends[foundIndex].image = data.image
                }
            }
        },
        setXp(state, xp){
          state.user.exp = xp;
            let a = 100;
            let b = 9;
            let c = 8;
            let k = 9000;
            let lv = 1;
            let x = k * (Math.log(Math.cosh((lv - a) / b)) - Math.log(Math.cosh(-a / b)) + lv / c);
            levels_xp.forEach(function(key,element) {
               if(x > element && x <= levels_xp[key + 1]){
                   let percent = parseFloat((100 * (x - element)) / (levels_xp[key + 1] - element));
                   state.user.lvl_percent = percent.toFixed(2)
                   state.user.lvl = key
               }
            });
        },
        winXp(state, xp){
            state.user.exp += xp
            if(state.user.lvl){
                if(levels_xp[lvl + 1] <= xp){
                    state.user.lvl++
                }
            }
        },

        set_myForum(state, forums){
            state.myForums = forums;
            state.myForums.forEach(forum => {
                if(forum){
                    this._vm.$socket.emit('subscribe', "forum-" + forum.id);
                    if(!state.socket_rooms["forum-" + forum.id]){
                        state.socket_rooms.push("forum-" + forum.id);
                    }
                }
            });
        },
        set_forumsList(state, forums){
            state.forumsList = forums;
        },
        update_myForum(state, forum){
            let foundIndex = state.myForums.findIndex(x => x.identificator == forum.identificator);
            if(foundIndex !== -1){
                state.myForums[foundIndex] = forum;
            }
            else {
                state.myForums.push(forum);
            }
        },
        changeTheme(state,theme){
            state.theme = theme
        },
        setFriend(state, data){
            let foundIndex = state.friends.findIndex(x => x.id == data.id);
            if(foundIndex !== -1){
                data.statut = 0;
                state.friends[foundIndex] = data;
                this._vm.$socket.emit('subscribe', 'user-' + data.id);
                if(!state.socket_rooms['user-' + data.id]){
                    state.socket_rooms.push('user-' + data.id);
                }
            }
            else {
                data.statut = 0;
                state.friends.push(data);
                this._vm.$socket.emit('subscribe', 'user-' + data.id);
                if(!state.socket_rooms['user-' + data.id]){
                    state.socket_rooms.push('user-' + data.id);
                }
            }
        },
        friend_is_connected(state,id){
            let foundIndex = state.friends.findIndex(x => x.id == id);
            if(foundIndex !== -1){
                state.friends[foundIndex].statut = 1;
            }
            else {
                // wtf happen
            }
        },
        socketSubscribe(state,room){
            if(!state.socket_rooms[room]){
                state.socket_rooms.push(room);
            }
        },
        socketReconnect(state){
            if(state.socket_rooms.length > 0){
                state.socket_rooms.forEach(room => {
                    this._vm.$socket.emit('subscribe', room);
                });
            }
          //  this.WS_ONLINE();
        },
        /** CHAT FUNCTIONS **/
        chat_init(state, chat){
            // pass an array with 50 firsts messages per user
            state.chat = chat
        },
        chat_init_views(state, chat) {
          state.chat_views = chat;
        },
        update_views(state, friend){
            let key = state.chat[friend].length - 1
            if(key >= 0){
                let sec_key = state.chat[friend][key].length - 1
                if(sec_key >= 0){
                    let id = state.chat[friend][key][sec_key].id
                    if(id){
                        state.chat_views[friend] = id
                    }
                }
            }

        },
        send_message(state, message){
            if(state.chat[message.user].length !== 0){
                let lastentry = state.chat[message.user].length - 1
                let sender = state.chat[message.user][lastentry][0].sender;
                if(sender === message.content.sender){
                    let topush = {
                        temp_id: message.content.temp_id,
                        sender: message.content.sender,
                        content: message.content.content,
                        created_at: message.content.created_at,
                        updated_at: message.content.updated_at
                    }
                    state.chat[message.user][lastentry].push(topush)
                }
                else {
                    let topush = [
                        {
                            temp_id: message.content.temp_id,
                            sender: message.content.sender,
                            content: message.content.content,
                            created_at: message.content.created_at,
                            updated_at: message.content.updated_at
                        }
                    ]
                    state.chat[message.user].push(topush);
                }

            }
            else {
                let topush = [
                    {
                        temp_id: message.content.temp_id,
                        sender: message.content.sender,
                        content: message.content.content,
                        created_at: message.content.created_at,
                        updated_at: message.content.updated_at
                    }
                ]
                state.chat[message.user].push(topush);
            }


        },

        update_message_id(state, obj){
            let chat = state.chat[obj.key]
            let incre = chat.length - 1
            while(incre >= 0){
                let search = chat[incre].findIndex(function(element) {
                    return element.temp_id == obj.temp_id;
                });
                if(search != -1){
                    chat[incre][search].temp_id = null
                    chat[incre][search].id = obj.true_id
                }
                else {
                    incre--
                }
            }
        },




        // please conserv disconnect() at the bottom
        disconnect(state) {
            state.connected = false,
                state.user = {
                    id: 0,
                    name: "Anonyme",
                    email: "",
                    image: "https://cdn.dribbble.com/users/968424/screenshots/2287311/2015_10_12_flatlandscape_800x600_v01.jpg",
                    api_token: '',
                    exp:0,
                    lvl_percent: 0,
                    lvl:1,
                    shards:0,
                    name_token: '',
                    created_at: ''
                },
                state.myForums = [],
                state.forumsList = [],
                state.friends = [],
                state.socket_rooms = [],
                state.chat = []
                state.chat_views = []
        }
        // nothing
    }
});


export default store