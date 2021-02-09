import m from 'mithril'

// inc./decremented with new modals so body scroll bars can be removed/replaced
let numberOfOverlays = 0 

const target = document.getElementById('root')

export default function() {
  let dom, children

  const Content = {
    view() {
      return children
    }
  }

  return {
    oncreate(vnode) {
      children = vnode.children
      dom = document.createElement('div')
      dom.className = 'ui active page dimmer overlay'
      // document.body.appendChild(dom)
      target.appendChild(dom)
      m.mount(dom, Content)
      numberOfOverlays++
      document.body.style.overflow = 'hidden'
    },
    onbeforeupdate(vnode) {
      children = vnode.children
    },
    onbeforeremove() {
      dom.classList.add('hide')
      return new Promise(r => {
        dom.addEventListener('animationend', r)
      })
    },
    onremove() {
      m.mount(dom, null)
      numberOfOverlays--
      if (numberOfOverlays <= 0) {
        document.body.style.overflow = 'visible'
      }
      // document.body.removeChild(dom)
      target.removeChild(dom)
    },
    view() {}
  }
}