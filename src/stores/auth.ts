import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const loggedIn = ref(false)
    const setup = ref(false)
    const loading = ref(true)

    async function checkStatus() {
        try {
            const res = await fetch('/api/auth/status')
            const data = await res.json()
            setup.value = data.setup
            loggedIn.value = data.loggedIn
        } catch {
            loggedIn.value = false
        } finally {
            loading.value = false
        }
    }

    async function login(username: string, password: string): Promise<string | null> {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        const data = await res.json()
        if (res.ok) {
            loggedIn.value = true
            return null
        }
        return data.error
    }

    async function setupAccount(username: string, password: string): Promise<string | null> {
        const res = await fetch('/api/auth/setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        const data = await res.json()
        if (res.ok) {
            loggedIn.value = true
            setup.value = true
            return null
        }
        return data.error
    }

    async function logout() {
        await fetch('/api/auth/logout', { method: 'POST' })
        loggedIn.value = false
    }

    return { loggedIn, setup, loading, checkStatus, login, setupAccount, logout }
})