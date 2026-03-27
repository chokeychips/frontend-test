<script setup>
import { ref, onMounted } from "vue";
import { getApprovalList, processApproval } from "@/services/workflowService";
import { UiModal, UiTextarea, UiButton } from "@/components/ui";

const approvals = ref([]);
const loading = ref(false);
const error = ref("");
const selectedApproval = ref(null);
const approvalReason = ref("");
const isSubmitting = ref(false);

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
    <table v-if="!loading && approvals.length > 0" class="w-full border">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2">ID</th>
          <th class="p-2">Created By</th>
          <th class="p-2">Created Date</th>
          <th class="p-2">Approved By</th>
          <th class="p-2">Approved Date</th>
          <th class="p-2">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="approval in approvals" :key="approval.id || approval.idAuditTrail">
          <td class="p-2 font-mono font-bold text-center">
            {{ approval.id || "-" }}
          </td>
          <td class="p-2 text-center">
            {{ approval.createdBy?.name || approval.createdBy || "-" }}
          </td>
          <td class="p-2 text-center text-sm">
            {{ approval.createdDate ? new Date(approval.createdDate).toLocaleString() : "-" }}
          </td>
          <td class="p-2 text-center">
            <span v-if="approval.approvedBy?.name">{{ approval.approvedBy.name }}</span>
            <span v-else-if="approval.approvedBy">{{ approval.approvedBy }}</span>
            <span v-else class="text-yellow-600 font-semibold">⧖ Pending Tahap 1</span>
          </td>
          <td class="p-2 text-center text-sm">
            <span v-if="approval.approvedDate">{{
              new Date(approval.approvedDate).toLocaleString()
            }}</span>
            <span v-else class="text-yellow-600">-</span>
          </td>
          <td class="p-2 text-center">
            <UiButton @click="openApprovalModal(approval)" variant="success" size="sm">
              Approve Final
            </UiButton>
          </td>
        </tr>
      </tbody>
    </table>

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
