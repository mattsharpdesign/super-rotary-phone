import m from 'mithril'
import Parse from 'parse'

export default {
  view() {
    return m('[', [
      m('h2', 'Home'),
      m('button', { 
        onclick() {
          Parse.User.logOut().then(m.redraw)
        }
      }, `Log out`)
    ])
  }
}