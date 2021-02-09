import m from 'mithril'

export default {
  view({ attrs }) {
    const { store, isSecondary } = attrs
    return m('.ui menu', { class: isSecondary && 'secondary' }, [
      !isSecondary && m('.header item', [
        'Products',
        ` (${store.count})`
      ]),
      m('.item', 
        m('.ui icon input', [
          m('input[type=text][placeholder=Code starts with...]', {
            value: store.codeStartsWith,
            oninput: e => store.setCodeStartsWith(e.target.value)
          }),
          m('i.search icon')
        ])
      ),
      m('.right menu', [
        m('.item', { onclick: store.load }, 
          m('i.refresh icon', { class: store.isLoading && 'loading' })
        )
      ])
    ])
  }
}