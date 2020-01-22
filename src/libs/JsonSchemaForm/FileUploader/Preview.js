import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { getFileTypeIconProps } from '@uifabric/file-type-icons'
import { formatDistance, parseISO } from 'date-fns'

import { formatBytes, formatDuration } from './utils'
import './Preview.css'
// //@ts-ignore
// import cancelImg from './assets/cancel.svg'
// //@ts-ignore
// import removeImg from './assets/remove.svg'
// //@ts-ignore
// import restartImg from './assets/restart.svg'

// const iconByFn = {
//   cancel: { backgroundImage: `url(${cancelImg})` },
//   remove: { backgroundImage: `url(${removeImg})` },
//   restart: { backgroundImage: `url(${restartImg})` },
// }

const stagingTip = (
  <Tooltip id="tooltip">
    Staged new document will be commited once you click the save button.
  </Tooltip>
)

const replaceTip = (
  <Tooltip id="tooltip">
    A new version of this document is creatd while the previous one is stored in revision history.
  </Tooltip>
)

const inDatabaseTip = (
  <Tooltip id="tooltip">
    This document is already stored in the database.
  </Tooltip>
)

// const removeFactory = remove => {
//   return args => {
//     // console.log(...args)
//     remove && remove(args)
//   }
// }

export class Preview extends React.PureComponent {

  render() {
    const {
      className,
      imageClassName,
      style,
      imageStyle,
      fileWithMeta: { cancel, remove, restart },
      meta: { name = '', percent = 0, size = 0, lastModifiedDate, status, duration, validationError, fileType, uri },
      isUpload,
      canCancel,
      canRemove,
      canRestart,
      extra: { minSizeBytes },
      unlink,
    } = this.props

    let title = `${name || '?'}, ${formatBytes(size)}`
    if (duration) title = `${title}, ${formatDuration(duration)}`

    if (status === 'error_file_size' || status === 'error_validation') {
      return (
        <div className={className} style={style}>
          <span className="dzu-previewFileNameError">{title}</span>
          {status === 'error_file_size' && <span>{(minSizeBytes && size < minSizeBytes) ? 'File too small' : 'File too big'}</span>}
          {status === 'error_validation' && <span>{String(validationError)}</span>}
          {/* {canRemove && <span className="dzu-previewButton" style={iconByFn.remove} onClick={remove} />} */}
          {canRemove && <span className="dzu-previewButton" onClick={remove}>
            <i className="glyphicon glyphicon-remove"></i>
          </span>}
        </div>
      )
    }

    if (status === 'error_upload_params' || status === 'exception_upload' || status === 'error_upload') {
      title = `${title} (upload failed)`
    }
    if (status === 'aborted') title = `${title} (cancelled)`

    return (
      <div className={className} style={style}>
        <Row style={{width: '100%', margin: 0}}>
          <Col xs={1} style={{textAlign: 'center'}}>
            <Icon {...getFileTypeIconProps({extension: name.split(/\./g).pop(), size: 32})} /> 
          </Col>
          <Col xs={9}>
            <Row>
              <Col xs={12}>
                <span className="dzu-previewFileName">{name}</span>
              </Col>
            </Row>
            <Row>
              <Col xs={2}>
                <span>Size: {formatBytes(size)}</span>
              </Col>
              <Col xs={5}>
                <span>Last Modified: {lastModifiedDate ? formatDistance(parseISO(lastModifiedDate), new Date()) : 'Unknown'}</span>
              </Col>
              <Col xs={5}>
                <span>Uploaded By: <span style={{color: '#d9230f'}}>You</span></span>
              </Col>
            </Row>
          </Col>
          <Col xs={2}>
            <div className="dzu-previewStatusContainer">
              {
                fileType==='existing' && (
                  <OverlayTrigger placement="bottom" overlay={inDatabaseTip}>
                    <span style={{flex: 'auto'}}>In database</span>
                  </OverlayTrigger>
                )

              }
              {isUpload && fileType==='new' && status === 'done' && (
                <OverlayTrigger placement="bottom" overlay={stagingTip}>
                  <span style={{flex: 'auto', color: '#0cab44', fontWeight: 600}}>New</span>
                </OverlayTrigger>
              )}
              {isUpload && fileType==='replaced' && status === 'done' && (
                <OverlayTrigger placement="bottom" overlay={replaceTip}>
                  <span style={{flex: 'auto', color: '#0cab44', fontWeight: 600}}>Replaced</span>
                </OverlayTrigger>
              )}
              {isUpload && fileType!=='existing' && status !== 'done' && (
                <progress max={100} value={status === 'headers_received' ? 100 : percent} />
              )}

              {status === 'uploading' && canCancel && (
                // <span className="dzu-previewButton" style={iconByFn.cancel} onClick={cancel} />
                <span className="dzu-previewButton" onClick={remove}>
                  <i className="glyphicon glyphicon-pause"></i>
                </span>
              )}
              {status !== 'preparing' && fileType!=='existing' && status !== 'getting_upload_params' && status !== 'uploading' && canRemove && (
                // <span className="dzu-previewButton" style={iconByFn.remove} onClick={remove} />
                <span className="dzu-previewButton" onClick={() => { remove && remove(); unlink(uri)}}>
                  <i className="glyphicon glyphicon-remove"></i>
                </span>
              )}
              {status !== 'preparing' && fileType==='existing' && status !== 'getting_upload_params' && status !== 'uploading' && canRemove && (
                // <span className="dzu-previewButton" style={iconByFn.remove} onClick={remove} />
                <span className="dzu-previewButton" onClick={() => unlink(uri)}>
                  <i className="glyphicon glyphicon-remove"></i>
                </span>
              )}
              {/* {['error_upload_params', 'exception_upload', 'error_upload', 'aborted', 'ready'].includes(status) &&
                canRestart && 
                // <span className="dzu-previewButton" style={iconByFn.restart} onClick={restart} />
                <span className="dzu-previewButton" onClick={remove}>
                  <i className="glyphicon glyphicon-play"></i>
                </span>
              } */}
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

// @ts-ignore
Preview.propTypes = {
  className: PropTypes.string,
  imageClassName: PropTypes.string,
  style: PropTypes.object,
  imageStyle: PropTypes.object,
  fileWithMeta: PropTypes.shape({
    file: PropTypes.any.isRequired,
    meta: PropTypes.object.isRequired,
    cancel: PropTypes.func.isRequired,
    restart: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    xhr: PropTypes.any,
  }).isRequired,
  // copy of fileWithMeta.meta, won't be mutated
  meta: PropTypes.shape({
    status: PropTypes.oneOf([
      'preparing',
      'error_file_size',
      'error_validation',
      'ready',
      'getting_upload_params',
      'error_upload_params',
      'uploading',
      'exception_upload',
      'aborted',
      'error_upload',
      'headers_received',
      'done',
    ]).isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
    uploadedDate: PropTypes.string.isRequired,
    percent: PropTypes.number,
    size: PropTypes.number,
    lastModifiedDate: PropTypes.string,
    previewUrl: PropTypes.string,
    duration: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    videoWidth: PropTypes.number,
    videoHeight: PropTypes.number,
    validationError: PropTypes.any,
  }).isRequired,
  isUpload: PropTypes.bool.isRequired,
  canCancel: PropTypes.bool.isRequired,
  canRemove: PropTypes.bool.isRequired,
  canRestart: PropTypes.bool.isRequired,
  files: PropTypes.arrayOf(PropTypes.any).isRequired, // eslint-disable-line react/no-unused-prop-types
  extra: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    reject: PropTypes.bool.isRequired,
    dragged: PropTypes.arrayOf(PropTypes.any).isRequired,
    accept: PropTypes.string.isRequired,
    multiple: PropTypes.bool.isRequired,
    minSizeBytes: PropTypes.number,
    maxSizeBytes: PropTypes.number,
    maxFiles: PropTypes.number ,
  }).isRequired,
}

export default Preview