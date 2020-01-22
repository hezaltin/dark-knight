import selectn from "selectn"
import { isArraySchema, isObjectSchema, isStringSchema, isNumberSchema, toArray } from "./utils"

export const DEFAULT_OPTIONS = {
  required: false,
  labelKey: "name",
  minLength: 1,
  placeholder: "Search...",
  ref: "typeahead",
}

export const DEFAULT_ASYNC_OPTIONS = {
  ...DEFAULT_OPTIONS,
  isLoading: false,
}

export function optionToString(fields, separator) {
  return option => {
    return fields
      .map(field => selectn(field, option))
      .filter(fieldVal => fieldVal)
      .reduce((agg, fieldVal, i) => {
        if (i === 0) {
          return fieldVal;
        } else {
          return `${agg}${separator}${fieldVal}`
        }
      }, "")
  }
}

// const labelSelectorFactory = (labelKey) => option => selectn(labelKey, option)

export function mapLabelKey(labelKey) {
  if (Array.isArray(labelKey)) {
    return option => selectn(labelKey, option)
  } else if (
    typeof labelKey === "object" &&
    labelKey.label 
  ) {
    return option => {
      let { label, description } = labelKey;
      const labelText = label.fields.map(x => selectn(x, option)).filter(x => x).map(x => x.toString()).join(label.separator || ' ')
      const descriptionText = description && description.fields.map(x => selectn(x, option)).filter(x => x).map(x => x.toString()).join(description.separator)
      return description ? `${labelText} ( ${descriptionText} )` : labelText
    }
  }
  return labelKey;
}

//eslint-disable-next-line
export function applyLabelKey(obj, labelKey) {
  if (typeof obj === 'string') {
    return obj
  }
  if (typeof labelKey === "function") {
    return labelKey(obj);
  } else if (typeof labelKey === "string") {
    return selectn(labelKey, obj)
  } else {
    return obj
  }
}

function defaultValue(properties) {
  let defVal = Object.keys(properties).reduce((agg, field) => {
    if (properties[field].default !== undefined) {
      agg[field] = properties[field].default
    }
    return agg
  }, {})
  return defVal
}

function mapToObject(event, mapping, defVal) {
  let schemaEvent = Object.keys(mapping).reduce((agg, field) => {
    let eventField = mapping[field];
    if (typeof eventField === "object") {
      agg[field] = mapToObject(event, eventField, {})
    } else {
      agg[field] = selectn(eventField, event);
    }
    return agg
  }, Object.assign({}, defVal))
  return schemaEvent
}

function mapEvents(events, { type, properties, items }, mapping, labelKey) {
  if (!mapping || mapping === null) {
    if (type === "string") {
      return events.map(item => applyLabelKey(item, labelKey));
    }
    return events;
  } else if (typeof mapping === "string") {
    return events.map(event => selectn(mapping, event));
  } else if (typeof mapping === "function") {
    return events.map(event => mapping(event));
  } else if (typeof mapping === "object") {
    let defVal = defaultValue(
      properties
        ? properties
        : items && items.properties ? items.properties : {}
    );
    let mappedEvents = events.map(event => {
      return mapToObject(event, mapping, defVal);
    });
    return mappedEvents;
  }
}

export function mapToSchema(events, schema, mapping, labelKey) {
  let schemaEvents = mapEvents(events, schema, mapping, labelKey)
  return isArraySchema(schema) ? schemaEvents : schemaEvents[0]
}

function mapFromObject(data, mapping, defVal) {
  return Object.keys(mapping).reduce((agg, field) => {
    let eventField = mapping[field];
    if (typeof eventField === "object") {
      Object.assign(agg, mapFromObject(data[field], mapping, {}));
    } else {
      if(data[field]){
        agg[eventField] = data[field];
      }
    }
    return agg;
  }, defVal);
}
/**
 * 
 * @param {*} data 
 * @param {*} mapping 
 * Mapped object is converted to the object mapping takes
 */
function mapFromSchema(data, mapping) {
  if(isEmpty(data)) { 
    return
  }
  if (!mapping || mapping === null) {
    return data;
  } else if (typeof mapping === "string") {
    return { [mapping]: data };
  } else if (typeof mapping === "object") {
    return mapFromObject(data, mapping, {});
  } else {
    return data;
  }
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function toSelected(formData, schema, mapping, labelKey, options) {
  let normFormData = formData ? toArray(formData) : [];
  if (isObjectSchema(schema)) {
    return normFormData.map(selected =>
      mapFromSchema(selected, mapping)
    );
  } else if (options && (isStringSchema(schema) || isNumberSchema(schema)) && typeof mapping === "string") {
    return normFormData.map(dataItem => {
      return options.find(option => {
        if (option[mapping] === dataItem) {
          return option
        }
      })
    })
  } else {
    return normFormData;
  }
}

export function isValidFormData(data) {
  return data && !isEmpty(data);
}
