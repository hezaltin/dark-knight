import React from 'react';
import { Button, Modal, Table, Form } from 'react-bootstrap';

class RequestForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.uri = props.uri
    this.instance = props.instance
    this.profile = props.profile
    this.requestDoc = props.requestDoc
    this.requestPending = props.requestPending
    this.submitRequest = this.submitRequest.bind(this)

    this.state = {
      show: false,
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  submitRequest() {
    this.requestDoc(this.uri)
    this.handleClose()
  }

  render() {
    console.log(this.requestPending)
    return (
      <div>
        {/* <Button className="btn-primary" block onClick={this.handleShow}>
          Request Full-Text PDF
        </Button> */}
        <Modal show={this.state.show} onHide={this.handleClose} dialogClassName="request-form">
          <Modal.Header closeButton>
            <Modal.Title>Full Text Document Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table className="result-metadata">
              <tbody>
                <tr>
                  <th>Doc ID:</th>
                  <td>{ this.instance.serial_number }</td>
                </tr>
                <tr>
                  <th>Title:</th>
                  <td>{ this.instance.manufacturer }</td>
                </tr>
                <tr>
                  <th>Authors:</th>
                  <td>{ this.instance.manufacturer }</td>
                </tr>
                <tr>
                  <th>Business Unit:</th>
                  <td>{ this.instance.model }</td>
                </tr>
                <tr>
                  <td>
                    <hr/>
                  </td>
                </tr>
                <tr>
                  <th>Approver:</th>
                  <td>{ this.profile.approver.fullName }</td>
                </tr>
              </tbody>
            </Table>
            {/* <div class="well well-sm">For development purpose, the approver is set to be yourself.</div> */}
            {/* <Form>
              <Form.Check 
                type='checkbox'
                id='is-author'
                label='I am an author of this document.'
              />
            </Form> */}
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-primary" onClick={this.submitRequest}>
              { this.requestPending ? 'Loading' : "Submit"}
            </Button>
            <Button className="btn-default" onClick={this.handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default RequestForm