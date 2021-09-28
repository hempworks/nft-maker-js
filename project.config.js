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

  editionSize: 1,

  uniques: [
    {
      Background: 'Black',
      Foreground: 'White',
    },
  ],

  traits: [
    { Background: [{ Black: 10 }, { White: 20 }] },
    { Foreground: [{ White: 10 }, { Black: 20 }] },
  ],
}
