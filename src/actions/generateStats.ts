import { resolveManifest, shouldIncludeTraitInMetadata } from '../util'
import { Count, ManifestItem } from '../defs'
import fs from 'fs'

export default function () {
  const manifest = resolveManifest()
  let counts: Count = {}

  manifest.forEach((item: ManifestItem) => {
    Object.entries(item).forEach(value => {
      const traitCategory = value[0]
      const traitItem = value[1]

      if (shouldIncludeTraitInMetadata(traitCategory)) {
        // If the trait category doesn't exist create it...
        if (!(traitCategory in counts)) {
          counts[traitCategory] = {}
        }

        // If the trait item doesn't exist create it...
        if (!(traitItem.name in counts[traitCategory])) {
          counts[traitCategory][traitItem.name] = 0
        }

        // Now increment the trait item...
        counts[traitCategory][traitItem.name]++
      }
    })
  })

  fs.writeFileSync('./stats.json', JSON.stringify(counts, null, 2), {
    flag: 'w',
  })
}
