<script setup>
import { onMounted } from "vue"
import emitter from "../services/emitter"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Draggable } from "gsap/Draggable"

onMounted(() => {
    gsap.registerPlugin(ScrollTrigger, Draggable)
    let iteration = 0
    // set initial state of items
    gsap.set(".slider .slide", { xPercent: 400, opacity: 0, scale: 0.5 })
    const spacing = 0.12 // spacing of the cards (stagger)
    const snapTime = gsap.utils.snap(spacing)
    const cards = gsap.utils.toArray(".slider .slide")
    const animateFunc = (element) => {
        const tl = gsap.timeline()
        tl.fromTo(
            element,
            { scale: 0.5, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                zIndex: 100,
                duration: 0.5,
                yoyo: true,
                repeat: 1,
                ease: "power1.in",
                immediateRender: false,
            }
        ).fromTo(
            element,
            { xPercent: 400 },
            {
                xPercent: -400,
                duration: 1,
                ease: "none",
                immediateRender: false,
            },
            0
        )
        return tl
    }
    const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc)
    const playhead = { offset: 0 }
    const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration())
    const scrub = gsap.to(playhead, {
        // we reuse this tween to smoothly scrub the playhead on the seamlessLoop
        offset: 0,
        onUpdate() {
            seamlessLoop.time(wrapTime(playhead.offset)) // convert the offset to a "safe" corresponding time on the seamlessLoop timeline
        },
        duration: 0.5,
        ease: "power3",
        paused: true,
    })
    const trigger = ScrollTrigger.create({
        start: 0,
        onUpdate(self) {
            let scroll = self.scroll()
            if (scroll > self.end - 1) {
                wrap(1, 1)
            } else if (scroll < 1 && self.direction < 0) {
                wrap(-1, self.end - 1)
            } else {
                scrub.vars.offset =
                    (iteration + self.progress) * seamlessLoop.duration()
                scrub.invalidate().restart() // to improve performance, we just invalidate and restart the same tween. No need for overwrites or creating a new tween on each update.
            }
        },
        end: "+=3000",
        pin: ".slider-wrapper",
    })
    const progressToScroll = (progress) => {
        gsap.utils.clamp(
            1,
            trigger.end - 1,
            gsap.utils.wrap(0, 1, progress) * trigger.end
        )
    }
    const wrap = (iterationDelta, scrollTo) => {
        iteration += iterationDelta
        trigger.scroll(scrollTo)
        trigger.update() // by default, when we trigger.scroll(), it waits 1 tick to update().
    }
    ScrollTrigger.addEventListener("scrollEnd", () =>
        scrollToOffset(scrub.vars.offset)
    )
    function scrollToOffset(offset) {
        // moves the scroll playhead to the place that corresponds to the totalTime value of the seamlessLoop, and wraps if necessary.
        let snappedTime = snapTime(offset),
            progress =
                (snappedTime - seamlessLoop.duration() * iteration) /
                seamlessLoop.duration(),
            scroll = progressToScroll(progress)
        if (progress >= 1 || progress < 0) {
            return wrap(Math.floor(progress), scroll)
        }
        trigger.scroll(scroll)
    }
    function buildSeamlessLoop(items, spacing, animateFunc) {
        let rawSequence = gsap.timeline({ paused: true }), // this is where all the "real" animations live
            seamlessLoop = gsap.timeline({
                // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
                paused: true,
                repeat: -1, // to accommodate infinite scrolling/looping
                onRepeat() {
                    // works around a super rare edge case bug that's fixed GSAP 3.6.1
                    this._time === this._dur &&
                        (this._tTime += this._dur - 0.01)
                },
                onReverseComplete() {
                    this.totalTime(this.rawTime() + this.duration() * 100) // seamless looping backwards
                },
            }),
            cycleDuration = spacing * items.length,
            dur // the duration of just one animateFunc() (we'll populate it in the .forEach() below...

        // loop through 3 times so we can have an extra cycle at the start and end - we'll scrub the playhead only on the 2nd cycle
        items
            .concat(items)
            .concat(items)
            .forEach((item, i) => {
                let anim = animateFunc(items[i % items.length])
                rawSequence.add(anim, i * spacing)
                dur || (dur = anim.duration())
            })

        // animate the playhead linearly from the start of the 2nd cycle to its end (so we'll have one "extra" cycle at the beginning and end)
        seamlessLoop.fromTo(
            rawSequence,
            {
                time: cycleDuration + dur / 2,
            },
            {
                time: "+=" + cycleDuration,
                duration: cycleDuration,
                ease: "none",
            }
        )
        return seamlessLoop
    }
    Draggable.create(".drag-proxy", {
        type: "x",
        trigger: ".slider",
        onPress() {
            this.startOffset = scrub.vars.offset
        },
        onDrag() {
            scrub.vars.offset =
                this.startOffset + (this.startX - this.x) * 0.001
            scrub.invalidate().restart() // same thing as we do in the ScrollTrigger's onUpdate
        },
        onDragEnd() {
            scrollToOffset(scrub.vars.offset)
        },
    })
})
</script>

<template lang="pug">
div.slider-wrapper
    div.slider
        div.slide(style="background-image: url(/src/assets/images/1.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/2.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/3.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/4.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/1.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/2.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/3.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/4.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/1.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/2.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/3.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/4.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/1.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/2.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/3.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/4.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/1.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/2.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/3.jpeg);")
        div.slide(style="background-image: url(/src/assets/images/4.jpeg);")
    div.drag-proxy
</template>

<style lang="sass">
.slider-wrapper
    position: absolute
    width: 100%
    height: 100vh
    overflow: hidden
    .slider
        position: absolute
        width: 800px
        height: 600px
        top: 20%
        left: 50%
        transform: translateX(-50%)
        .slide
            background-size: cover
            list-style: none
            padding: 0
            margin: 0
            width: 800px
            height: 600px
            text-align: center
            line-height: 18rem
            font-size: 2rem
            font-family: sans-serif
            background-color: darkgrey
            position: absolute
            top: 0
            left: 0
.drag-proxy
    visibility: hidden
    position: absolute
</style>
