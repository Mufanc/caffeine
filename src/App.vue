<template>
    <n-flex vertical align="center">
        <div class="frame">
            <i ref="coffee" class="icon-coffee font-size-175px i-lmd:coffee-half-empty-twotone-loop" />
            <n-progress
                class="progress"
                :percentage="progressPercentage"
                :stroke-width="3"
                type="circle"
                color="var(--color)"
                v-vis="isActive"
            >
                <div class="flex flex-col items-center">
                    <i class="icon-coffee font-size-50px invisible i-lmd:coffee-half-empty-twotone-loop" />
                    <div ref="countdown">
                        <span class="countdown" v-show="!isInfinity">
                            <n-countdown
                                :duration="countdownTotal * 1000"
                                :active="isActive"
                                :key="isActive /* trigger remount */"
                                :render="renderer"
                                @finish="onFinish"
                            />
                        </span>
                        <span class="countdown" v-show="isInfinity">Caffeine</span>
                    </div>
                </div>
            </n-progress>
        </div>
        <div class="mt-20px">
            <n-flex class="control" v-show="!isActive">
                <n-button @click="startCountdown(20)" secondary round type="warning" @mousedown.prevent>20min</n-button>
                <n-button @click="startCountdown(45)" secondary round type="warning" @mousedown.prevent>45min</n-button>
                <n-button @click="startCountdown(70)" secondary round type="warning" @mousedown.prevent>70min</n-button>
                <n-button @click="startCountdown(-1)" secondary round type="warning" @mousedown.prevent
                    >Infinity</n-button
                >
            </n-flex>
            <n-flex class="control" v-show="isActive">
                <n-button @click="reset()" secondary round type="warning" @mousedown.prevent>Stop</n-button>
            </n-flex>
        </div>
    </n-flex>
</template>

<script setup lang="ts">
import { CountdownTimeInfo } from 'naive-ui'
import { computed, ref, watch } from 'vue'

const countdownTotal = ref(0)
const countdownLeft = ref(0)

const isActive = computed(() => countdownTotal.value !== 0)
const isInfinity = computed(() => countdownTotal.value === -1)

const progressPercentage = computed(() => {
    if (countdownTotal.value === -1) return 100
    if (countdownTotal.value === 0) return 0
    return (100 * countdownLeft.value) / countdownTotal.value
})

const coffee = ref<HTMLElement>()
const countdown = ref<HTMLElement>()

const coffeeAnim = ref<Animation | undefined>()

function renderer({ hours, minutes, seconds }: CountdownTimeInfo) {
    let min = `${hours * 60 + minutes}`.padStart(2, '0')
    let sec = `${seconds}`.padStart(2, '0')

    countdownLeft.value = hours * 3600 + minutes * 60 + seconds

    return `${min}:${sec}`
}

function startCountdown(min: number) {
    if (min === -1) {
        countdownTotal.value = -1
    } else {
        countdownTotal.value = 60 * min
        countdownLeft.value = countdownTotal.value
    }

    const translateX = 0
    const translateY = -countdown.value!.clientHeight / 2

    coffeeAnim.value = coffee.value?.animate(
        [
            {
                transform: `translate(${translateX}px, ${translateY}px)`,
                fontSize: '50px',
            },
        ],
        {
            duration: 500,
            iterations: 1,
            fill: 'forwards',
            easing: 'ease',
        },
    )
}

function reset() {
    countdownTotal.value = 0
    countdownLeft.value = 0
    coffeeAnim.value?.reverse()
}

function onFinish() {
    if (!isInfinity.value) {
        reset()
    }
}

watch(isActive, async (after, before) => {
    if (before === after) return

    if (after) {
        ;(<any>window).$lock = await navigator.wakeLock.request('screen')
        console.log('acquire wake lock')
    } else {
        ;(<any>window).$lock?.release()
        console.log('release wake lock')
    }
})
</script>

<style scoped>
:global(#app) {
    --color: tan;
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.frame {
    width: 200px;
    height: 200px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.frame > * {
    position: absolute;
}

.countdown {
    font-size: 30px;
    font-family: 'Chivo Mono', monospace;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
    color: var(--color);
}

.progress {
    width: 200px;
    transition: opacity 1s ease-in-out;
}

.icon-coffee {
    color: var(--color);
}

.control > * {
    width: 80px;
    font-size: 15px;
    font-family: 'Madimi One', sans-serif;
    font-weight: 400;
    font-style: normal;
    color: var(--color);
}
</style>
