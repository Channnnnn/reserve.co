<template>
  <a class="button" :href="data.link">{{data.name}}</a>
</template>

<script>
export default {
  props: ['data']
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";

a.button{
    display: inline-block;
    border-radius: 5px;
    padding: .6em 1em;
    box-sizing: border-box;
    min-width: 150px;
    line-height: 0.9;
    color: white;
    background-color: $color-grey;
    opacity: $opacity-link;
    &.blue{
        background-color: $color-blue !important;
    }
    &.red{
        background-color: $color-red !important;
    }
    &.green{
        background-color: $color-green !important;
    }
    &.disabled, &.disabled:hover{
        background-color: $color-grey !important;
        opacity: .25;
        cursor: unset;
    }
    &.transparent{
        border: 1px solid $color-blue !important;
        color: $color-blue !important;
        background-color: transparent !important;
        &:hover{
            filter: brightness(.75) saturate(1.5);
        }
        &.red{
            border-color: $color-red !important;
            color: $color-red !important;
            background-color: transparent !important;
        }
        &.blue{
            border-color: $color-blue !important;
            color: $color-blue !important;
            background-color: transparent !important;
        }
        &.disabled, &.disabled:hover{
            border-color: $color-grey !important;
            color: $color-grey !important;
            background-color: transparent !important;
            opacity: .25;
            cursor: unset;
        }
    }
    &.em{
        font-size: 1.1rem;
    }
    &.wide{
        display: block !important;
    }
    &.micro { /* Single Icon button */
        font-size: inherit;
        height: 2em;
        min-width: 2em;
        margin: 0;
        text-align: center;
        align-self: center;
    }
    &.mini { /* Navbar Button */
        font-size: .8em;
        padding: .5em .75em;
        min-width: 100px;
    }
    &.huge{
        font-size: 1.5em;
        font-weight: $font-bold;
        margin: .5em 0 .5em 0;
        &.transparent{
            font-weight:  $font-normal;
        }
    }    
}
</style>

