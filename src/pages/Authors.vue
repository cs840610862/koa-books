
<template>
  <BaseTable :df="df" />
</template>

<script setup lang='ts'>
import { authors_define as df } from "@/db"
import BaseTable from "./BaseTable.vue"
</script>