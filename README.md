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

## Installation

You can install NFT Maker using your favorite Node package
manager:

```sh 
# NPM
npm install -g nftmaker

# Yarn
yarn global install nftmaker
```

## Running NFT Maker

After installation and configuration, you can generate your
images and metadata by using the `run` command inside your
project folder:

```sh
nftmaker run
```

This will generate several files:

- `manifest.json` An image manifest with every token and
  attribute
- `stats.json` Counts of each attribute and the number of times
  they are used
- `assets` A folder of images and JSON files generated from your
  configuration file. These files are zero-indexed, meaning that
  Token #1's filenames are `0.png` and `0.json`

The contents of the `assets` folder is what is used to generate
your Candy Machine with Metaplex.

## Configuration

### Required Configuration Values

In addition to the image attributes (traits), there are other
configuration options you need to specify so the output JSON is
correct. These include the edition size, the project name and
description, the creator addresses and shares, and other
metadata:

```js
module.exports = {
  editionSize: 10, // How many NFTs should be generated
  maxAttempts: 400, // The maximum amount of times NFT Maker should attempt to find a unique image before failing
  name: 'Solana Project Name', // The name of your project
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
    - Green Eyes.png
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
filling in the `order` array inside your configuration:

```js
module.exports = {
  //...
  order: ['Background', 'Face', 'Eyes', 'Hair'],
  //...
}
```

### Specifying incompatibilities

Some individual trait items may not be compatible visually with
another trait item. For example, you may have a "Mouth"
item that doesn't work with a certain "Beard" item. You can
configure which items are incompatible with each by using
the `conflicts` key, which takes a closure that returns whether
the individual trait is conflicting:

```js
module.exports = {
//...
  traits: [
    {
      name: 'Beard',
      items: [
        {
          name: 'Soul Patch', weight: 10,
          conflicts: (traitName, traitValue) => ['Derp',
            'Toothy Grin'].includes(traitValue),
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
  //...
}
```

### Metadata Only Traits

Some traits are not represented in your images visually but
should still be included in the JSON metadata. For example, your
project may have traits with a specific
"gender", or  "favorite rapper". You can specify a trait as
`metadataOnly` to prevent NFT Maker from trying to find a layer
for it, but still including the attribute in the output.

```js
module.exports = {
  //...
  traits: [
    {
      name: 'Gender',
      items: [
        { name: 'Male', weight: 5, },
        { name: 'Female', weight: 5, },
        { name: 'Non-binary', weight: 5 },
        { name: 'Other', weight: 5 },
      ],
      options: {
        metadataOnly: true,
      },
    },
  ],
  //...
}

```

### Generating Unique 1/1 Images (Uniques)

Every project tends to need some, special, 1/1, ultra-rare
images. You can have NFT Maker generate these "uniques" and
include them in a random position in your drop. Just specify the
specific attributes and their special values in the `uniques`
key of your configuration:

```js
module.exports = {
  //...
  uniques: [
    {
      Background: { name: 'Midnight' },
      Face: { name: 'Iridescent' },
      Eyes: { name: 'Laser' },
      Hair: { name: 'Lightning' },
    },
  ],
  //...
}
```
