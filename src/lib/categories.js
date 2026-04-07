// Category translations
const CATEGORIES_BY_LANG = {
  sv: {
    main: {
      'Spel': 'Spel',
      'Leksaker och samlarobjekt': 'Leksaker och samlarobjekt',
      'Bocker och trycksaker': 'Böcker och trycksaker',
      'Film och musik': 'Film och musik',
      'Klader och accessoarer': 'Kläder och accessoarer',
      'Hem och prylar': 'Hem och prylar',
      'Ovrigt': 'Övrigt',
    },
    sub: {
      'Bradspel': 'Brädspel',
      'TV-spel': 'TV-spel',
      'PC-spel': 'PC-spel',
      'Actionfigurer': 'Actionfigurer',
      'Figurer': 'Figurer',
      'Mjukisdjur': 'Mjukisdjur',
      'Leksaker': 'Leksaker',
      'Samlarkort': 'Samlarkort',
      'Modeller': 'Modeller',
      'Trinkets': 'Trinkets',
      'Bocker': 'Böcker',
      'Serietidningar': 'Serietidningar',
      'Tidningar och magasin': 'Tidningar och magasin',
      'DVD': 'DVD',
      'Blu-ray': 'Blu-ray',
      'Vinyl': 'Vinyl',
      'CD': 'CD',
      'T-shirts': 'T-shirts',
      'Kepsar': 'Kepsar',
      'Muggar': 'Muggar',
      'Misc': 'Misc',
    }
  },
  no: {
    main: {
      'Spel': 'Spill',
      'Leksaker och samlarobjekt': 'Leker og samleobjekter',
      'Bocker och trycksaker': 'Bøker og tryksaker',
      'Film och musik': 'Film og musikk',
      'Klader och accessoarer': 'Klær og tilbehør',
      'Hem och prylar': 'Hjem og ting',
      'Ovrigt': 'Øvrigt',
    },
    sub: {
      'Bradspel': 'Brettspill',
      'TV-spel': 'TV-spill',
      'PC-spel': 'PC-spill',
      'Actionfigurer': 'Actionfigurer',
      'Figurer': 'Figurer',
      'Mjukisdjur': 'Plysj-dyr',
      'Leksaker': 'Leker',
      'Samlarkort': 'Samlekort',
      'Modeller': 'Modeller',
      'Trinkets': 'Kleinodale',
      'Bocker': 'Bøker',
      'Serietidningar': 'Tegneserier',
      'Tidningar och magasin': 'Aviser og magasiner',
      'DVD': 'DVD',
      'Blu-ray': 'Blu-ray',
      'Vinyl': 'Vinyl',
      'CD': 'CD',
      'T-shirts': 'T-skjorter',
      'Kepsar': 'Caps',
      'Muggar': 'Kopper',
      'Misc': 'Diverse',
    }
  },
  en: {
    main: {
      'Spel': 'Games',
      'Leksaker och samlarobjekt': 'Toys & Collectibles',
      'Bocker och trycksaker': 'Books & Printed Matter',
      'Film och musik': 'Film & Music',
      'Klader och accessoarer': 'Clothing & Accessories',
      'Hem och prylar': 'Home & Stuff',
      'Ovrigt': 'Other',
    },
    sub: {
      'Bradspel': 'Board Games',
      'TV-spel': 'Video Games',
      'PC-spel': 'PC Games',
      'Actionfigurer': 'Action Figures',
      'Figurer': 'Figurines',
      'Mjukisdjur': 'Plush Toys',
      'Leksaker': 'Toys',
      'Samlarkort': 'Collectible Cards',
      'Modeller': 'Models',
      'Trinkets': 'Trinkets',
      'Bocker': 'Books',
      'Serietidningar': 'Comics',
      'Tidningar och magasin': 'Magazines & Newspapers',
      'DVD': 'DVD',
      'Blu-ray': 'Blu-ray',
      'Vinyl': 'Vinyl',
      'CD': 'CD',
      'T-shirts': 'T-shirts',
      'Kepsar': 'Caps',
      'Muggar': 'Mugs',
      'Misc': 'Miscellaneous',
    }
  }
}

export const CATEGORY_TREE = {
  'Spel': ['Bradspel', 'TV-spel', 'PC-spel'],
  'Leksaker och samlarobjekt': ['Actionfigurer', 'Figurer', 'Mjukisdjur', 'Leksaker', 'Samlarkort', 'Modeller', 'Trinkets'],
  'Bocker och trycksaker': ['Bocker', 'Serietidningar', 'Tidningar och magasin'],
  'Film och musik': ['DVD', 'Blu-ray', 'Vinyl', 'CD'],
  'Klader och accessoarer': ['T-shirts', 'Kepsar'],
  'Hem och prylar': ['Muggar'],
  'Ovrigt': ['Misc'],
}

export const MAIN_CATEGORIES = Object.keys(CATEGORY_TREE)

export function findMainCategoryForSubcategory(subcategory) {
  if (!subcategory) return ''

  const match = Object.entries(CATEGORY_TREE).find(([, subcategories]) =>
    subcategories.includes(subcategory)
  )

  return match ? match[0] : ''
}

export function translateCategory(categoryKey, lang = 'sv', type = 'main') {
  return CATEGORIES_BY_LANG[lang]?.[type]?.[categoryKey] || categoryKey
}