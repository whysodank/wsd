import { DependencyList, EffectCallback, useCallback, useEffect, useRef, useState } from 'react'

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

  const updateAttribute = useCallback(() => {
    if (ref.current) {
      const values = {} as Partial<Pick<T, K>>
      for (const key of attributeKeys) {
        values[key] = ref.current[key]
      }

      setAttributeValue((prevValues) => {
        const hasChanged = attributeKeys.some((key) => prevValues[key] !== values[key])
        return hasChanged ? values : prevValues
      })
    }
  }, [attributeKeys])

  useEffect(() => {
    updateAttribute()
    window.addEventListener('resize', updateAttribute)

    if (ref.current) {
      const observer = new MutationObserver(updateAttribute)
      observer.observe(ref.current, { attributes: true })

      return () => {
        window.removeEventListener('resize', updateAttribute)
        observer.disconnect()
      }
    }

    return () => {
      window.removeEventListener('resize', updateAttribute)
    }
  }, [updateAttribute])

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

export function useFilePaste({
  acceptedTypes,
  maxSize,
  targetElement,
  enabled = true,
}: {
  acceptedTypes?: string[]
  maxSize?: number
  targetElement?: HTMLElement | null
  enabled?: boolean
} = {}): {
  files: File[]
  isLoading: boolean
  error: string | null
  clearFiles: () => void
} {
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearFiles = useCallback(() => {
    setFiles([])
    setError(null)
  }, [])

  const validateFiles = useCallback(
    (pastedFiles: File[]): { valid: boolean; error?: string } => {
      if (pastedFiles.length === 0) {
        return { valid: false, error: 'No files found in clipboard' }
      }

      if (acceptedTypes && acceptedTypes.length > 0) {
        const wildcardAcceptedTypes = acceptedTypes
          .filter((type) => type.endsWith('/*'))
          .map((type) => type.slice(0, -2))
        const normalizedAcceptedTypes = acceptedTypes.map((type) => (type.endsWith('/*') ? type.slice(0, -2) : type))

        const invalidFiles = pastedFiles.filter((file) => {
          const fileType = file.type
          return (
            !normalizedAcceptedTypes.includes(fileType) &&
            !wildcardAcceptedTypes.some((wildcardType) => fileType.startsWith(wildcardType))
          )
        })
        if (invalidFiles.length > 0) {
          const invalidFileNames = invalidFiles.map((file) => file.name).join(', ')
          return {
            valid: false,
            error: `Invalid file types: ${invalidFileNames}. Accepted types: ${acceptedTypes.join(', ')}`,
          }
        }
      }

      if (maxSize) {
        const oversizedFile = pastedFiles.find((file) => file.size > maxSize)
        if (oversizedFile) {
          const fileSizeMB = (oversizedFile.size / (1024 * 1024)).toFixed(2)
          const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
          return {
            valid: false,
            error: `File "${oversizedFile.name}" (${fileSizeMB} MB) exceeds the maximum size of ${maxSizeMB} MB`,
          }
        }
      }

      return { valid: true }
    },
    [acceptedTypes, maxSize]
  )

  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      if (!enabled) return

      const { clipboardData } = event
      if (!clipboardData) return

      // Check if there are files in the clipboard
      const hasFiles = clipboardData.files && clipboardData.files.length > 0
      if (!hasFiles) return

      // Prevent default paste behavior
      event.preventDefault()
      setIsLoading(true)
      setError(null)

      try {
        const pastedFiles = Array.from(clipboardData.files)
        const validation = validateFiles(pastedFiles)

        if (!validation.valid) {
          setError(validation.error || 'Invalid files')
          setFiles([])
        } else {
          setFiles(pastedFiles)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process pasted files')
        setFiles([])
      } finally {
        setIsLoading(false)
      }
    },
    [enabled, validateFiles]
  )

  useEffect(() => {
    if (!enabled) return

    const target = targetElement || document

    target.addEventListener('paste', handlePaste as EventListener)
    return () => {
      target.removeEventListener('paste', handlePaste as EventListener)
    }
  }, [enabled, handlePaste, targetElement])

  return { files, isLoading, error, clearFiles }
}
