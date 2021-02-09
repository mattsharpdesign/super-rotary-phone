import m from 'mithril'
import store from '../stores/job-store'
import JobListHeader from './JobListHeader'
import JobListItem from './JobListItem'
import JobStatusTabs from './JobStatusTabs'
import { Job } from '../stores/job-store'
import Overlay from './Overlay'
import { ModalJobForm } from './JobForm'

export default function() {
  let isFormOpen = false
  let currentJob = null
  function addJob() {
    currentJob = new Job()
    isFormOpen = true
  }
  function editJob(job) {
    currentJob = job
    isFormOpen = true
  }
  return {
    oninit() {
      if (!store.lastLoadedAt) store.load()
    },
    view() {
      return m('[', [
        isFormOpen && m(Overlay, m(ModalJobForm, { job: currentJob, closeForm: () => isFormOpen = false })),
        m(JobListHeader, { store, addJob }),
        m(JobStatusTabs, { store }),
        m('.ui loader', { class: store.isLoading && 'active' }),
        m('.ui divided items', [
          store.jobs.map(job => m(JobListItem, { key: job.id, job, onSelect: editJob })),
        ]),
        m('button', {
          onclick() {
            store.loadMore()
          }
        }, store.isLoading ? 'Loading...' : 'Load more')
      ])
    }
  }
}