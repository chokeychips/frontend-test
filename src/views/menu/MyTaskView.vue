<script setup>
// imports
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getMyTaskList, approveTask } from "@/services/workflowService";
import { UiButton, UiModal, UiTextarea, UiTable } from "@/components/ui";

// router helper
const router = useRouter();

// state refs
const tasks = ref([]);
const loading = ref(false);
const error = ref("");
const selectedTask = ref(null);
const approvalReason = ref("");
const isSubmitting = ref(false);

const taskColumns = [
  { key: "idAuditTrail", label: "ID Audit Trail" },
  { key: "createdBy", label: "Created By" },
  { key: "createdDate", label: "Created Date" },
  { key: "status", label: "Status" },
];

// fetch task list dari backend
const fetchTasks = async () => {
  try {
    loading.value = true;
    error.value = "";

    const res = await getMyTaskList();

    // parse API response
    let taskList = [];

    if (res.data?.status === false) {
      error.value = res.data?.message || "API returned error";
      taskList = [];
    } else {
      taskList = res.data?.data || [];
    }

    tasks.value = taskList;
  } catch (err) {
    error.value = err.response?.data?.message || err.message || "Gagal memuat task";
    tasks.value = [];
  } finally {
    loading.value = false;
  }
};

// modal approval controls
const openApprovalModal = (task) => {
  selectedTask.value = task;
  approvalReason.value = "";
};

const closeApprovalModal = () => {
  selectedTask.value = null;
  approvalReason.value = "";
};

// utility parse task data JSON / object
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

// find user ID recursively
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

// compute user id from task details
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

// navigate ke edit request
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

// approve task action
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
    const errorMsg =
      err.response?.data?.message || err.response?.data?.error || err.message || "Gagal approve";

    alert(errorMsg);
  } finally {
    isSubmitting.value = false;
  }
};

// init fetch
onMounted(() => {
  fetchTasks();
});
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-bold">My Task (Maintenance Approval)</h1>
      <div class="flex gap-2">
        <UiButton @click="fetchTasks" :disabled="loading" variant="success" size="sm">
          {{ loading ? "Loading..." : "🔄 Refresh" }}
        </UiButton>
      </div>
    </div>

    <!-- Loading -->
    <p v-if="loading" class="text-center py-4">Loading...</p>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      ❌ {{ error }}
    </div>

    <!-- Table -->
    <UiTable
      :columns="taskColumns"
      :data="tasks"
      :loading="loading"
      empty-message="Tidak ada task untuk di-approve"
      show-actions
      actions-label="Action"
    >
      <template #idAuditTrail="{ item }">
        <span class="font-mono font-bold">{{ item.idAuditTrail || item.id || "-" }}</span>
      </template>
      <template #createdBy="{ item }">
        {{ item.createdBy?.name || item.createdBy || "-" }}
      </template>
      <template #createdDate="{ item }">
        {{ item.createdDate ? new Date(item.createdDate).toLocaleString() : "-" }}
      </template>
      <template #status="{ item }">
        <span v-if="item.approvedBy" class="text-green-600 font-semibold">✓ Approved</span>
        <span v-else class="text-yellow-600 font-semibold">⧖ Pending</span>
      </template>
      <template #actions="{ item }">
        <div class="flex flex-col gap-2 items-center">
          <UiButton
            :disabled="item.approvedBy"
            @click="openApprovalModal(item)"
            :class="[
              'px-3 py-2 rounded font-semibold text-sm',
              item.approvedBy
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600',
            ]"
          >
            {{ item.approvedBy ? "Sudah Approved" : "Approve" }}
          </UiButton>

          <UiButton
            v-if="getTaskUserId(item)"
            @click="goToEditRequest(item)"
            class="px-3 py-2 rounded font-semibold text-sm bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Edit request
          </UiButton>
        </div>
      </template>
    </UiTable>

    <!-- No Data -->
    <div
      v-if="!loading && tasks.length === 0 && !error"
      class="bg-yellow-100 border border-yellow-400 p-4 rounded"
    >
      <p class="font-semibold">Tidak ada task untuk di-approve</p>
      <p class="text-sm text-gray-600 mt-2">Buat user baru di halaman Users untuk test workflow.</p>
    </div>

    <!-- Approval Modal -->
    <UiModal
      :show="!!selectedTask"
      title="Approve Task"
      size="md"
      :loading="isSubmitting"
      @close="closeApprovalModal"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-2">ID Audit Trail</label>
          <p class="text-gray-700">{{ selectedTask.idAuditTrail }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">Action</label>
          <p class="text-gray-700">{{ selectedTask.action || selectedTask.name || "-" }}</p>
        </div>

        <UiTextarea
          v-model="approvalReason"
          label="Alasan Approve"
          placeholder="Masukkan alasan approve..."
          :rows="4"
        />
      </div>

      <template #footer>
        <UiButton @click="closeApprovalModal" :disabled="isSubmitting" variant="secondary">
          Cancel
        </UiButton>
        <UiButton
          @click="handleApprove"
          :disabled="isSubmitting"
          variant="success"
          :loading="isSubmitting"
        >
          {{ isSubmitting ? "Submitting..." : "Approve" }}
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
