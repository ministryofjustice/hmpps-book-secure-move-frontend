let realDateClass: typeof Date | undefined

export function mockDate(
  year: number,
  month: number,
  date: number,
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0
) {
  class MockDate extends Date {
    constructor() {
      if (arguments?.length) {
        // @ts-ignore
        super(...arguments)
      } else {
        super(year, month, date, hours, minutes, seconds)
      }
    }

    static now() {
      return new this().getTime()
    }
  }

  if (!realDateClass) {
    realDateClass = global.Date
  }

  global.Date = MockDate as unknown as typeof Date
}

export function unmockDate() {
  if (!realDateClass) {
    return
  }

  global.Date = realDateClass as typeof Date
  realDateClass = undefined
}
