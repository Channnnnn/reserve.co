<template>
    <div class="center">
        <h1>Content not exist</h1>
        <h2>Bad URL: {{$route.path}}</h2>
        <a @click="returnPreviousPage"><h5>Return to previous page</h5></a>
    </div>
</template>

<script>
export default {
    methods:{
        returnPreviousPage(){
            this.$router.go(-1);
        }
    }
}
</script>

<style lang="scss" scoped>
.center{
    display: flex;
    flex-flow: column;
    height: 100vh;
    width: 100%;
    margin: auto;
    align-items: center;
    justify-content: center;
}
</style>