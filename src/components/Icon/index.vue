<template>
  <i class="ym-icon" :class="{ [`ym-icon-${icon}`]: icon }" aria-hidden="true" @click="$emit('click', $event)"></i>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    }
  }
}
</script>
