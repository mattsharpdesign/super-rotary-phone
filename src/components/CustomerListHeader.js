import m from 'mithril'

export default {
  view({ attrs }) {
    const { store, isSecondary, searchString, setSearchString } = attrs
    return m('.ui menu', { class: isSecondary && 'secondary' }, [
      !isSecondary && m('.header item', 'Customers'),
      m('.item', [
        m('.ui icon input', [
          m('input[type=text][placeholder=Search]', {
            value: searchString,
            oninput: e => setSearchString(e.target.value)
          }),
          m('i.search icon')
        ])
      ]),
      m('.right menu', [
        m('.link item', { onclick: store.load }, 
          m('i.refresh icon', { 
            class: store.isLoading && 'loading',
          })
        )
      ])
    ])
  }
}