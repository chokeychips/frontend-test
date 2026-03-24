<script setup>
import { ref, watch } from "vue";
import Autocomplete from "@/components/Autocomplete.vue";
import api from "@/services/api";
import { updateUser } from "@/services/userService";

const fetchRole = (search) => {
  return api.get("/api/role/list", {
    params: {
      search,
      page: 1,
      perPage: 10,
    },
  });
};

const fetchBranch = (search) => {
  return api.get("/api/branch/list", {
    params: {
      search,
      page: 1,
      perPage: 10,
    },
  });
};

const fetchSegbis = (search) => {
  const keyword = search?.trim() || "";
  return api.get("/api/reference/segment-business", {
    params: {
      keyword,
      page: 1,
      perPage: 10,
      filter: JSON.stringify({ keyword, page: 1, perPage: 10 }),
    },
  });
};

const fetchSupervisor = (search) => {
  const keyword = search?.trim() || "";

  return api
    .get("/api/reference/supervisor", {
      params: {
        search: keyword,
        page: 1,
        perPage: 10,
        filter: JSON.stringify({ keyword, page: 1, perPage: 10 }),
      },
    })
    .then((res) => {
      if (res.data?.data && Array.isArray(res.data.data)) {
        res.data.data = res.data.data.map((item) => ({
          ...item,
          name: item.name || item.status?.name || `ID: ${item.id}`,
        }));
      }
      return res;
    });
};

const fetchChannel = (search) => {
  return api.get("/api/channel/list", {
    params: {
      search,
      page: 1,
      perPage: 10,
    },
  });
};

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["submit", "cancel"]);

const selectedRole = ref(null);
const selectedBranch = ref(null);
const selectedSegbis = ref(null);
const selectedSupervisor = ref(null);
const selectedChannel = ref(null);

const form = ref({
  id: 0,
  userName: "",
  password: "",
  name: "",
  hp: "",
  nik: "",
  email: "",
  idRole: null,
  idBranch: null,
  idSegbis: null,
  idSupervisor: 0,
  idChannel: 0,
});

const errors = ref({});

const loadUser = (u) => {
  if (!u) return;
  form.value.id = u.id;
  form.value.userName = u.userName || u.username || "";
  form.value.password = "";
  form.value.name = u.name || "";
  form.value.hp = u.hp || "";
  form.value.nik = u.nik || "";
  form.value.email = u.email || "";
  form.value.idRole = u.idRole || u.roleId || null;
  form.value.idBranch = u.idBranch || null;
  form.value.idSegbis = u.idSegbis || null;
  form.value.idSupervisor = u.idSupervisor || 0;
  form.value.idChannel = u.idChannel || 0;

  selectedRole.value = u.role || null;
  selectedBranch.value = u.branch || null;
  selectedSegbis.value = u.segbis || null;
  selectedSupervisor.value = u.supervisor || null;
  selectedChannel.value = u.channel || null;
};

watch(
  () => props.user,
  (newVal) => {
    loadUser(newVal);
  },
  { immediate: true },
);

const validate = () => {
  errors.value = {};

  if (form.value.nik.length !== 16) {
    errors.value.nik = "NIK harus 16 digit";
  }

  if (!form.value.email.includes("@")) {
    errors.value.email = "Email tidak valid";
  }

  if (!form.value.idRole) {
    errors.value.idRole = "Role wajib dipilih";
  }

  if (!form.value.idBranch) {
    errors.value.idBranch = "Branch wajib dipilih";
  }

  if (!form.value.idSegbis) {
    errors.value.idSegbis = "Segmen Bisnis wajib dipilih";
  }

  if (!form.value.idSupervisor) {
    errors.value.idSupervisor = "Supervisor wajib dipilih";
  }

  if (!form.value.idChannel) {
    errors.value.idChannel = "Channel wajib dipilih";
  }

  return Object.keys(errors.value).length === 0;
};

const onRoleSelect = (val) => {
  selectedRole.value = val;
  form.value.idRole = val?.id || val?.idRole || null;
};
const onBranchSelect = (val) => {
  selectedBranch.value = val;
  form.value.idBranch = val?.id || val?.idBranch || null;
};
const onSegbisSelect = (val) => {
  selectedSegbis.value = val;
  form.value.idSegbis = val?.id || val?.idSegbis || null;
};
const onSupervisorSelect = (val) => {
  selectedSupervisor.value = val;
  form.value.idSupervisor = val?.id || val?.idSupervisor || null;
};
const onChannelSelect = (val) => {
  selectedChannel.value = val;
  form.value.idChannel = val?.id || val?.idChannel || null;
};

const handleSubmit = async () => {
  if (!validate()) return;

  const payload = {
    id: form.value.id,
    userName: form.value.userName,
    password: form.value.password || undefined,
    name: form.value.name,
    hp: form.value.hp,
    nik: form.value.nik,
    email: form.value.email,
    idSegbis: form.value.idSegbis || 0,
    idRole: form.value.idRole || 0,
    idBranch: form.value.idBranch || 0,
    idSupervisor: form.value.idSupervisor || 0,
    idChannel: form.value.idChannel || 0,
  };

  await updateUser(form.value.id, payload);
  emit("submit", payload);
};
</script>

<template>
  <div class="space-y-3">
    <h2 class="text-lg font-bold">Edit User</h2>
    <div>
      <label class="block font-semibold mb-1">Role</label>
      <Autocomplete :fetchData="fetchRole" @select="onRoleSelect" />
      <p class="text-red-500 text-sm" v-if="errors.idRole">{{ errors.idRole }}</p>
    </div>

    <div>
      <label class="block font-semibold mb-1">Branch</label>
      <Autocomplete :fetchData="fetchBranch" @select="onBranchSelect" />
      <p class="text-red-500 text-sm" v-if="errors.idBranch">{{ errors.idBranch }}</p>
    </div>

    <div>
      <label class="block font-semibold mb-1">Segmen Bisnis</label>
      <Autocomplete :fetchData="fetchSegbis" @select="onSegbisSelect" />
      <p class="text-red-500 text-sm" v-if="errors.idSegbis">{{ errors.idSegbis }}</p>
    </div>

    <div>
      <label class="block font-semibold mb-1">Supervisor</label>
      <Autocomplete :fetchData="fetchSupervisor" @select="onSupervisorSelect" />
      <p class="text-red-500 text-sm" v-if="errors.idSupervisor">{{ errors.idSupervisor }}</p>
    </div>

    <div>
      <label class="block font-semibold mb-1">Channel</label>
      <Autocomplete :fetchData="fetchChannel" @select="onChannelSelect" />
      <p class="text-red-500 text-sm" v-if="errors.idChannel">{{ errors.idChannel }}</p>
    </div>

    <div>
      <label class="block font-semibold mb-1">Username</label>
      <input v-model="form.userName" class="border p-2 w-full" />
    </div>
    <div>
      <label class="block font-semibold mb-1">Password (biarkan kosong jika tidak diubah)</label>
      <input type="password" v-model="form.password" class="border p-2 w-full" />
    </div>
    <div>
      <label class="block font-semibold mb-1">Name</label>
      <input v-model="form.name" class="border p-2 w-full" />
    </div>
    <div>
      <label class="block font-semibold mb-1">Phone</label>
      <input v-model="form.hp" class="border p-2 w-full" />
    </div>
    <div>
      <label class="block font-semibold mb-1">NIK</label>
      <input v-model="form.nik" class="border p-2 w-full" />
      <p class="text-red-500 text-sm" v-if="errors.nik">{{ errors.nik }}</p>
    </div>
    <div>
      <label class="block font-semibold mb-1">Email</label>
      <input v-model="form.email" class="border p-2 w-full" />
      <p class="text-red-500 text-sm" v-if="errors.email">{{ errors.email }}</p>
    </div>

    <div class="flex gap-2">
      <button
        @click="handleSubmit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save Changes
      </button>
      <button
        @click="emit('cancel')"
        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
