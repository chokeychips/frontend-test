<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  fetchData: Function,
  selectedItem: Object,
});

const emit = defineEmits(["select"]);

const search = ref("");
const options = ref([]);
const show = ref(false);

let timeout = null;

// Watch for selectedItem changes to set initial value
watch(
  () => props.selectedItem,
  (newItem) => {
    if (newItem) {
      search.value = newItem.name || "";
    } else {
      search.value = "";
    }
  },
  { immediate: true },
);

const handleSearch = () => {
  clearTimeout(timeout);

  if (!search.value) {
    options.value = [];
    return;
  }

  timeout = setTimeout(async () => {
    try {
      const res = await props.fetchData(search.value);

      // Support multiple API response shapes
      options.value =
        res.data?.data ||
        res.data?.data?.data ||
        res.data?.data?.items ||
        res.data?.data?.rows ||
        res.data?.items ||
        res.data?.rows ||
        res.data ||
        [];

      // Some reference endpoints wrap data in `data` object with list in data.data
      if (Array.isArray(options.value) === false && Array.isArray(res.data?.data?.data)) {
        options.value = res.data.data.data;
      }

      if (!Array.isArray(options.value)) {
        console.warn("[AUTOCOMPLETE] Unexpected response shape:", res.data);
        options.value = [];
      }
    } catch (err) {
      console.error("[AUTOCOMPLETE] Error fetching options:", err);
      options.value = [];
    }
  }, 500);
};

const handleSelect = (item) => {
  emit("select", item);
  search.value = item.name || "";
  show.value = false;
};

const hideDropdown = () => {
  window.setTimeout(() => {
    show.value = false;
  }, 200);
};
</script>

<template>
  <div class="relative">
    <input
      v-model="search"
      @focus="show = true"
      @blur="hideDropdown"
      @input="handleSearch"
      class="border p-2 w-full"
      placeholder="Search..."
    />

    <div
      v-if="show && search.length > 0"
      class="absolute bg-white border w-full max-h-40 overflow-auto z-10"
    >
      <div v-if="options.length === 0" class="p-2 text-gray-500">Tidak ada hasil</div>

      <div
        v-for="item in options"
        :key="item.id"
        @mousedown="handleSelect(item)"
        class="p-2 hover:bg-gray-200 cursor-pointer"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
