const noUndefined = value => value !== undefined

const onlyDefined = data =>
  typeof data === 'object' && data !== null
    ? Object.keys(data).reduce((acc, elem) => {
        const value = data[elem]
        if (value !== undefined) {
          if (Array.isArray(value)) acc[elem] = value.map(onlyDefined).filter(noUndefined)
          else if (typeof value === 'object') {
            const fValue = onlyDefined(value)
            if (Object.keys(fValue).length) acc[elem] = fValue
          } else acc[elem] = value
        }
        return acc
      }, {})
    : data

module.exports = onlyDefined
