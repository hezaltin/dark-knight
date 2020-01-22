import React, { Component } from "react"
import PropTypes from "prop-types"
import cx from 'classnames'
import selectn from "selectn"
import { Row, Col } from 'react-bootstrap'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { DefaultLabel, Label } from "../Label"
import { Preview } from './Preview'
import { Layout } from './Layout'
import './FileUploader.css'
import slugify from "slugify"

export class FileUploaderField extends Component {
  constructor(props) {
    super(props)

    // this.state = {
    //   files: [],
    // }
  }
  
  componentDidMount() {

  }

  handleSelectionChange = (conf, type) => (events) => {
    console.log(events)
    // let { schema, uiSchema, onChange, formData } = this.props
    // if (events.length > 0) {
    //   let { mapping } = conf
    //   let labelKey = (uiSchema.asyncConstraintSelector && uiSchema.asyncConstraintSelector.labelKey)
    //   labelKey = mapLabelKey(labelKey)
      
    //   let schemaEvents = mapToSchema(events, schema.properties[type], mapping, labelKey)
    //   formData = formData || { includes: [], excludes: [] }
      
    //   formData[type] = schemaEvents.map(item => applyLabelKey(item, labelKey))
    //   onChange(formData)
    // } else {
    //   formData[type] = []
    //   onChange(formData)
    // }
  }

  getUploadParams = ({ meta }, uriPrfix) => { 
    meta['uri'] = uriPrfix + slugify(meta.name)
    meta['fileType'] = 'new'
    meta['uploaded'] = true
    return { url: `/api/crud/upload-file?uri=${meta.uri}`, meta } 
  }
  
  handleUnlink = uri => {
    const { onChange, formData=[] } = this.props
    const newFormData = formData.filter(file => file.uri !== uri)
    onChange(newFormData)
  }

  // called every time a file's `status` changes
  handleChangeStatus = ({ meta, file }, status, allFiles) => {
    const { schema, uiSchema, onChange, formData=[] } = this.props
    switch(status) {
      case 'done': {
        // this.setState({
        //   files: this.state.files.push({
        //     name: meta.name,
        //     uri: meta.uri,
        //     type: meta.type,
        //     modified: meta.lastModifiedDate,
        //   })
        // })
        const entry = {
          name: meta.name,
          uri: meta.uri,
          type: meta.type,
          size: meta.size,
          modified: meta.lastModifiedDate,
          uploader: 'You',
          fileType: meta.fileType
        }
        const filteredFormData = formData.filter(x => x.uri !== entry.uri)
        if (formData.length > filteredFormData.length) {
          entry.fileType = meta.fileType = 'replaced'
          
          // Mark the overwritten item and remove it
          const overwrittenFile = allFiles.find(file => file.meta.uri === meta.uri && file.meta !== meta )
          overwrittenFile && overwrittenFile.remove()
        }
        const newFormData = [...filteredFormData, entry]
        onChange(newFormData)
        return meta
      }

      // case 'removed': {
      //   // this.setState({
      //   //   files: this.state.files.filter(file => file.uri !== meta.uri)
      //   // })
      //   console.log('removed', {formData})
      // }
    }
    // console.log('change', {status, meta, file}) 
  }
  
  // receives array of files that are done uploading when submit button is clicked
  handleSubmit = (files, allFiles) => {
    // console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  render() {
    let {
      formContext: { uriPrefix },
      schema,
      uiSchema: { asyncConstraintSelector },
      formData,
      idSchema: { $id } = {},
    } = this.props

    // console.log({props:this.props})
    const existingFiles = formData.filter(x => x.fileType === 'existing')
    return (
      <div id={$id}>
        <DefaultLabel {...this.props} id={$id+'-fileUploader'} />
        <Row>
          <Col xs={12}>
            <Dropzone
              inputContent='Drag Files or Click to Browse'
              inputWithFilesContent='Repeat to Add More Files'
              submitButtonDisabled={true}
              PreviewComponent={(props) => <Preview {...props} unlink={this.handleUnlink}></Preview>}
              LayoutComponent={(props) => 
                <Layout {...props} existingFiles={existingFiles} unlink={this.handleUnlink}></Layout>}
              SubmitButtonComponent={null}
              getUploadParams={({file, meta}) => this.getUploadParams({file, meta}, uriPrefix)}
              onChangeStatus={this.handleChangeStatus}
              onSubmit={this.handleSubmit}
              // accept="image/*,audio/*,video/*,application/pdf"
            />
          </Col>
        </Row>
      </div>
    )
  }
}
