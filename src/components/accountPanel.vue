<template>
    <div>
        <div class="avatar"></div>
        <h2>{{name ? name: '#'}}</h2>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'accountPanel',
    props: ['avatar', 'name']
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
</style>
