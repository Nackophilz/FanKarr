<template>
  <div class="max-w-5xl mx-auto px-8 py-8">
    <!-- Back -->
    <button
        @click="$router.push('/')"
        class="text-[#5a7a94] text-xs tracking-widest hover:text-[#e8513a] transition-colors mb-8 cursor-pointer"
    >
      ← CATALOGUE
    </button>

    <!-- Loading -->
    <div v-if="loading" class="text-[#5a7a94] text-sm tracking-widest py-20 text-center">
      CHARGEMENT...
    </div>

    <template v-else-if="production">
      <!-- Hero -->
      <div class="flex gap-8 mb-10">
        <!-- Poster -->
        <div class="w-40 flex-shrink-0">
          <img
              v-if="production.cover"
              :src="imageUrl(production.cover)"
              :alt="production.name"
              class="w-full object-cover"
          />
          <div v-else class="w-full aspect-[2/3] bg-[#0d1219] flex items-center justify-center text-5xl">🎌</div>
        </div>

        <!-- Info -->
        <div class="flex-1">
          <div class="text-[10px] text-[#e8513a] tracking-widest mb-2">FANKAI</div>
          <h1 class="text-3xl font-black text-white font-sans mb-4">{{ production.name }}</h1>

          <!-- Badges -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="text-[10px] border border-[#1e2d3d] text-[#5a7a94] px-2 py-1 tracking-wider">
              {{ production.status.toUpperCase() }}
            </span>
            <span class="text-[10px] border border-[#3a8fe8] text-[#3a8fe8] bg-[#3a8fe8]/10 px-2 py-1 tracking-wider">
              {{ production.episodes_count }} FILMS
            </span>
            <span class="text-[10px] border border-[#1e2d3d] text-[#5a7a94] px-2 py-1 tracking-wider">
              PAR {{ production.kaieur.toUpperCase() }}
            </span>
          </div>

          <p class="text-sm text-[#5a7a94] leading-relaxed mb-6">{{ production.description }}</p>

          <!-- Torrents globaux -->
          <div v-if="torrents.length > 0">
            <div class="text-[10px] text-[#5a7a94] tracking-widest mb-2">TORRENTS</div>
            <div class="flex flex-col gap-2">
              <a
                v-for="t in torrents"
                :key="t.url"
                :href="t.url"
                target="_blank"
                class="flex items-center justify-between bg-[#0d1219] border border-[#1e2d3d] hover:border-[#e8513a] px-4 py-2.5 transition-colors group"
              >
                <span class="text-sm text-white">{{ t.name }}</span>
                <span class="text-[10px] text-[#e8513a] tracking-widest group-hover:text-white transition-colors">
                    NYAA ↗
                </span>
              </a>
            </div>
          </div>

          <!-- Lien wiki -->
          <a
            v-if="production.link"
            :href="production.link"
            target="_blank"
            class="inline-block mt-4 text-[10px] text-[#5a7a94] hover:text-[#3a8fe8] tracking-widest transition-colors"
          >
            GUIDE DES ÉPISODES ↗
          </a>
        </div>
      </div>

      <!-- Saisons -->
      <!-- Saisons -->
      <div v-if="production.seasons.length > 0" class="space-y-6">
        <div v-for="season in production.seasons" :key="season.id">
          <div class="flex items-center gap-4 mb-3">
            <div class="text-[10px] text-[#5a7a94] tracking-widest">SAISON {{ season.number }}</div>
            <div class="text-sm font-bold text-white">{{ season.name }}</div>
            <div class="flex-1 h-px bg-[#1e2d3d]"></div>
          </div>
          <div class="grid grid-cols-1 gap-px bg-[#1e2d3d]">
            <div v-for="ep in season.episodes" :key="ep.id">
              <EpisodeRow :ep="ep" :production-id="production.id" />
            </div>
          </div>
        </div>
      </div>

      <!-- Episodes sans saison -->
      <div v-else-if="production.episodes.length > 0">
        <div class="flex items-center gap-4 mb-3">
          <div class="text-sm font-bold text-white">ÉPISODES</div>
          <div class="flex-1 h-px bg-[#1e2d3d]"></div>
        </div>
        <div class="grid grid-cols-1 gap-px bg-[#1e2d3d]">
          <div v-for="ep in production.episodes" :key="ep.id">
            <EpisodeRow :ep="ep" :production-id="production.id" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import { imageUrl, parseTorrents, type ProductionDetail } from '@/api/fankai'
import EpisodeRow from "@/components/EpisodeRow.vue";

const route = useRoute()
const store = useCatalogStore()

const production = ref<ProductionDetail | null>(null)
const loading = ref(true)

const torrents = computed(() => parseTorrents(production.value?.torrents ?? null))

onMounted(async () => {
  const id = Number(route.params.id)
  const name = route.query.name as string ?? ''
  production.value = await store.loadProduction(id, name)
  loading.value = false
})
</script>