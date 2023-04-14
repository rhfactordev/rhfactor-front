<template>


    <h1 class="mt-3 mb-5 text-center">Mapa Astral</h1>

    <div v-if="isLoading" label="Loading...">Carregando...</div>

    <div v-if="!isLoading" class="row text-center">
      <div v-for="(item,x) in personalListTitle" :key="x" class="col-lg-4">
        <img class="bd-placeholder-img rounded-circle" width="140" height="140" :src="item.image" />
        <h2 class="h4">{{ item.title }}</h2>
        <p>
          {{ item.description }}
        </p>
      </div>
    </div>

    <section  v-if="!isLoading" class="p-3" v-for="(section,i) in lists" :key="i" >
      <hr class="mb-5"/>
      <div class="container">
        <h1 class="mt-3 mb-5 text-center">{{ section.title }}</h1>
        <transit-view v-for="(item,x) in section.transits" :key="x" :transit="item" />
      </div>
    </section>

</template>

<script setup>
const isLoading = computed(()=>{
  return props.loading
})

const props = defineProps({
  birthmap : { required: true, type: Object },
  loading : { required: false, type: Boolean, default : () => { return false } },
})

const personalList = computed(()=>{
  return [ props.birthmap.sun, props.birthmap.house1, props.birthmap.moon, props.birthmap.nnode ]
})
const relationsList = computed(()=>{
  return [props.birthmap.house7, props.birthmap.venus, props.birthmap.house5, props.birthmap.lilith, props.birthmap.house11]
})
const workList = computed(()=>{
  return [props.birthmap.house6, props.birthmap.house10, props.birthmap.house2]
})
const spiritualList = computed(()=>{
  return [props.birthmap.house12, props.birthmap.house9, props.birthmap.jupiter]
})

const personalListTitle = computed(()=>{
  return [
    {...props.birthmap.sun, image: 'https://s3.amazonaws.com/andrezaastrologia.com.br/images/solar.png'},
    {...props.birthmap.house1, image: 'https://s3.amazonaws.com/andrezaastrologia.com.br/images/ascendente.png'},
    {...props.birthmap.moon, image: 'https://s3.amazonaws.com/andrezaastrologia.com.br/images/lua.png'},
  ]
})

const lists = computed(()=>{
  return [
    {
      title: "Sobre você!",
      transits: {...personalList.value},
    },
    {
      title: "Relacionamentos",
      transits: {...relationsList.value},
    },
    {
      title: "Área profissional - Missão de Vida - Propósito e Dinheiro",
      transits: {...workList.value}
    },
    {
      title: "Espiritualidade",
      transits: {...spiritualList.value}
    }
  ]
})
</script>
