import m from 'mithril'

export default {
  view({ attrs }) {
    const { product } = attrs
    if (!product) return 'Product not found'
    return [m('strong', product.get('code')), ' ', product.get('description')]
  }
}