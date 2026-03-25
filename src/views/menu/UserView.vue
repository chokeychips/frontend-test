<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getUserList } from "@/services/userService";
import { UiTable, UiButton } from "@/components/ui";

const router = useRouter();

const users = ref([]);
const loading = ref(false);
const error = ref("");

// pagination
const page = ref(1);
const limit = ref(10);
const totalData = ref(0);
const maxPage = ref(0);

const totalPages = computed(() => {
  return maxPage.value || Math.ceil(totalData.value / limit.value);
});

const total = ref(0);

const userTableColumns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "nik", label: "NIK" },
  { key: "hp", label: "Phone" },
  { key: "role.name", label: "Role" },
  { key: "branch.name", label: "Branch" },
  { key: "supervisor.name", label: "Supervisor" },
  { key: "channel.name", label: "Channel" },
];

const fetchUsers = async () => {
  try {
    loading.value = true;
    error.value = "";

    const res = await getUserList({
      page: page.value,
      perPage: limit.value,
    });

    // Struktur: res.data.data = array user, res.data.totalData = total
    users.value = res.data.data || [];
    totalData.value = res.data.totalData || 0;
    total.value = res.data.totalData || 0;
  } catch (err) {
    console.error("[USER] Fetch error:", err);
    error.value = err.response?.data?.message || err.message || "Gagal memuat data user";
    users.value = [];
  } finally {
    loading.value = false;
  }
};

const goToPage = (pageNum) => {
  page.value = pageNum;
  fetchUsers();
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    goToPage(page.value + 1);
  }
};

const prevPage = () => {
  if (page.value > 1) {
    goToPage(page.value - 1);
  }
};

const handleCreateUser = () => {
  router.push("/dashboard/users/create");
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">User List</h1>

    <!-- Loading -->
    <p v-if="loading" class="text-center py-4">Loading...</p>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      ❌ {{ error }}
    </div>

    <!-- Add User Button -->
    <button
      v-if="!loading && !error"
      @click="handleCreateUser"
      class="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
    >
      + Add User
    </button>

    <!-- Table -->
    <UiTable
      :columns="userTableColumns"
      :data="users"
      :loading="loading"
      empty-message="Tidak ada data user"
      show-actions
      actions-label="Aksi"
    >
      <template #actions="{ item }">
        <UiButton
          variant="warning"
          size="sm"
          @click="router.push(`/dashboard/users/edit/${item.id}`)"
        >
          Edit
        </UiButton>
      </template>
    </UiTable>

    <!-- No Data -->
    <div
      v-if="!loading && users.length === 0"
      class="bg-yellow-100 border border-yellow-400 p-4 rounded"
    >
      Tidak ada data user
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Showing page <strong>{{ page }}</strong> of <strong>{{ totalPages }}</strong> (Total:
        {{ totalData }} users)
      </div>

      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-4 py-2 bg-gray-300 disabled:opacity-50 rounded hover:bg-gray-400"
        >
          ← Previous
        </button>

        <div class="flex gap-1">
          <button
            v-for="pageNum in totalPages"
            :key="pageNum"
            @click="goToPage(pageNum)"
            :class="page === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'"
            class="px-3 py-2 rounded"
          >
            {{ pageNum }}
          </button>
        </div>

        <button
          @click="nextPage"
          :disabled="page >= totalPages"
          class="px-4 py-2 bg-gray-300 disabled:opacity-50 rounded hover:bg-gray-400"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>
