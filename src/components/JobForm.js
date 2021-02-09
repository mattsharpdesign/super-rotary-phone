import m from 'mithril'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import Overlay from './Overlay'
import CustomerDescription from './CustomerDescription'
import CustomerSelector from './CustomerSelector'
import ProductDescription from './ProductDescription'
import ProductSelector from './ProductSelector'
import PowderSelector from './PowderSelector'
import store from '../stores/job-store'
import PackingSlipForm, { PackingSlipFormBody } from './PackingSlipForm'

export const ModalJobForm = () => {
  return {
    view({ attrs }) {
      const { job, closeForm } = attrs
      return m('.ui large active modal'
        , m('.header', job.get('jobNumber') ? `Job ${job.get('jobNumber')}` : 'New Job')
        , m('.scrolling content'
          , m(FormBody, { job })
        )
        , m('.actions'

          // Print job sheet button
          , !job.isNew() && !job.dirty() && m(PrintJobSheetButton, { job })

          // Save button
          , job.dirty() && m(SaveButton, { job })

          // Undo changes button
          , job.dirty() && !job.isNew() && m('button.ui button'
            , { onclick: () => job.revert() }
            , 'Undo Changes'
          )

          // Close/cancel button
          , (!job.dirty() || job.isNew()) && m('button[type=button].ui button'
            , { onclick: closeForm }
            , job.isNew() ? 'Cancel' : 'Close'
          )
        )
      )
    }
  }
}

function SaveButton() {
  let isSaving = false
  return {
    view({ attrs }) {
      const { job } = attrs
      return m('button.ui primary button', {
        disabled: job.isInvalid(),
        onclick() {
          isSaving = true
          job.save().then(() => {
            isSaving = false
            store.load()
            m.redraw()
          })
        }
      }, isSaving ? 'Saving...' : 'Save')
    }
  }
}

function PrintJobSheetButton({ attrs }) {
  const { job } = attrs
  let isLoading = false
  function printJobSheet() {
    isLoading = true
    job.createJobSheet()
      .then(url => {
        isLoading = false
        m.redraw()
        const a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('download', `JobSheet${job.get('jobNumber')}.pdf`)
        a.setAttribute('target', '_blank')
        a.click()
      })
  }
  return {
    view({ attrs }) {
      return m('button[type=button].ui left floated basic button', {
        onclick: printJobSheet
      }, [ m('i.print icon'), isLoading ? 'Loading...' : 'Job Sheet'])
    }
  }
}

function FormBody() {
  
  let isCustomerSelectorOpen = false
  let isProductSelectorOpen = false
  let isPowderSelectorOpen = false
  let isPackingSlipFormOpen = false
  
  return {
    oninit() {
      // Refresh the job data?
    },
    view(vnode) {
      const { job } = vnode.attrs
      return [

        isCustomerSelectorOpen && m(Overlay, [
          m(CustomerSelector, {
            onSelect: customer => {
              job.set('customer', customer)
              isCustomerSelectorOpen = false
            },
            close: () => isCustomerSelectorOpen = false,
          })
        ]),

        isProductSelectorOpen && m(Overlay, m(ProductSelector, {
          onSelect: product => {
            job.set('product', product)
            isProductSelectorOpen = false
          },
          onCancel: () => isProductSelectorOpen = false,
        })),

        isPowderSelectorOpen && m(Overlay, m(PowderSelector, {
          onSelect: powder => {
            job.set('colour', powder.get('description'))
            isPowderSelectorOpen = false
          },
          onCancel: () => isPowderSelectorOpen = false
        })),

        isPackingSlipFormOpen && m(Overlay, m(PackingSlipForm, {
          job,
          onClose: () => isPackingSlipFormOpen = false
        })),

        m('.ui form', { class: job.isLoading && 'loading' }, [

          job.isFinished() ? 
            m(PackingSlipDetails, { job, edit: () => isPackingSlipFormOpen = true }) 
          : 
            m('.field', m('.ui positive fluid button', { onclick: () => isPackingSlipFormOpen = true }, 'Create Packing Slip')),

          // Customer and order date
          m('.fields', [
            m('.twelve wide field', [
              m('label', 'Customer'),
              job.get('customer') ?
                m('p', { onclick: () => isCustomerSelectorOpen = true }, [
                  m(CustomerDescription, { customer: job.get('customer') })
                ])
              :
                m('.ui fluid button', {
                  onclick: () => isCustomerSelectorOpen = true
                }, 'Select Customer')
            ]),
            m('.four wide field', [
              m('label', 'Job Date'),
              m('input[type=date]', {
                value: format(job.get('dateOrdered'), 'yyyy-MM-dd'),
                onchange: e => {
                  job.set('dateOrdered', parse(e.target.value, 'yyyy-MM-dd', new Date()))
                }
              })
            ])
          ]),

          // Order number and additional customer ref
          m('.two fields', [
            m('.field', [
              m('label', 'Order #'),
              m('input[type=text]', {
                value: job.get('orderNumber'),
                oninput: e => job.set('orderNumber', e.target.value)
              })
            ]),
            m('.field', [
              m('label', 'Customer Ref.'),
              m('input[type=text]', {
                value: job.get('additionalCustomerRef'),
                oninput: e => job.set('additionalCustomerRef', e.target.value)
              })
            ]),
          ]),

          // Product
          m('.field', [
            m('label', 'Product'),
            job.get('product') ? [
              m('p', { onclick: () => isProductSelectorOpen = true }, [
                m(ProductDescription, { product: job.get('product') })
              ]),
              m('.ui small info message', [
                m('p', job.get('product').hangingDetails()),
                job.get('product').get('hangingNotes') && m('p', job.get('product').get('hangingNotes'))
              ])
            ]
            :
              m('.ui fluid button', {
                onclick: () => isProductSelectorOpen = true
              }, 'Select Product')
          ]),

          // Colour and quantity ordered
          m('.fields', [
            m('.twelve wide field', [
              m('label', 'Colour'),
              m('p', { onclick: () => isPowderSelectorOpen = true }, job.get('colour') || 'Select Powder')
            ]),
            m('.four wide field', [
              m('label', 'Qty Ordered'),
              m('input[type=number][min=0]', {
                value: job.get('quantityOrdered'),
                oninput: e => job.set('quantityOrdered', Number(e.target.value)),
                disabled: job.get('quantityDelivered') > 0
              })
            ]),
          ]),

          // Notes
          m('.field', [
            m('label', 'Notes'),
            m('textarea[rows=2]', {
              value: job.get('jobNotes'),
              oninput: e => job.set('jobNotes', e.target.value)
            })
          ]),

        ]),

      ]
    }
  }
}

const PackingSlipDetails = {
  view({ attrs }) {
    const { job, edit } = attrs
    return m('.ui positive message', [
      m('.header', 'Packing Slip'),
      m('p', [
        'Delivered ', 
        m('strong', job.get('quantityDelivered')), 
        ' on ',
        job.get('dateDelivered') ? format(job.get('dateDelivered'), 'dd/MM/yyyy') : 'unknown date',
        job.get('chainSpaces') && ` (${job.get('chainSpaces')} spaces)`,
        job.get('timeTakenMinutes') > 0 && ` (${job.get('timeTakenMinutes')} minutes)`,
        ' ',
        m('a', { onclick: edit }, 'Edit')
      ])
    ])
  }
}
