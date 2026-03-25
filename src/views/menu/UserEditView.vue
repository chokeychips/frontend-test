<script setup>
// imports
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import UserEditForm from "@/components/user/UserEditForm.vue";
import { updateUser, getUserList } from "@/services/userService";
import { approveTask } from "@/services/workflowService";

// router and route
const router = useRouter();
const route = useRoute();

// state refs
const user = ref(null);
const loading = ref(true);
const error = ref("");

// load user detail based on route param
const fetchUser = async (id) => {
  try {
    loading.value = true;
    error.value = "";

    const res = await getUserList({ page: 1, perPage: 1000 });
    const foundUser = res.data.data.find((u) => u.id == id || u.idUser == id);

    if (foundUser) {
      user.value = foundUser;
    } else {
      error.value = "User tidak ditemukan";
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Gagal memuat data user";
  } finally {
    loading.value = false;
  }
};

// submit edited user data
const handleEditSubmit = async (data) => {
  try {
    const updateResponse = await updateUser(data.id, data);

    if (updateResponse.data?.status === false) {
      const errorMsg = updateResponse.data?.message || "API returned error";
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

    // extract audit trail id from response
    if (auditTrailId) {
      try {
        await approveTask(auditTrailId, "User edit request approved");
        alert("✅ User berhasil diperbarui dan workflow disubmit");
      } catch (workflowErr) {
        alert(
          "⚠️ User diperbarui, tapi gagal submit ke workflow: " +
            (workflowErr.response?.data?.message || workflowErr.message),
        );
      }
    } else {
      alert(
        "⚠️ User berhasil diperbarui, tapi auditTrailId tidak ditemukan (workflow tidak dijalankan)",
      );
    }

    setTimeout(() => router.push("/dashboard/users"), 1000);
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Gagal update user";
    alert(errorMsg);
  }
};

// cancel action
const handleEditCancel = () => {
  router.push("/dashboard/users");
};

// init load user
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
