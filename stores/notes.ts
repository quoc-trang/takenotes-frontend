import { defineStore } from 'pinia'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  imageUrl?: string
}

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getNotes = computed(() => notes.value)
  const getNoteById = computed(() => (id: string) => notes.value.find(note => note.id === id))
  const isLoading = computed(() => loading.value)

  const fetchNotes = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch('/api/notes')
      notes.value = response
    } catch (err: any) {
      error.value = err.data?.message || err.statusMessage || 'Failed to fetch notes'
    } finally {
      loading.value = false
    }
  }

  const createNote = async (note: { title: string; content: string, imageUrl?: string }) => {
    try {
      const newNote = await $fetch('/api/notes', {
        method: 'POST',
        body: note
      })
      notes.value.unshift(newNote)
      return newNote
    } catch (err: any) {
      throw new Error(err.data?.message || err.statusMessage || 'Failed to create note')
    }
  }

  const updateNote = async (id: string, note: { title: string; content: string }) => {
    try {
      const updatedNote = await $fetch(`/api/notes/${id}`, {
        method: 'PUT',
        body: note
      })

      const index = notes.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notes.value[index] = updatedNote
      }
      return updatedNote
    } catch (err: any) {
      throw new Error(err.data?.message || err.statusMessage || 'Failed to update note')
    }
  }

  const deleteNote = async (id: string) => {
    try {
      await $fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      })

      notes.value = notes.value.filter(note => note.id !== id)
    } catch (err: any) {
      throw new Error(err.data?.message || err.statusMessage || 'Failed to delete note')
    }
  }

  return {
    // State
    notes,
    loading,
    error,

    // Getters
    getNotes,
    getNoteById,
    isLoading,

    // Actions
    fetchNotes,
    createNote,
    updateNote,
    deleteNote
  }
}) 