import React, { Component } from 'react'
import {Image, Thumbnail, Col, Row} from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import Form from 'react-jsonschema-form'
import SchemaField from 'react-jsonschema-form/lib/components/fields/SchemaField'
import { AsyncSingleObjectSelectorField } from '../../libs/JsonSchemaForm/TypeaheadSelector/SingleObjectSelector'
import { AsyncStringSelectorField } from '../../libs/JsonSchemaForm/TypeaheadSelector/StringSelector'

const CustomSchemaField = function (props) {
  const customProps = {};
  const { onChange, name, schema } = props
  if (name && schema) {
    const formContext = props.registry.formContext
    customProps.onChange = (formData) => {
      console.log({custom: formData})
      switch (schema['compas:type']) {
        case 'attribute': 
          formContext.onAttributeChange(name, formData, schema['compas:xpath'])
          break
        
        case 'measurement':
          formContext.onMeasurementChange(name, formData, schema['compas:xpath'])
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
  AsyncStringSelectorField,
  SchemaField: CustomSchemaField
}

class Technology extends Component {
  
  constructor(props){
    super(props)
    this.patch = []
  }
  handleChange = (update) => {
    // console.log({update})
  }


  handleSubmit = ({formData}) => {
    console.log({formData})
  }

  onAttributeChange = (name, data, xpath) => {
    console.log({ name, data, xpath})
    this.patch = this.patch.filter(x => x.replace && x.replace.select !== xpath)
    this.patch.push({ replace: { select: xpath, content: data}}) // apply: 'attributeFunc'
    console.log(JSON.stringify(this.patch))
  }

  onMeasurementChange = (name, data, xpath) => {
      console.log({ name, data, xpath})
      this.patch = this.patch.filter(x => x.replace && x.replace.select !== xpath)
      this.patch.push({ replace: { select: xpath, content: data}}) // apply: 'measurementFunc'
      console.log(JSON.stringify(this.patch))
  }

  render() {
    const dataSchema = {
      type: 'object',
      title: 'NBD Team Document',
      required: ['company', 'creator'],
      properties: {
        company: {
          type: 'object',
          title: 'Company',
          properties: {
            name: {
              type: 'string',
              title: 'Company Name'
            },
            uri: {
              type: 'string',
              title: 'Company URI'
            }
          }
        },
        creator: {
          type: 'object',
          title: 'Creator',
          properties: {
            id: {
              type: 'string'
            },
            name: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string'
                },
                lastName: {
                  type: 'string'
                },
                displayName: {
                  type: 'string'
                }
              }
            },
            location: {
              type: 'object',
              properties: {
                city: {
                  type: 'string'
                },
                state: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                }
              }
            },
            contact: {
              type: 'object',
              properties: {
                phone: {
                  type: 'string'
                },
                email: {
                  type: 'string'
                }
              }
            }
          }
        },
        technologies: {
          type: 'array',
          title: 'Technologies',
          items: {
            type: 'string'
          }
        }
      }
    }
  
    const uiSchema = {
      company: {
        'ui:field': 'AsyncSingleObjectSelectorField',
        asyncSingleObjectSelector: {
          url: "/api/value/typeahead-taxonomy-concepts/nbdCompany",
          method: "GET",
          labelKey: "label",
          minLength: 0,
          attributes: [
            {
              labelKey: 'country',
              title: null,
              col: 3
            },
            {
              labelKey: 'homepage',
              title: null,
              col: 9
            }
          ]
        }
      },
      creator: {
        'ui:field': 'AsyncSingleObjectSelectorField',
        asyncSingleObjectSelector: {
          url: "/api/value/typeahead-user-profiles",
          method: "GET",
          labelKey: ["name", "displayName"],
          filterBy: ["id"],
          minLength: 2,
          attributes: [
            {
              labelKey: ["id"],
              title: null,
              highlight: true,
              col: 1
            },
            {
              labelKey: ["contact", "email"],
              title: null,
              highlight: true,
              col: 3
            },
            {
              labelKey: ["organization", "business"],
              title: null,
              col: 2
            },
            {
              labelKey: ["organization", "title"],
              title: null,
              col: 3
            },
            {
              labelKey: {
                label: {
                  fields: [
                    ["location", "city"],
                    ["location", "state"],
                    ["location", "country"],
                  ],
                  separator: ', '
                }
              },
              title: null,
              col: 3
            },
          ]
        }
      },
      technologies: {
        'ui:field': 'AsyncStringSelectorField',
        asyncStringSelector: {
          url: "/api/value/typeahead-user-profiles",
          method: "GET",
          labelKey: "id",
          minLength: 2,
          multiple: true,
          allowNew: true,
          newSelectionPrefix: "Add a new item: ",
        }
      }
    }

    return <>
      <h2 style={{textAlign: 'center', color: '#999'}}>Sorry. This section is still under development</h2>
      <Row>
        <Col xs={3}></Col>
        <Col xs={6}>
          <Form
            fields={fields}
            formData={{
              company: {
                name: 'ACME Corp',
                uri: 'http://dupont.com/vocab/water-solutions/fc56c117-2c27-11b2-80fb-005056bba47c'
              }
            }}
            schema={dataSchema}
            uiSchema={uiSchema}
            onChange={this.handleChange}
            formContext={{uriPrefix: '/test/file/abc/'}}
            liveValidate={true}
            showErrorList={false}
            onSubmit={this.handleSubmit}
          >
            {/* <div/> */}
          </Form>
        </Col>
        <Col xs={3}></Col>
      </Row>
    </>
  }
}

export default withRouter(connect(null, {})(Technology))
