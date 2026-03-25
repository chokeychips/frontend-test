import api from "./api";

export const getUserList = async (params) => {
  return await api.get("/api/user/list", { params });
};

export const createUser = async (payload) => {
  const requestBody = {
    userName: payload.userName || "",
    password: payload.password || "",
    name: payload.name || "",
    hp: payload.hp || "",
    nik: payload.nik || "",
    email: payload.email || "",
    idSegbis: parseInt(payload.idSegbis) || 0,
    idRole: parseInt(payload.idRole) || 0,
    idBranch: parseInt(payload.idBranch) || 0,
    idSupervisor: parseInt(payload.idSupervisor) || 0,
    idChannel: parseInt(payload.idChannel) || 0,
  };

  console.log("[USER_SERVICE] Create user with data:", requestBody);
  const res = await api.post("/api/user/create", requestBody);
  return res;
};

export const updateUser = async (id, payload) => {
  const requestBody = {
    idUser: parseInt(id),
    userName: payload.userName,
    password: payload.password,
    name: payload.name,
    hp: payload.hp,
    nik: payload.nik,
    email: payload.email,
    idSegbis: parseInt(payload.idSegbis),
    idRole: parseInt(payload.idRole),
    idBranch: parseInt(payload.idBranch),
    idSupervisor: parseInt(payload.idSupervisor),
    idChannel: parseInt(payload.idChannel),
  };

  console.log("[USER_SERVICE] Updating user with idUser:", id);
  console.log("[USER_SERVICE] Full request body:", JSON.stringify(requestBody, null, 2));

  const res = await api.post("/api/user/edit", requestBody);
  return res;
};

export const fetchRole = async (search) => {
  return await api.get("/api/role/list", {
    params: {
      search,
      page: 1,
      perPage: 10,
    },
  });
};

export const fetchBranch = async (search) => {
  return await api.get("/api/branch/list", {
    params: {
      search,
      page: 1,
      perPage: 10,
    },
  });
};

export const fetchSegbis = async (search) => {
  const keyword = search?.trim() || "";

  return await api.get("/api/reference/segment-business", {
    params: {
      keyword,
      page: 1,
      perPage: 10,
      filter: JSON.stringify({ keyword, page: 1, perPage: 10 }),
    },
  });
};

export const fetchSupervisor = async (search) => {
  const keyword = search?.trim() || "";

  const response = await api.get("/api/reference/supervisor", {
    params: {
      search: keyword,
      page: 1,
      perPage: 10,
      filter: JSON.stringify({ keyword, page: 1, perPage: 10 }),
    },
  });

  // Normalize supervisor data - response has nested status object
  if (response.data?.data && Array.isArray(response.data.data)) {
    response.data.data = response.data.data.map((item) => ({
      ...item,
      name: item.name || item.status?.name || `ID: ${item.id}`,
    }));
  }
  return response;
};

export const fetchChannel = async (search) => {
  return await api.get("/api/channel/list", {
    params: {
      search,
      page: 1,
      perPage: 10,
    },
  });
};
