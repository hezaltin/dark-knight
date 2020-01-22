import React, { Component } from 'react'
import {Image, Thumbnail, Col, Row} from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import slugify from 'slugify'
import Form from 'react-jsonschema-form'
import { FileUploaderField } from '../../libs/JsonSchemaForm'

const fields = {
  FileUploaderField
}

export class Team extends Component {

  constructor(props) {
    super(props)

  }
  
  // specify upload params and url for your files
  getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }
  
  // called every time a file's `status` changes
  handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }
  
  // receives array of files that are done uploading when submit button is clicked
  handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  handleChange = (update) => {
    console.log({update})
  }


  render() {
    const dataSchema = {
      type: 'object',
      title: 'NBD Team Document',
      properties: {
        files: {
          type: 'array',
          title: 'Attachment',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              uri: {
                type: 'string'
              },
              type: {
                type: 'string'
              },
              modified: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  
    const uiSchema = {
      files: {
        fileUploader: {
  
        },
        'ui:field': 'FileUploaderField'
      }
    }

    return <>
      {/* <h2 style={{textAlign: 'center', color: '#999'}}>Sorry. This section is still under development</h2> */}
      <h2 style={{textAlign: 'center', color: '#999'}}>Development Area</h2>
      <Row>
          <Col xs={4}>
            {/* <center>
              <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRbezqZpEuwGSvitKy3wrwnth5kysKdRqBW54cAszm_wiutku3R" name="aboutme" width="140" height="140" border="0" className="img-circle"/>
              <h3 className="media-heading">Joe Sixpack <small>USA</small></h3>
              <span><strong>Skills: </strong></span>
                <span className="label label-warning">HTML5/CSS</span>
                <span className="label label-info">Adobe CS 5.5</span>
                <span className="label label-info">Microsoft Office</span>
              <span className="label label-success">Windows XP, Vista, 7</span>
            </center> */}
          </Col>
      </Row>
      <Row>
        <Col xs={3}></Col>
        <Col xs={6}>
          <Form
            fields={fields}
            formData={{
              files: [
                {
                  name: '123.pdf', 
                  uri: '/test/file/abc/123.pdf', 
                  type: 'application/pdf', 
                  lastModifiedDate: new Date('2018-01-01').toISOString(), 
                  size: 123456,
                  fileType: 'existing'
                },
                {
                  name: '20190826-sc-digital-day-compas-poster-final.ppt', 
                  uri: '/test/file/abc/20190826-sc-digital-day-compas-poster-final.ppt', 
                  type: 'application/vnd.ms-powerpoint', 
                  lastModifiedDate: new Date('2010-11-11').toISOString(), 
                  size: 6543210,
                  fileType: 'existing'
                },
                {
                  name: '609-50337 Toray element construction issues (vs. SW30XHR-440i).pdf', 
                  uri: `/test/file/abc/${slugify('609-50337 Toray element construction issues (vs. SW30XHR-440i).pdf')}`, 
                  type: 'application/pdf', 
                  lastModifiedDate: new Date().toISOString(), 
                  size: 9999,
                  fileType: 'existing'
                },
              ]
            }}
            schema={dataSchema}
            uiSchema={uiSchema}
            onChange={this.handleChange}
            formContext={{uriPrefix: '/test/file/abc/'}}
          >
            {/* <div/> */}
          </Form>
        </Col>
        <Col xs={3}></Col>
      </Row>
    </>
  }
 

}


export default withRouter(connect(null, {})(Team))
