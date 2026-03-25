<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getMyTaskList, approveTask } from "@/services/workflowService";

const router = useRouter();

const tasks = ref([]);
const loading = ref(false);
const error = ref("");
const selectedTask = ref(null);
const approvalReason = ref("");
const isSubmitting = ref(false);

const fetchTasks = async () => {
  try {
    loading.value = true;
    error.value = "";

    const res = await getMyTaskList();

    // Handle API response
    let taskList = [];

    if (res.data?.status === false) {
      error.value = res.data?.message || "API returned error";
      console.error("[MYTASK] API Error:", error.value);
      taskList = [];
    } else {
      taskList = res.data?.data || [];
    }

    tasks.value = taskList;
  } catch (err) {
    console.error("[MYTASK] Fetch error:", err);
    error.value = err.response?.data?.message || err.message || "Gagal memuat task";
    tasks.value = [];
  } finally {
    loading.value = false;
  }
};

const openApprovalModal = (task) => {
  selectedTask.value = task;
  approvalReason.value = "";
};

const closeApprovalModal = () => {
  selectedTask.value = null;
  approvalReason.value = "";
};

const parseTaskData = (data) => {
  if (!data) return null;

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  if (typeof data === "object") {
    return data;
  }

  return null;
};

const findUserId = (obj) => {
  if (!obj || typeof obj !== "object") return null;

  if (obj.userId) return obj.userId;
  if (obj.idUser) return obj.idUser;
  if (obj.user?.id) return obj.user.id;
  if (obj.id && obj.idAuditTrail == null) return obj.id; // tidak ambil audittrail id

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === "object") {
      const nested = findUserId(value);
      if (nested) return nested;
    }
  }

  return null;
};

const getTaskUserId = (task) => {
  const candidates = [
    task.userId,
    task.idUser,
    task.targetId,
    task.data?.idUser,
    task.data?.userId,
    task.data?.id,
  ];

  for (const c of candidates) {
    if (c) return c;
  }

  const taskData = parseTaskData(task.data);
  const nestedId = findUserId(taskData);
  if (nestedId) return nestedId;

  const actionData = parseTaskData(task.action);
  const nestedActionId = findUserId(actionData);
  if (nestedActionId) return nestedActionId;

  return null;
};

const goToEditRequest = (task) => {
  const userId = getTaskUserId(task);
  if (!userId) {
    console.error("MyTask user id lookup failed", task);
    alert(
      "Tidak bisa menemukan user ID untuk request ini. Cek console log (task object) dan minta backend menyertakan userId di task data.",
    );
    return;
  }

  router.push(`/dashboard/users/edit/${userId}`);
};

const handleApprove = async () => {
  if (!selectedTask.value) return;

  if (!approvalReason.value.trim()) {
    alert("Alasan approve harus diisi");
    return;
  }

  try {
    isSubmitting.value = true;

    const payload = {
      idAuditTrail: [selectedTask.value.id || selectedTask.value.idAuditTrail],
      reason: approvalReason.value,
    };

    await approveTask(
      selectedTask.value.id || selectedTask.value.idAuditTrail,
      approvalReason.value,
    );

    alert("Task berhasil di-approve tahap 1");
    closeApprovalModal();
    fetchTasks();
  } catch (err) {
    console.error("[MYTASK] Approve error:", err);
    console.error("[MYTASK] Error response data:", err.response?.data);
    console.error("[MYTASK] Error response status:", err.response?.status);

    const errorMsg =
      err.response?.data?.message || err.response?.data?.error || err.message || "Gagal approve";

    alert(errorMsg);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchTasks();
});
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-bold">My Task (Maintenance Approval)</h1>
      <div class="flex gap-2">
        <button
          @click="fetchTasks"
          :disabled="loading"
          class="px-3 py-2 rounded text-sm font-semibold bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
        >
          {{ loading ? "Loading..." : "🔄 Refresh" }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <p v-if="loading" class="text-center py-4">Loading...</p>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      ❌ {{ error }}
    </div>

    <!-- Table -->
    <table v-if="!loading && tasks.length > 0" class="w-full border">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2">ID Audit Trail</th>
          <th class="p-2">Created By</th>
          <th class="p-2">Created Date</th>
          <th class="p-2">Status</th>
          <th class="p-2">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="task in tasks" :key="task.idAuditTrail || task.id">
          <td class="p-2 font-mono font-bold text-center">
            {{ task.idAuditTrail || task.id || "-" }}
          </td>
          <td class="p-2 text-center">{{ task.createdBy?.name || task.createdBy || "-" }}</td>
          <td class="p-2 text-sm text-center">
            {{ task.createdDate ? new Date(task.createdDate).toLocaleString() : "-" }}
          </td>
          <td class="p-2 text-center">
            <span v-if="task.approvedBy" class="text-green-600 font-semibold">✓ Approved</span>
            <span v-else class="text-yellow-600 font-semibold">⧖ Pending</span>
          </td>
          <td class="p-2 text-center">
            <div class="flex flex-col gap-2 items-center">
              <button
                :disabled="task.approvedBy"
                @click="openApprovalModal(task)"
                :class="[
                  'px-3 py-2 rounded font-semibold text-sm',
                  task.approvedBy
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600',
                ]"
              >
                {{ task.approvedBy ? "Sudah Approved" : "Approve" }}
              </button>

              <button
                v-if="getTaskUserId(task)"
                @click="goToEditRequest(task)"
                class="px-3 py-2 rounded font-semibold text-sm bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Edit request
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- No Data -->
    <div
      v-if="!loading && tasks.length === 0 && !error"
      class="bg-yellow-100 border border-yellow-400 p-4 rounded"
    >
      <p class="font-semibold">Tidak ada task untuk di-approve</p>
      <p class="text-sm text-gray-600 mt-2">Buat user baru di halaman Users untuk test workflow.</p>
    </div>

    <!-- Approval Modal -->
    <div
      v-if="selectedTask"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-bold mb-4">Approve Task</h2>

        <div class="mb-4">
          <label class="block text-sm font-semibold mb-2">ID Audit Trail</label>
          <p class="text-gray-700">{{ selectedTask.idAuditTrail }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold mb-2">Action</label>
          <p class="text-gray-700">{{ selectedTask.action || selectedTask.name || "-" }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold mb-2">Alasan Approve</label>
          <textarea
            v-model="approvalReason"
            placeholder="Masukkan alasan approve..."
            class="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>

        <div class="flex gap-2 justify-end">
          <button
            @click="closeApprovalModal"
            :disabled="isSubmitting"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            @click="handleApprove"
            :disabled="isSubmitting"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {{ isSubmitting ? "Submitting..." : "Approve" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
