<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  fetchData: Function,
  selectedItem: Object,
});

const emit = defineEmits(["select"]);

const search = ref("");
const options = ref([]);
const allOptions = ref([]);
const show = ref(false);
const isLoading = ref(false);
const loaded = ref(false);

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

const normalizeResponse = (res) => {
  let val =
    res?.data?.data ||
    res?.data?.data?.data ||
    res?.data?.data?.items ||
    res?.data?.data?.rows ||
    res?.data?.items ||
    res?.data?.rows ||
    res?.data ||
    [];

  if (!Array.isArray(val) && Array.isArray(res?.data?.data)) {
    val = res.data.data;
  }

  if (!Array.isArray(val)) {
    console.warn("[AUTOCOMPLETE] Unexpected response shape:", res?.data);
    val = [];
  }

  return val;
};

const loadAllOptions = async () => {
  if (loaded.value) return;

  isLoading.value = true;

  try {
    const res = await props.fetchData("");
    allOptions.value = normalizeResponse(res);
    loaded.value = true;
    filterOptions();
  } catch (err) {
    console.error("[AUTOCOMPLETE] Error loading all options:", err);
    allOptions.value = [];
    options.value = [];
  } finally {
    isLoading.value = false;
  }
};

const filterOptions = () => {
  const q = String(search.value || "")
    .trim()
    .toLowerCase();

  if (!q) {
    options.value = [...allOptions.value];
    return;
  }

  options.value = allOptions.value.filter((item) => {
    const values = [item.name, item.label, item.title, item.email, item.username, item.code, ""]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return values.includes(q);
  });
};

const handleSearch = () => {
  clearTimeout(timeout);

  timeout = setTimeout(async () => {
    if (!loaded.value) {
      await loadAllOptions();
      return;
    }

    filterOptions();
  }, 250);
};

const handleSelect = (item) => {
  emit("select", item);
  search.value = item.name || item.label || item.title || "";
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
      @focus="
        show = true;
        handleSearch();
      "
      @blur="hideDropdown"
      @input="handleSearch"
      class="border p-2 w-full"
      placeholder="Search..."
    />

    <div v-if="show" class="absolute bg-white border w-full max-h-40 overflow-auto z-10">
      <div v-if="isLoading" class="p-2 text-gray-500">Memuat...</div>
      <div v-else-if="options.length === 0" class="p-2 text-gray-500">Tidak ada hasil</div>

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
