<script setup>
import { ref, onMounted } from "vue";
import { getApprovalList, processApproval } from "@/services/workflowService";
import { UiModal, UiTextarea, UiButton, UiTable } from "@/components/ui";

const approvals = ref([]);
const loading = ref(false);
const error = ref("");
const selectedApproval = ref(null);
const approvalReason = ref("");
const isSubmitting = ref(false);

const approvalColumns = [
  { key: "id", label: "ID" },
  { key: "createdBy", label: "Created By" },
  { key: "createdDate", label: "Created Date" },
  { key: "approvedBy", label: "Approved By" },
  { key: "approvedDate", label: "Approved Date" },
];

const fetchApprovals = async () => {
  try {
    loading.value = true;
    error.value = "";

    const res = await getApprovalList();

    // Handle API response
    let approvalList = [];

    if (res.data?.status === false) {
      error.value = res.data?.message || "API returned error";
      approvalList = [];
    } else {
      approvalList = res.data?.data || [];
    }

    approvals.value = approvalList;
  } catch (err) {
    error.value = err.response?.data?.message || err.message || "Gagal memuat approval";
    approvals.value = [];
  } finally {
    loading.value = false;
  }
};

const openApprovalModal = (approval) => {
  selectedApproval.value = approval;
  approvalReason.value = approval.reason || "";
};

const closeApprovalModal = () => {
  selectedApproval.value = null;
  approvalReason.value = "";
};

const handleApproveProcess = async () => {
  if (!selectedApproval.value) return;

  try {
    isSubmitting.value = true;
    const idAuditTrail = selectedApproval.value.idAuditTrail || selectedApproval.value.id;

    await processApproval(idAuditTrail, "approved", approvalReason.value || "Final approval");

    alert("Approval berhasil diproses (Final)");
    closeApprovalModal();
    fetchApprovals();
  } catch (err) {
    const errorMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Gagal process approval";

    alert(errorMsg);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchApprovals();
});
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-bold">List Approval (Final Approval)</h1>
      <div class="flex gap-2">
        <UiButton @click="fetchApprovals" :disabled="loading" variant="success" size="sm">
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
      :columns="approvalColumns"
      :data="approvals"
      :loading="loading"
      empty-message="Tidak ada approval untuk di-proses"
      show-actions
      actions-label="Action"
    >
      <template #id="{ item }">
        <span class="font-mono font-bold">{{ item.id || "-" }}</span>
      </template>
      <template #createdBy="{ item }">
        {{ item.createdBy?.name || item.createdBy || "-" }}
      </template>
      <template #createdDate="{ item }">
        {{ item.createdDate ? new Date(item.createdDate).toLocaleString() : "-" }}
      </template>
      <template #approvedBy="{ item }">
        <span v-if="item.approvedBy?.name">{{ item.approvedBy.name }}</span>
        <span v-else-if="item.approvedBy">{{ item.approvedBy }}</span>
        <span v-else class="text-yellow-600 font-semibold">⧖ Pending Tahap 1</span>
      </template>
      <template #approvedDate="{ item }">
        <span v-if="item.approvedDate">{{ new Date(item.approvedDate).toLocaleString() }}</span>
        <span v-else class="text-yellow-600">-</span>
      </template>
      <template #actions="{ item }">
        <UiButton @click="openApprovalModal(item)" variant="success" size="sm">
          Approve Final
        </UiButton>
      </template>
    </UiTable>

    <!-- No Data -->
    <div
      v-if="!loading && approvals.length === 0 && !error"
      class="bg-yellow-100 border border-yellow-400 p-4 rounded"
    >
      <p class="font-semibold">Tidak ada approval untuk di-proses</p>
      <p class="text-sm text-gray-600 mt-2">
        Tunggu hingga user baru di-approve di My Task untuk muncul di sini.
      </p>
    </div>

    <!-- Approval Modal -->
    <UiModal
      :show="!!selectedApproval"
      title="Approve Final"
      size="md"
      :loading="isSubmitting"
      @close="closeApprovalModal"
      @confirm="handleApproveProcess"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-2">ID</label>
          <p class="text-gray-700">{{ selectedApproval?.id }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">Created By</label>
          <p class="text-gray-700">
            {{ selectedApproval?.createdBy?.name || selectedApproval?.createdBy || "-" }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">Created Date</label>
          <p class="text-gray-700">
            {{
              selectedApproval?.createdDate
                ? new Date(selectedApproval.createdDate).toLocaleString()
                : "-"
            }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">Approved By (Tahap 1)</label>
          <p class="text-gray-700">
            <span v-if="selectedApproval?.approvedBy?.name">{{
              selectedApproval.approvedBy.name
            }}</span>
            <span v-else-if="selectedApproval?.approvedBy">{{ selectedApproval.approvedBy }}</span>
            <span v-else class="text-yellow-600 font-semibold">⧖ Pending Tahap 1</span>
          </p>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">Approved Date (Tahap 1)</label>
          <p class="text-gray-700">
            <span v-if="selectedApproval?.approvedDate">{{
              new Date(selectedApproval.approvedDate).toLocaleString()
            }}</span>
            <span v-else class="text-yellow-600">-</span>
          </p>
        </div>

        <UiTextarea
          v-model="approvalReason"
          label="Reason"
          placeholder="Masukkan reason approval final"
          :rows="3"
        />
      </div>

      <template #footer>
        <UiButton variant="secondary" @click="closeApprovalModal" :disabled="isSubmitting">
          Cancel
        </UiButton>
        <UiButton variant="success" @click="handleApproveProcess" :loading="isSubmitting">
          Approve Final
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
