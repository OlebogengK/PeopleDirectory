import LoaderComponent from './components/helper/loader/LoaderComponent.vue'

const Loader = {
    install(app) {
        // Register the loader component globally
        app.component('loader-component', LoaderComponent)

        const loader = {
            show() {
                app.config.globalProperties.$emitter.emit('show')
            },
            hide() {
                app.config.globalProperties.$emitter.emit('hide')
            }
        }
        app.config.globalProperties.$loader = loader

        app.provide("loader-component", loader)
    }
}
export { Loader }
