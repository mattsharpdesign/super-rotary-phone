import m from 'mithril'
import Parse from 'parse'

export const LoginForm = {
  view() {
    return m('button', {
      onclick() {
        Parse.User.logIn('matt', 'asdf')
          .then(m.redraw)
      }
    }, 'Log in')
  }
}