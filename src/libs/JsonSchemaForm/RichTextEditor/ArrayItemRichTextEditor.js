import React, { Component } from "react"
import PropTypes from "prop-types"
import RichTextEditor from "react-rte"
import { Row, Col, FormGroup, FormControl, Button, Glyphicon } from 'react-bootstrap'
import Panel from 'react-bootstrap/lib/Panel'
import PanelTitle from 'react-bootstrap/lib/Panel'
import PanelHeading from 'react-bootstrap/lib/Panel'
import { isEmpty, isEqual } from 'lodash'
import ReactHtmlParser from 'react-html-parser'
import Moment from 'react-moment'
import { DefaultLabel } from "../Label"
import "./RichTextEditor.css"

const DEFAULT_FORMAT = "html"

export class ArrayItemRichTextEditorField extends Component {
  constructor(props) {
    super(props)

    let {
      formData = "",
      uiSchema: { arrayItemRichTextEditor: { format = DEFAULT_FORMAT } = {} },
    } = props;

    this.state = {
      title: '',
      body: RichTextEditor.createValueFromString(formData, format),
      formData: [
        {
          title: 'Inverleith capital (Edinburgh) to represent Filter Clear LLC in company sale',
          creator: {
            id: 'lc3268',
            name: 'Fan Li',
            email: 'fan.li@dupont.com'
          },
          timestamp: '2018-01-22T12:30:41.190Z',
          body: '<p><strong>Inverleith capital (Edinburgh)</strong> is representing Filter Clear LLC as they pursue sale of their company for purposes of growing internationally.  The company has one "bed filtration" product that is being used to replace MMF and slow sand filters in waste and in industrial process waters and a means to reduce TSS in raw waters.  Claims are that particulate removal <1 micron is possible with no chemical washes, and lower capital expense and footprint.</p>\n<p>A SWRO facility at KAUST uses the technology as pre-treatment, and that data may be available to use in the investigation.  One WO patent application published.  Markus is chasing down the KAUST data.  If no red flags, entertain going the NDA route to see more.  Database class:  2</p>'
        },
        {
          title: 'Note from Rory Boyd at Inverleith',
          creator: {
            id: 'wp1510',
            name: 'Lynn M. Schiel',
            email: 'lynn.schiel@dupont.com'
          },
          timestamp: '2019-01-22T12:30:41.190Z',
          body: '<p>Note from Rory Boyd at Inverleith - Attached...(sorry for not including originally)<br/>The teaser is very high level.</p>\n<p>Appreciate what you can find. The company did just send me more case studies today (which are also attached). I have not yet looked at them.</p>'
        },
        {
          title: 'Introductory email from David Ovens',
          creator: {
            id: 'ead173',
            name: 'Alicia M. Glasscock',
            email: 'alicia.m.glasscock@dupont.com'
          },
          timestamp: '2020-01-22T12:30:41.190Z',
          body: '<p>Introductory email from David Ovens -<br/>Many thanks for your email. In response, I attach a summary document setting out brief details of a company called Filter Clear, which we are marketing for sale on behalf of its shareholders. The company manufactures a next generation media-based water filtration technology, called the Spruce Filter, which has significant advantages to rapid sand filters. <br/><br/>The shareholders have instructed Inverleith Capital to conduct a process designed to find a new owner with the market presence to realise the full potential of the technology. If this is of interest to you, we will have a detailed information memorandum, which I could send over next week in return for a signed confidentiality agreement.</p>'
        },
        ...props.formData
      ],
      index: null,
    }
  }

  componentDidUpdate(prevProps) {
    if ((isEmpty(prevProps.formData) && !isEmpty(this.props.formData)) || !isEqual(prevProps.formData, this.props.formData)) {
      this.setState({formData: this.props.formData})
    }
    // if ((!prevProps.formData || isEmpty(prevProps.formData)) && this.props.formData) {
    //   this.setState({
    //     defaultInputValue: this.props.formData
    //   })
    // }
  }

  updateFormData = () => {
    let {
      uiSchema: { arrayItemRichTextEditor: { format = DEFAULT_FORMAT } = {} },
      onChange,
    } = this.props
    let { index, title, body } = this.state
    if (onChange) {
      title = title.toString()
      body = body.toString(format)

      // onChange({
      //   index,
      //   change: {
      //     title,
      //     body,
      //   },
      //   data: this.state.formData
      // })
      // onChange({
      //   index,
      //   data: {
      //     title: title.toString(),
      //     body: body.toString(format)
      //   },
      // })
    }
  }

  handleTitleChange = e => {
    let { uiSchema: { updateOnBlur = false } } = this.props
    this.setState({ title: e.target.value }, () => !updateOnBlur && this.updateFormData())
  }

  handleBodyChange = (body, index ) => {
    let { uiSchema: { 
      updateOnBlur = false,
      arrayItemRichTextEditor: { format = DEFAULT_FORMAT } = {}
    } } = this.props
    // this.setState({ body: RichTextEditor.createValueFromString(body, format) }, () => !updateOnBlur && this.updateFormData())
    this.setState({ body }, () => !updateOnBlur && this.updateFormData())
  }

  handleBlur = () => {
    let { uiSchema: { updateOnBlur = false } } = this.props
    if (updateOnBlur) {
      this.updateFormData()
    }
  }


  editForm = (index) => {
    let { uiSchema: { 
      arrayItemRichTextEditor,
      arrayItemRichTextEditor: { format = DEFAULT_FORMAT } = {}
    }, idSchema: { $id } = {} } = this.props
    let autoFocus = this.props.uiSchema["ui:autofocus"]
    const title = index !== undefined && this.state.formData[index].title
    const body = index !== undefined && this.state.formData[index].body
    return <>
      <Row>
        <Col xs={12}>
          <FormGroup>
            <FormControl
              type="text"
              placeholder="Title"
              value={title}
              style={{fontSize: '16px'}}
              onChange={this.handleTitleChange}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div id={index !== undefined ? `form-${index}` : 'form-new'}>
            {/* <DefaultLabel {...this.props} /> */}
            <RichTextEditor
              onBlur={this.handleBlur}
              {...arrayItemRichTextEditor}
              autoFocus={autoFocus}
              value={RichTextEditor.createValueFromString(body, format)}
              onChange={(body) => this.handleBodyChange(body, index)}
              className="rich-text-editor"
            />
          </div>
        </Col>
      </Row>
    </>
  }


  render() {
    if (!this.state.formData) {
      return null
    }

    let { uiSchema: { arrayItemRichTextEditor }, idSchema: { $id } = {} } = this.props
    let autoFocus = this.props.uiSchema["ui:autofocus"]

    let formData = this.state.formData

    return <>
      <Row>
        <Col xs={12}>
          <h4>Create a new record</h4>
        </Col>
      </Row>
      { this.editForm() }
      <h4 style={{marginTop: '32px'}}>Previous records</h4>
      {

        formData.map((item, i) => {
          return (
            <Panel key={`item-text-${i}`}>
              <Button bsSize="small" 
                style={{float: 'right', border: 'none', backgroundColor: '#fff', backgroundImage: 'none'}} 
                onClick={() => this.setState({index: i})}>
                <Glyphicon style={{color: '#999', backgroundColor: '#fff', backgroundImage: 'none'}} glyph="glyphicon glyphicon-pencil"/>
              </Button>
              <h4 key={`item-text-${i}-title`} style={{fontSize: '14px', fontWeight: 600}}>{ item.title }</h4>
              <p>
                <span style={{fontSize: '11px'}}>{ item.creator.name }</span><br/>
                <span style={{fontSize: '11px'}}><Moment fromNow>{ item.timestamp }</Moment></span>
              </p>
              { ReactHtmlParser(item.body) }
              {
                this.state.index === i && <>
                  { this.editForm(i)  }
                </>
              }
            </Panel>
          )
        })
      }


      {/* <pre>{ JSON.stringify(this.state.formData, null, 2)}</pre> */}
    </>
  }
}

ArrayItemRichTextEditorField.propTypes = {
  uiSchema: PropTypes.shape({
    updateOnBlur: PropTypes.bool,
    arrayItemRichTextEditor: PropTypes.shape({
      format: PropTypes.string,
    }),
  }),
}