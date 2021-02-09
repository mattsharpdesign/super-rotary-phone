import m from 'mithril'
import Parse from 'parse'
import { LoginForm } from './LoginForm'

export default {
  view({ children }) {
    const currentUser = Parse.User.current()
    return m('[', [
      m('.ui inverted menu', [
        m('.header item', 'TC2'),
        currentUser && [
          m(m.route.Link, { class: 'item', href: '/home' }, 'Home'),
          m(m.route.Link, { class: 'item', href: '/customers' }, 'Customers'),
          m(m.route.Link, { class: 'item', href: '/products' }, 'Products'),
          m(m.route.Link, { class: 'item', href: '/jobs' }, 'Jobs'),
        ]
      ]),
      m('.ui container', [
        currentUser ? children : m(LoginForm)
      ])
    ])
  }
}