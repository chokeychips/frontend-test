<script setup>
import { ref, watch } from "vue";
import Autocomplete from "@/components/Autocomplete.vue";
import { UiInput, UiButton } from "@/components/ui";
import {
  fetchRole,
  fetchBranch,
  fetchSegbis,
  fetchSupervisor,
  fetchChannel,
} from "@/services/userService";

// Fetch functions are imported from userService

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

// load user data into local form model
const loadUser = (u) => {
  if (!u) return;
  form.value.id = u.id || u.idUser || u.userId || 0;
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

  // Set selected items - if object exists, use it; otherwise create placeholder
  selectedRole.value = u.role || (u.idRole ? { id: u.idRole, name: `Role ID: ${u.idRole}` } : null);
  selectedBranch.value =
    u.branch || (u.idBranch ? { id: u.idBranch, name: `Branch ID: ${u.idBranch}` } : null);
  selectedSegbis.value =
    u.segbis || (u.idSegbis ? { id: u.idSegbis, name: `Segbis ID: ${u.idSegbis}` } : null);
  selectedSupervisor.value =
    u.supervisor ||
    (u.idSupervisor ? { id: u.idSupervisor, name: `Supervisor ID: ${u.idSupervisor}` } : null);
  selectedChannel.value =
    u.channel || (u.idChannel ? { id: u.idChannel, name: `Channel ID: ${u.idChannel}` } : null);
};

// watch user prop for changes
watch(
  () => props.user,
  (newVal) => {
    loadUser(newVal);
  },
  { immediate: true },
);

// validate current form values
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

  // submit payload to parent component
  emit("submit", payload);
};
</script>

<template>
  <div class="space-y-3">
    <h2 class="text-lg font-bold">Edit User</h2>
    <div>
      <label class="block font-semibold mb-1">Role</label>
      <Autocomplete :fetchData="fetchRole" :selectedItem="selectedRole" @select="onRoleSelect" />
      <p class="text-red-500 text-sm" v-if="errors.idRole">{{ errors.idRole }}</p>
    </div>

    <div>
      <label class="block font-semibold mb-1">Branch</label>
      <Autocomplete
        :fetchData="fetchBranch"
        :selectedItem="selectedBranch"
        @select="onBranchSelect"
      />
      <p class="text-red-500 text-sm" v-if="errors.idBranch">{{ errors.idBranch }}</p>
    </div>

    <div>
      <label class="block font-semibold mb-1">Segmen Bisnis</label>
      <Autocomplete
        :fetchData="fetchSegbis"
        :selectedItem="selectedSegbis"
        @select="onSegbisSelect"
      />
      <p class="text-red-500 text-sm" v-if="errors.idSegbis">{{ errors.idSegbis }}</p>
    </div>

    <div>
      <label class="block font-semibold mb-1">Supervisor</label>
      <Autocomplete
        :fetchData="fetchSupervisor"
        :selectedItem="selectedSupervisor"
        @select="onSupervisorSelect"
      />
      <p class="text-red-500 text-sm" v-if="errors.idSupervisor">{{ errors.idSupervisor }}</p>
    </div>

    <div>
      <label class="block font-semibold mb-1">Channel</label>
      <Autocomplete
        :fetchData="fetchChannel"
        :selectedItem="selectedChannel"
        @select="onChannelSelect"
      />
      <p class="text-red-500 text-sm" v-if="errors.idChannel">{{ errors.idChannel }}</p>
    </div>

    <div>
      <UiInput v-model="form.userName" label="Username" placeholder="Masukkan username" required />
    </div>
    <div>
      <UiInput
        v-model="form.password"
        type="password"
        label="Password (biarkan kosong jika tidak diubah)"
        placeholder="Masukkan password"
      />
    </div>
    <div>
      <UiInput v-model="form.name" label="Name" placeholder="Masukkan nama" />
    </div>
    <div>
      <UiInput v-model="form.hp" label="Phone" placeholder="Masukkan nomor telepon" />
    </div>
    <div>
      <UiInput v-model="form.nik" label="NIK" placeholder="Masukkan NIK" />
      <p class="text-red-500 text-sm" v-if="errors.nik">{{ errors.nik }}</p>
    </div>
    <div>
      <UiInput v-model="form.email" label="Email" placeholder="Masukkan email" />
      <p class="text-red-500 text-sm" v-if="errors.email">{{ errors.email }}</p>
    </div>

    <div class="flex gap-2">
      <UiButton @click="handleSubmit" variant="primary"> Save Changes </UiButton>
      <UiButton @click="emit('cancel')" variant="secondary"> Cancel </UiButton>
    </div>
  </div>
</template>
