import { makeModel } from "../utils/schema.js"

export const ErrorReturn = makeModel({

  schema: {
    error: { type: "string", valid: true }
  },

  build: message => ({ model: { error: message } }),
})

export const ValueErrorReturn = makeModel({

  schema: {
    given: { type: "any", valid: true },
    error: { type: "string", valid: true },
  },

})

export const ErrorsReturn = makeModel({

  schema: {
    errors: {
      type: "dict",
      valid: true,
      item: { type: ValueErrorReturn }
    }
  },

  build: errors => ({ model: { errors: errors } }),
})
