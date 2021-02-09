import m from 'mithril'
import format from 'date-fns/format'
import parse from 'date-fns/parse'

export default function({ attrs }) {
  const { job } = attrs
  // let isOpen = false
  let isSaving = false
  let quantityDelivered
  let dateDelivered = new Date
  let snapshot
  // function updateSnapshot() {
  //   snapshot = JSON.stringify({ quantityDelivered, dateDelivered })
  // }
  // function isDirty() {
  //   return JSON.stringify({ quantityDelivered, dateDelivered }) !== snapshot
  // }
  // function isValid() {
  //   return quantityDelivered > 0 && typeof dateDelivered === 'object'
  // }
  // function revert() {
  //   const original = JSON.parse(snapshot)
  //   quantityDelivered = original.quantityDelivered
  //   dateDelivered = new Date(original.dateDelivered)
  // }
  function save() {
    isSaving = true
    job.save()
      .then(() => {
        isSaving = false
        // updateSnapshot()
        m.redraw()
      })
  }
  return {
    // oninit({ attrs }) {
    //   const { job } = attrs
    //   if (job.get('dateDelivered')) dateDelivered = job.get('dateDelivered')
    //   if (job.get('quantityDelivered')) quantityDelivered = job.get('quantityDelivered')
    //   updateSnapshot()
    // },
    view({ attrs }) {
      const { job, onClose } = attrs
      return m('.ui small active modal', [
        m('.header', `Packing Slip ${job.get('jobNumber')}`),
        m('.content', m(PackingSlipFormBody, { job })),
        m('.actions', [
          job.isFinished() && !job.dirty() && m('.ui left floated basic button', {
            onclick: () => window.print()
          }, [
            m('i.print icon'),
            'Packing Slip'
          ]),
          job.dirty() && [
            m('button.ui primary button', { 
              disabled: !job.isPackingSlipValid(),
              onclick: save
            }, isSaving ? 'Saving...' : 'Save'),
            m('.ui button', {
              onclick: () => job.revert(),
            }, 'Undo Changes')
          ],
          !job.dirty() && m('button.ui button', { 
            onclick: onClose
          }, 'Close')
        ])
      ])
    }
  }
}

export const PackingSlipFormBody = {
  view({ attrs }) {
    return m('.ui form', [
      m('.fields', [
        // m('.field', [
        //   m('label', 'Qty ordered'),
        //   m('input[readonly]', { value: attrs.job.get('quantityOrdered') })
        // ]),
        m('.field', [
          m('label', 'Qty delivered'),
          m('input[type=number]', {
            value: attrs.job.get('quantityDelivered'),
            oninput: e => attrs.job.set('quantityDelivered', Number(e.target.value))
          })
        ]),
        m('.field', [
          m('label', 'Date delivered'),
          m('input[type=date]', {
            value: attrs.job.get('dateDelivered') ? format(attrs.job.get('dateDelivered'), 'yyyy-MM-dd') : '',
            onchange: e => {
              attrs.job.set('dateDelivered', parse(e.target.value, 'yyyy-MM-dd', new Date()))
            }
          })
        ])
      ]),
      m('.fields', [
        m('.field', [
          m('label', 'Chain spaces'),
          m('input[type=number]', {
            value: attrs.job.get('chainSpaces'),
            oninput: e => attrs.job.set('chainSpaces', Number(e.target.value))
          })
        ]),
        m('.field', [
          m('label', 'Time taken (minutes)'),
          m('input[type=number]', {
            value: attrs.job.get('timeTakenMinutes'),
            oninput: e => attrs.job.set('timeTakenMinutes', Number(e.target.value))
          })
        ]),
        m('.field', [
          m('label', 'Sprayer(s)'),
          m('input[type=number]', {
            value: attrs.job.get('sprayer'),
            oninput: e => attrs.job.set('sprayer', e.target.value)
          })
        ])
      ])
    ])
  }
}