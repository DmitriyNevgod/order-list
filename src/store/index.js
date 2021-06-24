import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    orderData: {
      orders: null,
      statuses: null,
      products: null,
    },
    autocomplete: null
  },
  mutations: {
    setOrderData(state, { name, data }) {
      state.orderData[name] = data
    },
    setAutocompleteInit() {

    },
    deletOrder(state, id) {
      const index = state.orderData.orders.findIndex((el) =>
        el.id === id ? true : false
      );
      state.orderData.orders.splice(index, 1)
    }
  },
  actions: {
    async getOrderInfo({ commit }, { chunkUrl }) {
      const baseUrl = `https://webtest.it.ua/testApp/api/${chunkUrl}`;
      const options = {
        method: 'GET',
      }
      try {
        const response = await fetch(baseUrl, options)
        const data = await response.json()
        commit('setOrderData', { name: chunkUrl, data })
      } catch (err) {
        throw new Error(err)
      }
    },
    async setOrderInfo(_, { chunkUrl, data }) {
      const baseUrl = `https://webtest.it.ua/testApp/api/orders/${chunkUrl}`
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(data)
      }
      try {
        const response = await fetch(baseUrl, options)
        return response
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  getters: {
    getOrders(state) {
      const data = [];
      if (state.orderData.orders && state.orderData.statuses && state.orderData.products) {
        //заполнение массива данными
        state.orderData.orders.forEach(el => {
          data.push({
            id: el.id,
            product: el.productId,
            status: el.statusId,
            count: el.count,
          });
        });

        // фильтрация - замена "id" на "name" статуса
        data.map((el) => {
          state.orderData.statuses.forEach(status => {
            if (el.status === status.id) {
              el.status = status
              return el
            }
          })
        })

        // фильтрация - замена "id" на обьект товара статуса
        data.map((el) => {
          state.orderData.products.forEach(product => {
            if (el.product === product.id) {
              el.product = product
              return el
            }
          })
        })
        return data
      }
    }
  },
})
