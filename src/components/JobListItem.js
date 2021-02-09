import m from 'mithril'
import CustomerDescription from './CustomerDescription'
import ProductDescription from './ProductDescription'

export default {
  view({ attrs }) {
    const { job, onSelect } = attrs
    return m('.job item', {
      onclick: () => onSelect(job)
    }, [
      m('.content', [
        m('.header', job.get('jobNumber')),
        job.isFinished() && m('i.green check status icon'),
        job.isInvoiced() && m('i.blue dollar sign status icon'),
        m('.description', [
          m('p', m(CustomerDescription, { customer: job.get('customer') })),
          m('p', m(ProductDescription, { product: job.get('product') })),
          m('p', [
            m('.ui label', `${job.get('quantityOrdered')}x`),
            ' ',
            job.get('colour'),
          ])
        ])
      ])
    ])
  }
}