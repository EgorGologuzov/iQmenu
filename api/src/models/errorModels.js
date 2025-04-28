
export const ErrorReturn = Object.freeze({

  schema: {
    error: { type: "string", valid: true }
  },

  build: message => ({ model: { error: message } }),
})

export const ErrorsReturn = Object.freeze({

  schema: {
    errors: {
      type: "dict",
      valid: true,
      itemSchema: {
        given: { type: "any", valid: true },
        error: { type: "string", valid: true },
      }
    }
  },

  build: errors => ({ model: { errors: errors } }),
})
