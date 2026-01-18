<template>
  <div class="max-w-2xl mx-auto">
    <div class="card">
      <div v-if="note">
        <h1 class="text-2xl font-bold mb-2">{{ note.title }}</h1>
        <template v-if="note.imageUrl">
          <img
            :src="getImageUrl(note.imageUrl)"
            :alt="note.title"
            class="w-full h-auto object-cover"
          />
        </template>
        <div class="prose prose-blue max-w-none mb-6" v-html="note.content"></div>
        <div class="flex justify-between items-center">
          <div class="text-xs text-gray-500">
            Last updated: {{ formatDate(note.updatedAt) }}
          </div>
          <div class="space-x-2">
            <NuxtLink :to="`/notes/${note.id}/edit`" class="btn-secondary">
              Edit
            </NuxtLink>
            <button @click="deleteNote" class="btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-600">
        Loading note...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from '~/stores/notes'
import { useAuthStore } from '~/stores/auth'

const notesStore = useNotesStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const note = computed(() => notesStore.getNoteById(route.params.id as string))

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  if (!note.value) {
    await notesStore.fetchNotes()
  }
})

const deleteNote = async () => {
  if (confirm('Are you sure you want to delete this note?')) {
    await notesStore.deleteNote(route.params.id as string)
    router.push('/notes')
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return
  return `https://storage.googleapis.com/takenotes-uploads-assets/${imageUrl}`;
};
</script> 