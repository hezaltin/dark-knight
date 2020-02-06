const formData = {
  orders: [
    { name: 'Max', age: 20 },
    {  name: 'Max', age: 25 },
    { name: 'Max', age: 23 }
  ]
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
                  type: 'string',
                  title: 'id'
                }
                            }
            }
          },
          name: {
            type: 'string',
            title: 'Name'
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
          uiSchema: {
            asyncMultiObjectSelector: {
              url: '/api/value/typeahead-taxonomy-concepts/technology?',
              method: 'GET',
              mapping:{
                unique:'name'
              },
              labelKey: 'name',
              minLength: 0,
              allowNew: true,
              newSelectionPrefix: 'Add a new item: '
            }
          }
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
        }
      ],

      tableConfig: {
        mandatoryField: ['description'],
        action: {
          updateClassNames: {
            // Upadating Class Names for the custom rows
            classToAdd: {
              classNameToAdd: 'disableEdit',
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
      leftActions: [],
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
