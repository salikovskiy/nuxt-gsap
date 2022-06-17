<script setup>
import Logo from "../assets/icons/logo.svg"
import Slider from "../components/Slider.vue"
import emitter from "../services/emitter"

emitter.on("loader:end", () => {
    console.log("loader:end")
})
</script>

<template lang="pug">
#home
    div.logo-wrapper: Logo.logo
    Slider
</template>

<style lang="sass" scoped>
.logo-wrapper
    position: fixed
    left: 50%
    top: 10%
    transform: translateX(-50%)
    z-index: 100
</style>
