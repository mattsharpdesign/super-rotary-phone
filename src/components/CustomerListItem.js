import m from 'mithril'
import CustomerDescription from './CustomerDescription'

export default { 
  view({ attrs }) {
    const { customer, onSelect } = attrs
    return m('.customer item', { onclick: () => onSelect(customer) }, [
      m('.content', [
        m('.description', m(CustomerDescription, { customer }))
      ])
    ])
  }
}