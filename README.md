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

NFT Maker can read this folder and generate and example
configuration for you. You are free to further customize this
configuration file to your liking.

If you've already generated a config file and need to 
overwrite your changes, you can pass `--force` to overwrite 
the existing file:

`nftmaker init --force`

