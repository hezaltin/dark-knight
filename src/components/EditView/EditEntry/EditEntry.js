import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import merge from 'deepmerge';
import { isEmpty, debounce, last, cloneDeep, isEqual } from 'lodash';
import { connect } from 'react-redux';
import * as slugify from 'slugify';
import { isSelection, getSchema } from '../../../redux/entry/actions';
import { TypeaheadField } from 'react-jsonschema-form-extras/lib/TypeaheadField';
import './EditEntry.css';
import { Row, Col, Button } from 'react-bootstrap';
import DropdownMenu, { NestedDropdownMenu } from 'react-dd-menu';
import SchemaField from 'react-jsonschema-form/lib/components/fields/SchemaField';
import {
  SingleObjectSelectorField,
  AsyncSingleObjectSelectorField
} from '../../../libs/JsonSchemaForm/TypeaheadSelector/SingleObjectSelector';
import { AsyncMultiObjectSelectorField } from '../../../libs/JsonSchemaForm/TypeaheadSelector/MultiObjectSelector';
import { AsyncStringSelectorField } from '../../../libs/JsonSchemaForm/TypeaheadSelector/StringSelector';
import { ArrayItemRichTextEditorField } from '../../../libs/JsonSchemaForm/RichTextEditor/ArrayItemRichTextEditor';
import { FileUploaderField } from '../../../libs/JsonSchemaForm/FileUploader/FileUploader';
import { RichTextEditorField } from '../../../libs/JsonSchemaForm/RichTextEditor/RichTextEditor';
import table from 'react-jsonschema-form-extras/lib/table';
import TableTypehead from '../../../libs/JsonSchemaForm/table-form-schema';

const CustomSchemaField = function(props) {
  const customProps = {};
  const { onChange, name, schema } = props;
  if (name && schema) {
    const formContext = props.registry.formContext;
    customProps.onFormSubmit = formContext.onFormSubmit;
    customProps.onChange = formData => {
      // const {index, change, data} = formData
      // if (index !== undefined && change !== undefined && data !== undefined) {}
      switch (
        schema['brain:value'] && schema['brain:value']['brain:valueType']
      ) {
        case 'attribute':
          formContext.onAttributeChange(name, formData, schema['brain:xpath']);
          break;

        case 'data': {
          if (
            schema['brain:value']['brain:valueSchemaTemplate'] &&
            schema['brain:value']['brain:valueSchemaTemplate'][
              'brain:valueSchemaTemplateName'
            ] === 'richTextEditor'
          ) {
            // formContext.onHtmlDataChange.cancel()  // Cannot cancel debounced func in this manner
            formContext.onHtmlDataChange(name, formData, schema['brain:xpath']);
            break;
          }
          formContext.onDataChange(name, formData, schema['brain:xpath']);
          break;
        }
      }
      switch (
        !schema['brain:value'] &&
          schema.type === 'array' &&
          schema.items['brain:value'] &&
          schema.items['brain:value']['brain:valueType']
      ) {
        case 'attribute':
          formContext.onAttributeChange(name, formData, schema['brain:xpath']);
          break;

        case 'data': {
          if (
            schema.items['brain:value']['brain:valueSchemaTemplate'] &&
            schema.items['brain:value']['brain:valueSchemaTemplate'][
              'brain:valueSchemaTemplateName'
            ] === 'arrayItemRichTextEditor'
          ) {
            // formContext.onHtmlDataChange.cancel()  // Cannot cancel debounced func in this manner
            formContext.onEditorDataChange(
              name,
              formData,
              schema['brain:xpath']
            );
            return;
          }

          const xpath = schema['brain:xpath']; //+ `[${formData.index ? formData.index.toString() : 'last()+1'}]`
          formContext.onDataChange(name, formData.data, xpath);
          break;
        }
      }
      onChange(formData);
    };
  }

  return <SchemaField {...props} {...customProps} />;
};

const fields = {
  AsyncSingleObjectSelectorField,
  AsyncMultiObjectSelectorField,
  AsyncStringSelectorField,
  SingleObjectSelectorField,
  ArrayItemRichTextEditorField,
  FileUploaderField,
  RichTextEditorField,
  SchemaField: CustomSchemaField,
  table: table
};

export default class EditEntry extends Component {
  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormUpdate = this.handleFormUpdate.bind(this);

    this.state = {
      dataSchemaForm: {},
      formDataWithTable: {},
      uiSchemaForm: {},
      formData: {},
      showDropdown: false,
      selectedSchema: {},
      isMenuOpen: false,
      dropdownList: [],
      sideBarList: {},
      propertySelected: null,
      url: '',
      formCreated: false,
      unsaved: false,
      doc: props.doc,
      group: props.group,
      isRendererCalled: false
    };
    this.formData = {};
    this.patch = [
      {
        'replace-library': {
          at: '/ml-packages/schema/json-schema/patch.xqy',
          ns: 'http://marklogic.com/patch/apply/patch-lib'
        }
      }
    ];
  }
  toggle = () => {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  };

  close = () => {
    this.setState({ isMenuOpen: false });
  };

  // onSubmit = ({formData}, e) => {
  //     e.preventDefault()

  //     let test = {
  //       'patch': this.patch
  //     }

  //     fetch(new URL(this.state.url, document.baseURI).toString(), {
  //       method: 'PATCH',
  //       credentials: "same-origin",
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(test)
  //     })
  //     .then(res => {
  //       // console.log(res)
  //       this.patch = []
  //     })
  // };

  // UNSAFE_componentWillMount() {

  //   console.log('propsSelection', this.props.selection)
  // }

  componentDidUpdate(prevProps) {
    // console.log({prev: prevProps.doc, cur: this.props.doc})
    if (
      (isEmpty(prevProps.doc) && !isEmpty(this.props.doc)) ||
      !isEqual(prevProps.doc, this.props.doc)
    ) {
      this.setState({ doc: this.props.doc });
    }

    if (
      (!prevProps.group && !!this.props.group) ||
      prevProps.group !== this.props.group
    ) {
      this.setState({ group: this.props.group });
    }
    // console.log({
    //   selection: this.props.selection,
    //   prevSelection: prevProps.selection,
    //   template: this.props.template,
    //   pending: this.props.templatePending
    // })
    // console.log({
    //   1: this.props.selection && !isEmpty(this.props.selection),
    //   2: this.props.template && !isEmpty(this.props.template),
    //   3: !this.props.templatePending,
    //   4: (
    //     (isEmpty(prevProps.selection) || this.props.selection.uri !== prevProps.selection.uri) ||
    //     (!this.state.dropdownList || isEmpty(this.state.sideBarList) || isEmpty(this.state.selectedSchema))
    //   )
    // })
    // const schema = cloneDeep(sampleData['data'])
    if (
      this.props.selection &&
      !isEmpty(this.props.selection) &&
      (this.props.schema && !isEmpty(this.props.schema)) &&
      !this.props.schemaPending &&
      (isEmpty(prevProps.selection) ||
        this.props.selection.uri !== prevProps.selection.uri ||
        (!this.state.dropdownList ||
          isEmpty(this.state.sideBarList) ||
          isEmpty(this.state.selectedSchema)))
    ) {
      const schema = this.props.schema.envelope.instance.data;
      // Initiate schema with the summary section
      // let selectedSchema = {
      //     type: schema['type'],
      //     properties: {
      //       summary: schema['properties']['summary']
      //     }
      // }
      const group = 'summary';
      const subgroup = 'productInfo';
      const selectedSchema = schema.properties[group].properties[subgroup];

      // Put remaining sections in the dropdown list
      // delete schema['properties']['summary']
      let dropdownList = Object.keys(schema['properties'])
        .filter(key => key !== 'summary')
        .map(key => {
          const el = schema['properties'][key];
          return {
            key,
            title: el['title'],
            children:
              el['properties'] &&
              Object.keys(el['properties']).map(keyChild => {
                const elChild = el['properties'][keyChild];
                return {
                  key: keyChild,
                  title: elChild['title']
                };
              })
          };
        });

      let sideBarProps = Object.keys(schema['properties']).map(el => ({
        [el]: schema['properties'][el]
      }));
      let sideBarList = {};
      sideBarProps.forEach(el => {
        sideBarList[Object.keys(el)[0]] = Object.keys(
          el[Object.keys(el)[0]]['properties']
        );
      });

      this.setState({
        dropdownList,
        sideBarList,
        selectedSchema: selectedSchema,
        propertySelected: 'summary'
      });
    }
  }

  componentWillUnmount() {
    // this.props.deselectSchema()
  }

  handleClickClear = () => {
    this.props.isSelection(false);
  };

  // handleClickDropdown = (group, subgroup, i, j) => {
  //   let selectedSchema = {
  //       "type": sampleData['data']['type'],
  //       "properties": {}
  //   }
  //   selectedSchema['properties'][group] = {"properties": {}}
  //   selectedSchema['properties'][group]['properties'][subgroup] = sampleData['data']['properties'][group]['properties'][subgroup]
  //   Object.keys(sampleData['data']['properties'][group]).filter(key => key !== 'properties').forEach(key2 => {
  //     selectedSchema['properties'][group][key2] = sampleData['data']['properties'][group][key2]
  //   })

  //   let dropdownList = cloneDeep(this.state.dropdownList)
  //   dropdownList[i].children.splice(j, 1)
  //   if (dropdownList[i].children.length === 0) {
  //     dropdownList.splice(i, 1)
  //   }
  //   if (dropdownList.length === 0) {
  //     this.setState({showDropdown: false})
  //   }
  //   // dropdownList[group] = dropdownList[group].filter(test1 =>
  //   //    (test1 !== subgroup)
  //   // )
  //   // Object.keys(dropdownList).forEach(test => {
  //   //     if(dropdownList[test].length === 0){
  //   //         delete dropdownList[test]
  //   //     }
  //   // })
  //   // if(Object.keys(dropdownList).length === 0){
  //   //     this.setState({showDropdown: false})
  //   // }

  //   let sideBarList = cloneDeep(this.state.sideBarList)
  //   if (typeof sideBarList[group] === 'undefined') {
  //     sideBarList[group] = []
  //     sideBarList[group].push(subgroup)
  //   } else {
  //     sideBarList[group].push(subgroup)
  //   }
  //   this.setState({selectedSchema: selectedSchema, dropdownList, sideBarList, propertySelected: group})
  // }

  handleClickSideBar = (group, subgroup) => {
    const schema = this.props.schema.envelope.instance;
    const selectedSchema = schema.data.properties[group].properties[subgroup];
    // let selectedSchema = {
    //   "type": dataSchema.type,
    //   "properties": {
    //     [group]: {
    //       'properties': {
    //         [subgroup]: dataSchema['properties'][group]['properties'][subgroup]
    //       }
    //     }
    //   }
    // }
    // Object.keys(dataSchema['properties'][group]).filter(key => key !== 'properties').forEach(key2 => {
    //   selectedSchema['properties'][group][key2] = dataSchema['properties'][group][key2]
    // })

    const data = this.props.document.envelope.instance;
    const selectedData = data[group][subgroup];

    // fetch(new URL(this.state.url, document.baseURI).toString(), {
    //   method: "GET",
    //   credentials: "same-origin",
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // .then(res => res.json())
    // .then(data => {
    //   this.setState({formData: data['envelope']['instance']})
    // })
    // console.log({selectedData, selectedSchema})
    this.setState({ selectedSchema: selectedSchema });
    this.setState({ formData: selectedData });
  };

  onAttributeChange = (name, data, xpath) => {
    // console.log({ name, data, xpath})
    if (data) {
      this.patch = this.patch.filter(
        x => !x.replace || (x.replace && x.replace.select !== xpath)
      );
      this.patch.push({
        replace: {
          select: xpath,
          content: data
        }
      }); // apply: 'attributeFunc'
      // console.log(JSON.stringify(this.patch))
    }
  };

  onDataChange = (name, data, xpath) => {
    if (data) {
      this.patch = this.patch.filter(
        x => !x.replace || (x.replace && x.replace.select !== xpath)
      );
      this.patch.push({
        replace: {
          select: xpath,
          content: data,
          apply: 'apply-prov'
        }
      }); // apply: 'measurementFunc'
      // console.log('data', name, this.patch)
    }
  };

  onHtmlDataChange = (name, data, xpath) => {
    if (data) {
      this.patch = this.patch.filter(
        x => !x.replace || (x.replace && x.replace.select !== xpath)
      );
      this.patch.push({
        replace: {
          select: xpath,
          content: data,
          apply: 'apply-prov-html'
        }
      }); // apply: 'measurementFunc'
      console.log('html', name, this.patch);
    }
  };

  onEditorDataChange = (name, data, xpath) => {
    if (data) {
      const { entry, index } = data;
      const title = entry.title;
      const body =
        entry.body && entry.body.toString('html').replace(/&nbsp;/g, ' ');
      let patch = {};
      if (index) {
        patch = {
          replace: {
            select: xpath + `/object-node()[${index + 1}]`,
            content: { title, body },
            apply: 'apply-prov-array-element'
          }
        };
      } else {
        patch = {
          'replace-insert': {
            select: xpath + '/object-node()[last()+1]',
            context: xpath,
            content: { title, body },
            apply: 'apply-prov-array-element'
          }
        };
      }
      this.patch = [
        {
          'replace-library': {
            at: '/ml-packages/schema/json-schema/patch.xqy',
            ns: 'http://marklogic.com/patch/apply/patch-lib'
          }
        },
        patch
      ]; // apply: 'measurementFunc'
      console.log('editor', name, this.patch);
    }
  };

  handleFormUpdate({ formData }) {
    // Duplicate check
    // const uri = this.buildProductUri(formData)
    // if (uri) {
    //   this.formData = formData
    //   this.props.checkDuplicate(uri)
    // }
    this.setState({ unsaved: true, doc: formData });
  }

  // handleItemUpdate({index, data}) {
  //   console.log(index)
  //   this.handleFormUpdate({formData: data})
  // }

  handleFormSubmit({ formData }, e) {
    e.preventDefault();

    const uri = this.props.uri;
    // const type = 'product'
    let url = `/api/entry/formdata/update?schema=/nbd/companies&uri=${uri}`;

    fetch(new URL(url, document.baseURI).toString(), {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patch: this.patch })
    }).then(res => {
      this.setState({ formCreated: true });
      this.patch = [
        {
          'replace-library': {
            at: '/ml-packages/schema/json-schema/patch.xqy',
            ns: 'http://marklogic.com/patch/apply/patch-lib'
          }
        }
      ];
      this.props.fetchDoc(this.props.uri, 'doc', this.props.group.key);
      this.setState({ unsaved: false });
      // this.props.deselectSchema()
      // this.props.history.push(`/search/nbd?scope=/nbd/companies`)
    });
    // url = `/api/crud/${type}?uri=${uri}`
    // this.setState({showDropdown: true, url})
  }

  render() {
    const { schema, group } = this.props;
    const doc = this.state.doc;
    if (isEmpty(schema) || isEmpty(group) || isEmpty(doc)) {
      return null;
    }

    const { dataSchema, uiSchema } = schema.schemas[group.key];
    delete dataSchema.title;
    const options = uiSchema['brain:options'];

    const formContext = {
      onAttributeChange: debounce(this.onAttributeChange, 500),
      onDataChange: debounce(this.onDataChange, 500), //debounce(this.onFieldChange, 250)
      onHtmlDataChange: debounce(this.onHtmlDataChange, 500),
      onEditorDataChange: debounce(this.onEditorDataChange, 500),
      onFormSubmit: this.handleFormSubmit
    };

    // console.log({dataSchema, uiSchema, doc})
    // TODO: better way to track if doc and schema are in sync
    if (Object.keys(dataSchema.properties).some(x => !doc.hasOwnProperty(x))) {
      // console.log('doc and schema NOT in sync for', schema.title)
      return null;
    } else {
      // console.log('doc and schema in sync for', schema.title)
    }

    // TODO: once the Updated Api is available need to remove the below and get the values f
    // [this.state.doc] is the one to listen the updations of the form
    //Verify to Add the row in the table
    const isOrdersAvailable =
      uiSchema['ui:order'].indexOf('orders') === -1 ? false : true;
    if (!isOrdersAvailable) {
      uiSchema['ui:order'].push('orders');
      const dataSchemaForm = {
        type: 'object',
        properties: {
          ...dataSchema.properties,
          ...TableTypehead.schema.properties
        }
      };
      const formDataWithTable = {
        ...this.state.doc,
        ...TableTypehead.formData
      };
      const uiSchemaForm = { ...uiSchema, ...TableTypehead.uiSchema };
      console.log('dataSchemaForm==>', dataSchemaForm);
      console.log('formDataWithTable==>', formDataWithTable);
      console.log('uiSchemaForm==>', uiSchemaForm);
      this.setState({
        dataSchemaForm: dataSchemaForm,
        doc: formDataWithTable,
        uiSchemaForm: uiSchemaForm
      });
    }
    return (
      <>
        {/* <h4>{ this.props.group.name }</h4> */}
        {/* <pre>{ JSON.stringify(dataSchema, null, 2) }</pre> */}
        {
          <Form
            fields={fields}
            schema={this.state.dataSchemaForm}
            formContext={formContext}
            formData={this.state.doc}
            uiSchema={this.state.uiSchemaForm}
            onChange={this.handleFormUpdate}
            onSubmit={this.handleFormSubmit}
            noValidate={true}
          >
            {options['brain:formSubmitButton'] ? (
              <div style={{ textAlign: 'left' }}>
                <Button
                  type="submit"
                  bsStyle="primary"
                  bsSize="small"
                  disabled={
                    this.props.checkPending ||
                    this.props.duplicate ||
                    !this.state.unsaved
                  }
                  style={{ marginRight: '6px' }}
                >
                  Save
                </Button>
              </div>
            ) : (
              <></>
            )}
          </Form>
        }
      </>
    );

    // const schema = this.props.schema.envelope.instance
    // const dataSchema = schema.data
    // const uiSchemas = schema.ui
    //   const dropdownMap = this.state.dropdownList.map((el,i) => {
    //     return(
    //       <NestedDropdownMenu animate = {false} key = {i} toggle = {
    //         <a style = {{cursor: "pointer", display: 'inline-block'}}>
    //           { el['title'] }
    //         </a>
    //       } align="left" delay={0}>
    //           { el.children && el.children.map((el2, j) => {
    //               return(
    //               <li style = {{cursor: "pointer"}} onClick = {() => this.handleClickDropdown(el.key, el2.key, i, j)} key = {j}>
    //                 <a style = {{display: 'inline-block'}}>{el2['title']}</a>
    //               </li>
    //               )
    //           })}
    //       </NestedDropdownMenu>
    //     )
    //   })

    //   const sideBarMap = Object.keys(this.state.sideBarList).map((el, i) => {
    //     return(
    //       <div key={i}>
    //         <h4>
    //           <strong>{dataSchema['properties'][el]['title']}</strong>
    //         </h4>
    //         {this.state.sideBarList[el].map((el2, i) => {
    //           return(
    //             <div key={i}>
    //               <li style = {{display: 'inline-block'}} onClick = {() => this.handleClickSideBar(el, el2)}><a style = {{cursor: 'pointer'}}>{dataSchema['properties'][el]['properties'][el2]['title']}</a></li>
    //             </div>
    //           )
    //         })}
    //       </div>
    //     )
    //   })

    //   // const uiSchema = merge(this.props.schema.shared || {}, this.props.schema.edit || {})
    //   const editSchema = merge(uiSchemas.shared || {}, uiSchemas.edit || {})
    //   console.log({editSchema})
    //   const formContext = {
    //       onAttributeChange: debounce(this.onAttributeChange, 500),
    //       onMeasurementChange: debounce(this.onMeasurementChange, 500) //debounce(this.onFieldChange, 250)
    //   };
    //   const menuOptions = {
    //       isOpen: this.state.isMenuOpen,
    //       close: this.close,
    //       toggle: <a style = {{cursor: "pointer"}} onClick={this.toggle}><span className = 'glyphicon glyphicon-plus-sign'></span> Click here to add a section...</a>,
    //       align: 'left',
    //       animate: false,
    //       delay: 0,
    //     };

    //   let formButtonText = "Save"

    //   return (
    //     <div>
    //       {/* <h4>You have selected <strong>{this.props.templateName} </strong><span><a style = {{cursor: 'pointer'}} onClick= {this.handleClickClear}>(Clear)</a></span></h4> */}

    //       {this.state.showDropdown ?
    //       <DropdownMenu {...menuOptions}>
    //         { dropdownMap }
    //       </DropdownMenu>
    //       :
    //       null}
    //       <Row>
    //         <Col xs = {2}>
    //           {sideBarMap}
    //         </Col>
    //         <Col md = {8} xs={10}>
    //           <Form formData = {this.state.formData} schema = {this.state.selectedSchema} uiSchema = {editSchema} fields = {{SchemaField: CustomSchemaField, typeahead: TypeaheadField}} onSubmit = {this.onSubmit} onChange = {this.onChange} formContext={formContext}>
    //             <button className="btn btn-info" type="submit">{ formButtonText }</button>
    //           </Form>
    //         </Col>
    //       </Row>

    //     </div>
    //   )
  }
}

// const mapStateToProps = state => ({
//     templateName: state.entry.templateName,
//     templateURI: state.entry.templateURI,
// 	selection: state.entry.selection,
// 	template: state.entry.template,
//     schema: state.entry.schema
// })
// export default connect(mapStateToProps, {isSelection, getTemplate})(Template)
