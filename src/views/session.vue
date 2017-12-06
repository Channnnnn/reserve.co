<template>
    <div class="center">
        <h2>Session Timeout</h2>
        <router-link class="link" :to="{name: 'login'}">Login</router-link>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
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