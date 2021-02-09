import m from 'mithril'
import { CustomerList } from './CustomerList'

export default {
  view({ attrs }) {
    const { onSelect, close } = attrs
    return m('.ui small active selector modal', [
      m('.header', 'Select Customer'),
      m('.scrolling content', m(CustomerList, { isSecondary: true, onSelect })),
      m('.actions', [
        m('.ui basic button', { onclick: close }, 'Cancel')
      ])
    ])
  }
}