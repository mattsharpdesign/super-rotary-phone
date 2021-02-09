import m from 'mithril'
import Parse from 'parse'

export const Job = Parse.Object.extend('Job', {
  isFinished() {
    return this.get('quantityDelivered') > 0 ? true : false
  },
  isInvoiced() {
    return this.get('invoiceNumber') > 0 ? true : false
  },
  isInvalid() {
    if (!this.get('customer')) return true
    if (!this.get('product')) return true
    if (!this.get('colour')) return true
    if (!this.get('quantityOrdered')) return true
    return false
  },
  isPackingSlipValid() {
    if (!(typeof this.get('quantityDelivered') === 'number')) return false
    if (!this.get('dateDelivered')) return false
    return true
  },
  // Creates the pdf on the server and returns the url of the saved pdf
  createJobSheet() {
    return Parse.Cloud.run('createJobSheet', { id: this.id })
  },
  initialize(attrs, options) {
    this.set('dateOrdered', new Date)
  }
})

const store = {
  jobs: [],
  count: 0,
  isLoading: false,
  lastLoadedAt: null,
  selectedStatus: 'all',

  load(options = {}) {
    store.isLoading = true
    const query = new Parse.Query(Job)
    query.descending('jobNumber')
    query.withCount()
    query.include('customer,product')
    query.equalTo('status', store.selectedStatus)
    if (options.skip) query.skip(options.skip)
    query.find()
      .then(response => {
        store.jobs = options.append ? store.jobs.concat(response.results) : response.results
        store.count = response.count
        store.isLoading = false
        store.lastLoadedAt = new Date()
      })
      .then(m.redraw)
  },

  loadMore() {
    store.load({ skip: store.jobs.length, append: true })
  },

  setStatus(value) {
    store.selectedStatus = value
    store.load()
  }
}

export default store