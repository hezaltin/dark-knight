export const fetchModel = {
  '@type': 'Application_Framework',
  '@id': 'insight',
  name: 'InSIGHT',
  heading: 'InSIGHT - Competitive Intelligence Hub',
  description: 'Competitive Intelligence for DuPont Water Solutions',
  host: 'http://eslv128.es.dupont.com/insight',
  owners: [{ '@type': 'Business_Unit', name: 'Safety & Construction' }],
  annoucements: [
    {
      title: 'Search for a DuPont product',
      link:
        'https://www.dupont.com/solution-finder/results.html?BU=water-solutions',
      external: true
    },
    { title: 'Meet the inSIGHT team', link: '/about-us', external: false }
  ],
  navigation: [
    { '@type': 'Nav_Item', name: 'Home', link: '/home' },
    {
      '@type': 'Nav_Dropdown',
      name: 'Portals',
      items: [
        {
          '@type': 'Menu_Item',
          name: 'ComPas',
          link: '/portals/compas',
          disabled: true
        },
        {
          '@type': 'Menu_Item',
          name: 'InSIGHT',
          link: '/portals/insight',
          disabled: true
        },
        {
          '@type': 'Menu_Item',
          name: 'NBD Team',
          link: '/portals/nbd',
          type: 'search'
        }
      ]
    },
    {
      '@type': 'Nav_Dropdown',
      name: 'Search',
      items: [
        { '@type': 'Nav_Heading', name: 'ComPas' },
        {
          '@type': 'Menu_Item',
          name: 'Sample Assessments',
          link: '/search/compas?scope=/sharepoint/teams/nh_crd/statements',
          disabled: true
        },
        {
          '@type': 'Menu_Item',
          name: 'Product Analyses',
          link:
            '/search/customer-related?scope=/sharepoint/teams/nh_crd/uploaded-documents',
          disabled: true
        },
        {
          '@type': 'Menu_Item',
          name: 'Competitor Profiles',
          link:
            '/search/customer-related?scope=/sharepoint/teams/nh_crd/uploaded-documents',
          disabled: true
        },
        { '@type': 'Nav_Divider' },
        { '@type': 'Nav_Heading', name: 'InSIGHT' },
        {
          '@type': 'Menu_Item',
          name: 'Field Intelligence',
          link: '/search/insight?scope=/insight/field-intelligence'
        },
        {
          '@type': 'Menu_Item',
          name: 'News Feed',
          link: '/search/insight?scope=/insight/news-feed'
        },
        {
          '@type': 'Menu_Item',
          name: 'Product Reviews',
          link: '/search/insight?scope=/insight/product-reviews/homedepot'
        },
        { '@type': 'Nav_Divider' },
        { '@type': 'Nav_Heading', name: 'NBD Team' },
        {
          '@type': 'Menu_Item',
          name: 'NBD Companies',
          link: '/search/nbd?scope=/nbd/companies'
        },
        {
          '@type': 'Menu_Item',
          name: 'NBD Team Documents',
          link: '/search/nbd?scope=/nbd/team-docs&view=web'
        },
        { '@type': 'Nav_Divider' },
        { '@type': 'Nav_Heading', name: 'Intellectual Capital' },
        {
          '@type': 'Menu_Item',
          name: 'Patents',
          link: '/search/ip?scope=/ip/patents',
          disabled: true
        },
        {
          '@type': 'Menu_Item',
          name: 'Scientific Literature',
          link: '/search/ip?scope=/ip/scientific-literature',
          disabled: true
        }
      ]
    },
    {
      '@type': 'Nav_Dropdown',
      name: 'Contribute',
      items: [
        { '@type': 'Nav_Heading', name: 'ComPas' },
        {
          '@type': 'Menu_Item',
          name: 'New Sample',
          link: '/contribute/compas-new-sample',
          disabled: true
        },
        {
          '@type': 'Menu_Item',
          name: 'Update Samples',
          link: '/contribute/compas-update-samples',
          disabled: true
        },
        { '@type': 'Nav_Divider' },
        { '@type': 'Nav_Heading', name: 'NBD Team' },
        {
          '@type': 'Menu_Item',
          name: 'New Entry',
          link: '/contribute/new-entry/nbd'
        },
        {
          '@type': 'Menu_Item',
          name: 'Update NBD Companies',
          link: '/search/nbd?scope=/nbd/companies&message=update'
        },
        { '@type': 'Nav_Divider' },
        {
          '@type': 'Menu_Item',
          name: 'Leaderboard',
          link: '/contribute/leaderboard'
        }
      ]
    },
    {
      '@type': 'Nav_Dropdown',
      name: 'About',
      items: [
        { '@type': 'Menu_Item', name: 'InSIGHT Team', link: '/about/team' },
        { '@type': 'Menu_Item', name: 'Technology', link: '/about/technology' },
        {
          '@type': 'Menu_Item',
          name: 'Business Value',
          link: '/about/business-value'
        }
      ]
    }
  ],
  portals: {
    nbd: {
      title: 'NBD Team',
      announcements: [
        {
          message:
            'This application is still under active development. Please be patient.',
          status: 'warning'
        },
        {
          message: 'Please report any bugs to the support team.',
          status: 'danger'
        }
      ],
      contacts: [
        {
          name: 'Lynn Schiel',
          email: 'lynn.schiel@dupont.com',
          role: 'User Guide'
        },
        {
          name: 'Fan Li',
          email: 'fan.li@dupont.com',
          role: 'Technical Support'
        }
      ],
      search: [
        { name: 'NBD Companies', link: '/search/nbd?scope=/nbd/companies' },
        {
          name: 'NBD Team Documents',
          link: '/search/nbd?scope=/nbd/team-docs&view=web'
        }
      ]
    }
  }
};
