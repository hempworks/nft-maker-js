# NFT Maker

This package generates images and JSON files for use with the
Metaplex Candy Machine. It will take a folder of traits,
randomly generate images based on weighting, and create the
necessary JSON file with project information, royalty settings,
and everything else needed to launch your NFT.

Metaplex offers a similar generator in their CLI, but this
package offers a few unique features not currently implemented:

- The ability to generate one-off, completely-custom images and
  have them included in the final output.
- The ability to define trait layers but have them excluded from
  the final JSON metadata. This is good for layers that are not
  unique between individual NFTs.
- The ability to define incompatible layers (e.g. This type of
  mouth doesn't work with this beard).

## Installation

You can install NFT Maker using your favorite Node package
manager:

```sh 
# NPM
npm install -g nftmaker

# Yarn
yarn global install nftmaker
```

## Quickstart

```sh
# Create a folder for the project
mkdir my-project

# Move your traits folder into your project folder
cp path-to-traits my-project

# Generate a configuration file based on 
# the contents of the traits folder
nftmaker init

# Modify the configuration to specify the edition size,
# project details, uniques, along with any exclusions, and 
# incompatibilities. Then, run the generator:
nftmaker run
```

## Configuration

### Required Configuration Values

In addition to the image attributes (traits), there are other
configuration options you need to specify so the output JSON is
correct. These include the edition size, the project name and
description, the creator addresses and shares, and other
metadata:

```js
module.exports = {
  editionSize: 10,
  name: 'Solana Project Name',
  description: 'Your description goes here',
  collection: {
    name: 'Solana Project Name (1st Edition)',
    family: 'Solana Project Name',
  },
  sellerFeeBasisPoints: 500,
  creators: [
    {
      address: 'YOUR_ADDRESS_HERE',
      share: 100,
    }
  ],
}
```

### Generating a configuration file from a folder of traits

NFT Maker uses a configuration file to generate the image assets
and JSON metadata. NFT Maker can generate this file for you
automatically by reading the directory structure of your traits
folder.

For example, if you have a folder of layers (traits) like this:

```sh
- traits
  - Background
    - Brick.png
    - Blue Sky.png
    - Outer Space.png
  - Hair
    - Crazy Hair.png
    - Normal Hair.png
    - Bald.png
  - Eyes
    - Blue Eyes.png
    - Brown Eyes.png
    - Brown Eyes.png
  - Face
    - Face.png
```

NFT Maker can read this folder and generate an example
configuration for you. You are free to further customize this
configuration file to your liking.

If you've already generated a config file and need to overwrite
your changes, you can pass `--force` to overwrite the existing
file:

`nftmaker init --force`

### Ordering your traits

Your project's traits are probably required to be in a certain
order to make sense. You can adjust the order of the layers, by
filling out the `order` key inside your configuration:

```js
module.exports = {
  //...
  order: ['Background', 'Face', 'Eyes', 'Hair'],
  //...
}
```

### Specifying incompatibilities

Some individual trait items may not be comptatible visually with
another trait item. For example, you may have a "Mouth"
item that doesn't work with a certain "Beard" item. You can
configure which items are incompatible with each by using
the `incompatible` key, passing in an object of trait and their
array of incompatible values:

```js
module.exports = {
//...
  traits: [
    {
      name: 'Beard',
      items: [
        {
          name: 'Soul Patch', weight: 10,
          incompatible: {
            Mouth: ['Derp', 'Toothy Grin'],
          }
        },
      ],
    },
    {
      name: 'Mouth',
      items: [
        { name: 'Derp', weight: 10 },
        { name: 'Toothy Grin', weight: 10 },
      ],
    }
  ]
}
```

You may also tell NFT Maker that all of a given trait's items
are incompatible by using an asterisk as the value:

```js
module.exports = {
//...
  traits: [
    {
      name: 'Beard',
      items: [
        {
          name: 'Soul Patch', weight: 10,
          incompatible: {
            Mouth: ['*'],
          }
        },
      ],
    },
    {
      name: 'Mouth',
      items: [
        { name: 'Derp', weight: 10 },
        { name: 'Toothy Grin', weight: 10 },
      ],
    }
  ]
}
```

### Excluding traits from JSON output

Some traits may be common to all of your NFTs but do not need to
be in the JSON metadata. For example, you may have an outline
that needs to be applied to each image. In that case, you can
specify an `options` key to the trait to mark it as excluded:

```js
module.exports = {
//...
  traits: [
    {
      name: 'Outline',
      items: [
        //...
      ],
      options: {
        excluded: true
      }
    }
  ]
}
```

### Generating Unique 1/1 Images (Uniques)

Every project tends to need some, special, ultra-rare images.
You can have NFT Maker generate these "uniques" and include them
in your drop. Just specify the specific attributes and their
special values in the `uniques` key of your configuration:

```js
module.exports = {
  //...
  uniques: [
    {
      Background: 'Midnight',
      Face: 'Iridescent',
      Eyes: 'Laser',
      Hair: 'Lightning'
    }
  ],
  //...
}
```
