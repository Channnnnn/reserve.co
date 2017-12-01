<template>
  <a v-if="HasAuth" @click="logout" class="button red logout"><div class="fa fa-sign-out"></div>Sign out</a>
</template>

<script>
import {db,auth} from '@/scripts/firebase_config';
import { mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters(['HasAuth'])
    },
    methods: {
        logout(){
            let self = this;
            auth.signOut()
            .then(() => { 
                console.log('Signed Out');
                self.$store.dispatch('onAuthChanged');
                self.$router.push({name: 'login'})
            })
            .catch(err => { console.log('Error while signing out\n' + err);})
        }
    }
}
</script>

<style lang="scss" scoped>
.logout{
    margin-top: auto !important;
    margin-bottom: 1em !important;
    color: white;
    .fa{
        margin-bottom: 0;
        margin-right: .25em;
    }
}
</style>

