
<template>
  <BaseTable :df="df" />
</template>

<script setup lang='ts'>
import { users_define as df } from "@/db"
import BaseTable from "./BaseTable.vue"
</script>