<template>
  <div class="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
    <AppHeader />
    <div class="flex-1">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>
