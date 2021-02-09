import m from 'mithril'
import store from '../stores/customer-store'
import CustomerListHeader from './CustomerListHeader'
import CustomerListItem from './CustomerListItem'

export function CustomerList() {
  let searchString = ''
  return {
    oninit() {
      if (!store.lastLoadedAt) store.load()
    },
    view({ attrs }) {
      const { onSelect, isSecondary } = attrs
      return m('[', [
        m(CustomerListHeader, { store, isSecondary, searchString, setSearchString: value => searchString = value }),
        m('.ui divided items', [
          store.customers
            .filter(c => {
              if (!searchString) return true
              const _search = searchString.toLowerCase()
              if (c.get('code') && c.get('code').toLowerCase().includes(_search)) return true
              if (c.get('name') && c.get('name').toLowerCase().includes(_search)) return true
              return false
            })
            .sort((a, b) => a.get('code') > b.get('code') ? 1 : -1)
            .map(customer => m(CustomerListItem, { key: customer.id, customer, onSelect }))
        ])
      ])
    }
  }
}
