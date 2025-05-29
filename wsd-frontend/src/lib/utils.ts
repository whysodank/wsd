import WSDTailwindConfig from '~/tailwind.config'

import { NextRequest, NextResponse } from 'next/server'

import React from 'react'

import _ from 'lodash'

import { LONG_DATE_FORMAT, SHORT_DATETIME_FORMAT, SHORT_DATE_FORMAT } from '@/lib/constants'

import { type ClassValue, clsx } from 'clsx'
import { format } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import resolveConfig from 'tailwindcss/resolveConfig'
import { parse, stringify } from 'uuid'

export const tailwindConfig = resolveConfig(WSDTailwindConfig)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// We don't care about the function, we are just passing some attributes to it to be used
// by namespacing the function itself rather than having to create a class or some similar structure
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function withAttributes<T extends Record<string, string | boolean | Function | number | object>>(
  fn: Function, // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  attributes: T
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
): Function & T {
  Object.keys(attributes).forEach((key) => {
    // Usage
    //
    //  const myFunction = assignAttributesToFunction(function() {}, {"foo": "bar"})
    //  myFunction.foo // TS successfully detects that foo is a string
    //  myFunction.baz // TS successfully figures baz doesn't exist on the returned function
    //
    // This type error is contained only within this function, so it actually works perfectly
    // @ts-ignore
    fn[key] = attributes[key]
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return fn as Function & T
}

export function makeCallable<T, R>(originalCallable: (arg: T) => R) {
  // Usage
  //
  // I hate writing () => someFunction(data) for everything that needs a function
  // This utility allows me to turn
  // <SomeComponent onClick={() => someFunction(data))} />
  // into
  // <SomeComponent onClick={makeCallable(someFunction)(data)} />
  return (data: T) => () => originalCallable(data)
}

export function slugify(value: string, allowUnicode: boolean = false): string {
  /**
   * Convert to ASCII if 'allowUnicode' is false. Convert spaces or repeated
   * dashes to single dashes. Remove characters that aren't alphanumerics,
   * underscores, or hyphens. Convert to lowercase. Also strip leading and
   * trailing whitespace, dashes, and underscores.
   */
  // Django's slugify function ported to typescript, so we can save some api calls.
  if (allowUnicode) {
    value = value.normalize('NFKC')
  } else {
    value = value
      .normalize('NFKD')
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/[\r\n]+/g, '')
      .trim()
  }

  value = value.replace(/[^\w\s-]/g, '').toLowerCase()

  return value.replace(/[-\s]+/g, '-').replace(/^[-_]+|[-_]+$/g, '')
}

export function checkRequiredKeys<T extends Record<string, unknown>, C extends Record<string, Array<keyof T>>>(
  obj: T,
  conditions: C
): keyof C {
  /**
   * Check if the object has exactly one of the required key groups.
   * Used when a function can take multiple different sets of arguments but only some of them make sense together.
   * For instance, a function that can take either "a" or "b and c" but not both at the same time, and at least one set is required.
   **/
  // Usage
  //
  // const obj1 = { a: 1, b: undefined, c: undefined, d: undefined, e: undefined };
  // const obj2 = { a: undefined, b: 1, c: 2, d: undefined, e: undefined };
  // const obj3 = { a: undefined, b: undefined, c: undefined, d: 1, e: 2 };
  // const conditions = {
  //   conditionName: ["a"],
  //   condition2Name: ["b", "c"],
  //   condition3Name: ["d", "e"]
  // };
  //
  // checkRequiredKeys(obj1, conditions); // "conditionName"
  // checkRequiredKeys(obj2, conditions); // "condition2Name"
  // checkRequiredKeys(obj3, conditions); // "condition3Name"
  // checkRequiredKeys({ a: 1, b: 2, c: 3 }, conditions); // Throws error

  const matchingConditions = Object.entries(conditions).filter(
    ([_, keys]) =>
      keys.every((key) => obj[key] !== undefined) &&
      Object.keys(obj).every((key) => keys.includes(key as keyof T) || obj[key] === undefined)
  )

  if (matchingConditions.length !== 1) {
    throw new Error(`Object keys do not match exactly one required condition. ${JSON.stringify(conditions)}`)
  }

  return matchingConditions[0][0] as keyof C
}

export function getLazyValue<T>(input: T | (() => T)) {
  /**
   * Get the value of a lazy value, which can be either a function or a value.
   */
  if (typeof input === 'function') {
    return (input as () => T)()
  }
  return input
}

export async function getLazyValueAsync<T>(input: T | (() => Promise<T>) | (() => T)) {
  /**
   * Get the value of a lazy value, which can be either a function, an async function or a value.
   */
  if (typeof input === 'function') {
    const result = (input as () => Promise<T>)()
    if (result instanceof Promise) {
      return await result
    }
    return result
  }
  return input
}

export function runMiddlewareIfPathMatches(path: RegExp, exemptNextPaths: boolean = true) {
  return function (middleware: (request: NextRequest) => Promise<NextResponse | void>) {
    return async function (request: NextRequest) {
      const nextPatterns = [/^\/_next/]
      const wellKnownPatterns = [/^\/.well-known/]
      const publicPatterns = [
        // TODO: read the src/public directory and generate this list
        // icons
        /apple-icon.png/,
        /favicon.ico/,
        /icon.png/,
        /icon.svg/,
        /web-app-manifest-192x192.png/,
        /web-app-manifest-512x512.png/,
        // meta
        /robots.txt/,
        /humans.txt/,
        /manifest.json/,
      ]

      const ignoredPatterns = [...nextPatterns, ...wellKnownPatterns, ...publicPatterns]

      if (exemptNextPaths && _.some(ignoredPatterns, (pattern) => pattern.test(request.nextUrl.pathname))) {
        return
      }

      if (path.test(request.nextUrl.pathname)) {
        return await middleware(request)
      }
    }
  }
}

export function formattedDate(dateFormat: string, date?: Date) {
  return format(date || new Date(), dateFormat)
}

export function longFormattedDate(date?: Date) {
  return formattedDate(LONG_DATE_FORMAT, date || new Date())
}

export function shortFormattedDate(date?: Date) {
  return formattedDate(SHORT_DATE_FORMAT, date || new Date())
}

export function shortFormattedDateTime(date?: Date) {
  return formattedDate(SHORT_DATETIME_FORMAT, date || new Date())
}

export function optionalDate(date?: string) {
  return date ? new Date(date) : undefined
}

export function preventDefault<T extends (event: Event) => unknown>(callable: T): T {
  return async function (event: Event) {
    event.preventDefault()
    return await callable(event)
  } as T
}

export function uuidV4toHEX(uuid: string) {
  return Buffer.from(parse(uuid)).toString('hex')
}

export class InvalidHEXError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'InvalidHEXError'
    Object.setPrototypeOf(this, InvalidHEXError.prototype)
  }
}

export function hexToUUIDv4(hex: string): string {
  if (!/^[0-9a-fA-F]{32}$/.test(hex)) {
    throw new InvalidHEXError('Invalid hex string. Must be 32 hexadecimal characters.')
  }
  return stringify(Buffer.from(hex, 'hex'))
}

export function suppress<T, ERT>(
  exceptions: Array<new (message?: string) => Error>,
  fn: () => T,
  onError?: (error: unknown) => ERT
): T | ERT | undefined {
  try {
    return fn()
  } catch (error) {
    if (exceptions.some((exception) => error instanceof exception)) {
      return onError ? onError(error) : undefined
    }
    throw error
  }
}

export function setKeyValueToObjectIfValue(key: string, value: unknown, object: Record<string, unknown>) {
  if (value) {
    object[key] = value
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as Data URL'))
      }
    }
    reader.onerror = (error) => reject(error)
  })
}

export function noopLayout() {
  return function Layout({ children }: { children: React.ReactNode }) {
    return React.createElement(React.Fragment, null, children)
  }
}

/**
 * Converts a URLSearchParams object into a Record where values can be of type T,
 * or arrays of type T when multiple values exist for the same key.
 *
 * @template T The type of values in the resulting record (defaults to string | number | boolean)
 * @param searchParamsObj - URLSearchParams object to convert
 * @param valueTransformer - Optional function to transform string values to type T
 * @returns A record with search parameter keys and their values
 */
export function searchParamsToRecord<T = string | number | boolean>(
  searchParamsObj: URLSearchParams,
  valueTransformer?: (value: string, key: string) => T
): Record<string, T | T[]> {
  return Array.from(searchParamsObj).reduce(
    (data, [key, value]) => {
      // Transform the value if a transformer is provided
      const transformedValue = valueTransformer ? valueTransformer(value, key) : (value as unknown as T)

      if (key in data) {
        if (Array.isArray(data[key])) {
          ;(data[key] as T[]).push(transformedValue)
        } else {
          data[key] = [data[key] as T, transformedValue]
        }
      } else {
        data[key] = transformedValue
      }
      return data
    },
    {} as Record<string, T | T[]>
  )
}
