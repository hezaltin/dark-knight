import React, { PureComponent } from "react"
import { Row, Col, Pagination, Button, ButtonGroup } from 'react-bootstrap';
import { Document, Page, pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`


class PdfViewer extends PureComponent {
  state = {
    numPages: null,
    pageNumber: 1,
    visibility: 'hidden'
  }

  constructor(props) {
    super(props)
    this.uri = this.generateUri(this.props.uri)
  }
 
  generateUri(uri) {
    console.log(uri)
    var hash = 0, i, chr;
    if (uri.length === 0) return hash;
    for (i = 0; i < uri.length; i++) {
      chr   = uri.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    // console.log(`/v1/documents?uri=/tests/pdf/${Math.abs(hash%100) + 1}.pdf`)
    // return `/v1/documents?uri=/tests/pdf/${Math.abs(hash%100) + 1}.pdf`
    return `/v1/documents?uri=/content/sample/21715342DW/attachments/0/Vontron-ULP32-8040-Membrane-Element.pdf`
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages, visibility: 'visible' })
  }

  onPageLoadSuccess = () => {
    this.setState({ visibility: 'visible' })
  }

  navigate(page) {
    this.setState({visibility: 'hidden', pageNumber: page})
  }
  
  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div className="pdf-container" style={{visibility: this.state.visibility}}>
        <div className="pager">
          <ButtonGroup aria-label="Pager">
            <Button bsStyle="primary" onClick={() => this.navigate(pageNumber-1)} disabled={pageNumber===1}>&larr; Prev</Button>
            <Button bsStyle="primary" onClick={() => this.navigate(pageNumber+1)} disabled={pageNumber===numPages}>Next &rarr;</Button>
          </ButtonGroup>
        </div>
        {/* <ul class="pager">
          {
            pageNumber===1 ? 
            <li class="previous disabled">
              <a class="btn-primary" href="#">&larr; Prev</a>
            </li> :
            <li class="previous">
              <a class="btn-primary" href="#" onClick={() => this.navigate(pageNumber-1)}>&larr; Prev</a>
            </li>
          }
          {
            pageNumber===numPages ? 
            <li class="next disabled">
              <a class="btn-primary" href="#">Next &rarr;</a>
            </li> :
            <li class="next">
              <a class="btn-primary" href="#" onClick={() => this.navigate(pageNumber+1)}>Next &rarr;</a>
            </li>
          }
        </ul> */}
          <Document className="pdf-preview" file={this.uri} onLoadSuccess={this.onDocumentLoadSuccess}>
            <Page pageIndex={pageNumber-1} width={this.props.wrapperDivSize} 
                onLoadSuccess={this.onPageLoadSuccess} />
          </Document>
          <div className="text-center">
            <Pagination className="preview-pagination"
                items={numPages}
                maxButtons={10}
                boundaryLinks={true}
                activePage={pageNumber}
                onSelect={(x) => this.navigate(x)}
              ></Pagination>
          </div>
      </div>
    )
  }
}

export default PdfViewer