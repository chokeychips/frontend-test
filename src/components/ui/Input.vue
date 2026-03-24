<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
});

const emit = defineEmits(["update:modelValue", "input", "blur", "focus"]);

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-4 py-3 text-base",
};

const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
  emit("input", event);
};

const handleBlur = (event) => {
  emit("blur", event);
};

const handleFocus = (event) => {
  emit("focus", event);
};
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="`input-${_uid}`" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <input
      :id="`input-${_uid}`"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="[
        'w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors',
        sizeClasses[size],
        error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300',
      ]"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>
