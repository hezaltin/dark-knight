export const uiSchema = {
  'ui:order': [
    'envelope_instance_content_info_title',
    'envelope_instance_content_info_champions',
    'envelope_instance_content_info_status',
    'envelope_instance_content_info_submitter',
    'envelope_instance_content_info_technologies',
    'envelope_instance_content_profile_description',
    'orders'
  ],
  'brain:options': {
    'brain:formSubmitButton': true
  },
  envelope_instance_content_info_title: {
    'ui:field': 'AsyncSingleObjectSelectorField',
    asyncSingleObjectSelector: {
      url: '/api/value/typeahead-taxonomy-concepts/nbdCompany?limit=10&',
      method: 'GET',
      labelKey: 'label',
      minLength: 0,
      highlightOnlyResult: true,
      attributes: [
        {
          labelKey: 'country',
          title: null,
          col: 3
        },
        {
          labelKey: 'homepage',
          title: null,
          col: 9
        }
      ]
    }
  },
  envelope_instance_content_info_champions: {
    'ui:field': 'AsyncMultiObjectSelectorField',
    asyncMultiObjectSelector: {
      url: '/api/value/typeahead-user-profiles?',
      method: 'GET',
      labelKey: ['name', 'displayName'],
      filterBy: ['id'],
      minLength: 2,
      highlightOnlyResult: true,
      multiple: true,
      allowNew: false,
      attributes: [
        {
          labelKey: ['id'],
          title: null,
          highlight: true,
          col: 1
        },
        {
          labelKey: ['contact', 'email'],
          title: null,
          highlight: true,
          col: 3
        },
        {
          labelKey: ['organization', 'business'],
          title: null,
          col: 2
        },
        {
          labelKey: ['organization', 'title'],
          title: null,
          col: 3
        },
        {
          labelKey: {
            label: {
              fields: [
                ['location', 'city'],
                ['location', 'state'],
                ['location', 'country']
              ],
              separator: ', '
            }
          },
          title: null,
          col: 3
        }
      ]
    }
  },
  envelope_instance_content_info_status: {
    'ui:field': 'SingleObjectSelectorField',
    singleObjectSelector: {
      minLength: 0,
      options: [
        {
          score: '0',
          description: '0 - Not yet evaluated'
        },
        {
          score: '1',
          description: '1 - High interest, High Priority'
        },
        {
          score: '2',
          description: '2 - Potential interest for DWS, lower priority'
        },
        {
          score: '3',
          description: '3 - No fit for DWS, but has potential for success'
        },
        {
          score: '4',
          description: '4 - Technically unfeasible or economically unviable'
        },
        {
          score: '5',
          description: '5 - Category 1 projects completed/sun-set'
        }
      ],
      labelKey: {
        label: {
          fields: ['description'],
          separator: ' '
        }
      }
    },
    'ui:placeholder': 'Level of relevancy from 0 to 5'
  },
  envelope_instance_content_info_submitter: {
    'ui:field': 'AsyncSingleObjectSelectorField',
    asyncSingleObjectSelector: {
      url: '/api/value/typeahead-user-profiles?',
      method: 'GET',
      labelKey: ['name', 'displayName'],
      filterBy: ['id'],
      minLength: 2,
      highlightOnlyResult: true,
      multiple: false,
      attributes: [
        {
          labelKey: ['id'],
          title: null,
          highlight: true,
          col: 1
        },
        {
          labelKey: ['contact', 'email'],
          title: null,
          highlight: true,
          col: 3
        },
        {
          labelKey: ['organization', 'business'],
          title: null,
          col: 2
        },
        {
          labelKey: ['organization', 'title'],
          title: null,
          col: 3
        },
        {
          labelKey: {
            label: {
              fields: [
                ['location', 'city'],
                ['location', 'state'],
                ['location', 'country']
              ],
              separator: ', '
            }
          },
          title: null,
          col: 3
        }
      ]
    }
  },
  envelope_instance_content_info_technologies: {
    'ui:field': 'AsyncMultiObjectSelectorField',
    asyncMultiObjectSelector: {
        bodyContainer: true,
      url: '/api/value/typeahead-taxonomy-concepts/technology?',
      method: 'GET',
      labelKey: 'item',
      minLength: 0,
      allowNew: true,
      newSelectionPrefix: 'Add a new item: '
    }
  },
  envelope_instance_content_profile_description: {
    'ui:field': 'RichTextEditorField',
    richTextEditor: {}
  },
  orders: {
    classNames: 'col-md-12',
    'ui:field': 'table',
    'ui:options': {
      label: false
    },
    table: {
      insertRow: true,
      tableCols: [
        {
          dataField: 'order',
          field: 'AsyncMultiObjectSelectorField',
          uiSchema: {
            focusOnMount: true,
            asyncMultiObjectSelector: {
                url: '/api/value/typeahead-taxonomy-concepts/technology?',
                method: 'GET',
                labelKey: 'order',
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
        // mandatoryField: ['description'],
        // action: {
        //   updateClassNames: {
        //     classToAdd: {
        //       classNameToAdd: 'disableEdit',
        //       columnsToAdd: ['name']
        //     },
        //     classToDelete: {
        //       classNameToDelete: 'DeleteClass',
        //       columnsToDelete: []
        //     },
        //     validate: {
        //       field: 'isCustomRow'
        //     }
        //   }
        // }
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
