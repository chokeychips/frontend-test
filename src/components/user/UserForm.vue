<script setup>
import { ref } from "vue";
import Autocomplete from "@/components/Autocomplete.vue";
import {
  fetchRole,
  fetchBranch,
  fetchSegbis,
  fetchSupervisor,
  fetchChannel,
} from "@/services/userService";

// Fetch functions are imported from userService

const selectedRole = ref(null);
const selectedBranch = ref(null);
const selectedSegbis = ref(null);
const selectedSupervisor = ref(null);
const selectedChannel = ref(null);

const emit = defineEmits(["submit"]);

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
      <label class="block font-semibold mb-1" for="userName">Username</label>
      <input id="userName" v-model="form.userName" class="border p-2 w-full" />
    </div>

    <div>
      <label class="block font-semibold mb-1" for="password">Password</label>
      <input id="password" v-model="form.password" type="password" class="border p-2 w-full" />
    </div>

    <div>
      <label class="block font-semibold mb-1" for="name">Name</label>
      <input id="name" v-model="form.name" class="border p-2 w-full" />
    </div>

    <div>
      <label class="block font-semibold mb-1" for="hp">Phone</label>
      <input id="hp" v-model="form.hp" class="border p-2 w-full" />
    </div>

    <div>
      <label class="block font-semibold mb-1" for="nik">NIK</label>
      <input id="nik" v-model="form.nik" class="border p-2 w-full" />
      <p class="text-red-500 text-sm" v-if="errors.nik">{{ errors.nik }}</p>
    </div>

    <div>
      <label class="block font-semibold mb-1" for="email">Email</label>
      <input id="email" v-model="form.email" class="border p-2 w-full" />
      <p class="text-red-500 text-sm" v-if="errors.email">{{ errors.email }}</p>
    </div>

    <p class="text-red-500 text-sm" v-if="errors.idRole">{{ errors.idRole }}</p>
    <p class="text-red-500 text-sm" v-if="errors.idBranch">{{ errors.idBranch }}</p>
    <p class="text-red-500 text-sm" v-if="errors.idSegbis">{{ errors.idSegbis }}</p>
    <p class="text-red-500 text-sm" v-if="errors.idSupervisor">{{ errors.idSupervisor }}</p>
    <p class="text-red-500 text-sm" v-if="errors.idChannel">{{ errors.idChannel }}</p>

    <button @click="handleSubmit" class="bg-blue-500 text-white px-4 py-2">Submit</button>
  </div>
</template>
