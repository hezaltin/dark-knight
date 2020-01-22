import React from 'react'
import { Preview } from './Preview'

export const Layout = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles }, existingFiles=[], unlink }) => {
  return (
    <div>
      <div {...dropzoneProps}>
        {files.length < maxFiles && input}
      </div>

      { 
        existingFiles.map(file => {
          const props = {
            className: 'dzu-previewContainer',
            imageClassName: 'dzu-previewContainerImage',
            style: {},
            imageStyle: {},
            fileWithMeta: { 
              
            },
            meta: file,
            isUpload: true,
            canRemove: true,
            extra: {},
            fileType: 'existing',
            unlink,
          }
          return <Preview {...props}></Preview>
        }) 
      }

      {previews}

      {files.length > 0 && submitButton}
    </div>
  )
}