import m from 'mithril'

export default {
  view({ attrs }) {
    const { store, addJob } = attrs
    return m('.ui menu', [
      m('.header item', 'Jobs'),
      m('.right menu', [
        m('.link item', {
          onclick: addJob
        }, [
          m('i.plus icon'),
          'New job'
        ]),
        m('.link item',
          m('i.refresh icon', {
            onclick: store.load,
            class: store.isLoading && 'loading'
          })
        )
      ])
    ])
  }
}