<template>

  <form class="needs-validation" v-if="hasServiceId">

    <div class="mb-3">
      <label for="birthRequestFormFieldName" class="form-label">Nome *</label>
      <input type="text" class="form-control" id="birthRequestFormFieldName" name="name" required placeholder="Nome" v-model="page.signupForm.name">
    </div>

    <div class="mb-3">
      <label for="birthRequestFormFieldEmail" class="form-label">E-mail *</label>
      <input type="email" class="form-control" id="birthRequestFormFieldEmail" name="email" required placeholder="email@domínio.com.br" v-model="page.signupForm.email">
    </div>

    <div class="mb-3">
      <label for="birthRequestFormFieldEmail" class="form-label">Data e hora de nascimento *</label>
      <input type="datetime-local" class="form-control" required
             id="birthRequestFormFieldEmail"
             placeholder="Data e Hora de nascimento"
             name="birthdate" v-model="page.signupForm.birthDate">
    </div>

    <div v-if="showCityFindInput" class="mb-3">
      <label for="birthRequestFormFieldCity" class="form-label">Cidade de Nascimento *</label>
      <div class="input-group">
        <input type="text" id="birthRequestFormFieldCity" v-model.lazy="page.cityFindInput" class="form-control" name="city" placeholder="Cidade de Nascimento">
        <div class="input-group-text">
          <button type="button" :disabled="page.loading" @click="searchCity" class="input-group-text" id="basic-addon2">
            <i v-if="!page.loading" class="fa-solid fa-search">Buscar</i>
            <i v-else class="fa-solid fa-spinner">*</i>
          </button>
        </div>
        <small v-if="showCityDescription">Digite o nome de sua Cidade de Nascimento e clique em buscar para selecionar.</small>
      </div>
    </div>

    <ul v-if="showCityFindInput" class="list-group mb-3">
      <li v-for="(item,x) in page.cityList" @click="selectCity(item)" :key="x"
          class="list-group-item list-group-item-action">{{ item.label }}
      </li>
    </ul>
    <div v-else class="mb-3 input-group">
      <input type="text" class="form-control" disabled v-model="page.selectedCity.label">
      <div class="input-group-text">
        <button @click="clearSelectedCity" class="input-group-text" id="basic-addon2">
          <i class="fa-solid fa-trash">X</i>
        </button>
      </div>
    </div>

    <div class="form-check mb-3">
      <input type="checkbox" class="form-check-input" v-model="page.signupForm.accpetedTerms" id="exampleCheck1">
      <label class="form-check-label" for="exampleCheck1">
        Eu autorizo o compartilhamento dos meus dados com a equipe do site {{ siteDomain }}
      </label>
    </div>

    <div class="d-grid gap-2">
      <button :disabled="page.loading" type="submit" class="btn btn-primary btn-lg p-3"
              @click.stop.prevent="submit()">
        <span class="h2 text-white">Gerar mapa astral</span>
      </button>
    </div>

  </form>

</template>

<script setup>

const reEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const reDatetime = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d/

const r = useRouter()

const page = ref({
  cityFindInput: "Santo André",
  cityList: [],
  selectedCity: {},
  signupForm: {
    name: "Roberto Fonseca",
    email: "roberto@rhfactor.com.br",
    city: "1",
    birthDate: "1986-07-03T10:15",
    serviceId: 2,
    accpetedTerms: true
  },
  loading: false
})

const showCityFindInput = computed(() => {
  return page.value.selectedCity.value == null
})

const showCityDescription = computed(()=>{
  return page.value.selectedCity.value == null && page.value.cityList.length == 0
})

const hasServiceId = computed(() => {
  return true
})

const siteDomain = computed(() => {
  // return process.env.VUE_APP_DOMAIN
  return "sarakoimbra.com.br"
})

const submit = async () => {
  // Validação
  const validName = page.value.signupForm.name.length > 2
  const validEmail = reEmail.test(page.value.signupForm.email)
  const validBirthdate = reDatetime.test(page.value.signupForm.birthDate)
  const validCity = page.value.signupForm.city != null && page.value.signupForm.city > 0
  const validAccepted = page.value.signupForm.accpetedTerms == true

  console.log('Validação', validName, validEmail, validBirthdate, validCity, validAccepted)

  if (!validName || !validEmail || !validBirthdate || !validCity || !validAccepted) {
    alert('Verifique os campos!')
    return
  }

  // Verificar Network
  if (page.value.loading) {
    console.log('Está carregando')
    return
  }

  // page.value.signupForm.serviceId = page.value.serviceId
  page.value.loading = true

  const { returnId } = await $fetch('/client/v1/signup/birthmap/request', {
    baseURL: `http://localhost:5000`,
    method: 'post',
    query: {
      domain: `sarakoimbra.com.br`
    },
    body: {
      name: page.value.signupForm.name,
      email: page.value.signupForm.email,
      birthdate: page.value.signupForm.birthDate,
      birthplaceId: page.value.signupForm.city,
      serviceId: page.value.signupForm.serviceId,
      accpetedTerms: page.value.signupForm.accpetedTerms
    }
  }).catch(e=>{
    alert('Houve um erro ao gerar seu mapa!')
    console.log('Erro', e)
    return
  }).then(res => res)

  page.value.loading = false
  r.push(`/import/${returnId}?name=${page.value.signupForm.name}`)
}

const selectCity = (city) => {
  page.value.signupForm.city = city.value
  page.value.selectedCity = city
}

const searchCity = async () => {
  if (page.value.loading) {
    return
  }
  page.value.loading = true

  const {data: cityList} = await useFetch('/client/v1/location', {
    baseURL: `http://localhost:5000`,
    query: {
      city: page.value.cityFindInput
    }
  })

  page.value.cityList = cityList
  page.value.loading = false
}

const clearSelectedCity = () => {
  page.value.cityFindInput = ""
  page.value.selectedCity = {}
  page.value.cityList = []
}

</script>
