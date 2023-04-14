<template>
    <h2 class="my-3">{{transit?.name}}</h2>
    <div class="mb-5" v-html="transit?.birthmapText" />
    <!-- Detalhamento dos planetas -->
    <div v-if="hasPlanets" >
      <div v-for="(item,x) in transit?.planets" :key="x">
        <h3 class="my-3">{{ item?.name }}</h3>
        <div class="mb-5" v-html="item?.birthmapText" />
      </div>
    </div>
</template>

<script setup>
const props = defineProps({
  transit: {required: true, type: Object},
  showPlanets: {
    required: true, type: Boolean, default: () => {
      return true
    }
  }
})

const hasPlanets = computed(() => {
  return props.transit?.planets && props.transit?.planets?.length > 0
})
</script>
