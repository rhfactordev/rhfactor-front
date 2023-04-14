<template>


  <div class="row">
    <div class="col-12 col-md-6 offset-md-3">
      <h1 class="my-5 text-center">Pedido #{{id}}</h1>

      <p>Olá, {{ name }},</p>
      <p class="mb-3">
        Estamos importanto seu mapa astral, aguarde! <br/>
        Isso pode levar até 2 minutos.
      </p>


      <p><strong>Status</strong>: <span>{{status}}</span></p>

      <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" :style="`width: ${percent}%`"></div>
      </div>
      <small>Tempo decorrido: {{timeTotal}} segundos</small>

    </div>
  </div>


</template>

<script setup>
const route = useRoute()
const router = useRouter()

const name = ref(route.query.name ? route.query.name : '')
const id = ref(route.params.id ? route.params.id : 0)
const status = ref("Aguardando incialização!")

const total = 2*60*1000
const timeTotal = ref(0)

const percent = computed(()=>{
  return (timeTotal.value * 100000 / total).toFixed(0)
})

const startCounter = () =>{
  setInterval( function() {
    timeTotal.value = timeTotal.value+1
    if( percent.value > 100 ){
      router.push(`/detalhar/${id.value}`)
    }
  }, 1000);
}

onMounted(async ()=>{
  console.log('Iniciar importação')

  await $fetch(`/workers/birthmap/${id.value}`, {
    baseURL: `http://localhost:5000`,
    method: 'GET',
    query: {
      domain: `sarakoimbra.com.br`
    }
  }).catch(e=>{
    console.log('Erro import', e)
  }).finally(()=>{
    console.log('Chamou a URL')
    startCounter()
  })


})

</script>
