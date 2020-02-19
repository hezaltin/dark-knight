import slugify from 'slugify';
const formData = {
  orders: [
    { name: 'Max', age: 20,files: [
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
        name:
          '609-50337 Toray element construction issues (vs. SW30XHR-440i).pdf',
        uri: `/test/file/abc/${slugify(
          '609-50337 Toray element construction issues (vs. SW30XHR-440i).pdf'
        )}`,
        type: 'application/pdf',
        lastModifiedDate: new Date().toISOString(),
        size: 9999,
        fileType: 'existing'
      }
    ] },
    { name: 'Max', age: 25,files:[] },
    { name: 'Max', age: 23,files:[] }
  ],
  
};

const schema = {
  required: [],
  type: 'object',
  properties: {
    orders: {
      type: 'array',
      title: 'Rows',
      items: {
        required: [],
        type: 'object',
        properties: {
          order: {
            type: 'array',
            title: 'Order',
            items: {
              type: 'object',
              properties: {
                unique: {
                  type: 'array',
                  title: 'id'
                }
              }
            }
          },
          name: {
            type: 'string',
            title: 'Name'
          },
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
          },
          age: {
            type: 'number',
            title: 'Age'
          }
        }
      }
    }
  }
};

const uiSchema = {
  orders: {
    classNames: 'col-md-12',
    'ui:field': 'table',
    'ui:options': {
      label: false
    },

    table: {
      //focusOnAdd: 1,
      insertRow: true,
      tableCols: [
        {
          dataField: 'order',
          field: 'AsyncMultiObjectSelectorField',
          dataFormat: (cell, row, enumObject, rowIndex, formData, onChange) => {
            console.log(`The cell is ${cell}`);
            console.log(formData);
            if (!formData) {
              console.log('Hello World');
            }
            console.log(
              `The row is is ${JSON.stringify(row)} and the position is ${
                row._position
              }`
            );
            console.log(formData)
            if (row && row.order) {
              if (typeof row.order === 'string')
                row.order = [{ unique: row.order }];
            }

            if (typeof cell === 'undefined') {
              return;
            }
            const dataFormat =
              typeof cell === 'string' ? [cell] : cell.map(i => i.unique);
            const cellValue = { unique: dataFormat.join(',') };

            return cellValue.unique;
          },
          uiSchema: {
            asyncMultiObjectSelector: {
              url: '/api/value/typeahead-taxonomy-concepts/technology?',
              method: 'GET',

              labelKey: 'unique',
              minLength: 0,
              allowNew: true,
              newSelectionPrefix: 'Add a new item: '
            }
          },
          addTo: 'order'
        },
        {
          dataField: 'name',
          className: 'col-md-1',
          columnClassName: 'col-md-1',
          editColumnClassName: 'col-md-1'
        },
        {
          dataField: 'age',
          className: 'col-md-1',
          columnClassName: 'col-md-1',
          editColumnClassName: 'col-md-1'
        },
        {
          dataField: 'files',
          field: 'FileUploaderField',
          dataFormat:(cell, row, enumObject, rowIndex, formData, onChange)=>{
            if(row && row.files && row.files){
             
              if( !row.files.length){
                return 'No Data'
              }
              console.log(`row is ${row.files.map(name=>name.name)}`)
              return  row.files.map(name=>name.name).join(',')
            }

          },
          uiSchema: {
            FileUploaderField:{
              files: {
                fileUploader: {},
                uriPrefix: '/test/file/abc/'
              }
            }
            
          }
        }
      ],

      tableConfig: {
        mandatoryField: [],
        action: {
          updateClassNames: {
            // Upadating Class Names for the custom rows
            classToAdd: {
              //  classNameToAdd: 'disableEdit',
              columnsToAdd: ['order']
            },
            classToDelete: {
              classNameToDelete: 'DeleteClass',
              columnsToDelete: []
            },
            validate: {
              field: 'isCustomRow'
            }
          }
        }
      },
      leftActions: [
        // {
        //   action: 'insert',
        //   icon: 'glyphicon glyphicon-minus',
        //   text: 'Delete',
        //   displayName: 'Right Panel'
        // }
      ],
      rightActions: [
        {
          action: 'delete',
          icon: 'glyphicon glyphicon-trash',
          className: 'col-md-1',
          columnClassName: 'col-md-1',
          editColumnClassName: 'col-md-1'
        }
      ]
    }
  }
};

export default { schema, uiSchema, formData };
