import React from 'react'
import { Button, Modal, Table } from 'react-bootstrap'
import Form from "react-jsonschema-form"
import { isEmpty, debounce, last } from 'lodash'
import * as slugify from 'slugify'
import SchemaField from 'react-jsonschema-form/lib/components/fields/SchemaField'
import { SingleObjectSelectorField, AsyncSingleObjectSelectorField } from '../../../libs/JsonSchemaForm/TypeaheadSelector/SingleObjectSelector'
import { AsyncMultiObjectSelectorField } from '../../../libs/JsonSchemaForm/TypeaheadSelector/MultiObjectSelector'
import { AsyncStringSelectorField } from '../../../libs/JsonSchemaForm/TypeaheadSelector/StringSelector'
import { toast } from 'react-toastify'
import './CreateEntry.css'
import 'react-toastify/dist/ReactToastify.css'

const CustomSchemaField = function (props) {
  const customProps = {};
  const { onChange, name, schema } = props
  if (name && schema) {
    const formContext = props.registry.formContext
    customProps.onChange = (formData) => {
      // console.log({data: formData, schema: schema})
      switch (schema['brain:value'] && schema['brain:value']['brain:valueType']) {
        case 'attribute': 
          formContext.onAttributeChange(name, formData, schema['brain:xpath'])
          break
        
        case 'data':
          formContext.onDataChange(name, formData, schema['brain:xpath'])
          break
      }
      onChange(formData)
    }
  } 

  return (
    <SchemaField {...props} {...customProps} />
  )
}

const fields = {
  AsyncSingleObjectSelectorField,
  AsyncMultiObjectSelectorField,
  AsyncStringSelectorField,
  SingleObjectSelectorField,
  SchemaField: CustomSchemaField
}

function traverse(schema) {
  // Handle schema irregularity.
  if (!schema || schema.type !== 'object') {
    return null
  }

  // Terminate recursion when reaching "measurement" or "attribute" level
  if (['measurement', 'attribute'].includes(schema['compas:type'])) {
    return null
  }

  // Recursively initiate field values
  const parsedData = {}
  Object.keys(schema['properties']).forEach((item) => {
    parsedData[item] = traverse(schema['properties'][item])
  })
  return parsedData 
}

export default class CreateEntry extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFormUpdate = this.handleFormUpdate.bind(this)
    this.formData = {}
    this.patch = [
      {
        "replace-library": {
          "at": "/ml-packages/schema/json-schema/patch.xqy",
          "ns": "http://marklogic.com/patch/apply/patch-lib"
        }
      }
    ]
  }

  // notify = () => toast(`Congrats! You've created a new NBD profile. (10 points)`)

  buildProductUri({ manufacturer, model, serialNumber }) {
    if (!manufacturer || !model || !serialNumber) {
      return undefined
    }
    const manufacturerSlug = slugify(manufacturer, {lower: true})
    const modelSlug = slugify(model, {lower: true})
    const serialNumberSlug = slugify(serialNumber, {lower: true})
    return `/content/product/${manufacturerSlug}-${modelSlug}-${serialNumberSlug}.json`
  }

  selectSchema(e) {
    this.props.selectSchema(this.props.schemaList[e.target.value], 'new-entry')
  }

  handleFormUpdate({formData}) {
    const uri = this.buildProductUri(formData)
    if (uri) {
      this.formData = formData
      this.props.checkDuplicate(uri)
    } 
  }

  handleFormSubmit ({formData}, e) {
    e.preventDefault()
    console.log({formData})
    const uri = '/nbd/companies/' + last(formData['envelope_instance_content_info_title'].uri.split('/')) + '.json'
    // const type = 'product'
    let url =  `/api/entry/formdata?schema=/nbd/companies&uri=${uri}`
    console.log({patch: this.patch})

    fetch(new URL(url, document.baseURI).toString(), {
        method: 'POST',
        credentials: "same-origin",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({patch: this.patch})
    })
    .then(res => {
      this.setState({ formCreated: true })
      this.patch = [
        {
          "replace-library": {
            "at": "/ml-packages/schema/json-schema/patch.xqy",
            "ns": "http://marklogic.com/patch/apply/patch-lib"
          }
        }
      ]
      this.props.closeModal()

      this.props.deselectSchema()
      // this.props.history.push(`/search/nbd?scope=/nbd/companies`)
      this.props.history.push(`/edit?type=/nbd/companies&uri=${uri}`)
    })
    // url = `/api/crud/${type}?uri=${uri}`
    // this.setState({showDropdown: true, url})
  }

  // submitRequest() {
  //   this.requestDoc(this.uri)
  //   this.handleClose()
  // }

  onAttributeChange = (name, data, xpath) => {
    // console.log({ name, data, xpath})
    if (data) {
      this.patch = this.patch.filter(x => !x.replace || (x.replace && x.replace.select !== xpath))
      this.patch.push({ replace: { select: xpath, content: data}}) // apply: 'attributeFunc'
      console.log(JSON.stringify(this.patch))
    }
  }

  onDataChange = (name, data, xpath) => {
      // console.log({ name, data, xpath})
      if (data) {
        this.patch = this.patch.filter(x => !x.replace || (x.replace && x.replace.select !== xpath))
        this.patch.push({ 
          replace: { 
            select: xpath,
            content: data,
            apply: "apply-prov",
          }
        }) // apply: 'measurementFunc'
        console.log(JSON.stringify(this.patch))
      }
  }

  render() {
    if (isEmpty(this.props.schema) || this.props.schema['brain:schemaType'] !== 'new-entry') {
      return null
    }
    console.log({schema: this.props.schema})
    const schema = this.props.schema
    const { dataSchema, uiSchema } = schema
    const { title, description } = dataSchema
    delete dataSchema.title
    delete dataSchema.description
    // const selection = this.props.selection
    // const schema = this.props.schema.envelope.instance

    const formContext = {
      onAttributeChange: debounce(this.onAttributeChange, 500),
      onDataChange: debounce(this.onDataChange, 500) //debounce(this.onFieldChange, 250)
    }


    const log = (type) => console.log.bind(console, type)
    return this.props.schema ? 
      <Modal show={this.props.show} onHide={this.props.closeModal} backdrop='static' keyboard={false} dialogClassName="new-entry-form" bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>Register A New <span style={{fontWeight: 600}} title={ description }>{ title }</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            (!isEmpty(this.formData) && this.props.duplicate) ? <div className="panel panel-warning errors">
              <div className="panel-heading">
                <h3 className="panel-title">Duplicate Found</h3>
              </div>
              <ul className="list-group">
                <li className="list-group-item text-warning" style={{minHeight: '48px', padding: '12px'}}>
                  <a href="#" className="btn btn-warning btn-sm" style={{position: 'absolute', top: '8px', right: '12px'}}>Edit</a>
                  URI: <span>{ this.props.uri }</span>
                </li>
              </ul>
            </div> : null
          }
          <Form 
            fields={fields}
            formContext={formContext}
            schema={ dataSchema }
            formData={ this.formData }
            uiSchema={ uiSchema }
            liveValidate={true}
            showErrorList={false}
            autocomplete='off'
            onChange={this.handleFormUpdate}
            onSubmit={this.handleFormSubmit}
            onError={log("errors")}>
            <div style={{ textAlign: "right"}}>
              <button className="btn btn-primary" type="submit" 
                disabled={this.props.checkPending || this.props.duplicate} 
                style={{ marginRight: "6px" }}>Submit</button>
              <button className="btn btn-default" type="button" onClick={this.props.closeModal}>Cancel</button>
            </div>
          </Form>
        </Modal.Body>
        {/* <Modal.Footer>
        </Modal.Footer> */}
      </Modal> : null
  }
}
