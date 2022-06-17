<script setup>
import Loader from "./components/Loader.vue"
import CustomCursor from "./components/CustomCursor.vue"
</script>

<template lang="pug">
Loader
RouterView
CustomCursor
</template>

<style lang="sass">
*
    padding: 0
    margin: 0
    box-sizing: border-box
html
    background: $black
    color: $white
::-webkit-scrollbar
    display: none
    background: none
body
    cursor: none
</style>
