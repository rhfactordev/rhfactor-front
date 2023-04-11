<template>

  <form class="needs-validation" v-if="hasServiceId">
    <div class="form-group">
      Nome <i>*</i>
      <input type="text" class="form-control mt-1" name="name" required placeholder="Nome"
             v-model="page.signupForm.name">
    </div>

    <div class="form-group">
      E-mail <i>*</i>
      <input type="email" class="form-control mt-1" name="email" required placeholder="email@domínio.com.br"
             v-model="page.signupForm.email">
    </div>

    <div class="form-group">
      Data e Hora de Nascimento <i>*</i>
      <input type="datetime-local" class="form-control mt-1" required placeholder="Data e Hora de nascimento"
             name="birthdate" v-model="page.signupForm.birthDate">
    </div>

    <div>
      Digite o nome de sua Cidade de Nascimento e clique em buscar para selecionar <i>*</i>
      <div v-if="showCityFindInput" class="input-group mb-3 mt-1">
        <input type="text" v-model.lazy="page.cityFindInput" id="city" class="form-control" name="city"
               placeholder="Cidade de Nascimento">
        <div class="input-group-append">
          <button type="button" :disabled="page.loading" @click="searchCity" class="input-group-text" id="basic-addon2">
            <i v-if="!page.loading" class="fa-solid fa-search">Buscar</i>
            <i v-else class="fa-solid fa-spinner">*</i>
          </button>
        </div>
      </div>
    </div>

    <ul v-if="showCityFindInput" class="list-group mb-3">
      <li v-for="(item,x) in page.cityList" @click="selectCity(item)" :key="x"
          class="list-group-item list-group-item-action">{{ item.label }}
      </li>
    </ul>
    <div v-else class="input-group mb-3">
      <input type="text" class="form-control" disabled v-model="page.selectedCity.label">
      <div class="input-group-append">
        <button @click="clearSelectedCity" class="input-group-text" id="basic-addon2">
          <i class="fa-solid fa-trash">X</i>
        </button>
      </div>
    </div>

    <div class="form-group form-check">
      <input type="checkbox" class="form-check-input" v-model="page.signupForm.accpetedTerms" id="exampleCheck1">
      <label class="form-check-label" for="exampleCheck1">
        Eu autorizo o compartilhamento dos meus dados com a equipe do site {{ siteDomain }}
      </label>
    </div>

    <button :disabled="page.loading" type="submit" class="btn btn-primary btn-lg btn-block p-3"
            @click.stop.prevent="submit()">
      <span class="h2 text-white">Gerar mapa astral</span>
    </button>

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
    serviceId: 1,
    accpetedTerms: true
  },
  loading: false
})

const showCityFindInput = computed(() => {
  return page.value.selectedCity.value == null
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

  const {data} = await useAsyncData(() => $fetch(`/api/birthmap/create?city=${page.value.cityFindInput}`, {
    method: 'post',
    body: {
      data: {
        name: page.value.signupForm.name,
        email: page.value.signupForm.email,
        birthdate: page.value.signupForm.birthDate,
        birthplaceId: page.value.signupForm.city,
        serviceId: page.value.signupForm.serviceId,
        accpetedTerms: page.value.signupForm.accpetedTerms
      }
    }
  }))

  r.push('/carregar')


  // page.value.$axios.post(`/client/v1/signup/birthmap?domain=${process.env.VUE_APP_DOMAIN}`, ).then((res) => {
  //   page.value.$router.push(`/checkout/${res.data.returnId}/pagamento`)
  // }).catch(e => {
  //   console.log("Ops! Houve um erro ao enviar seu formulário. \n Recarregue a página e tente novamente!", e)
  //   alert('Houve um erro ao criar seu pedido!')
  // }).finally(() => {
  page.value.loading = false
  // });
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

  const {data} = await useAsyncData(() => $fetch(`/api/location?city=${page.value.cityFindInput}`))

  page.value.cityList = data
  page.value.loading = false
}

const clearSelectedCity = () => {
  page.value.cityFindInput = ""
  page.value.selectedCity = {}
  page.value.cityList = []
}

</script>
