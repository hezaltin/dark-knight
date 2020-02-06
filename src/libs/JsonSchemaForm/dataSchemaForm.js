export const dataSchemaForm = {
  type: 'object',
  properties: {
    envelope_instance_content_info_title: {
      type: 'object',
      title: 'Company Name',
      'brain:value': {
        'brain:valueType': 'attribute',
        'brain:valueSchemaDefinition': {
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
        }
      },
      properties: {
        label: {
          type: 'string',
          title: 'Company Name',
          'brain:view': [
            {
              'brain:viewType': 'search-result',
              'brain:viewOption': 'compact',
              'brain:viewField': 'heading'
            },
            {
              'brain:viewType': 'search-result',
              'brain:viewOption': 'expanded',
              'brain:viewField': 'heading'
            }
          ]
        },
        uri: {
          type: 'string'
        },
        country: {
          type: ['string', 'null']
        },
        homepage: {
          type: ['string', 'null']
        },
        alsoKnownAs: {
          type: 'array',
          title: 'Formerly Known As',
          'brain:view': [
            {
              'brain:viewType': 'search-result',
              'brain:viewOption': 'compact',
              'brain:viewField': 'subheading'
            },
            {
              'brain:viewType': 'search-result',
              'brain:viewOption': 'expanded',
              'brain:viewField': 'subheading'
            },
            {
              'brain:viewType': 'view--profile',
              'brain:viewOrder': 15
            }
          ],
          items: {
            type: 'string'
          }
        }
      },
      'brain:xpath':
        '/object-node("envelope")/object-node("instance")/object-node("content")/object-node("info")/object-node("title")'
    },
    envelope_instance_content_info_champions: {
      type: 'array',
      title: 'Champion(s)',
      'brain:value': {
        'brain:valueType': 'data',
        'brain:valueForCreate': 50,
        'brain:valueOrder': 1050,
        'brain:valueSchemaTemplate': {
          'brain:valueSchemaTemplateName': 'ldapUserSearch',
          'brain:valueSchemaTemplateOptions': {
            multiple: true,
            allowNew: false
          }
        }
      },
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          name: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string'
              },
              lastName: {
                type: 'string'
              },
              displayName: {
                type: 'string',
                title: 'Champion',
                'ml:index': [
                  {
                    'ml:indexType': 'range-path-index',
                    'ml:indexParameters': {
                      'scalar-type': 'string',
                      collation: 'http://marklogic.com/collation/en/S1',
                      'range-value-positions': false,
                      'invalid-values': 'reject'
                    }
                  }
                ],
                'ml:constraint': [
                  {
                    'brain:search': {
                      'brain:searchType': 'range'
                    },
                    'ml:constraintType': 'range-path-constraint',
                    'ml:constraintOrder': 50,
                    'ml:constraintParameters': {
                      name: 'Champions',
                      range: {
                        type: 'xs:string',
                        collation: 'http://marklogic.com/collation/en/S1',
                        facet: true,
                        'facet-option': [
                          'limit=10',
                          'frequency-order',
                          'descending'
                        ]
                      }
                    }
                  }
                ]
              }
            }
          },
          location: {
            type: 'object',
            properties: {
              city: {
                type: 'string'
              },
              state: {
                type: 'string'
              },
              country: {
                type: 'string'
              }
            }
          },
          contact: {
            type: 'object',
            properties: {
              phone: {
                type: 'string'
              },
              email: {
                type: 'string'
              }
            }
          }
        }
      },
      'brain:xpath':
        '/object-node("envelope")/object-node("instance")/object-node("content")/object-node("info")/object-node("champions")'
    },
    envelope_instance_content_info_status: {
      type: 'object',
      title: 'Status',
      properties: {
        score: {
          type: 'string',
          title: 'Status'
        },
        description: {
          type: 'string',
          'ml:index': [
            {
              'ml:indexType': 'range-path-index',
              'ml:indexParameters': {
                'scalar-type': 'string',
                collation: 'http://marklogic.com/collation/en/S1',
                'range-value-positions': false,
                'invalid-values': 'reject'
              }
            }
          ],
          'ml:constraint': [
            {
              'brain:search': {
                'brain:searchType': 'range'
              },
              'ml:constraintType': 'range-path-constraint',
              'ml:constraintOrder': 20,
              'ml:constraintParameters': {
                name: 'Status',
                range: {
                  type: 'xs:string',
                  collation: 'http://marklogic.com/collation/en/S1',
                  facet: true,
                  'facet-option': ['limit=10', 'item-order']
                }
              }
            }
          ]
        }
      },
      enum: [
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
      'brain:value': {
        'brain:valueType': 'data',
        'brain:valuePlaceholder': 'Level of relevancy from 0 to 5',
        'brain:valueSchemaDefinition': {
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
                description:
                  '4 - Technically unfeasible or economically unviable'
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
        }
      },
      'brain:xpath':
        '/object-node("envelope")/object-node("instance")/object-node("content")/object-node("info")/object-node("status")'
    },
    envelope_instance_content_info_submitter: {
      type: 'object',
      title: 'Submitted By',
      'brain:value': {
        'brain:valueType': 'attribute',
        'brain:valueSchemaTemplate': {
          'brain:valueSchemaTemplateName': 'ldapUserSearch',
          'brain:valueSchemaTemplateOptions': {
            multiple: false
          }
        }
      },
      properties: {
        id: {
          type: 'string'
        },
        name: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string'
            },
            lastName: {
              type: 'string'
            },
            displayName: {
              type: 'string',
              title: 'Submitted By',
              'brain:view': [
                {
                  'brain:viewType': 'search-result',
                  'brain:viewOption': 'compact',
                  'brain:viewField': 'attributes',
                  'brain:viewOrder': 50
                },
                {
                  'brain:viewType': 'search-result',
                  'brain:viewOption': 'expanded',
                  'brain:viewField': 'attributes',
                  'brain:viewOrder': 50
                }
              ],
              'ml:index': [
                {
                  'ml:indexType': 'range-path-index',
                  'ml:indexParameters': {
                    'scalar-type': 'string',
                    collation: 'http://marklogic.com/collation/en/S1',
                    'range-value-positions': false,
                    'invalid-values': 'reject'
                  }
                }
              ],
              'ml:constraint': [
                {
                  'brain:search': {
                    'brain:searchType': 'range'
                  },
                  'ml:constraintType': 'range-path-constraint',
                  'ml:constraintOrder': 80,
                  'ml:constraintParameters': {
                    name: 'Submitted_By',
                    range: {
                      type: 'xs:string',
                      collation: 'http://marklogic.com/collation/en/S1',
                      facet: true,
                      'facet-option': [
                        'limit=10',
                        'frequency-order',
                        'descending'
                      ]
                    }
                  }
                }
              ]
            }
          }
        },
        location: {
          type: 'object',
          properties: {
            city: {
              type: 'string'
            },
            state: {
              type: 'string'
            },
            country: {
              type: 'string'
            }
          }
        },
        contact: {
          type: 'object',
          properties: {
            phone: {
              type: 'string'
            },
            email: {
              type: 'string'
            }
          }
        }
      },
      'brain:xpath':
        '/object-node("envelope")/object-node("instance")/object-node("content")/object-node("info")/object-node("submitter")'
    },
    envelope_instance_content_info_technologies: {
      type: 'array',
      title: 'Technologies',
      items: {
        type: 'object',
        properties: {
          group: {
            type: 'string',
            title: 'Category'
          },
          item: {
            type: 'string',
            title: 'subCategory'
          }
        }
      },
      'brain:value': {
        'brain:valueType': 'attribute',
        'brain:valueForCreate': 40,
        'brain:valueOrder': 1040,
        'brain:valueSchemaDefinition': {
          'ui:field': 'AsyncMultiObjectSelectorField',
          asyncMultiObjectSelector: {
            url: '/api/value/typeahead-taxonomy-concepts/technology?',
            method: 'GET',
            labelKey: 'item',
            minLength: 0,
            allowNew: true,
            newSelectionPrefix: 'Add a new item: '
          }
        }
      },
      'brain:xpath':
        '/object-node("envelope")/object-node("instance")/object-node("content")/object-node("info")/array-node("technologies")'
    },
    envelope_instance_content_profile_description: {
      type: 'object',
      title: 'Business Description',
      'brain:value': {
        'brain:valueType': 'data',
        'brain:valueSchemaTemplate': {
          'brain:valueSchemaTemplateName': 'richTextEditor',
          'brain:valueSchemaTemplateOptions': {}
        }
      },
      properties: {
        html: {
          type: 'string'
        },
        text: {
          type: 'string'
        }
      },
      'brain:xpath':
        '/object-node("envelope")/object-node("instance")/object-node("content")/object-node("profile")/object-node("description")'
    },
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
              },
              
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
