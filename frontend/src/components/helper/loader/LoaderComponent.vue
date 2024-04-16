<template>
    <div class="text-center">
        <v-dialog v-model="loading"
                  v-if="loading"
                  hide-overlay
                  persistent
                  width="300">
            <v-card color="primary"
                    dark>
                <!-- Card Content -->
                <v-card-text>
                    Please wait...
                    <!-- Progress Bar -->
                    <v-progress-linear indeterminate
                                       color="white"
                                       class="mb-0" />
                    <!-- Progress Bar -->
                </v-card-text>
                <!-- Card Content -->
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        name: 'LoaderComponent',

        data () {
            return {
                loader: false
            }
        },
        computed: {
            ...mapState('loader', ['loading'])
        },
        created () {
            this.loader = false
        },

        beforeMount () {
            this.$emitter.on("show", () => {
                this.show()
            })
            this.$emitter.on("hide", () => {
                this.hide()
            })
        },

        methods: {
            show () {
                this.loader = true
            },

            hide () {
                this.loader = false
            }
        }
    }
</script>
