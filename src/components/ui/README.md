# UI Components

This directory contains reusable UI components for the application.

## Components

### UiTable

A flexible table component with support for:

- Custom columns with nested data access
- Loading states
- Empty states
- Actions column with slots
- Automatic formatting for dates

**Usage:**

```vue
<template>
  <UiTable
    :columns="columns"
    :data="items"
    :loading="loading"
    empty-message="No data found"
    show-actions
    @action="handleAction"
  >
    <template #actions="{ item }">
      <UiButton @click="edit(item)">Edit</UiButton>
    </template>
  </UiTable>
</template>

<script setup>
const columns = [
  { key: "name", label: "Name" },
  { key: "user.email", label: "Email" },
  { key: "createdAt", label: "Created", type: "datetime" },
];
</script>
```

### UiModal

A modal dialog component with:

- Multiple sizes (sm, md, lg, xl, full)
- Loading states
- Custom footer with slots
- Backdrop click and escape key handling
- Smooth animations

**Usage:**

```vue
<template>
  <UiModal
    :show="showModal"
    title="Confirm Action"
    size="md"
    @close="showModal = false"
    @confirm="handleConfirm"
  >
    <p>Are you sure you want to proceed?</p>

    <template #footer>
      <UiButton @click="showModal = false">Cancel</UiButton>
      <UiButton variant="danger" @click="handleConfirm">Delete</UiButton>
    </template>
  </UiModal>
</template>
```

### UiButton

A button component with:

- Multiple variants (primary, secondary, success, danger, etc.)
- Sizes (sm, md, lg)
- Loading states with spinner
- Block/full width option

**Usage:**

```vue
<template>
  <UiButton variant="primary" size="md" :loading="submitting" @click="submit">
    Save Changes
  </UiButton>
</template>
```

### UiInput

An input component with:

- Label support
- Error states
- Required field indicator
- Multiple sizes

**Usage:**

```vue
<template>
  <UiInput
    v-model="email"
    label="Email Address"
    type="email"
    :error="errors.email"
    required
  />
</template>
```

### UiTextarea

A textarea component with:

- Label support
- Error states
- Configurable rows
- Multiple sizes

**Usage:**

```vue
<template>
  <UiTextarea
    v-model="description"
    label="Description"
    :rows="4"
    placeholder="Enter description..."
  />
</template>
```

## Importing Components

You can import individual components:

```js
import { UiTable, UiModal } from "@/components/ui";
```

Or import all from the index:

```js
import * as UI from "@/components/ui";
```

## Benefits

- **Consistency**: All components follow the same design patterns
- **Maintainability**: Changes to component behavior affect the entire app
- **Reusability**: Components can be used across different views
- **Accessibility**: Components include proper ARIA attributes and keyboard navigation
- **Performance**: Components are optimized with proper Vue patterns</content>
  <parameter name="filePath">d:\Project\skyworx-test\src\components\ui\README.md
