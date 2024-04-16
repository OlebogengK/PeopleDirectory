<template>
    <div>
    <div class="text-end ma-5">
        <router-link to="/login"><v-btn color="green">Admin Login</v-btn></router-link>
    </div>
    <div class="home">
        <h1 class="mt-10">Find a Person</h1>
        <!--
        <v-text-field :loading="loading"
                      density="compact"
                      variant="solo"
                      label="Search Key Words"
                      append-inner-icon="mdi-magnify"
                      v-model="searchInput"
                      single-line
                      hide-details
                      @input="searchPerson(searchInput)"
                      @keydown.enter="searchPerson(searchInput)"
                      @click:append-inner="searchPerson(searchInput)"
                      class="w-70 my-5"
                      width="300">
        </v-text-field>
        -->
        <v-autocomplete
            clearable
            label="Search Key Words"
            :items="this.items"
            variant="outlined"
            v-model="searchInput"
            :search-input.sync="searchInput"
            @click="searchPerson(searchInput)"
            @keyup="searchPerson(searchInput)"
            append-inner-icon="mdi-magnify"
            menu-icon=""
        ></v-autocomplete>
        <!--
        <v-btn variant="outlined" @click="searchPerson(searchInput)">
            Search
        </v-btn>
        -->
        <v-row justify="end" class="">
            <v-col cols="4">
                <v-select
                    label="Filter by Country"
                    :items="['England', 'South Africa', 'Lesotho']"
                    v-model="countryFilter"
                    variant="underlined"
                ></v-select>
            </v-col>
            <v-col cols="4">
                <v-select
                    :disabled="disableCity"
                    label="Filter by City"
                    :items="cities"
                    v-model="cityFilter"
                    variant="underlined"
                ></v-select>
            </v-col>
        </v-row>
        <v-row class="mt-2">
            <v-col md="1" class=""></v-col>
            <v-col md="2" class="">Name</v-col>
            <v-col md="2" class="">Surname</v-col>
            <v-col md="3" class="">Country</v-col>
            <v-col md="3" class="">City</v-col>
        </v-row>
        <div v-for="person in filteredResults" :key="person.id">
            <PersonComponent :picture=person.picture :name=person.name :surname=person.surname :id=person.id :country=person.country :city=person.city :admin=false></PersonComponent>
        </div>
    </div>
    </div>
    <router-view/>
</template>

<script>
// @ is an alias to /src
import PersonComponent from '@/components/PersonComponent.vue'
import PersonController from '@/controller/person/person.controller.js'
export default {
        name: 'HomeView',
        components: {
            PersonComponent
        },
        data() {
            return {
                searchInput: "",
                personController:"",
                surname: "",
                name: "",
                country:"",
                city:"",
                filteredResults: [],
                cityFilter: '',
                people: [],
                items: [],
                names: [],
                surnames: [],
                countryFilter: '',
                disableCity: true,
                cities : []
            }
        },
        watch: {
            searchInput(val){
                this.searchPerson(val)
            },
            cityFilter(){
                this.applyFilters()
            },
            countryFilter(){
                this.disableCity = false;
                this.applyFilters()
                if(this.countryFilter === "England")
                {
                    this.cities = ['London','Manchester','Liverpool','Newcastle']
                }
                else  if (this.countryFilter === "South Africa")
                {
                    this.cities = ['Durban','Pretoria','Bloemfontein','Cape Town','Johannesburg']
                }
                else if (this.countryFilter === "Lesotho")
                {
                    this.cities = ['Maseru','Leribe']
                }
            }
        },
         mounted () {
            this.personController = new PersonController(this.$http);
            this.getAllPeople();
        },
        methods: {
            async getAllPeople() {
                try{
                    let result = await this.personController.getAllPeople();
                    console.log(result.data);
                    //this.items = result.map(person => person.name);
                    this.names = result.map(person => person.name);
                    this.surnames = result.map(person => person.surname);
                    for (let i = 0; i < this.names.length; i++) {
                        this.items.push(this.names[i]);
                        this.items.push(this.surnames[i]);
                    }
                    console.log(this.items);
                }
                catch(error)
                {
                    console.log(error)
                }
            },
            async searchPerson(input) {
                try{
                    let result = await this.personController.searchUser(input);
                    console.log(result.data);
                    this.people = result.data;
                    this.applyFilters();
                }
                catch(error)
                {
                    console.log(error)
                }
            },
            applyFilters() {
                // Apply city filter if provided
                if (this.countryFilter !=="")
                {
                    this.filteredResults = this.people.filter(result => result.country === this.countryFilter);
                    if(this.cityFilter!=="")
                    {
                        this.filteredResults = this.people.filter(result => result.city === this.cityFilter);
                    }
                }
                else {
                    this.filteredResults = this.people; // No city filter, use all results
                }
            }

            
        },
        
}
</script>
<style scoped>
    .v-text-field{
        width:800px;
        justify-content:center;
    }
    .home{
        max-width:fit-content;
        margin-right:auto;
        margin-left:auto;
    }
    .v-select{
        width:180px;
        height:80px
    }
</style>
