import { policeUser, supplierUser } from './roles'
import Page from './page-model'
import { clickSelectorIfExists } from './helpers'

const page = new Page()

const users = [
  {
    name: 'Police user',
    role: policeUser,
    username: page.nodes.policeUserName,
    homeButton: page.nodes.createMoveButton,
  },
  {
    name: 'Supplier user',
    role: supplierUser,
    username: page.nodes.supplierUserName,
    homeButton: page.nodes.downloadMovesButton,
  },
]

fixture`Smoke test`

users.forEach(user => {
  test(`${user.name}: logs in/signs out, navigates days and loads without errors`, async t => {
    await t.useRole(user.role).navigateTo(page.locations.home)

    await clickSelectorIfExists(page.nodes.custodySuitLocationLink)

    await t
      .expect(page.nodes.appHeader.exists)
      .ok()
      .expect(user.username.exists)
      .ok()
      .expect(user.homeButton.exists)
      .ok()
      // Navigate
      .expect(page.nodes.pageHeading.innerText)
      .eql('Today')
      .click(page.nodes.paginationPrev)
      .expect(page.nodes.pageHeading.innerText)
      .eql('Yesterday')
      .click(page.nodes.paginationToday)
      .expect(page.nodes.pageHeading.innerText)
      .eql('Today')
      .click(page.nodes.paginationNext)
      .expect(page.nodes.pageHeading.innerText)
      .eql('Tomorrow')
      // Sign out
      .navigateTo('/auth/sign-out')
      .expect(page.nodes.signInHeader.exists)
      .ok()
  })
})
