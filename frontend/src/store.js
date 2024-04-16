import { createStore } from 'vuex'
import { loader } from './store/modules/loader'

export default createStore({
    state() {
        return {
            edit : false,
            delete: false
        }
    },
    getters: {
    },
    mutations: {
        changeEdit(state)
        {
            state.edit = true
        },
        changeDelete(state)
        {
            state.delete = true
        }
    },
    actions: {
    },
    modules: {
        loader
    }
})
