<template>
    <div class="">
        <v-card class="mb-2" @click="showDetails(this.id)">
            <v-row>
                <v-col md="1" class="ml-2 mt-1">
                    <v-img :width="30"
                           aspect-ratio="16/9"
                           cover
                           :src="picture">
                    </v-img>
                </v-col>
                <v-col class="my-2" md="2">
                    <h4>{{name}}</h4>
                </v-col>
                <v-col class="my-2" md="2">
                    <h4>{{surname}}</h4>
                </v-col>
                <v-col class="my-2" md="3">
                    <h4>{{country}}</h4>
                </v-col>
                <v-col class="my-2" md="3">
                    <h4>{{city}}</h4>
                </v-col>
            </v-row>
        </v-card>
        <v-dialog v-model="dialog" width="auto" v-if="!admin">
            <v-card
                width="500"
                prepend-icon="mdi-account"
                class="text-center"
            >
            <div class="avatar" width="500"><v-img :src="this.person.picture" height="30vh"></v-img></div>
            <h2>Name: {{this.person.name}}</h2>
            <h2>Surname: {{this.person.surname}}</h2>
            <h2>City: {{this.person.city}}</h2>
            <h2>Country: {{this.person.country}} </h2>
            <h2>Email: {{this.person.email}} </h2>
            <template v-slot:actions>
                <v-btn class="ms-auto" text="Close" @click="dialog=false"></v-btn>
            </template>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog" width="auto" v-if="admin">
            <v-card
                width="500"
                class="px-8 pt-5"
            >
                <h2 class="mb-3">Edit Data</h2>
                <v-text-field label="ImgSRC" variant="outlined" density="compact" :model-value="this.person.picture" v-model="person.picture" :rules="[rules.required]"></v-text-field>
                <v-text-field label="Name" variant="outlined" density="compact" :model-value="this.person.name" v-model="person.name" :rules="[rules.required]"></v-text-field>
                <v-text-field label="Surname" variant="outlined" density="compact" :model-value="this.person.surname" v-model="person.surname" :rules="[rules.required]"></v-text-field>
                <v-text-field label="Phone" variant="outlined" density="compact" :model-value="this.person.phoneNumber" v-model="person.phoneNumber" :rules="[rules.required]"></v-text-field>
                <v-select
                    label="Country"
                    :items="['England', 'South Africa', 'Lesotho']"
                    v-model="countrySelect"
                    variant="underlined"
                    :rules="[rules.required]"
                ></v-select>
                <v-select
                    :disabled="disableCity"
                    label="City"
                    :items="cities"
                    v-model="citySelect"
                    variant="underlined"
                    :rules="[rules.required]"
                ></v-select>
                <v-text-field label="email" variant="outlined" density="compact" :model-value="this.person.email" v-model="person.email" :rules="[rules.required]"></v-text-field>
                <template v-slot:actions>
                    <v-btn class="ms-auto" text="Delete Person" @click="deletePerson(id)"></v-btn>
                    <v-btn class="ms-auto" text="Save" @click="editPerson(id,this.person)"></v-btn>
                </template>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import PersonController from '@/controller/person/person.controller.js'
import AdminController from '@/controller/admin/admin.controller.js'
import EmailController from '@/controller/email/email.controller.js'

export default {
    props:{
        name:String,
        surname:String,
        country:String,
        picture:String,
        city:String,
        id:String,
        admin: Boolean
    },
    data() {
        return {
            dialog: false,
            person: {},
            emailController: null,
            personController:"",
            adminController:"",
            disableCity: true,
            countrySelect:"",
            cities : [],
            citySelect : "" ,
            person : {
                picture: "",
                name: "",
                surname: "",
                email: "",
                country: "",
                city: "",
                phoneNumber: "",
            },
            emailBody : {
                to: 'mark@bluegrassdigital.com',
                subject: 'Person Edited',
                fields:{
                    "id": "",
                    "picture" : "",
                    "name": "",
                    "surname": "",
                    "email": "",
                    "phoneNumber": "",
                    "country": "",
                    "city": ""
                }
            },
            valid: false,
            rules: {
                required: value => !!value || 'Field is required',
            },
        }
    },
    mounted () {
        this.personController = new PersonController(this.$http);
        this.adminController = new AdminController(this.$http);
        this.emailController = new EmailController(this.$http);
    },
    watch:{
        countrySelect(){
                this.disableCity = false;
                if(this.countrySelect === "England")
                {
                    this.cities = ['London','Manchester','Liverpool','Newcastle']
                }
                else  if (this.countrySelect === "South Africa")
                {
                    this.cities = ['Durban','Pretoria','Bloemfontein','Cape Town','Johannesburg']
            }
            else if (this.countrySelect === "Lesotho")
            {
                this.cities = ['Maseru','Leribe']
            }
        }
    },
    methods: {
        async showDetails(id) {
            try{
                let result = await this.personController.showDetails(id);
                console.log(result.data);
                this.person = result.data;
                this.dialog = true;
            }
            catch(error)
            {
                console.log(error)
            }
        },
        async editPerson(id,person)
        {
            this.validate();
            if(this.valid)
            {
                try{
                    let result = await this.adminController.editPerson(id,this.person);
                    console.log(result);
                    this.emailBody.fields.id = id;
                    this.emailBody.fields.picture = this.person.picture;
                    this.emailBody.fields.name = this.person.name;
                    this.emailBody.fields.surname = this.person.surname;
                    this.emailBody.fields.email = this.person.email;
                    this.emailBody.fields.phoneNumber = this.person.phoneNumber;
                    this.emailBody.fields.country = this.countrySelect;
                    this.emailBody.fields.city = this.citySelect;
                    this.emailSend(this.emailBody);
                    this.dialog = false;
                    this.$emit('messageToParent', 'true');
                }
                catch(error)
                {
                    console.log(error)
                }
            }
        },
        async emailSend (emailBody){
            try{
                let result = await this.emailController.sendEmail(emailBody)
                console.log("its sent")
            }catch (error) {
                console.log(error)
            }
        },
        async deletePerson(id)
        {
            try{
                let result = await this.adminController.deletePerson(id);
                console.log(result);
                this.dialog = false;
                this.$emit('messageToParent', 'true');
            }
            catch(error)
            {
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
                else if (this.countrySelect === "")
                {
                    this.valid = false;
                }
                else if (this.citySelect === "")
                {
                    this.valid = false;
                }
                else
                {
                    this.person.country = this.countrySelect;
                    this.person.city = this.citySelect;
                    this.valid = true;
                }
            }
    }
}
</script>
<styles scoped>
    .avatar{
        max-width:fit-content;
        margin-right:auto;
        margin-left:auto;
    }
</styles>
