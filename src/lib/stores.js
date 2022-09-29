import { writable } from 'svelte/store'

export const newlyFoundFlag = writable(null)
export const alienFoundFlag = writable(null)

export function broadcastCapture(flag) {
    alienFoundFlag.set(flag)
    setTimeout(() => { alienFoundFlag.set(null) }, 5000)
}