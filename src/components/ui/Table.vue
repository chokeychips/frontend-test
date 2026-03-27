<script setup>
import { computed } from "vue";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every((col) => col.key && col.label);
    },
  },
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyMessage: {
    type: String,
    default: "Tidak ada data",
  },
  showActions: {
    type: Boolean,
    default: false,
  },
  actionsLabel: {
    type: String,
    default: "Aksi",
  },
});

const emit = defineEmits(["action"]);

const hasData = computed(() => {
  return !props.loading && props.data.length > 0;
});

const isEmpty = computed(() => {
  return !props.loading && props.data.length === 0;
});

const handleAction = (action, item, index) => {
  emit("action", { action, item, index });
};
</script>

<template>
  <div class="w-full">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading...</p>
    </div>

    <!-- Table -->
    <div v-if="hasData" class="overflow-x-auto">
      <table class="w-full border border-gray-300 text-sm">
        <thead>
          <tr class="bg-gray-100">
            <th
              v-for="column in columns"
              :key="column.key"
              class="p-3 text-center font-semibold text-gray-700 border-b"
            >
              {{ column.label }}
            </th>
            <th v-if="showActions" class="p-3 text-center font-semibold text-gray-700 border-b">
              {{ actionsLabel }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in data"
            :key="item.id || index"
            class="hover:bg-gray-50 even:bg-gray-25"
          >
            <td v-for="column in columns" :key="column.key" class="p-3 border-b text-center">
              <slot
                :name="column.key"
                :item="item"
                :value="getNestedValue(item, column.key)"
                :index="index"
              >
                {{ formatValue(getNestedValue(item, column.key), column) }}
              </slot>
            </td>
            <td v-if="showActions" class="p-3 border-b text-center">
              <slot name="actions" :item="item" :index="index">
                <!-- Default actions slot -->
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div
      v-if="isEmpty"
      class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
    >
      <div class="text-gray-400 mb-2">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <p class="text-gray-500 font-medium">{{ emptyMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "UiTable",
  methods: {
    getNestedValue(obj, path) {
      return path.split(".").reduce((current, key) => current?.[key], obj) || "-";
    },

    formatValue(value, column) {
      if (value === null || value === undefined || value === "") {
        return "-";
      }

      // Handle date formatting
      if (column.type === "date" && value) {
        return new Date(value).toLocaleDateString();
      }

      // Handle datetime formatting
      if (column.type === "datetime" && value) {
        return new Date(value).toLocaleString();
      }

      return value;
    },
  },
};
</script>
