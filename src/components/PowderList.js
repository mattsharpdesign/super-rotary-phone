import m from 'mithril'
import store from '../stores/powder-store'

const PowderList = {
  oninit() {
    if (!store.lastLoadedAt) store.load()
  },
  view({ attrs }) {
    const { onSelect, isSecondary } = attrs
    return m('[', [
      m('.ui menu', { class: isSecondary && 'secondary' }, [
        !isSecondary && m('.header item', 'Powders'),
        m('.item', [
          m('.ui icon input', [
            m('input[type=text][placeholder=Search powders]', {
              value: store.searchString,
              oninput: e => store.searchString = e.target.value
            }),
            m('i.search icon')
          ])
        ])
      ]),
      m('.ui divided items', [
        store.filteredSortedPowders.map(powder => m(ListItem, { key: powder.id, powder, onSelect }))
      ])
    ])
  }
}

const ListItem = {
  view({ attrs }) {
    const { powder, onSelect } = attrs
    return m('.powder item', { onclick: () => onSelect(powder) }, [
      m('.content', [
        m('.description', [
          m(PowderDescription, { powder })
        ])
      ])
    ])
  }
}

const PowderDescription = {
  view({ attrs }) {
    const { powder } = attrs
    if (!powder) return 'Powder not found'
    return m('[', [
      powder.get('description'),
      ' ',
      m('small', powder.get('code'))
    ])
  }
}

export default PowderList