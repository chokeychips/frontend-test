<script setup>
import { useRouter } from "vue-router";
import UserForm from "@/components/user/UserForm.vue";
import { createUser } from "@/services/userService";
import { approveTask } from "@/services/workflowService";

const router = useRouter();

const handleCreate = async (data) => {
  try {
    console.log("[USER] Submitting user create data:", data);

    const createResponse = await createUser(data);
    console.log("[USER] Create response:", createResponse);
    console.log("[USER] Create response data:", createResponse.data);

    // Check if API returned an error (status: false)
    if (createResponse.data?.status === false) {
      const errorMsg = createResponse.data?.message || "API returned error";
      console.error("[USER] API Error:", errorMsg);
      alert("❌ Gagal create user: " + errorMsg);
      return;
    }

    alert("✅ User berhasil dibuat");

    // Try to extract audit trail ID from various possible response paths
    let auditTrailId = null;

    if (createResponse.data?.data?.idAuditTrail) {
      auditTrailId = createResponse.data.data.idAuditTrail;
    } else if (createResponse.data?.idAuditTrail) {
      auditTrailId = createResponse.data.idAuditTrail;
    } else if (
      createResponse.data?.data?.id &&
      Array.isArray(createResponse.data?.data?.auditTrail)
    ) {
      auditTrailId = createResponse.data.data.auditTrail[0]?.id;
    } else if (createResponse.data?.auditTrailId) {
      auditTrailId = createResponse.data.auditTrailId;
    }

    console.log("[USER] Extracted auditTrailId:", auditTrailId);

    // Always try to submit to workflow, even if we extracted audit trail ID
    if (auditTrailId) {
      try {
        console.log("[USER] Submitting to workflow with ID:", auditTrailId);
        await approveTask(auditTrailId, "New user created and approved");
        alert("✅ User berhasil dibuat dan masuk ke workflow!");
      } catch (workflowErr) {
        console.error("[USER] Workflow submit error:", workflowErr);
        console.error("[USER] Workflow error details:", workflowErr.response?.data);
        alert(
          "⚠️ User dibuat tapi gagal submit ke workflow: " +
            (workflowErr.response?.data?.message || workflowErr.message),
        );
      }
    } else {
      console.warn("[USER] No audit trail ID found in response, workflow submission skipped");
    }

    setTimeout(() => router.push("/dashboard/users"), 1000);
  } catch (err) {
    console.error("[USER] Create error:", err);
    console.error("[USER] Create error details:", err.response?.data);
    const errorMsg = err.response?.data?.message || "Gagal create user";
    alert(errorMsg);
  }
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">Create New User</h1>
    <div class="bg-white p-6 rounded-lg shadow">
      <UserForm @submit="handleCreate" />
    </div>
  </div>
</template>
