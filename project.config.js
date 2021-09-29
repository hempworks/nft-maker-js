module.exports = {
  name: 'Hemp',
  description: '128 randomly-generated avatars',
  collection: {
    name: 'Hemp (1st Edition)',
    family: 'Hemp',
  },
  creators: [
    {
      address: '1234567890',
      share: 100,
    },
  ],

  editionSize: 10,

  uniques: [
    {
      Background: 'Black',
      Foreground: 'White',
    },
  ],

  traits: [
    {
      name: 'Background',
      items: [
        { name: 'Black', weight: 10 },
        { name: 'Red', weight: 10 },
        { name: 'White', weight: 20 },
      ],
    },
    {
      name: 'Foreground',
      items: [
        { name: 'White', weight: 10 },
        { name: 'Black', weight: 20 },
        { name: 'Green', weight: 20 },
      ],
    },
  ],
}
