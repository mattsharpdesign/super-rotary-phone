import m from 'mithril'
import Parse from 'parse'

export const Powder = Parse.Object.extend('Powder')

const store = {
  powders: [],
  isLoading: false,
  lastLoadedAt: null,
  searchString: '',

  load() {
    store.isLoading = true
    const query = new Parse.Query(Powder)
    query.findAll().then(response => {
      store.powders = response
      store.isLoading = false
      m.redraw()
    })
  },

  get filteredPowders() {
    if (!store.searchString) return store.powders
    const _searchString = store.searchString.toLowerCase()
    return store.powders.filter(p => p.get('description').toLowerCase().includes(_searchString))
  },

  get filteredSortedPowders() {
    return store.filteredPowders.sort((a, b) => a.get('description') > b.get('description') ? 1 : -1)
  }
}

export default store