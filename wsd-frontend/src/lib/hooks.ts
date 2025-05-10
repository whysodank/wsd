import { DependencyList, EffectCallback, useEffect, useRef, useState } from 'react'

export function useElementAttributes<T extends HTMLElement, K extends keyof T>(attributeKeys: K[]) {
  /**
   * Get the value of given attributes of an element for the given ref.
   */
  // Usage
  //
  // const {
  //   ref: targetElementRef,
  //   attributeValues: { requestedAttributeValue },
  // } = useElementAttributes<SomeJSXElementThatTakesARef, keyof SomeJSXElementThatTakesARef>('requestedAttributeValue')
  //
  // requestedAttributeValue should be a key of SomeJSXElementThatTakesARef in this case
  //
  const ref = useRef<T | null>(null)
  const [attributeValues, setAttributeValue] = useState<Partial<Pick<T, K>>>({})

  useEffect(() => {
    function updateAttribute() {
      if (ref.current) {
        const values = {} as Partial<Pick<T, K>>
        for (const key of attributeKeys) {
          values[key] = ref.current[key]
        }
        setAttributeValue(values)
      }
    }

    updateAttribute()
    window.addEventListener('resize', updateAttribute)

    return () => {
      window.removeEventListener('resize', updateAttribute)
    }
  }, [attributeKeys])

  return { ref, attributeValues }
}

export function useFormState<T>(initialState: T) {
  /**
   * A hook to manage form state, errors, and event/change handlers
   */

  // Usage
  //
  // const {
  // formState,
  // setFormState,
  // formErrors,
  // setFormErrors,
  // handleFormStateValue,
  // handleFormStateEvent,
  // } = useFormState<{key: string}>({key: ''})
  //
  // formState: is the current state of the form
  // setFormState:  is a function to update the form state directly, should be rarely used
  // formErrors:  is the current form errors
  // setFormErrors:  is a function to update the form errors directly, should be rarely used
  // handleFormStateValue("key"): is a function that when called with a key, onChange={handleFormStateValue("key")}
  // handleFormStateEvent("key"): is a function that when called with a key, onEvent={handleFormStateEvent("key")}
  const [formState, setFormState] = useState<T>(initialState)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof T, string[]>> & { non_field_errors?: string[] }>()

  function resetFormState() {
    setFormState(initialState)
  }

  type InputEventType = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

  function handleFormState<K extends keyof T, HandlerInputType>({
    key,
    inputType,
  }: {
    key: K
    inputType: 'event' | 'value'
  }) {
    return (event: HandlerInputType) => {
      let value: T[K]
      if (inputType === 'event') {
        const target = (event as InputEventType).target
        value = (target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value) as T[K]
      } else {
        value = event as T[K]
      }
      setFormState((prev) => ({ ...prev, [key]: value }))
    }
  }

  const handleFormStateValue = <K extends keyof T>(key: K) => handleFormState<K, T[K]>({ key, inputType: 'value' })
  const handleFormStateEvent = <K extends keyof T>(key: K) =>
    handleFormState<K, InputEventType>({ key, inputType: 'event' })
  const handleFormStateOnClick =
    <K extends keyof T>(key: K, value: T[K]) =>
    () => {
      setFormState((prev) => ({ ...prev, [key]: value }))
    }

  return {
    formState,
    setFormState,
    formErrors,
    setFormErrors,
    handleFormStateValue,
    handleFormStateEvent,
    handleFormStateOnClick,
    resetFormState,
  }
}

export function useEffectAfterMount(effect: EffectCallback, deps: DependencyList) {
  /*
    Only run the effect after the first render, and only if the dependencies change.
   */
  const isFirstRender = useRef(true)
  const prevDepsRef = useRef<DependencyList>([])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevDepsRef.current = [...deps]
      return
    }

    if (deps.some((dep, index) => dep !== prevDepsRef.current[index])) {
      const cleanup = effect()
      prevDepsRef.current = [...deps]
      return cleanup
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
