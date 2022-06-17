<script setup>
import { onMounted } from "vue"
import emitter from "../services/emitter"
import { gsap } from "gsap"

onMounted(() => {
    // window.addEventListener("load", () => {
    //     gsap.to(".loader", {
    //         opacity: 0,
    //         pointerEvents: "none",
    //         duration: 2,
    //         onComplete: () => emitter.emit("loader:end"),
    //     })
    // })
})
</script>

<template lang="pug">
//- div.loader
</template>

<style lang="sass">
.loader
    position: fixed
    background: darkblue
    top: 0
    left: 0
    width: 100%
    height: 100%
</style>
