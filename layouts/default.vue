<template>
  <div class="flex h-screen bg-white font-sans">
    <!-- Sidebar -->
    <aside v-if="authStore.isLoggedIn" class="notion-sidebar">
      <NuxtLink to="/notes" class="text-2xl font-bold mb-8 px-2 text-gray-900"
        >TakeNotes</NuxtLink
      >
      <nav class="flex-1 flex flex-col gap-1">
        <NuxtLink
          to="/notes"
          :class="[
            'notion-sidebar-link',
            { 'notion-sidebar-link-active': isAllNotesActive },
          ]"
          >All Notes</NuxtLink
        >
        <NuxtLink
          to="/notes/new"
          :class="[
            'notion-sidebar-link',
            { 'notion-sidebar-link-active': isNewNoteActive },
          ]"
          >New Note</NuxtLink
        >
      </nav>
      <div class="mt-auto pt-8 border-t border-gray-200">
        <button @click="logout" class="notion-sidebar-link w-full text-left">
          Logout
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex flex-col min-h-screen flex-1 overflow-y-scroll">
      <main class="flex-1 flex flex-col items-center bg-white">
        <div class="w-full px-4 py-10">
          <NuxtPage />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const route = useRoute();

const isAllNotesActive = computed(() => {
  const path = route.path;
  return (
    path === "/notes" || (path.startsWith("/notes/") && path !== "/notes/new")
  );
});

const isNewNoteActive = computed(() => {
  const path = route.path;
  return path === "/notes/new";
});

const logout = async () => {
  try {
    // Call backend logout endpoint if user is authenticated
    await $fetch("/api/auth/logout");
  } catch (error) {
    // Ignore logout errors, still clear local state
    console.error("Logout error:", error);
  } finally {
    navigateTo("/login");
  }
};
</script>
