export const schema = 
    {
        "envelope": {
          "headers": {
            "title": "Reverse Osmosis",
            "description": "Data schema for reverse osmosis membrane products."
          },
          "triples": [],
          "instance": {
            "data": {
              "type": "object",
              "properties": {
                "summary": {
                  "type": "object",
                  "title": "Summary",
                  "compas:order": 10,
                  "compas:security": {
                    "classification": "DISO/2-Internal Use",
                    "roles": {
                      "searchable": ["all"],
                      "readable": ["all"]
                    }
                  },
                  "required": [
                    "productInfo"
                  ],
                  "properties": {
                    "productInfo": {
                      "type": "object",
                      "title": "Product Information",
                      "required": [
                        "manufacturer",
                        "model",
                        "serialNumber",
                        "thumbnail"
                      ],
                      "properties": {
                        "manufacturer": {
                          "type": "string",
                          "title": "Manufacturer",
                          "compas:type": "attribute",
                          "compas:xpath": "/envelope/instance/summary/productInfo/manufacturer",
                          "enum": [
                            "CSM",
                            "DuPont",
                            "GE",
                            "Hydranautics",
                            "Lanxess",
                            "LG Chem",
                            "Toray",
                            "Vontron"
                          ]
                        },
                        "model": {
                          "type": "string",
                          "title": "Model",
                          "compas:type": "attribute",
                          "compas:xpath": "/envelope/instance/summary/productInfo/model"
                        },
                        "serialNumber": {
                          "type": "string",
                          "title": "Serial Number",
                          "compas:type": "attribute",
                          "compas:xpath": "/envelope/instance/summary/productInfo/serialNumber"
                        },
                        "thumbnail": {
                          "type": "string",
                          "title": "Thumbnail",
                          "format": "data-url",
                          "compas:type": "attribute",
                          "compas:xpath": "/envelope/instance/summary/productInfo/thumbnail"
                        },
                        "launchDate": {
                          "type": "string",
                          "title": "Launch Date",
                          "format": "date",
                          "compas:type": "attribute",
                          "compas:xpath": "/envelope/instance/summary/productInfo/launchDate"
                        }
                      }
                    }
                  }
                },
                "material": {
                  "type": "object",
                  "title": "Material",
                  "compas:order": 20,
                  "compas:security": {
                    "classification": "DISO/3-Confidential",
                    "roles": {
                      "searchable": ["randd", "marketing"],
                      "readable": ["randd"]
                    }
                  },
                  "properties": {
                    "beforeBoxOpened": {
                      "type": "object",
                      "title": "Before Box Opened",
                      "properties": {
                        "packaging": {
                          "type": "object",
                          "title": "Packaging",
                          "compas:type": "measurement",
                          "compas:xpath": "/envelope/instance/material/beforeBoxOpened/packaging",
                          "properties": {
                            "data": {
                              "type": "string",
                              "title": "Data"
                            },
                            "method": {
                              "type": "string",
                              "title": "Method"
                            }
                          }
                        },
                        "couplerMaterial": {
                          "type": "object",
                          "title": "Coupler Material",
                          "compas:type": "measurement",
                          "compas:xpath": "/envelope/instance/material/beforeBoxOpened/couplerMaterial",
                          "properties": {
                            "data": {
                              "type": "string",
                              "title": "Data"
                            },
                            "method": {
                              "type": "string",
                              "title": "Method"
                            }
                          }
                        },
                        "couplerThickness": {
                          "type": "object",
                          "title": "Coupler Thickness",
                          "compas:type": "measurement",
                          "compas:xpath": "/envelope/instance/material/beforeBoxOpened/couplerThickness",
                          "properties": {
                            "data": {
                              "type": "string",
                              "title": "Data"
                            },
                            "method": {
                              "type": "string",
                              "title": "Method"
                            }
                          }
                        }
                      }
                    },
                    "afterBoxOpened": {
                      "type": "object",
                      "title": "After Box Opened",
                      "properties": {
                        "label": {
                          "type": "array",
                          "title": "Label Image",
                          "compas:type": "measurement",
                          "compas:xpath": "/envelope/instance/material/afterBoxOpened/label",
                          "items": {
                            "type": "string",
                            "format": "data-url"
                          }
                        },
                        "endCapMaterial": {
                          "type": "object",
                          "title": "End Cap Material",
                          "compas:type": "measurement",
                          "compas:xpath": "/envelope/instance/material/afterBoxOpened/endCapMaterial",
                          "properties": {
                            "data": {
                              "type": "string",
                              "title": "Data"
                            },
                            "method": {
                              "type": "string",
                              "title": "Method"
                            }
                          }
                        }
                      }
                    },
                    "afterElementOpened": {
                      "type": "object",
                      "title": "After Element Opened",
                      "properties": {
                        "feedSpacers": {
                          "type": "string",
                          "title": "Feed Spacers",
                          "format": "data-url",
                          "compas:type": "measurement",
                          "compas:xpath": "/envelope/instance/material/afterElementOpened/feedSpacers",
                        },
                        "permeateSpacers": {
                          "type": "string",
                          "title": "Permeate Spacers",
                          "format": "data-url",
                          "compas:type": "measurement",
                          "compas:xpath": "/envelope/instance/material/afterElementOpened/permeateSpacers",
                        }
                      }
                    }
                  }
                },
                "performance": {
                  "type": "object",
                  "title": "Performance",
                  "compas:order": 30,
                  "compas:security": {
                    "classification": "DISO/3-Confidential",
                    "roles": {
                      "searchable": ["marketing", "randd"],
                      "readable": ["marketing", "randd"]
                    }
                  },
                  "properties": {
                    "saltRejection": {
                      "type": "object",
                      "title": "Salt Rejection",
                      "compas:type": "measurement",
                      "compas:xpath": "/envelope/instance/performance/saltRejection",
                      "properties": {
                        "data": {
                          "type": "string",
                          "title": "Data"
                        },
                        "method": {
                          "type": "string",
                          "title": "Method"
                        }
                      }
                    },
                    "flux": {
                      "type": "object",
                      "title": "Flux",
                      "compas:type": "measurement",
                      "compas:xpath": "/envelope/instance/performance/flux",
                      "properties": {
                        "data": {
                          "type": "string",
                          "title": "Data"
                        },
                        "method": {
                          "type": "string",
                          "title": "Method"
                        }
                      }
                    }
                  }
                },
          
                "literature": {
                  "type": "object",
                  "title": "Literature",
                  "compas:order": 40,
                  "compas:security": {
                    "classification": "DISO/2-Internal Use",
                    "roles": {
                      "searchable": ["all"],
                      "readable": ["all"]
                    }
                  },
                  "properties": {
                    "datasheet": {
                      "type": "array",
                      "title": "Datasheet",
                      "compas:type": "measurement",
                      "compas:xpath": "/envelope/instance/literature/datasheet",
                      "items": {
                        "type": "string",
                        "format": "data-url"
                      }
                    },
                    "patent": {
                      "type": "array",
                      "title": "Patent",
                      "compas:type": "measurement",
                      "compas:xpath": "/envelope/instance/literature/patent",
                      "items": {
                        "type": "string",
                        "format": "data-url"
                      }
                    },
                    "news": {
                      "type": "array",
                      "title": "News",
                      "compas:type": "measurement",
                      "compas:xpath": "/envelope/instance/literature/news",
                      "items": {
                        "type": "string",
                        "format": "data-url"
                      }
                    }
                  }
                },
                "publication": {
                  "type": "object",
                  "title": "Publication",
                  "compas:order": 50,
                  "compas:security": {
                    "classification": "DISO/2-Internal Use",
                    "roles": {
                      "searchable": ["all"],
                      "readable": ["all"]
                    }
                  },
                  "properties": {
                    "internalPublication": {
                      "type": "array",
                      "title": "Internal Publication",
                      "compas:type": "measurement",
                      "compas:xpath": "/envelope/instance/publication/internalPublication",
                      "items": {
                        "type": "string",
                        "format": "data-url"
                      }
                    },
                    "externalPublication": {
                      "type": "array",
                      "title": "External Publication",
                      "compas:type": "measurement",
                      "compas:xpath": "/envelope/instance/publication/externalPublication",
                      "items": {
                        "type": "string",
                        "format": "data-url"
                      }
                    }
                  }
                }
              }
            },
            "ui": {
              "shared": {
                "summary": {
                  "classNames": "tab-level"
                },
                "material": {
                  "classNames": "tab-level"
                },
                "performance": {
                  "classNames": "tab-level"
                },
                "literature": {
                  "classNames": "tab-level"
                },
                "publication": {
                  "classNames": "tab-level"
                }
              },
              "edit": {
                "productInformation": {
                  "manufacturer": {
                    "ui:widget": "select",
                    "ui:placeholder": "Select One"
                  }
                },
                "beforeBoxOpened": {
                  "numberOfBags": {
                    "ui:widget": "textarea"
                  },
                  "couplerImage": {
                    "ui:options": {
                      "accept": [
                        ".png",
                        ".jpg",
                        ".jpeg"
                      ]
                    }
                  }
                }
              },
              "view": {
                "sampleInfo": {
                  "ui:disabled": true,
                  "ui:tabOrder": ["summary", "material", "performance", "literature", "publication"],
                  "summary": {
                    "ui:headingOrder": ["productInfo"]
                  },
                  "material": {
                    "ui:headingOrder": ["beforeBoxOpened","afterBoxOpened","afterElementOpened"]
                  },
                  "performance": {
                    "ui:headingOrder": ["saltRejection","flux"]
                  },
                  "literature": {
                    "ui:headingOrder": ["datasheet","patent","news"]
                  },
                  "publication": {
                    "ui:headingOrder": ["internalPublication","externalPublication"]
                  }

                }
              }
            }
          }
        }
      }
