import m from 'mithril'
import store from '../stores/product-store'
import ProductListHeader from './ProductListHeader'
import ProductListItem from './ProductListItem'

export function ProductList() {
  return {
    oninit({ dom }) {
      console.log(dom)
      if (!store.lastLoadedAt) store.load()
    },
    view({ attrs }) {
      const { onSelect, isSecondary } = attrs
      return m('[', [
        m(ProductListHeader, { store, isSecondary }),
        m('.ui loader', { class: store.isLoading && 'active' }),
        m('.ui divided items', [
          store.products.map(product => m(ProductListItem, { key: product.id, product, onSelect })),
        ]),
        store.count > store.products.length && m('button.ui basic button', { 
          onclick: store.loadMore
        }, store.isLoading ? 'Loading...' : 'Load more'),
        m('.button.ui basic green button', 'Add product'),
        store.products.length > 40 && m('.ui right floated basic button', {
          onclick: () => console.log(dom)
        }, 'Back to top')
      ])
    }
  }
}