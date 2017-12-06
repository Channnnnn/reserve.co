<template>
    <div>
        <div class="modal">
            <a class="button round transparent fa fa-close" @click="hideSelf" aria-hidden="true"></a>
            <slot></slot>
        </div>
        <div class="modal-mask" @click="hideSelf"></div>
    </div>
</template>

<script>
export default {
    name: 'modal',
    props: ['visible'],
    methods: {
        hideSelf: function(){
            this.$emit('update:visible', false);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
a.button.round {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    min-width: unset !important;
    padding: 0.25rem;
    border-radius: 50% !important;
    color: $color-grey !important;
    border-color: $color-grey !important;
    &:hover {
        border-color: $color-red !important;
        color: $color-red !important;
        box-shadow: 0 0 3px;
    }
}
.modal-mask{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    mix-blend-mode: multiply;
    background-color: rgba(0,0,0,.25);
}
.modal{
    position: relative;
    background: white;
    z-index: 50;
    padding: 1.5rem 3rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    box-shadow: 0 3px 15px rgba(0,0,0,.25);;
}
.searchbox{
    font-family: 'Kanit', Arial, Helvetica, sans-serif;
    font-weight: $font-normal;
    border: 1px solid $color-green;
    padding: .5rem 1em;
    border-radius: 5px;
    outline: none;
    &:focus{
        box-shadow: 0 0 3px $color-green;
    }
}
</style>
