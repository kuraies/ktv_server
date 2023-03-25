const state = {
    adminInfo:{}
}

const getters = {
    adminInfo:(state) => state.adminInfo  
}

const mutations = {
    setAdminInfo:(state,info) => {
        state.adminInfo = info
    }
}

const actions = {
    setAdminInfo:({commit},info) => {
        commit('setAdminInfo',info)
    }
}

const adminStore = {
    state,
    getters,
    mutations,
    actions
}

export default adminStore

