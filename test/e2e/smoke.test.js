import Page from './page-model'

const page = new Page()

fixture('Smoke test').page(page.location.home)

test('Logs in and loads the app without errors', async t => {
  await page.logIn()
  await t.expect(page.productName).eql('Book a secure move')
})
