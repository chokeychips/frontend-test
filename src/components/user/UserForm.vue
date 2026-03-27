<script setup>
// component imports
import { ref } from "vue";
import Autocomplete from "@/components/Autocomplete.vue";
import { UiInput, UiButton } from "@/components/ui";
import {
  fetchRole,
  fetchBranch,
  fetchSegbis,
  fetchSupervisor,
  fetchChannel,
} from "@/services/userService";

// selected item refs
const selectedRole = ref(null);
const selectedBranch = ref(null);
const selectedSegbis = ref(null);
const selectedSupervisor = ref(null);
const selectedChannel = ref(null);

// emit events to parent
const emit = defineEmits(["submit"]);

// form state
const form = ref({
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

// validation logic
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

// select handlers
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

// submit handler
const handleSubmit = () => {
  if (!validate()) return;

  const payload = {
    userName: form.value.userName,
    password: form.value.password,
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

  emit("submit", payload);
};
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block font-semibold mb-1" for="role">Role</label>
      <Autocomplete id="role" :fetchData="fetchRole" @select="onRoleSelect" />
      <p class="text-sm text-gray-600">Selected role: {{ selectedRole?.name || "-" }}</p>
      <p class="text-red-500 text-sm" v-if="errors.idRole">{{ errors.idRole }}</p>
    </div>

    <div>
      <label class="block font-semibold mb-1" for="branch">Branch</label>
      <Autocomplete id="branch" :fetchData="fetchBranch" @select="onBranchSelect" />
      <p class="text-sm text-gray-600">Selected branch: {{ selectedBranch?.name || "-" }}</p>
      <p class="text-red-500 text-sm" v-if="errors.idBranch">{{ errors.idBranch }}</p>
    </div>

    <div>
      <label class="block font-semibold mb-1" for="segbis">Segmen Bisnis</label>
      <Autocomplete id="segbis" :fetchData="fetchSegbis" @select="onSegbisSelect" />
      <p class="text-sm text-gray-600">Selected segbis: {{ selectedSegbis?.name || "-" }}</p>
      <p class="text-red-500 text-sm" v-if="errors.idSegbis">{{ errors.idSegbis }}</p>
    </div>

    <div>
      <label class="block font-semibold mb-1" for="supervisor">Supervisor</label>
      <Autocomplete id="supervisor" :fetchData="fetchSupervisor" @select="onSupervisorSelect" />
      <p class="text-sm text-gray-600">
        Selected supervisor: {{ selectedSupervisor?.name || "-" }}
      </p>
      <p class="text-red-500 text-sm" v-if="errors.idSupervisor">{{ errors.idSupervisor }}</p>
    </div>

    <div>
      <label class="block font-semibold mb-1" for="channel">Channel</label>
      <Autocomplete id="channel" :fetchData="fetchChannel" @select="onChannelSelect" />
      <p class="text-sm text-gray-600">Selected channel: {{ selectedChannel?.name || "-" }}</p>
      <p class="text-red-500 text-sm" v-if="errors.idChannel">{{ errors.idChannel }}</p>
    </div>

    <div>
      <UiInput
        id="userName"
        v-model="form.userName"
        label="Username"
        placeholder="Masukkan username"
        required
      />
    </div>

    <div>
      <UiInput
        id="password"
        type="password"
        v-model="form.password"
        label="Password"
        placeholder="Masukkan password"
      />
    </div>

    <div>
      <UiInput id="name" v-model="form.name" label="Name" placeholder="Masukkan nama" />
    </div>

    <div>
      <UiInput id="hp" v-model="form.hp" label="Phone" placeholder="Masukkan nomor telepon" />
    </div>

    <div>
      <UiInput id="nik" v-model="form.nik" label="NIK" placeholder="Masukkan NIK" />
      <p class="text-red-500 text-sm" v-if="errors.nik">{{ errors.nik }}</p>
    </div>

    <div>
      <UiInput id="email" v-model="form.email" label="Email" placeholder="Masukkan email" />
      <p class="text-red-500 text-sm" v-if="errors.email">{{ errors.email }}</p>
    </div>

    <p class="text-red-500 text-sm" v-if="errors.idRole">{{ errors.idRole }}</p>
    <p class="text-red-500 text-sm" v-if="errors.idBranch">{{ errors.idBranch }}</p>
    <p class="text-red-500 text-sm" v-if="errors.idSegbis">{{ errors.idSegbis }}</p>
    <p class="text-red-500 text-sm" v-if="errors.idSupervisor">{{ errors.idSupervisor }}</p>
    <p class="text-red-500 text-sm" v-if="errors.idChannel">{{ errors.idChannel }}</p>

    <UiButton @click="handleSubmit" variant="primary">Submit</UiButton>
  </div>
</template>
