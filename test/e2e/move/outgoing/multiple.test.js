import { Selector } from 'testcafe'

import { E2E } from '../../../../config'
import { outgoingMoves, home } from '../../_routes'
import { page } from '../../pages'

fixture('Multiple Windows').page(home)

test.before(async t => {
  await page.signIn(E2E.USERS.POLICE)
})('Load multiple outgoing pages', async t => {
  // First page
  await page.chooseLocation({ position: 0 })
  await t.navigateTo(outgoingMoves)
  const initialOutgoingUrl = await t.eval(() => document.documentURI)
  const initialLocationTitle = await Selector('.moj-organisation-nav__title')
    .innerText

  // Second page
  await t.navigateTo(`${home}/locations`)
  await page.chooseLocation({ position: 1 })
  const secondLocationTitle = await Selector('.moj-organisation-nav__title')
    .innerText
  await t
    .expect(initialLocationTitle)
    .notEql(secondLocationTitle, 'first and second locations are not different')

  await t.navigateTo(initialOutgoingUrl)
  const reloadedLocationTitle = await Selector('.moj-organisation-nav__title')
    .innerText
  await t
    .expect(secondLocationTitle)
    .eql(reloadedLocationTitle, 'first and second locations are different')

  const initialLocationContent =
    await Selector('span').withText(initialLocationTitle).exists
  await t.expect(initialLocationContent).ok('first location not found on page')
})
