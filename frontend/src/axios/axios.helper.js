import axios from 'axios'
import store from '@/store'

class AxiosHelper {
   
    constructor(app) {
        axios.defaults.showLoader = true
        axios.interceptors.request.use((config) => {
            // Show the loader when a request is sent.
            if (config.showLoader) {
                store.dispatch('loader/pending')
            }
            return config
        }, (error) => {
            // Hide the loader when an error occurs.
            if (error.config.showLoader) {
                store.dispatch('loader/done')
            }

            return Promise.reject(error)
        })

        // An interceptor for each response received from the API.
        // Interceptors can be used to perform an operation before every response reaches it destination.
        axios.interceptors.response.use((response) => {
            // Hide the loader when a response is received.
            if (response.config.showLoader) {
                store.dispatch('loader/done')
            }
            return response
        },
            (error) => {
                // Hide the loader when an error occurs.
                let response = error.response
                if (response.config.showLoader) {
                    store.dispatch('loader/done')
                }

                if (error.response.status === 401) {
                    store.dispatch('loader/done')
                }

                return Promise.reject(error)
            }
        )
    }

    set token(val) {
        axios.defaults.headers.Authorization = `Bearer ${val}`
        this.authToken = val
    }

    get token() {
        return this.authToken
    }

    /**
     * REST GET Request functionality.
     * @param {string} path The URL of the REST end-point.
     * @param {object} params The request body.
     */
    get(path, params) {
        return axios.get(path, params)
    }

    /**
     * REST POST Request functionality.
     * @param {string} path The URL of the REST end-point.
     * @param {object} params The request body.
     */
    post(path, params) {
        return axios.post(path, params)
    }

    /**
     * REST PUT Request functionality.
     * @param {string} path The URL of the REST end-point.
     * @param {object} params The request body.
     */
    put(path, params) {
        return axios.put(path, params)
    }

    /**
     * REST DELETE Request functionality.
     * @param {string} path The URL of the REST end-point.
     * @param {object} params The request body.
     */
    delete(path, params) {
        return axios.delete(path, { data: params })
    }
}

export default AxiosHelper
