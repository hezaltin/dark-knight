import React, { Component } from 'react'
import Form from "react-jsonschema-form";
import merge from "deepmerge"
import {connect} from 'react-redux'
import {isSelection, getTemplate} from '../../redux/entry/templateAction'
import {TypeaheadField} from 'react-jsonschema-form-extras/lib/TypeaheadField'
import './Template.css'
import sampleData from './sampleData'
import {Row, Col} from 'react-bootstrap'
import {cloneDeep, debounce} from 'lodash'
import DropdownMenu, { NestedDropdownMenu } from 'react-dd-menu';
import SchemaField from 'react-jsonschema-form/lib/components/fields/SchemaField';
import { withRouter } from "react-router-dom";

const CustomSchemaField = function (props) {

    const customProps = {};
    const { onChange, name, schema } = props
    if (name && schema) {
        const formContext = props.registry.formContext
        customProps.onChange = (formData) => {
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
    );
};

function traverse(schema) {
    if (!schema) { return }
    if (schema['type'] === 'string'){
        return ''
    }
    else if(schema['type'] === 'array'){
        return []
    }
    const parsedData = {}
    Object.keys(schema['properties']).forEach((item) => {
        parsedData[item] = traverse(schema['properties'][item])
    })
    return parsedData 
}

class Template_2 extends Component {
    constructor(props){
        super(props)
        this.state = {
            formData: {},
            showDropdown: false,
            fullSchema: {},
            isMenuOpen: false,
            dropdownList: {},
            sideBarList: {},
            propertySelected: "",
            url: ""
        }
        this.patch = []
    }
    toggle = () => {
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
      }
    
      close = () => {
        this.setState({ isMenuOpen: false });
      };
    
    onSubmit = ({formData}, e) => {
        e.preventDefault()
        if(this.state.propertySelected === 'Summary'){
            let data = traverse(sampleData['schema'])
            data['summary'] = formData['summary']
            let data2 = {
                "envelope": {
                    "headers": {
                        "bookmarks": []
                    },
                    "triples": [],
                    "instance": data
                }
            }
            console.log(data2)
            let jsonName = data['summary']['productInfo']['manufacturer']+'-'+data['summary']['productInfo']['model']+'-'+data['summary']['productInfo']['serialNumber']+'.json'
            let url = '/api/crud/all/'+encodeURIComponent('/content/sample/product/'+jsonName)
            fetch(new URL(url, document.baseURI).toString(), {
                method: 'POST',
                credentials: "same-origin",
                body: JSON.stringify(data2)
            })
            .then(res => console.log(res))
            this.setState({showDropdown: true, url})
        }else{
            let test = {
                'patch': this.patch
            }
            console.log(test)
            fetch(new URL(this.state.url, document.baseURI).toString(), {
                method: 'PATCH',
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(test)
            })
            .then(res => console.log(res))
        }
        // this.setState({formData:{}})
    };

    handleClickClear = () => {
		this.props.isSelection(false)
    }
    
    handleClickDropdown = (firstAttr, secondAttr) => {
        let selectSchema = {
            "type": sampleData['schema']['type'],
            "properties": {}
        }
        selectSchema['properties'][firstAttr] = {"properties": {}}
        selectSchema['properties'][firstAttr]['properties'][secondAttr] = sampleData['schema']['properties'][firstAttr]['properties'][secondAttr]
        Object.keys(sampleData['schema']['properties'][firstAttr]).filter(key => key !== 'properties').forEach(key2 => {
            selectSchema['properties'][firstAttr][key2] = sampleData['schema']['properties'][firstAttr][key2]
        })

        
         let dropdownList = cloneDeep(this.state.dropdownList)
         dropdownList[firstAttr] = dropdownList[firstAttr].filter(test1 => 
           (test1 !== secondAttr)
        )
        Object.keys(dropdownList).forEach(test => {
            if(dropdownList[test].length === 0){
                delete dropdownList[test]
            }
        })
        if(Object.keys(dropdownList).length === 0){
            this.setState({showDropdown: false})
        }
        let sideBarList = cloneDeep(this.state.sideBarList)
        if(typeof sideBarList[firstAttr] === 'undefined'){
            sideBarList[firstAttr] = []
            sideBarList[firstAttr].push(secondAttr)
        }else{
            sideBarList[firstAttr].push(secondAttr)
        }
        this.setState({fullSchema: selectSchema, dropdownList, sideBarList, propertySelected: firstAttr})
    }

    handleClickSideBar = (firstAttr, secondAttr) => {
        let selectSchema = {
            "type": sampleData['schema']['type'],
            "properties": {}
        }
        selectSchema['properties'][firstAttr] = {"properties": {}}
        selectSchema['properties'][firstAttr]['properties'][secondAttr] = sampleData['schema']['properties'][firstAttr]['properties'][secondAttr]
        Object.keys(sampleData['schema']['properties'][firstAttr]).filter(key => key !== 'properties').forEach(key2 => {
            selectSchema['properties'][firstAttr][key2] = sampleData['schema']['properties'][firstAttr][key2]
        })
        fetch(new URL(this.state.url, document.baseURI).toString(), {
            method: 'GET',
            credentials: "same-origin",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            this.setState({formData: data['envelope']['instance']})
        })
        this.setState({fullSchema: selectSchema})
    }
	
	UNSAFE_componentWillMount(){
        let selectSchema = {
            "type": sampleData['schema']['type'],
            "properties": {}
        }
        selectSchema['properties']['summary'] = sampleData['schema']['properties']['summary']
        let schemaList = Object.keys(sampleData['schema']['properties']).map((el) => ({[el]: sampleData['schema']['properties'][el]})).filter((el2)=>el2[Object.keys(el2)[0]]['title'] !== 'Summary')
        let dropdownList = {}
        schemaList.forEach(el => {
            dropdownList[Object.keys(el)[0]] = Object.keys(el[Object.keys(el)[0]]['properties'])
        })
        let sideBarProps = Object.keys(sampleData['schema']['properties']).map((el) => ({[el]: sampleData['schema']['properties'][el]})).filter((el2)=>el2[Object.keys(el2)[0]]['title'] === 'Summary')
        let sideBarList = {}
        sideBarProps.forEach(el => {
            sideBarList[Object.keys(el)[0]] = Object.keys(el[Object.keys(el)[0]]['properties'])
        })
        this.setState({dropdownList, sideBarList, fullSchema: selectSchema, propertySelected: "Summary"})
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
        const dropdownMap = Object.keys(this.state.dropdownList).map((el,i) => {
            return(
              <NestedDropdownMenu animate = {true} key = {i} toggle = {<a style = {{cursor: "pointer", display: 'inline-block'}}>{sampleData['schema']['properties'][el]['title']}</a>} animate = {true}>
                  {this.state.dropdownList[el].map((el2, i) => {
                      return(
                      <li style = {{cursor: "pointer"}} onClick = {() => this.handleClickDropdown(el, el2)} key = {i}><a style = {{display: 'inline-block'}}>{sampleData['schema']['properties'][el]['properties'][el2]['title']}</a></li>
                      )
                  })}
              </NestedDropdownMenu>
                
            )
        })

        const sideBarMap = Object.keys(this.state.sideBarList).map((el, i) => {
            return(
                <div>
                    <h4>
                        <strong>{sampleData['schema']['properties'][el]['title']}</strong>
                    </h4>
                    {this.state.sideBarList[el].map((el2, i) => {
                        return(
                            <div>
                            <li style = {{display: 'inline-block'}} onClick = {() => this.handleClickSideBar(el, el2)}><a style = {{cursor: 'pointer'}}>{sampleData['schema']['properties'][el]['properties'][el2]['title']}</a></li>
                            </div>
                        )
                    })}
                </div>

            )
        })

        const uiSchema = merge(this.props.schema.shared || {}, this.props.schema.edit || {})
        
        const formContext = {
            onAttributeChange: debounce(this.onAttributeChange, 500),
            onMeasurementChange: debounce(this.onMeasurementChange, 500) //debounce(this.onFieldChange, 250)
        };
        const menuOptions = {
            isOpen: this.state.isMenuOpen,
            close: this.close,
            toggle: <a style = {{cursor: "pointer"}} onClick={this.toggle}><span className = 'glyphicon glyphicon-plus-sign'></span> Click here to add a section...</a>,
            align: 'right',
        };
      
        return (
            <div>
                <h4>You have selected <strong>{this.props.templateName} </strong><span><a style = {{cursor: 'pointer'}} onClick= {this.handleClickClear}>(Clear)</a></span></h4>
                
                {this.state.showDropdown ? 
                <DropdownMenu {...menuOptions}>
                {dropdownMap}
                </DropdownMenu>
                :
                null}
                <Row>
                    <Col xs = {2}>
                        {sideBarMap}
                    </Col>
                    <Col xs = {8}>
                        <Form formData = {this.state.formData} schema = {this.state.fullSchema} fields = {{SchemaField: CustomSchemaField, typeahead: TypeaheadField}} onSubmit = {this.onSubmit} formContext={formContext}></Form> 
                    </Col>
                </Row>

             </div>
        )
    }
}

const mapStateToProps = state => ({
    templateName: state.entry.templateName,
    templateURI: state.entry.templateURI,
	selection: state.entry.selection,
	template: state.entry.template,
    schema: state.entry.schema
})
export default withRouter(connect(mapStateToProps, {isSelection, getTemplate})(Template_2))

