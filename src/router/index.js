import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Profil from '@/components/Profil'
import Login from '@/components/Login'
import BugReport from '@/components/BugReport'
import Friends from '@/components/Friends'
import Help from '@/components/Help'
import MesForums from '@/components/MesForums'
import Premium from '@/components/Premium'
import Reglages from '@/components/Reglages'
import Forum from '@/components/Forum'

import Subcategories from '@/components/threads/subcategories.vue'
import Threads from '@/components/threads/threads.vue'
import Thread from '@/components/threads/thread.vue'
import ChatIndex from '@/components/Chat/ChatIndex.vue'
import ChatFriends from '@/components/Chat/ChatFriends.vue'
import UserChat from '@/components/Chat/UserChat.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/chat',
            name: 'Chat',
            component: ChatIndex,
            redirect: { name: 'Chat.friends' },
            children: [
                {
                    path: 'friends',
                    name: 'Chat.friends',
                    component: ChatFriends,
                    children: [
                        {
                            path: ':id',
                            name: 'Chat.friends.id',
                            component: UserChat,
                            props: true
                        }
                        ]
                },
                {
                    path: 'forums',
                    name: 'Chat.forums',
                    component: ChatFriends,
                    children: [
                        {
                            path: ':id',
                            name: 'Chat.forums.id',
                            component: UserChat,
                            props: true
                        }
                    ]
                }
            ]
        },

        {
            path: '/forum/:key',
            name: 'forum',
            component: Forum,
            children: [{
                path: ':cat',
                name: 'Category',
                component: Subcategories,
            }, {
                path: ':cat/:subcat',
                name: 'Subcategories',
                component: Threads,
                children: [{
                    path: ':thread',
                    name: 'thread',
                    component: Thread
                }]
            }
            ]
        },
        {
            path: '/profil',
            name: 'Profil',
            component: Profil
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },

        {
            path: '/bug',
            name: 'Bug',
            component: BugReport
        },
        {
            path: '/friends',
            name: 'Friends',
            component: Friends
        },
        {
            path: '/help',
            name: 'Help',
            component: Help
        },
        {
            path: '/forums',
            name: 'MesForums',
            component: MesForums
        },
        {
            path: '/vip',
            name: 'Premium',
            component: Premium
        },
        {
            path: '/settings',
            name: 'Reglages',
            component: Reglages
        },

    ]
})