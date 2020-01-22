import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button, Glyphicon, Table, Tabs, Tab } from 'react-bootstrap'
import throttle from "lodash.throttle"
import ReadMoreReact from 'read-more-react'
import RequestForm from './RequestForm'
import PdfViewer from '../pdf/PdfViewer';
import './DetailView.css'
import 'font-awesome/css/font-awesome.min.css';
import FileViewer from 'react-file-viewer';
//import pdf from '../../assets/pdf.pdf';
// import xlsx from '../../assets/Sample-Sales-Data.xlsx';
import docx from '../../assets/SampleSpec.docx';
import xlsx from '../../assets/SimpleSpreadsheet.xlsx';
import csv from '../../assets/Total_Crime.csv';
import pdf from '../../assets/sample.pdf';
import { sampleData } from '../EditView/sampleData'
// import { schema } from './reverse-osmosis-membarane'
import { roData } from './ro-data'


var imageTagStyleProps = {
  height:'100%',
  width:'100%',
  objectFit: 'cover',
};

const tabSchema = sampleData
const tabData = roData.envelope.instance

const imageContent = {
  fontSize:'130%',
  fontWeight: '700',
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ececec',
  color: '#888',
  userSelect: 'none',
}
const SummaryContentPanel = (props) => {
  const { data, value, clickHandler, ...other } = props;

  return (
    <Row>
      <Col xs={9} md={9}>
        <div>
          {/* <h3>Summary</h3> */}
          {/* <div className="rendered-table" style={{padding: '12px 0'}}> */}
            {/* <ReadMoreReact text={data.summary.description || 'No description'} min={250} ideal={300} max={350} /> */}
            {/* <p>{ data.summary.description || 'No description' }</p> */}
          {/* </div> */}
          <div>
            <h3 style={{fontSize: '24px'}}>Product Information</h3>
            <br/>
            <p><b>Manufacturer: </b>{data.summary.manufacturer}</p>
            <p><b>Model: </b>{data.summary.model}</p>
            <p><b>Serial Number: </b>{data.summary.serial_number}</p>
            <p><b>GMID: </b>{data.summary.GMID}</p>
            <br/><br/><br/>
            <h3 style={{fontSize: '24px'}}>Element Materials</h3>
            <h4 style={{fontSize: '16px', color: "red"}}>Before Box Opened</h4>
            <p>Element Dimensions</p>
            <p>Label</p>
            <p>Thickness</p>
            <br/>
            {/* <h4 style={{fontSize: '14px'}}>After Box Open</h4>
            <p>To be added later</p> */}
            
          </div>
        </div>
      </Col>
      <Col xs={3} md={3}>
        <div className="key-facts-container">
          {/* <KeyFactsList instance={instance} profile={profile} requestDoc={requestDoc} requestPending={requestPending} id={this.id} ></KeyFactsList> */}
          <KeyFactsList instance={data} profile={null} requestDoc={null} requestPending={null} id={null} ></KeyFactsList>
        </div>
      </Col>
    </Row>

  );
}

const TabsLevelInnerMaterial = (props) => {
  const { data, childTabValue, clickHandler,dataProperties,dataPropertiesFormats,dataPropertiesSet, ...other } = props;
  
  return (
    <div className="tab-level-inner">
      <Tabs defaultActiveKey={1} id='manufacturers' animation={false} activeKey={childTabValue} bsStyle="pills" onSelect={props.handleChangeLevel} id="noanim-tab-example">
        {data ? data['ui:headingOrder'].map((el,i)=>{
          return (<Tab key={i} eventKey={i} title={dataProperties.properties[el] ? dataProperties.properties[el].title : el} target={`${el}`} >
          <TabLevelContent data={dataProperties.properties} parentTabValue={props.parentTabValue} childTabvalue={childTabValue} dataPropertiesFormats={dataPropertiesFormats} dataPropertiesSet={dataPropertiesSet}></TabLevelContent>
          </Tab>)
        }):''}
        
      </Tabs>
    </div>
  );
}

const TabLevelContent = (props) => {
  const { data, childTabvalue,parentTabValue,dataPropertiesFormats,dataPropertiesSet, ...other } = props;
  const uniqueKey = uniqueId

  const TabLevelData = {...dataPropertiesSet};
  const getSelectedKeyValue = Object.keys(dataPropertiesFormats[parentTabValue].properties)[childTabvalue];
  const properties = TabLevelData[getSelectedKeyValue].properties
  const allData = tabData[parentTabValue][getSelectedKeyValue]

  return data ? 
    <div className="detail-list-container">
      <div className="detail-request">
      {
        properties ? <Table className="result-metadata" size="sm" bordered={false} hover={false} striped={false}>
          <tbody>{
          Object.keys(properties).map((item,i)=>{
            const attributes = properties[item]
            const data = tabData[parentTabValue][getSelectedKeyValue][item]
            return (
              <tr key={i}>
                <th>{ properties[item]['title'] } : </th> 
                <td>{ <ItemLevelContent attributes={attributes} data={data}></ItemLevelContent> }</td>

                {/* <td>{ JSON.stringify(tabData[parentTabValue][getSelectedKeyValue][item]) }</td> */}
              </tr>
            )
          }) 
          }</tbody>
        </Table> : 
        <ItemLevelContent attributes={TabLevelData[getSelectedKeyValue]} data={allData}></ItemLevelContent>      
      }
      </div>
    </div> : null
}


const ItemLevelContent = (props) => {
  const { attributes, data } = props
  switch(attributes['type']) {
    case 'string': {
      if (attributes['format'] === 'data-url') {
        switch(attributes['compas:preview']) {
          case 'image': {
            return <div><img src={'/v1/documents?uri=' + data.uri} height="120"></img></div>
          }
          case 'docs': {
            // TODO: remove reference to local node API
            return <div><a href={'localhost:9003/v1/documents?uri=' + data.uri} target="__blank">{ data.name }</a></div>
          }
          default: {
            return <div>No Preview - String</div>
          }
        }
      }
      return <div>{ data }</div>
    }

    case 'array': {
      return <ul>
        {
          data.map((x, i) => <li><ItemLevelContent key={i} attributes={attributes['items']} data={x}></ItemLevelContent></li>)
        }
      </ul>
    }
     
    case 'object': {
      return <div>No Information - Object</div>
    }

    default: {
      return <div>No Information - Default</div>
    }
  }
}

const RawDataContentPanel = (props) => {
  const { data, value, clickHandler, ...other } = props;
  const uniqueKey = uniqueId
  console.log('RawDataContentPanel==>', props.value)
  return (
     (<div className="detail-list-container">
      <h4>Raw Data </h4>
      <div className="detail-request">
        {
       data ?   data.map((el, i) => <div key={uniqueKey()} className="doc-container">
           <div>
              <i key={uniqueKey()} className="fa fa-file-pdf-o" aria-hidden="true"></i>
              <a href="javascript:void(0)" onClick={($event) => clickHandler($event, el.uri)} key={uniqueKey()}> {el.uri.split('/').pop()} </a>
            </div>


            <div key={uniqueKey()} className="font-icon-container">
              {/* <i className="fa fa-download" aria-hidden="true" key={uniqueKey()}></i> */}
            </div>
          </div>) : <div className="no-data-preview"><span>No Data</span></div>
          // <div><span>No Data</span></div>
        }
      </div>
    </div>) 
  );
}

const LiteratureContentPanel = (props) => {
  const { data, value, clickHandler, ...other } = props;
  const uniqueKey = uniqueId
  console.log('LiteratureContentPanel==>', props.value)
  return (
    (<div className="detail-list-container">
      <h4>Attachments </h4>
      <div className="detail-request">
        {
          data ? data.map((el, i) => <div key={uniqueKey()} className="doc-container">
            <div>
              <i className="fa fa-file-pdf-o" key={uniqueKey()} aria-hidden="true"></i>
              <a href="javascript:void(0)" onClick={($event) => clickHandler($event, el.uri)} key={uniqueKey()}> {el.uri.split('/').pop()} </a>
            </div>
            <div key={uniqueKey()} className="font-icon-container">
              {/* <i className="fa fa-download" aria-hidden="true" key={uniqueKey()}></i> */}
            </div>
          </div>) : <div className="no-data-preview"><span>No Data</span></div>
        }
        {/* <div><span>No Data</span></div> */}
      </div>
    </div>) 
  );
}

const PublicationContentPanel = (props) => {
  const { data, value, clickHandler, ...other } = props;
  const uniqueKey = uniqueId
  console.log('PublicationContentPanel==>', props.value)
  return (
     (<div className="detail-list-container">
      <h4>Publication </h4>
      <div className="detail-request">
        {
        data ?  data.map((el, i) => <span key={uniqueId()}> {el.process} </span>) : <div className="no-data-preview"><span>No Data</span></div>
        }
        <div><span>VONTRON ULP32-8040 Membrane Element</span></div>
      </div>
    </div>) 
  );
}


const KeyFactsList = (props) => {
  const { instance, value, profile,requestDoc,requestPending,id, ...other } = props;
  return (
    <div className="key-facts-list">
      <h3>Key Facts</h3>
      <Table className="result-metadata" size="md" bordered={false} hover={false} striped={false}>
        <tbody>
          <tr>
            <th>Year Introduced:</th>
            {/* <td>{instance.summary.serial_number}</td> */}
            <td>1997</td>
          </tr>
          <tr>
            <th>NaCI Rejection:</th>
            {/* <td>{instance.summary.ra_number}</td> */}
            <td>19.5%</td>
          </tr>
          <tr>
            <th>Flux(GFD):</th>
            {/* <td>{instance.summary.manufacturer}</td> */}
            <td>33</td>
          </tr>
          <tr>
            <th>Boron Rejection:</th>
            {/* <td>{instance.summary.model}</td> */}
            <td>82%</td>
          </tr>
          <tr>
            <th>Avg. Delam. Press.(psi):</th>
            {/* <td>{instance.summary.date}</td> */}
            <td>13.3</td>
          </tr>
          <tr>
            <th>Avg. Fiber Diam.(µm):</th>
            {/* <td>{instance.summary.date}</td> */}
            <td>11.8±2.7</td>
          </tr>
          <tr>
            <th>Market:</th>
            {/* <td>{instance.summary.date}</td> */}
            <td>NA,EU,AP</td>
          </tr>
        </tbody>
      </Table>
      {/* <RequestForm instance={instance} profile={profile} uri={id} requestDoc={requestDoc} requestPending={requestPending} /> */}
    </div>

  );
}

let uniqueNumber = {
  previous: 0
}

const uniqueNumberFormat = () => {
  var date = Date.now();

  if (date <= uniqueNumber.previous) {
    date = ++uniqueNumber.previous;
  } else {
    uniqueNumber.previous = date;
  }

  return date;
}


const uniqueId = () => {
  return uniqueNumberFormat();
};



class DetailView extends React.Component {

  constructor(props) {
    super(props)
    this.selector = React.createRef();
    this.uniqueNumber = {
      previous: 0
    }
    this.selectorUri = props.uri;
    this.uri = props.uri
    this.state = { width: null, selectorUri: props.uri, value:'summary', fileType:null, filePath:null, tabLevel:0 }
    this.itemClick = this.itemClick.bind(this);
  }

  setDivSize() {
    this.setState({ width: this.selector.current.getBoundingClientRect().width })
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  }

  componentDidMount() {
    this.setDivSize()
    this.handleResize = throttle(this.setDivSize, 500).bind(this)
    window.addEventListener("resize", this.handleResize)

    if (!this.props.detail) {
      this.props.fetchDoc(this.props.uri, this.props.type)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.uri !== this.props.uri) {
      if (!this.props.detail) {
        this.props.fetchDoc(this.props.uri, 'product')
      }
    }
  }
  itemClick(event, uri) {
    //console.log('uri==>', uri)
    let splitUrl = uri ? uri.split('.').pop() : null;
    
    //console.log('splitUrl==>',splitUrl)
    if(splitUrl){
        let UrlPath;
        if(splitUrl==='xlsx')  UrlPath = xlsx;
        if(splitUrl==='pdf')  UrlPath = pdf;
      this.setState({ selectorUri: uri,fileType:splitUrl,filePath:UrlPath })
    }
    
  }

  handleChange = (value, event) => {
    
    this.setState({ value });
    this.setState({fileType:null,filePath:null,tabLevel:0  })
  };

  handleChangeTabLevel = (value, event) => {
    this.setState({ tabLevel:value });
    this.setState({fileType:null,filePath:null })
  };


  createMetadataPanel() {
    if (!this.props.detail || !this.props.profile) {
      return null
    }
    if(!this.props.detail) return null;
    const instance = this.props.detail.envelope.instance
    const profile = this.props.profile
    const requestDoc = this.props.requestDoc
    const requestPending = this.props.requestPending
    const { classes } = this.props;
    const { value } = this.state;

    const { tabLevel } = this.state
    const viewReferenceData = tabSchema.ui.view.sampleInfo
    const dataPropertiesFormat = tabSchema.data.properties;
    const dataPropertiesSet = viewReferenceData['ui:tabOrder'].reduce((all,item,index)=>{

        return {
          ...dataPropertiesFormat[item].properties,
          ...all
        };
    },{});

    console.log('metadata', this.props)
    return (
      <Col xs={12} md={12} className="ml-result-metadata">
        <a href="javascript:history.back()">Return to search results</a>
        <h1>
          {instance.model}
        </h1>
        <div>
        <h1 style={{ fontSize: '20px', fontWeight: '100', margin: '12px 0 12px 0' }}>{ instance.summary.productInfo.model} ({instance.summary.productInfo.manufacturer})</h1>
        </div>
    
        <div className="detail-page">
          <div className="detail-tabs">
            <Tabs defaultActiveKey={viewReferenceData['ui:tabOrder'][0]} animation={false} activeKey={value} onSelect={this.handleChange} id="noanim-tab-example">
                  {viewReferenceData['ui:tabOrder'].map((el,i)=>{
                    return (<Tab key={i} eventKey={el} title={dataPropertiesFormat[el].title}>
                      <TabsLevelInnerMaterial childTabValue={tabLevel} data={viewReferenceData[el]}  uri={this.uri} handleChangeLevel={this.handleChangeTabLevel} dataProperties={dataPropertiesFormat[el]} dataPropertiesSet={dataPropertiesSet} dataPropertiesFormats={dataPropertiesFormat} parentTabValue={value}></TabsLevelInnerMaterial>
                      </Tab>)
                  })}
            </Tabs>
          </div>
          <div className="key-facts-container">
            {value === 'summary' && <KeyFactsList instance={instance} profile={profile} requestDoc={requestDoc} requestPending={requestPending} uri={this.uri} ></KeyFactsList>}
          </div>

        </div>
        
      </Col>

    );
  }


  createPdfPreviewPanel() {
    const { value } = this.state;
    const uniqueKey = uniqueId;
    const {fileType} = this.state
    return <Col xs={12} md={7}  key={uniqueKey()} className="ml-doc-preview">
      <div style={{ width: "100%", display: "flex", overflow: "hidden", position: "absolute", left: "515px"}} key={uniqueKey()}>
        {/* <div id="placeholderWrapper" style={{width: "100%", height: "100vh"}}/> */}
        <div ref={this.selector} style={{ width: "100%", height: '700px',  margin: "50px 0" }} key={uniqueKey()}>
         {/* {this.state.selectorUri!=='%2Fcontent%2Fsample%2F21715544SOS.json' && this.state.value==2 && <PdfViewer uri={this.state.selectorUri} wrapperDivSize={this.state.width - 30} />} */}
         {(value === 1 || value ===2) && fileType && <FileViewer key={uniqueKey()}
            fileType={this.state.fileType}
            filePath={this.state.filePath}
            //errorComponent={CustomErrorComponent}
            onError={this.onError} />}
         
        </div>
      </div>
    </Col>
  }

  onError(e) {
    // logger.logError(e, 'error in file-viewer')
  }
 
  render() {
    console.log('render detail', this.props)
    const uniqueKey = uniqueId;
    return <div key={uniqueKey()}>
      <Row  key={uniqueKey()}>
        {this.createMetadataPanel()}
      </Row>
      <Row  key={uniqueKey()}>{this.createPdfPreviewPanel()}</Row>
    </div>
  }
}

DetailView.propTypes = process.env.NODE_ENV !== "production" ? {
  detail: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  contentType: PropTypes.string,
  error: PropTypes.string,
  profile: PropTypes.object,
} : {}

export default DetailView
