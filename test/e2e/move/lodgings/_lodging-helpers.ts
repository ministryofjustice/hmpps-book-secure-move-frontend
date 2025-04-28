import { Selector } from 'testcafe'

import { addDays } from 'date-fns'

import {
  lodgingCancelPage,
  moveDetailPage,
  moveLodgeLengthPage,
  moveLodgeLocationPage,
  moveLodgeSavedPage,
  page,
} from '../../pages'

export async function testLodges(t: any, count: number, length: number) {
  const lodgingLocations: string[] = []

  for (let i = 0; i < count; i++) {
    // Create lodge
    await t.click(
      moveDetailPage.nodes[
        `add${i > 0 ? 'Another' : ''}LodgeButton`
      ] as Selector
    )
    lodgingLocations.push(await moveLodgeLocationPage.pickRandomLocation())
    await moveLodgeLengthPage.pickDays(length)

    // Check lodge was created
    await moveLodgeSavedPage.checkAddLodgeSuccessMessage(
      i === 0 ? new Date() : addDays(new Date(), i * length),
      length,
      lodgingLocations[i]
    )
    await t.click(moveLodgeSavedPage.nodes.moveLink as Selector)
  }

  // Check all lodges were created
  await moveDetailPage.checkLodgesInDetails(count)

  // Test that amend location works
  for (let i = 0; i < count; i++) {
    // Amend location
    await moveDetailPage.clickUpdateLodgingLocationLink(i)
    lodgingLocations[i] = await moveLodgeLocationPage.pickRandomLocation(
      lodgingLocations[i]
    )

    // Check location was amended
    await moveLodgeSavedPage.checkUpdateLodgeSuccessMessage(
      i === 0 ? new Date() : addDays(new Date(), i * length),
      length,
      lodgingLocations[i]
    )
    await t.click(moveLodgeSavedPage.nodes.moveLink as Selector)
    await t.click(moveDetailPage.nodes.detailsTab as Selector)
  }

  // Test that amend length works
  for (let i = 0; i < count; i++) {
    // Amend location
    await moveDetailPage.clickUpdateLodgingDateLink(i)

    const newLength = length === 1 ? 2 : 1
    await moveLodgeLengthPage.pickDays(newLength)

    // Check location was amended
    await moveLodgeSavedPage.checkUpdateLodgeSuccessMessage(
      i === 0 ? new Date() : addDays(new Date(), i * newLength),
      newLength,
      lodgingLocations[i]
    )
    await t.click(moveLodgeSavedPage.nodes.moveLink as Selector)
    await t.click(moveDetailPage.nodes.detailsTab as Selector)
  }

  // Cancel lodge
  await moveDetailPage.clickCancelLodgingsLink()
  await lodgingCancelPage.pickRandomReason()
  await t
    .expect(page.getCurrentUrl())
    .match(/\/move\/\w{8}(?:-\w{4}){3}-\w{12}/)

  // Check lodge was cancelled
  await moveDetailPage.checkLodgesInDetails(0)
}
