<template>
    <div>
    <div class="home">
        <h1 class="mt-10">Admin</h1>
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
            v-on:this.$store.edit="this.getAllPeople"
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
        <v-btn variant="outlined" @click="this.dialog=true">
            Add New
        </v-btn>
        <v-dialog v-model="dialog" width="auto">
            <v-card
                class="px-8 pt-5"
            >
                <h2 class="mb-3 edit">Add New Person</h2>
                <v-text-field label="ImgSRC" variant="outlined" density="compact" v-model="person.picture" class="" :rules="[rules.required]"></v-text-field>
                <v-text-field label="Name" variant="outlined" density="compact" v-model="person.name" :rules="[rules.required]"></v-text-field>
                <v-text-field label="Surname" variant="outlined" density="compact" v-model="person.surname" :rules="[rules.required]"></v-text-field>
                <v-text-field label="Phone" variant="outlined" density="compact" v-model="person.phoneNumber" :rules="[rules.required]"></v-text-field>
                <v-select
                    label="Country"
                    :items="['England', 'South Africa', 'Lesotho']"
                    v-model="countryFilter"
                    :rules="[rules.required]"
                    variant="underlined"
                    width="700"
                ></v-select>
                <v-select
                    :disabled="disableCity"
                    label="City"
                    :items="cities"
                    v-model="cityFilter"
                    :rules="[rules.required]"
                    variant="underlined"
                ></v-select>
                <v-text-field label="email" variant="outlined" density="compact" v-model="person.email" :rules="[rules.required]"></v-text-field>
                <template v-slot:actions>
                    <v-btn class="ms-auto" text="Save" @click="addPerson(this.person)"></v-btn>
                </template>
            </v-card>
        </v-dialog>
        <v-row class="my-1">
            <v-col md="1" class=""></v-col>
            <v-col md="2" class="">Name</v-col>
            <v-col md="2" class="">Surname</v-col>
            <v-col md="3" class="">Country</v-col>
            <v-col md="3" class="">City</v-col>
        </v-row>
        <div v-for="person in filteredResults" :key="person.id">
            <PersonComponent :picture=person.picture :name=person.name :surname=person.surname :id=person.id :country=person.country :city=person.city :admin=true @messageToParent="handleMessageFromChild"></PersonComponent>
        </div>
        <v-snackbar v-model="snackbar" color="success">
            success

            <template v-slot:actions>
                <v-btn color="red" variant="text" @click="snackbar = false">
                Close
            </v-btn>
      </template>
    </v-snackbar>
    </div>
    </div>
    <router-view/>
</template>

<script>
// @ is an alias to /src
import PersonComponent from '@/components/PersonComponent.vue'
import PersonController from '@/controller/person/person.controller.js'
import AdminController from '@/controller/admin/admin.controller.js'
import EmailController from '@/controller/email/email.controller.js'
export default {
        name: 'HomeView',
        components: {
            PersonComponent
        },
        data() {
            return {
                valid : false,
                searchInput: "",
                personController:"",
                adminController:"",
                surname: "",
                dialog: false,
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
                cities : [],
                person : {
                    picture: "",
                    name: "",
                    surname: "",
                    email: "",
                    country: "",
                    city: "",
                    phoneNumber: "",
                },
                messageFromChild: '',
                emailController: null,
                snackbar: false,
                rules: {
                    required: value => !!value || 'Field is required',
                },
                emailBody : {
                    to: 'mark@bluegrassdigital.com',
                    subject: 'New Person Added',
                    body: 'This is a test email sent from the frontend.',
                    fields:{
                        "picture" : "",
                        "name": "",
                        "surname": "",
                        "email": "",
                        "phoneNumber": "",
                        "country": "",
                        "city": ""
                    }
                }
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
            this.adminController = new AdminController(this.$http);
            this.emailController = new EmailController(this.$http);
            this.getAllPeople();
        },
        methods: {
            async getAllPeople() {
                try{
                    console.log("getting all people");
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
            },
            async addPerson (person)
            {
                this.validate();
                if(this.valid)
                {
                    try{
                        let result = await this.adminController.addPerson(person);
                        console.log(result.data);
                        this.emailBody.fields.picture = this.person.picture;
                        this.emailBody.fields.name = this.person.name;
                        this.emailBody.fields.surname = this.person.surname;
                        this.emailBody.fields.email = this.person.email;
                        this.emailBody.fields.phoneNumber = this.person.phoneNumber;
                        this.emailBody.fields.country = this.countryFilter;
                        this.emailBody.fields.city = this.cityFilter;
                        this.dialog = false;
                        this.person.picture = "";
                        this.person.name = "";
                        this.person.surname = "";
                        this.person.email = "";
                        this.person.phoneNumber = "";
                        this.person.country = "";
                        this.person.city = "";
                        this.getAllPeople();
                        this.emailSend(this.emailBody)
                    }
                    catch(error)
                    {
                        console.log(error);
                    }
                }
            },
            methodThatForcesUpdate() {
                this.$forceUpdate();
            },
            handleMessageFromChild(message) {
                console.log(message);
                if(message === "true")
                {
                    console.log("its in");
                    this.searchInput = "";
                    this.people = [];
                    this.filteredResults = [];
                    this.snackbar =true;
                }
            },
            async emailSend (emailBody){
                try{
                  let result = await this.emailController.sendEmail(emailBody)
                }catch (error) {
                  console.log(error)
                }
            },
            validate()
            {
                if(this.person.picture === "")
                {
                    this.valid = false;
                }
                else if (this.person.name === "")
                {
                    this.valid = false;
                }
                else if (this.person.surname === "")
                {
                    this.valid = false;
                }
                else if (this.person.email === "")
                {
                    this.valid = false;
                }
                else if (this.person.phoneNumber === "")
                {
                    this.valid = false;
                }
                else if (this.countryFilter === "")
                {
                    this.valid = false;
                }
                else if (this.cityFilter === "")
                {
                    this.valid = false;
                }
                else
                {
                    this.person.country = this.countryFilter;
                    this.person.city = this.cityFilter;
                    this.valid = true;
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
    .v-card .v-text-field{
        width:500px;
    }
</style>