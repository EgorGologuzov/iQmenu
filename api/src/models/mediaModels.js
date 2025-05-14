import { makeModel } from "../utils/schema.js";

// Модели для API

export const UploadedFile = makeModel({

  schema: {
    url: { type: "string", valid: true }
  },

  build: url => ({ model: { url: url } }),

})
