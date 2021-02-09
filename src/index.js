import m from 'mithril'
import Parse from 'parse'
import { CustomerList } from './components/CustomerList'
import JobList from './components/JobList'
import { ProductList } from './components/ProductList'
import HomePage from './components/HomePage'
import Layout from './components/Layout'

Parse.initialize('myParseAppId', 'myParseJavascriptKey')

Parse.serverURL = 'http://localhost:1337/api'

m.route(document.getElementById('root'), '/home', {
  '/home': {
    render() {
      return m(Layout, m(HomePage))
    }
  },
  '/customers': {
    render() {
      return m(Layout, m(CustomerList))
    }
  },
  '/products': {
    render() {
      return m(Layout, m(ProductList))
    }
  },
  '/jobs': {
    render() {
      return m(Layout, m(JobList))
    }
  }
})