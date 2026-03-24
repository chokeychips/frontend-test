import api from "./api";

// ambil list my task with pagination
export const getMyTaskList = async (page = 1, perPage = 10) => {
  return await api.get("/api/audittrail/task/maintenance/list", {
    params: {
      page: page,
      perPage: perPage,
    },
  });
};

// approve tahap 1
export const approveTask = async (id, reason = "Approved") => {
  return await api.post("/api/workflow/submit", {
    idAuditTrail: [id],
    reason: reason,
  });
};

// ambil list approval untuk Tahap 2 Final
export const getApprovalList = async (page = 1, perPage = 10) => {
  return await api.get("/api/audittrail/task/approval/list", {
    params: {
      page: page,
      perPage: perPage,
    },
  });
};

// approve final (Tahap 2)
export const processApproval = async (
  idAuditTrail,
  status = "approved",
  reason = "Final approval",
) => {
  return await api.post("/api/audittrail/task/approval/process", {
    idAuditTrail: idAuditTrail,
    status: status,
    reason: reason,
  });
};
