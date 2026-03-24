<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-6"
  >
    <div
      class="max-w-3xl w-full bg-white shadow-2xl rounded-2xl border border-gray-200 p-8 text-center"
    >
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 10.5h18M3 14.5h18M5 10.5V5a2 2 0 012-2h10a2 2 0 012 2v5.5M8 14.5V19a2 2 0 002 2h4a2 2 0 002-2v-4.5"
            />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-800">Sedang dalam Perbaikan</h1>
        <p class="text-gray-600 text-base sm:text-lg">
          Halaman yang kamu coba akses saat ini sedang dalam masa maintenance. Silakan kembali ke
          menu utama atau hubungi admin jika butuh akses segera.
        </p>
        <div class="flex flex-wrap justify-center gap-3 mt-2">
          <router-link
            to="/dashboard/users"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Kembali ke User
          </router-link>
          <router-link
            to="/dashboard/mytask-maintenance"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Cek My Task
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
