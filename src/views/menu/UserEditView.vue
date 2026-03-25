<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import UserEditForm from "@/components/user/UserEditForm.vue";
import { updateUser, getUserList } from "@/services/userService";
import { approveTask } from "@/services/workflowService";

const router = useRouter();
const route = useRoute();

const user = ref(null);
const loading = ref(true);
const error = ref("");

const fetchUser = async (id) => {
  try {
    loading.value = true;
    error.value = "";
    console.log("[USER] Fetching user with ID from URL:", id, "Type:", typeof id);

    // Since we don't have a single user API, we'll fetch all users and find the one we need
    const res = await getUserList({ page: 1, perPage: 1000 }); // Fetch more to find the user
    console.log("[USER] Fetched user list count:", res.data.data.length);
    console.log("[USER] First user in list:", res.data.data[0]);

    const foundUser = res.data.data.find((u) => u.id == id);
    console.log("[USER] Found user:", foundUser);

    if (foundUser) {
      user.value = foundUser;
      console.log("[USER] Loaded user data:", foundUser);
    } else {
      error.value = "User tidak ditemukan";
      console.error("[USER] User not found. Searching by different ID fields:");
      // Try alternative ID fields
      res.data.data.forEach((u, idx) => {
        console.log(`[USER] User ${idx}:`, {
          id: u.idUser,
          userName: u.userName,
          name: u.name,
        });
      });
    }
  } catch (err) {
    console.error("[USER] Fetch user error:", err);
    error.value = err.response?.data?.message || "Gagal memuat data user";
  } finally {
    loading.value = false;
  }
};

const handleEditSubmit = async (data) => {
  try {
    console.log("[USER] Submitting user edit with ID:", data.id);
    console.log("[USER] Submitting user edit data:", JSON.stringify(data, null, 2));

    const updateResponse = await updateUser(data.id, data);
    console.log("[USER] Update response:", updateResponse);
    console.log("[USER] Update response full data:", JSON.stringify(updateResponse.data, null, 2));

    // Check if API returned an error (status: false)
    if (updateResponse.data?.status === false) {
      const errorMsg = updateResponse.data?.message || "API returned error";
      console.error("[USER] API Error:", errorMsg);
      console.error("[USER] API Error data:", JSON.stringify(updateResponse.data, null, 2));
      alert("❌ Gagal update user: " + errorMsg);
      return;
    }

    alert("✅ User berhasil diperbarui");

    // Try to extract audit trail ID from various possible response paths
    let auditTrailId = null;

    if (updateResponse.data?.data?.idAuditTrail) {
      auditTrailId = updateResponse.data.data.idAuditTrail;
    } else if (updateResponse.data?.idAuditTrail) {
      auditTrailId = updateResponse.data.idAuditTrail;
    } else if (
      updateResponse.data?.data?.id &&
      Array.isArray(updateResponse.data?.data?.auditTrail)
    ) {
      auditTrailId = updateResponse.data.data.auditTrail[0]?.id;
    } else if (updateResponse.data?.auditTrailId) {
      auditTrailId = updateResponse.data.auditTrailId;
    }

    console.log("[USER] Extracted auditTrailId:", auditTrailId);

    // Try to submit to workflow if audit trail ID found
    if (auditTrailId) {
      try {
        console.log("[USER] Submitting to workflow with ID:", auditTrailId);
        await approveTask(auditTrailId, "User updated and approved");
        alert("✅ User update berhasil masuk ke workflow!");
      } catch (workflowErr) {
        console.error("[USER] Workflow submit error:", workflowErr);
        console.error("[USER] Workflow error details:", workflowErr.response?.data);
        alert(
          "⚠️ User diperbarui tapi gagal submit ke workflow: " +
            (workflowErr.response?.data?.message || workflowErr.message),
        );
      }
    } else {
      console.warn("[USER] No audit trail ID found in response, workflow submission skipped");
      alert("⚠️ User berhasil diperbarui tapi tidak ada audit trail untuk workflow");
    }

    setTimeout(() => router.push("/dashboard/users"), 1000);
  } catch (err) {
    console.error("[USER] Update error:", err);
    console.error("[USER] Update error response:", JSON.stringify(err.response?.data, null, 2));
    const errorMsg = err.response?.data?.message || "Gagal update user";
    alert(errorMsg);
  }
};

const handleEditCancel = () => {
  router.push("/dashboard/users");
};

onMounted(() => {
  const userId = route.params.id;
  if (userId) {
    fetchUser(userId);
  } else {
    error.value = "ID user tidak ditemukan";
    loading.value = false;
  }
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">Edit User</h1>

    <!-- Loading -->
    <p v-if="loading" class="text-center py-4">Loading...</p>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      ❌ {{ error }}
    </div>

    <div v-if="!loading && !error && user" class="bg-white p-6 rounded-lg shadow">
      <UserEditForm :user="user" @submit="handleEditSubmit" @cancel="handleEditCancel" />
    </div>
  </div>
</template>
