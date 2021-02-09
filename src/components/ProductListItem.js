import m from 'mithril'
import ProductDescription from './ProductDescription'

export default {
  view({ attrs }) {
    const { product, onSelect } = attrs
    return m('.product item', { onclick: () => onSelect(product) }, [
      m('.content', [
        m('.description', m(ProductDescription, { product }))
      ])
    ])
  }
}