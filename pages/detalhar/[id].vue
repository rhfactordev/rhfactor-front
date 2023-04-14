<template>
    <birthmap :birthmap="birthmap" :loading="loading.value" />
</template>


<script setup>
import Birthmap from "~/components/Birthmap.vue";

const route = useRoute()
const id = ref(route.params.id ? route.params.id : 0)
const loading = ref(false)
// const errorMessage = ref("")
const birthmap = ref({})
const domain = "sarakoimbra.com.br"

const loadPageInfo = async () => {

  if( loading.value ){
    return
  }

  loading.value = true

  birthmap.value = await $fetch(`/client/v1/birthmap/${id.value}/public`, {
    baseURL: `http://localhost:5000`,
    method: 'GET',
    query: {
      domain
    }
  }).catch(e=>{
    console.log("erro", e)
  }).finally(()=>{
    loading.value = false
  })


}

onMounted(async ()=>{
  await loadPageInfo()
})

</script>
