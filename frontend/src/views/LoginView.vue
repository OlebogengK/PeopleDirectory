<template>
    <v-img
        class="ma-0 pa-0"
        height="100vh"
        cover
        src="https://images.unsplash.com/photo-1484503793037-5c9644d6a80a?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        gradient="to top, rgba(0, 0, 0, .75), rgba(0, 0, 0, .75)"
    >
        <v-container>
            <v-row
                align="center"
                no-gutters
                justify="center"
                class="h-screen"
            >
                <v-col
                    xs="12"
                    sm="8"
                    md="4"
                >
                    <v-card
                        class="elevation-24"
                        color="#E0E0E0"
                    >
                        <!-- Card Title -->
                        <v-toolbar
                            dark
                            color="primary"
                            class="mb-5"
                        >
                            <v-icon icon="mdi-cellphone-lock"
                                    class="ml-6"
                            >
                            </v-icon>
                            <v-toolbar-title>ADMIN LOGIN</v-toolbar-title>
                        </v-toolbar>
                        <!-- Card Title -->

                        <!-- Image in the Center of the Login Card -->
                        <div
                            class="logoPosition"
                        >
                            <img
                                class="imagePosition"
                                src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            >
                        </div>
                        <!-- Image in the Center of the Login Card -->

                        <!-- Login content -->
                        <v-card-text>
                            <v-form
                                ref="loginForm"
                                v-model="valid"
                                lazy-validation
                            >
                                <!-- E-mail Address -->
                                <v-text-field
                                    v-model="email"
                                    label="Email"
                                    variant="underlined"
                                    prepend-inner-icon="mdi-account-circle"
                                    autofocus
                                >
                                    <v-icon
                                        slot="prepend"
                                        color="cyan darken-4"
                                    >
                                        account_circle<v-btn
                                            color="deep-purple-accent-4"
                                        >
                                            hello
                                        </v-btn>
                                    </v-icon>
                                </v-text-field>
                                <!-- E-mail Address -->

                                <!-- Password -->
                                <v-text-field
                                    v-model="password"
                                    label="Password"
                                    variant="underlined"
                                    :rules="passwordRules"
                                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                    :type="showPassword ? 'text' : 'password'"
                                    prepend-inner-icon="mdi-lock"
                                    @click:append-inner="showPassword = !showPassword"
                                    @keyup.enter="loginClick"
                                >
                                    <v-icon
                                        slot="prepend"
                                        color="red darken-4"
                                    >
                                        lock
                                    </v-icon>
                                </v-text-field>
                                <!-- Password -->
                            </v-form>
                        </v-card-text>
                        <!-- Login content -->

                        <!-- Buttons -->
                        <v-card-actions>
                            <v-spacer />
                            <v-btn
                                slot="activator"
                                type="submit"
                                :disabled="!valid"
                                color="grey-darken-2"
                                variant="elevated"
                                @click="loginClick"
                            >
                                Log In
                            </v-btn>
                        </v-card-actions>
                        <!-- Buttons -->
                    </v-card>
                </v-col>
            </v-row>
            <v-snackbar v-model="snackbar" color="error">
            Admin password/email incorrect

            <template v-slot:actions>
                <v-btn color="black" variant="text" @click="snackbar = false">
                Close
            </v-btn>
      </template>
    </v-snackbar>
        </v-container>
    </v-img>
    <router-view/>
</template>
<script>
    import AdminController from '@/controller/admin/admin.controller.js'
    export default {
        name: 'LoginComponent',

        data () {
            return {
                showChangeDialog: false,
                email: null,
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+/.test(v) || 'E-mail must be valid'
                ],
                password: null,
                passwordRules: [
                    v => !!v || 'Password is required'
                ],
                valid: false,
                showPassword: false,
                loginController: null,
                snackbar: false
            }
        },

        mounted () {
            this.loginController = new AdminController(this.$http)
        },
        methods: {
            async loginClick () {
              try {
                var userCredentials = {
                  email: this.email,
                  password: this.password
                }
                let result = await this.loginController.adminLogin(userCredentials)
                console.log(result.status)
                this.$router.push('/admin')
                } catch (error) {
                  console.log(error)
                  this.snackbar = true;
                }
              }
        }
    }
</script>
<style>
    .logoPosition {
        text-align: center;
    }

    .imagePosition {
        margin-top: 20px;
        height: 20vh;
        width: 30vh;
    }

    .toolbarImage {
        width: 15vw;
    }
</style>

