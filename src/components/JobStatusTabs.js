import m from 'mithril'

export default {
  view({ attrs }) {
    const { store } = attrs
    const statuses = [ 'all', 'unfinished', 'finished', 'to be invoiced' ]
    return m('.ui tabular menu', [
      statuses.map(status => m('.link item', {
        class: store.selectedStatus === status && 'active',
        onclick() {
          store.setStatus(status)
        }
      }, [
        status.charAt(0).toUpperCase() + status.slice(1),
        !store.isLoading && store.selectedStatus === status && ` (${store.count})`,
      ]))
    ])
  }
}