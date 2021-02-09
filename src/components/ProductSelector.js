import m from 'mithril'
import { ProductList } from './ProductList'

export default {
  view({ attrs }) {
    const { onSelect, onCancel } = attrs
    return m('.ui small active selector modal', [
      m('.header', 'Select Product'),
      m('.scrolling content', 
        m(ProductList, { onSelect, isSecondary: true })
      ),
      m('.actions',
        m('button.ui button', { onclick: onCancel }, 'Cancel')
      )
    ])
  }
}