import m from 'mithril'
import Parse from 'parse'

const Customer = Parse.Object.extend('Customer')

const store = {
  customers: [],
  isLoading: false,
  lastLoadedAt: null,

  load() {
    store.isLoading = true
    const query = new Parse.Query(Customer)
    return query.findAll({ batchSize: 1000 })
      .then(response => store.customers = response)
      .then(() => store.isLoading = false)
      .then(() => store.lastLoadedAt = new Date())
      .then(m.redraw)
  }
}

export default store