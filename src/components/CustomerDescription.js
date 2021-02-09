import m from 'mithril'

export default {
  view({ attrs }) {
    const { customer } = attrs
    if (!customer) return 'Customer not found'
    return [m('strong', customer.get('code')), ' ', customer.get('name')]
  }
}