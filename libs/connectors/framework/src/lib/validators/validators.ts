import { isEmpty, isInteger, isNil, isString } from '@linkerry/shared'
import dayjs, { OpUnitType } from 'dayjs'
import { ErrorMessages } from './errors'
import { TypedValidatorFn, ValidationInputType } from './types'
import { formatErrorMessage } from './utils'

// TODO use zod to more specific validations?

export class Validators {
  static pattern(regex: string | RegExp): TypedValidatorFn<ValidationInputType.STRING> {
    return {
      type: ValidationInputType.STRING,
      validatorName: 'pattern',
      args: [regex.toString()],
      fn: (property, processedValue, userInput) => {
        if (isEmpty(processedValue)) return null

        if (typeof regex === 'string') {
          regex = new RegExp(regex)
        }

        return regex.test(String(processedValue))
          ? null
          : formatErrorMessage(ErrorMessages.REGEX, {
              userInput,
              property: property?.displayName,
            })
      },
    }
  }

  static prohibitPattern(regex: string | RegExp): TypedValidatorFn<ValidationInputType.STRING> {
    return {
      type: ValidationInputType.STRING,
      validatorName: 'prohibitPattern',
      args: [regex.toString()],
      fn: (property, processedValue, userInput) => {
        const patternValidator = Validators.pattern(regex)
        const patternError = patternValidator.fn(property, processedValue, userInput)
        return patternError
          ? null
          : formatErrorMessage(ErrorMessages.PROHIBIT_REGEX, {
              property: property.displayName,
            })
      },
    }
  }

  static maxLength(max: number): TypedValidatorFn<ValidationInputType.STRING> {
    return {
      type: ValidationInputType.STRING,
      validatorName: 'maxLength',
      args: [max],
      fn: (property, processedValue, userInput) => {
        if (isEmpty(processedValue)) return null

        const isValid = processedValue.length <= max

        if (!isValid) {
          return formatErrorMessage(ErrorMessages.MAX_LENGTH, {
            userInput,
            length: max.toString(),
          })
        }

        return null
      },
    }
  }

  static minLength(min: number): TypedValidatorFn<ValidationInputType.STRING> {
    return {
      type: ValidationInputType.STRING,
      validatorName: 'minLength',
      args: [min],
      fn: (property, processedValue, userInput) => {
        if (isEmpty(processedValue)) return null
        const isValid = processedValue.length >= min

        if (!isValid) {
          return formatErrorMessage(ErrorMessages.MIN_LENGTH, {
            userInput,
            length: min.toString(),
          })
        }

        return null
      },
    }
  }

  static minValue(min: number): TypedValidatorFn<ValidationInputType.NUMBER> {
    return {
      type: ValidationInputType.NUMBER,
      validatorName: 'minValue',
      args: [min],
      fn: (property, processedValue, userInput) => {
        const isValid = Number(processedValue) >= min
        if (isValid) return null
        return formatErrorMessage(ErrorMessages.MIN, { userInput, min })
      },
    }
  }

  static maxValue(max: number): TypedValidatorFn<ValidationInputType.NUMBER> {
    return {
      type: ValidationInputType.NUMBER,
      validatorName: 'maxValue',
      args: [max],
      fn: (property, processedValue, userInput) => {
        const isValid = Number(processedValue) <= max
        if (isValid) return null

        return formatErrorMessage(ErrorMessages.MAX, { userInput, max })
      },
    }
  }

  static minDate(min: string, unit: OpUnitType = 'day', includeBounds = false): TypedValidatorFn<ValidationInputType.DATE_TIME> {
    return {
      type: ValidationInputType.DATE_TIME,
      validatorName: 'minDate',
      args: [min, unit, includeBounds],
      fn: (property, processedValue) => {
        const dateValue = dayjs(processedValue)
        const minDate = dayjs(min)
        if (!minDate.isValid()) return null

        const isValid = includeBounds ? dateValue.isAfter(minDate, unit) : dateValue.isSame(minDate, unit) && dateValue.isAfter(minDate, unit)

        if (isValid) return null

        return formatErrorMessage(ErrorMessages.MIN_DATE, {
          userInput: dateValue.toISOString(),
          min: minDate.toISOString(),
        })
      },
    }
  }

  static maxDate(max: string, unit: OpUnitType = 'day', includeBounds = false): TypedValidatorFn<ValidationInputType.DATE_TIME> {
    return {
      type: ValidationInputType.DATE_TIME,
      validatorName: 'maxDate',
      args: [max, unit, includeBounds],
      fn: (property, processedValue) => {
        const dateValue = dayjs(processedValue)
        const maxDate = dayjs(max)
        if (!maxDate.isValid()) return null

        const isValid = includeBounds ? dateValue.isBefore(maxDate, unit) : dateValue.isSame(maxDate, unit) && dateValue.isBefore(maxDate, unit)

        if (isValid) return null

        return formatErrorMessage(ErrorMessages.MAX_DATE, {
          userInput: dateValue.toISOString(),
          max: maxDate.toISOString(),
        })
      },
    }
  }

  static inRange(min: number, max: number): TypedValidatorFn<ValidationInputType.NUMBER> {
    return {
      type: ValidationInputType.NUMBER,
      validatorName: 'inRange',
      args: [min, max],
      fn: (property, processedValue, userInput) => {
        const numericValue = Number(processedValue)
        const isValid = numericValue <= max && numericValue >= min

        if (isValid) return null

        return formatErrorMessage(ErrorMessages.IN_RANGE, {
          userInput,
          min,
          max,
        })
      },
    }
  }

  static inDateRange(min: string, max: string, unit: OpUnitType = 'day', includeBounds = false): TypedValidatorFn<ValidationInputType.DATE_TIME> {
    return {
      type: ValidationInputType.DATE_TIME,
      validatorName: 'inDateRange',
      args: [max, unit, unit, includeBounds],
      fn: (property, processedValue) => {
        const dateValue = dayjs(processedValue)
        const minDate = dayjs(min)
        const maxDate = dayjs(max)
        const validRanges = minDate.isValid() && maxDate.isValid()
        if (!validRanges) return null

        const isValid = includeBounds
          ? (dateValue.isBefore(maxDate, unit) || dateValue.isSame(maxDate, unit)) &&
            (dateValue.isAfter(minDate, unit) || dateValue.isSame(minDate, unit))
          : dateValue.isBefore(maxDate, unit) && dateValue.isAfter(minDate, unit)

        if (isValid) return null

        return formatErrorMessage(ErrorMessages.IN_RANGE, {
          userInput: dateValue.toISOString(),
          min: minDate.toISOString(),
          max: maxDate.toISOString(),
        })
      },
    }
  }

  static number: TypedValidatorFn<ValidationInputType.NUMBER> = {
    type: ValidationInputType.NUMBER,
    validatorName: 'number',
    fn: (property, processedValue, userInput) => {
      if (isNaN(processedValue)) {
        return formatErrorMessage(ErrorMessages.NUMBER, { userInput })
      }

      return null
    },
  }

  static string: TypedValidatorFn<ValidationInputType.STRING> = {
    type: ValidationInputType.STRING,
    validatorName: 'string',
    fn: (property, processedValue, userInput) => {
      if (!isString(processedValue)) {
        return formatErrorMessage(ErrorMessages.STRING, { userInput })
      }

      return null
    },
  }

  static nonZero: TypedValidatorFn<ValidationInputType.NUMBER> = {
    type: ValidationInputType.NUMBER,
    validatorName: 'nonZero',
    fn: (property, processedValue, userInput) => {
      if (processedValue === 0) {
        return formatErrorMessage(ErrorMessages.NON_ZERO, { userInput })
      }

      return null
    },
  }

  static integer: TypedValidatorFn<ValidationInputType.NUMBER> = {
    type: ValidationInputType.NUMBER,
    validatorName: 'integer',
    fn: (property, processedValue, userInput) => {
      if (isInteger(processedValue)) {
        return formatErrorMessage(ErrorMessages.WHOLE_NUMBER, { userInput })
      }
      return null
    },
  }

  // static image: TypedValidatorFn<ValidationInputType.FILE> = {
  //   type: ValidationInputType.FILE,
  //   fn: (property, processedValue) => {
  //     const regex = /\.(jpg|svg|jpeg|png|bmp|gif|webp)$/i;

  //     return regex.test((processedValue as File).name)
  //       ? null
  //       : formatErrorMessage(ErrorMessages.IMAGE, { property: property });
  //   },
  // };

  static email: TypedValidatorFn<ValidationInputType.STRING> = {
    type: ValidationInputType.STRING,
    validatorName: 'email',
    fn: (property, processedValue, userInput) => {
      const pattern = new RegExp(
        '^(([^<>()\\[\\].,;:\\s@"]+(\\.[^<>()\\[\\].,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z-0-9]+\\.)+[a-zA-Z]{2,}))$',
      )

      if (isEmpty(processedValue)) {
        return null
      }

      if (isEmpty(processedValue)) return null

      return pattern.test(String(processedValue)) ? null : formatErrorMessage(ErrorMessages.EMAIL, { userInput })
    },
  }

  static url: TypedValidatorFn<ValidationInputType.STRING> = {
    type: ValidationInputType.STRING,
    validatorName: 'url',
    fn: (property, processedValue, userInput) => {
      const pattern = new RegExp(
        '^((https?|ftp|file)://)?' + // protocol
          '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-zA-Z\\d_]*)?$', // fragment locator
      )
      if (isEmpty(processedValue)) return null

      return pattern.test(String(processedValue)) ? null : formatErrorMessage(ErrorMessages.URL, { userInput })
    },
  }

  static datetimeIso: TypedValidatorFn<ValidationInputType.DATE_TIME> = {
    type: ValidationInputType.DATE_TIME,
    validatorName: 'datetimeIso',
    fn: (property, processedValue, userInput) => {
      if (property.required && isNil(processedValue)) {
        return formatErrorMessage(ErrorMessages.ISO_DATE, { userInput })
      }

      // Regular expression to match ISO 8601 date format
      const isoDateRegex = /^(\d{4}-\d{2}-\d{2})$/
      const isoDateTimeRegex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))$/

      return isoDateRegex.test(processedValue) || isoDateTimeRegex.test(processedValue) ? null : formatErrorMessage(ErrorMessages.ISO_DATE, { userInput })
    },
  }

  // static file: TypedValidatorFn<ValidationInputType.FILE> = {
  //   type: ValidationInputType.FILE,
  //   fn: (property, processedValue, userInput) => {
  //     if (property.required && isNil(processedValue)) {
  //       return formatErrorMessage(ErrorMessages.FILE, { userInput });
  //     }
  //     return null;
  //   },
  // };

  static phoneNumber: TypedValidatorFn<ValidationInputType.STRING> = {
    type: ValidationInputType.STRING,
    validatorName: 'phoneNumber',
    fn: (property, processedValue, userInput) => {
      const pattern = new RegExp('^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$')
      if (isEmpty(processedValue)) return null

      return pattern.test(String(processedValue)) ? null : formatErrorMessage(ErrorMessages.PHONE_NUMBER, { userInput })
    },
  }

  static oneOf(values: unknown[]): TypedValidatorFn<any> {
    return {
      type: ValidationInputType.ANY,
      validatorName: 'oneOf',
      fn: (property, processedValue, userInput) => {
        if (Array.isArray(values)) {
          return values.includes(processedValue)
            ? null
            : formatErrorMessage(ErrorMessages.ONE_OF, {
                userInput,
                choices: values,
              })
        }

        return null
      },
    }
  }

  static requireKeys(values: string[]): TypedValidatorFn<ValidationInputType.OBJECT> {
    return {
      type: ValidationInputType.OBJECT,
      validatorName: 'requireKeys',
      args: [values],
      fn: (property, processedValue, userInput) => {
        if (Array.isArray(values)) {
          const missingKeys = values.filter((key) => !processedValue[key])
          return missingKeys.length
            ? formatErrorMessage(ErrorMessages.REQUIRE_KEYS, {
                userInput,
                keys: missingKeys.join(', '),
              })
            : null
        }
        return null
      },
    }
  }
}
