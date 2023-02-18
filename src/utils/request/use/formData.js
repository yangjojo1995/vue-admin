
function formDataAppend (formData, key, value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      formDataAppend(formData, `${key}[]`, item)
    }
  } else if ((value instanceof File) || (value instanceof Blob)) {
    formData.append(key, value, value.name)
  } else if (value && typeof value === 'object') {
    for (const itemKey of Object.keys(value)) {
      formDataAppend(formData, `${key}[${itemKey}]`, value[itemKey])
    }
  } else {
    formData.append(key, value)
  }
}

function objectToFormData (data) {
  const formData = new FormData()
  for (const key of Object.keys(data)) {
    formDataAppend(formData, key, data[key])
  }
  return formData
}

export default function (axios) {
  axios.interceptors.request.use(function (config) {
    if (config.formData && !(config.data instanceof FormData)) {
      config.data = objectToFormData(config.data)
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })
}
