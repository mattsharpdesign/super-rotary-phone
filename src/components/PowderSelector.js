import m from 'mithril'
import PowderList from './PowderList'

const PowderSelector = {
  view({ attrs }) {
    const { onSelect, onCancel } = attrs
    return m('.ui small active selector modal', [
      m('.header', 'Select Powder'),
      m('.scrolling content', m(PowderList, { onSelect, isSecondary: true })),
      m('.actions', [
        m('button.ui button', { onclick: onCancel }, 'Cancel')
      ])
    ])
  }
}

export default PowderSelector