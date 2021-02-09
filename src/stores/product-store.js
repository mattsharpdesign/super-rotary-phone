import m from 'mithril'
import Parse from 'parse'

const Product = Parse.Object.extend('Product', {
  hangingDetails() {
    if (!this.get('numberPerJig') && !this.get('jigTypeAndSpacing')) return 'No hanging details available'
    return `${this.get('numberPerJig') || '?'} per ${this.get('jigTypeAndSpacing') || '?'}`
  }
})

let query = null

function cancelPreviousRequest() {
  if (query) {
    query.cancel()
    store.isLoading = false
  }
}

const store = {
  products: [],
  count: 0,
  isLoading: false,
  codeStartsWith: '',
  lastLoadedAt: null,

  load(options = {}) {
    cancelPreviousRequest()
    store.isLoading = true
    query = new Parse.Query(Product)
    query.ascending('code')
    query.withCount()
    if (options.skip) query.skip(options.skip)
    if (store.codeStartsWith) query.startsWith('code', store.codeStartsWith)
    return query.find()
      .then(response => {
        if (response.results) {
          store.products = options.append ? store.products.concat(response.results) : response.results
          store.count = response.count
          store.isLoading = false
          store.lastLoadedAt = new Date()
        }
      })
      .then(m.redraw)
  },

  loadMore() {
    store.load({ skip: store.products.length, append: true })
  },

  setCodeStartsWith(string) {
    store.codeStartsWith = string.toUpperCase()
    store.load()
  }
}

export default store