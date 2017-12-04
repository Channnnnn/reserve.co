<template>
    <div>
        <div class="avatar" :style="{backgroundImage : 'url(' +userAvatarURL+ ')'}"></div>
        <h2 v-if="user">{{user.displayName}}</h2>
        <slot></slot>
    </div>
</template>

<script>
import {storage} from '@/scripts/firebase_config.js'
export default {
    name: 'accountPanel',
    computed: {
        user: function(){
            return this.$store.getters.HasAuth;
        },
        // userAvatar: function(){
        //     return this.$store.getters.UserAvatar;
        // }
    },
    data(){
        return{
            userAvatarURL: ''
        }
    },
    methods: {
        _FetchAvatar(){
            var self = this;
            var avatarRef = (self.user && self.user.photoURL) ? self.user.photoURL : '/user-avatar.gif';
            var refFromURL = storage.ref( avatarRef );
            refFromURL.getDownloadURL().then(function(url){
                self.userAvatarURL = url;
            })
        }
    },
    created(){
        this._FetchAvatar();
    }
}
</script>

<style lang="scss" scoped>
.avatar {
    display: block;
    height: 100px;
    width: 100px;
    border-radius: 50%;
    border: none;
    background-color: lightgrey;
    margin: 0 auto;
    margin-top: 1em;
}
h2{
    height: 1.5em;
}
</style>
