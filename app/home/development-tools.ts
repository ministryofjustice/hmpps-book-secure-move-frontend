export class DevelopmentTools {
  $module: any
  $document: any

  constructor ($module: any, $document: any) {
    this.cacheEls($module, $document)
    this.$document.getElementById($module.id).onclick = () => { this.toggleWhatsNewBanner() }
  }

  cacheEls ($module: any, $document: any) {
    this.$module = $module
    this.$document = $document
  }

  toggleWhatsNewBanner () {
    const decodedCookie = decodeURIComponent(this.$document.cookie)
    const cookies = decodedCookie.split(';')

    const result = cookies.filter(cookie => cookie.includes('banner-dismissed'))

    if (result) {
      this.$document.cookie = 'banner-dismissed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      location.reload()
    }

  }
}
