<template>
  <div class="min-h-screen bg-[#080c10] flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="flex items-baseline gap-1 mb-8 justify-center">
        <span class="font-sans text-3xl font-black text-white tracking-tight">Fank</span>
        <span class="font-sans text-3xl font-black text-[#e8513a] tracking-tight">Arr</span>
      </div>

      <!-- Card -->
      <div class="bg-[#0d1219] border border-[#1e2d3d] p-8">
        <div class="text-[10px] text-[#e8513a] tracking-widest mb-1">
          {{ isSetup ? 'PREMIÈRE CONNEXION' : 'CONNEXION' }}
        </div>
        <h1 class="text-lg font-black text-white font-sans mb-6">
          {{ isSetup ? 'Créer un compte' : 'Bon retour' }}
        </h1>

        <!-- Form -->
        <div class="flex flex-col gap-4">
          <div>
            <label class="text-[10px] text-[#5a7a94] tracking-widest block mb-1.5">IDENTIFIANT</label>
            <input
                v-model="username"
                type="text"
                placeholder="admin"
                class="w-full bg-[#121920] border border-[#1e2d3d] text-white px-3 py-2.5 text-sm outline-none focus:border-[#e8513a] transition-colors"
                @keyup.enter="submit"
            />
          </div>

          <div>
            <label class="text-[10px] text-[#5a7a94] tracking-widest block mb-1.5">MOT DE PASSE</label>
            <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full bg-[#121920] border border-[#1e2d3d] text-white px-3 py-2.5 text-sm outline-none focus:border-[#e8513a] transition-colors"
                @keyup.enter="submit"
            />
          </div>

          <div v-if="isSetup">
            <label class="text-[10px] text-[#5a7a94] tracking-widest block mb-1.5">CONFIRMER</label>
            <input
                v-model="confirm"
                type="password"
                placeholder="••••••••"
                class="w-full bg-[#121920] border border-[#1e2d3d] text-white px-3 py-2.5 text-sm outline-none focus:border-[#e8513a] transition-colors"
                @keyup.enter="submit"
            />
          </div>

          <!-- Error -->
          <div v-if="error" class="text-[#e8513a] text-xs">{{ error }}</div>

          <!-- Submit -->
          <button
              @click="submit"
              :disabled="submitting"
              class="w-full bg-[#e8513a] text-white py-2.5 text-xs tracking-widest font-bold hover:opacity-85 transition-opacity disabled:opacity-50 cursor-pointer mt-2"
          >
            {{ submitting ? '...' : isSetup ? 'CRÉER LE COMPTE' : 'SE CONNECTER' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const confirm = ref('')
const error = ref<string | null>(null)
const submitting = ref(false)

const isSetup = computed(() => !auth.setup)

async function submit() {
  error.value = null

  if (!username.value || !password.value) {
    error.value = 'Tous les champs sont requis'
    return
  }

  if (isSetup.value && password.value !== confirm.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  submitting.value = true

  const err = isSetup.value
      ? await auth.setupAccount(username.value, password.value)
      : await auth.login(username.value, password.value)

  submitting.value = false

  if (err) {
    error.value = err
    return
  }

  await router.push('/')
}
</script>