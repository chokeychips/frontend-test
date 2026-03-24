import api from "./api";

export const getUserList = async (params) => {
  return await api.get("/api/user/list", { params });
};

export const createUser = async (payload) => {
  const res = await api.post("/api/user/create", payload);
  return res;
};

export const updateUser = async (id, payload) => {
  const requestBody = {
    idUser: id,
    userName: payload.userName,
    password: payload.password,
    name: payload.name,
    hp: payload.hp,
    nik: payload.nik,
    email: payload.email,
    idSegbis: payload.idSegbis,
    idRole: payload.idRole,
    idBranch: payload.idBranch,
    idSupervisor: payload.idSupervisor,
    idChannel: payload.idChannel,
  };

  const res = await api.post("/api/user/edit", requestBody);
  return res;
};
