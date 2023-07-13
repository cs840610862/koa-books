
<template>
  <BaseTable :df="df" />
</template>

<script setup lang='ts'>
import { books_define as df } from "@/db"
import BaseTable from "./BaseTable.vue"
</script>