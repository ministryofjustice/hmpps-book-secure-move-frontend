// Copied from https://github.com/ministryofjustice/hmpps-strengths-based-needs-assessments-ui/blob/c1d2e0ac64ce2be0ea0a27919cd34f8882b2d5c0/server/%40types/hmpo-form-wizard/index.d.ts

/* eslint-disable max-classes-per-file */
import { NextFunction, Response } from 'express'

declare module 'hmpo-form-wizard' {
  import Express from 'express'

  // These enums have to live here because of TS/Jest and Enums work..  ¯\_(ツ)_/¯
  // Also this ESLint override because of how TS/Eslint works.
  // eslint-disable-next-line no-shadow
  export const enum FieldType {
    Text = 'TEXT',
    Radio = 'RADIO',
    CheckBox = 'CHECKBOX',
    TextArea = 'TEXT_AREA',
    Date = 'DATE',
    Dropdown = 'DROPDOWN',
  }

  // eslint-disable-next-line no-shadow
  export const enum ValidationType {
    String = 'string',
    Regex = 'regex',
    Required = 'required',
    Email = 'email',
    MinLength = 'minlength',
    MaxLength = 'maxlength',
    ExactLength = 'exactlength',
    Alpha = 'alpha',
    AlphaEx = 'alphaex',
    AlphaEx1 = 'alphaex1',
    Alphanumeric = 'alphanum',
    AlphanumericEx = 'alphanumex',
    AlphanumericEx1 = 'alphanumex1',
    Numeric = 'numeric',
    Equal = 'equal',
    PhoneNumber = 'phonenumber',
    UKMobileNumber = 'ukmobilephone',
    Date = 'date',
    DateYear = 'date-year',
    DateMonth = 'date-month',
    DateDay = 'date-day',
    BeforeDate = 'before',
    AfterDate = 'after',
    Postcode = 'postcode',
    Match = 'match',
    BeforeDateField = 'beforeField',
    AfterDateField = 'afterField',
  }

  // eslint-disable-next-line no-shadow
  export const enum FormatterType {
    Trim = 'trim',
    Boolean = 'boolean',
    Uppercase = 'uppercase',
    Lowercase = 'lowercase',
    RemoveSpaces = 'removespaces',
    SingleSpaces = 'singlespaces',
    Hyphens = 'hyphens',
    Apostrophes = 'apostrophes',
    Quotes = 'quotes',
    RemoveRoundBrackets = 'removeroundbrackets',
    RemoveHyphens = 'removehyphens',
    RemoveSlashes = 'removeslashes',
    UKPhonePrefix = 'ukphoneprefix',
    Base64Decode = 'base64decode',
  }

  // eslint-disable-next-line no-shadow
  export const enum Gender {
    NotKnown = 0,
    Male = 1,
    Female = 2,
    NotSpecified = 9,
  }

  function FormWizard(steps: FormWizard.Steps, fields: FormWizard.Fields, config: FormWizardConfig)

  namespace FormWizard {
    type Conditional = string | string[] | { html?: string; name?: string; id?: string }
    type ConditionFn = (isValidated: boolean, values: Record<string, string | Array<string>>) => boolean
    type SectionProgressRule = { fieldCode: string; conditionFn: ConditionFn }

    interface Request extends Omit<Express.Request, 'flash'> {
      flash: (type: string, data?: any) => void
      form: {
        values: Record<string, string | string[]>
        options: {
          allFields: { [key: string]: Field }
          journeyName: string
          section: string
          sectionProgressRules: Array<SectionProgressRule>
          fields: Fields
          steps: Steps
          locals: Record<string, boolean | string>
          next?: string
          fullPath?: string
        }
        persistedAnswers: Record<string, string | string[]>
      }
      isEditing: boolean
      journeyModel: {
        set: (key: string, value: any) => void
        get: (key: string) => unknown
        unset: (key: string) => unknown
        reset: () => unknown
      }
      sessionModel: {
        updateSessionData(changes: object): unknown
        save(): void
        set: (key: string, value: unknown, options?: { silent?: boolean }) => void
        get: <T>(key: string) => T
        reset: () => unknown
        unset: (key: string | string[]) => void
        toJSON: () => object
      }
    }

    class Controller {
      constructor(options: unknown)

      middlewareSetup(): void

      use(...args: ((req: Request | Express.Request, res: Express.Response, next: Express.NextFunction) => any)[]): any

      get(req: Request, res: Express.Response, next: Express.NextFunction): Promise

      post(req: Request, res: Express.Response, next: Express.NextFunction): Promise

      configure(req: Request, res: Express.Response, next: Express.NextFunction): Promise

      process(req: Request, res: Express.Response, next: Express.NextFunction): Promise

      validate(req: Request, res: Express.Response, next: Express.NextFunction): Promise

      validateFields(req: FormWizard.Request, res: Express.Response, callback: (errors: any) => void)

      // eslint-disable-next-line no-underscore-dangle
      _locals(req: Request, res: Express.Response, next: Express.NextFunction): Promise

      locals(req: Request, res: Express.Response, next: Express.NextFunction): object

      getValues(req: Request, res: Express.Response, next: (err: any, values?: any) => void): Promise

      saveValues(req: Request, res: Express.Response, next: Express.NextFunction): Promise

      successHandler(req: Request, res: Express.Response, next: Express.NextFunction): Promise | void

      errorHandler(error: Error, req: Request, res: Express.Response, next: Express.NextFunction): Promise

      setErrors(error: Error, req: Request, res: Express.Response)

      getErrors(req: Request, res: Express.Response)

      render(req: FormWizard.Request, res: Express.Response, next: NextFunction)

      setStepComplete(req: FormWizard.Request, res: Express.Response, path?: string)
    }

    namespace Controller {
      type Options = {
        key?: string
        errorGroup?: string
        field?: string
        type?: string
        redirect?: string
        url?: string
        message?: string
        headerMessage?: string
      }

      export class Error {
        key: string

        type: string

        args: { [key: string]: any }

        constructor(key?: string, options = {}, req?: Request): void
      }
    }

    namespace Field {
      type Option = {
        text: string
        value: string
        checked?: boolean
        conditional?: Conditional
        hint?: { text: string } | { html: string }
        behaviour?: string
        kind: 'option'
        summary?: {
          displayFn?: (text: string, value: string) => string
        }
      }

      type Divider = {
        divider: string
        kind: 'divider'
      }

      type Options = Array<Option | Divider>
    }

    type AnswerValue = string | number | Array<string | number>

    type FormatterFn = (val: AnswerValue) => AnswerValue

    type Formatter =
      | { type: FormatterType; arguments?: (string | number)[] }
      | { fn: FormatterFn; arguments?: (string | number)[] }

    type ValidatorFn = (val: AnswerValue, ...args: any) => boolean

    type Validate =
      | string
      | ValidatorFn
      | { type: ValidationType; arguments?: (string | number | object)[]; message: string }
      | { fn: ValidatorFn; arguments?: (string | number | object)[]; message?: string }

    type Dependent = { field: string; value: string | string[]; displayInline?: boolean }

    type Hint = { kind?: 'html'; html: string } | { kind?: 'text'; text: string }

    interface Item {
      text?: string
      value: string
      label?: string
      conditional?: Conditional
      id?: string
      hint?: Hint
    }

    interface Field {
      attributes?: { [attribute: string]: string | number }
      default?: string | number | []
      name?: string
      text?: string
      component?: string
      prefix?: string
      code?: string
      id?: string
      hint?: Hint
      type?: FieldType
      fieldset?: {
        legend: {
          text: string
          classes: string
        }
      }
      errorMessages?: { [type: string]: string }
      multiple?: boolean
      options?: FormWizard.Field.Options
      formatter?: Formatter[]
      validate?: Validate[]
      dependent?: Dependent
      invalidates?: string[]
      value?: string | string[]
      labelClasses?: string
      formGroupClasses?: string
      characterCountMax?: number
      classes?: string
      items?: {
        key?: string
        text?: string
        value: string
        label?: string
        conditional?: Conditional
        id?: string
        hint?: Hint
      }[]
      summary?: {
        displayFn?: (value: string) => string
        displayAlways?: boolean
      }
      errorMessage?: { href: string; text: string }
    }

    interface Fields {
      [key: string]: Field
    }

    namespace Step {
      type NextStepCondition = (req: Request, res: Response) => boolean
      type Op = (fieldValue, req, res, con) => boolean
      type FieldValueCondition = { field: string; op?: string | Op; value: string | string[]; next: NextStep }
      type CallbackCondition = { fn: NextStepCondition; next: string }

      type NextStep = FieldValueCondition | CallbackCondition | string | NextStep[]
    }

    interface Step {
      pageTitle?: string
      reset?: boolean
      entryPoint?: boolean
      template?: string
      next?: FormWizard.Step.NextStep
      fields?: string[]
      controller?: typeof FormWizard.Controller
      navigationOrder?: number
      backLink?: string
      section?: string
      sectionProgressRules?: Array<SectionProgressRule>
      noPost?: boolean
      locals?: Record<string, boolean | string>
      invalid?: boolean
    }

    interface RenderedStep {
      pageTitle: string
      reset?: boolean
      entryPoint?: boolean
      template?: string
      next?: FormWizard.Step.NextStep
      fields?: Fields
      controller?: typeof FormWizard.Controller
      navigationOrder?: number
      backLink?: string
      section: string
      sectionProgressRules?: Array<SectionProgressRule>
    }

    interface Steps {
      [key: string]: Step
    }

    interface RenderedSteps {
      [key: string]: RenderedStep
    }

    interface Answers {
      [key: string]: string | string[]
    }
  }

  export default FormWizard
}
/* eslint-enable max-classes-per-file */
