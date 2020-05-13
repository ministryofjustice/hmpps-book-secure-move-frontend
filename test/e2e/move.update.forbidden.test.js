import {
  createPrisonMove,
  createOcaMove,
  createSupplierMove,
  checkNoUpdateLinks,
  checkUpdatePagesForbidden,
} from './_move'

const checkUserCannotUpdate = () => {
  test('User should not see any update links on move page', async () => {
    await checkNoUpdateLinks()
  })

  test('User should not be able to access move update pages', async () => {
    await checkUpdatePagesForbidden()
  })
}

fixture('Existing move - Prison user').beforeEach(async () => {
  await createPrisonMove()
})
checkUserCannotUpdate()

fixture('Existing move - OCA user').beforeEach(async () => {
  await createOcaMove()
})
checkUserCannotUpdate()

fixture('Existing move - Supplier user').beforeEach(async () => {
  await createSupplierMove()
})
checkUserCannotUpdate()
