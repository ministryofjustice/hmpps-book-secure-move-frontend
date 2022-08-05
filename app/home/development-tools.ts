export class DevelopmentTools {
  document: Document

  constructor($document: Document) {
    this.document = $document
  }

  attachToggleWhatsNewBanner (element: HTMLElement) {
    element.onclick = () => this.toggleWhatsNewBanner()
  }

  toggleWhatsNewBanner () {
    const decodedCookie = decodeURIComponent(this.document.cookie)
    const cookies = decodedCookie.split(';')

    if (cookies.filter(cookie => cookie.includes('banner-dismissed')).length) {
      this.document.cookie = 'banner-dismissed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      location.reload()
    }
  }
}
