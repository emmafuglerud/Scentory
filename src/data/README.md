# Local perfume data

`perfumes.js` exports one ordinary JavaScript array containing 25 real fragrances. Each object represents one specific concentration, such as Eau de Parfum (EDP) or Eau de Toilette (EDT), with one example bottle size and price. It needs no database server, API, or extra packages.

This step only adds data. The array is not connected to the screens yet.

## Fields

| Field | Meaning |
| --- | --- |
| `id` | Unique, stable identifier. Keep this unchanged when updating a price. |
| `brand`, `name` | Brand and fragrance name. |
| `concentration` | Exact variant, to distinguish EDP, EDT and Cologne. |
| `fragranceFamily` | Lowercase English translation of a selected source's family or explicit scent description. |
| `topNotes`, `heartNotes`, `baseNotes` | Arrays of verified notes in the selected source's published tiers. |
| `otherNotes` | Verified notes mentioned without a clear tier. Never assign a tier by guessing. |
| `priceNok` | Approximate listed retail price in Norwegian kroner, stored as a number. |
| `bottleSizeMl` | Bottle size that the price applies to, stored as a number. |
| `priceRetailer` | Norwegian retailer or retailer's Norwegian storefront used for the price. |
| `imagePath` | Local generic placeholder, shared by all perfumes. |
| `sources` | Separate URLs supporting notes, family, and price. |
| `checkedAt` | Date those sources were checked, in `YYYY-MM-DD` format. |
| `researchNote` | Clarifications about variants, source differences, prices, and missing information. |

Empty arrays (`[]`), empty text (`''`), and `null` for missing numbers mean **not verified or unavailable**. They do not prove that a fragrance lacks a note. For example, Pure Musc has empty top/base arrays because the selected source only explicitly identifies its musk heart.

## Research and prices

Sources checked on **22 October 2026** include official brand pages from Valentino, Prada, Lancôme, Marc Jacobs, BYREDO, Jo Malone London and Maison Margiela, plus retailers including KICKS Norway, Fredrik & Louisa, Lyko Norway, Blivakker, Proshop Norway, Parfym.no, Flaconi and Tax Free Norway. Links are recorded beside each perfume rather than relying on an unsourced list from memory. Tax Free is used for Black Opium notes only; its tax-free price is not used.

Prices are manually recorded examples, not live quotes, lowest-price claims, or market averages. They apply to the specified bottle, exclude shipping, and may include a public discount. They are not currency conversions. Some browsing results are cached/indexed listings. The check date is when the source was consulted, not a guarantee that its displayed price was updated that day. Category-listing prices are identified in `researchNote`; those pages can change order or stock. No automatic updates or scraping code is included.

## Consistent note names

Use lowercase English names when editing. Translations, regional origins, extraction formats and plural forms are simplified for later comparison:

| Source wording examples | Stored name |
| --- | --- |
| Jasmin, sjasmin, jasmine sambac, jasmine grandiflorum | `jasmine` |
| Vanilje, Bourbon vanilla, vanilla infusion, vanilla absolute | `vanilla` |
| Seder, sedertre, Moroccan cedar, cedarwood oil | `cedarwood` |
| Patsjuli, patchouli oil | `patchouli` |
| Mysk, moskus, musks | `musk` |
| White musks, hvit musk | `white musk` |
| Rosépepper, rosa pepper | `pink pepper` |
| Granny Smith apple, grønt eple | `green apple` |
| Ambrette seeds, abelmoskus | `ambrette` |
| Naseberry, sapodillaeple | `sapodilla` |
| Acajou, mahogny | `mahogany` |
| Oriental wood (family) | `woody amber` |

Do not merge different materials just because their names look alike: `vanilla orchid` is separate from `vanilla`; `violet leaf` is separate from `violet`; `neroli` is separate from `orange blossom`; `lavandin` is separate from `lavender`; `sage` is separate from `clary sage`. `amber`, `ambrofix`, `ambroxan`, `cashmeran`, and `serenolide` are also kept distinct. General terms such as `citrus`, `fruity notes`, `white flowers`, and `woody notes` stay general instead of inventing individual ingredients.

Note lists describe marketed scent impressions and accords, not full ingredient formulas. Brand pages often give only a few signature notes. Retailers sometimes publish different pyramids or family labels for the same product. Each record follows the selected source and documents material differences; it does not combine conflicting tiers into a supposedly definitive formula. Family labels are not a universal scientific classification.

The selection covers floral scents (Flowerbomb, Chloé), gourmand/vanilla scents (Goddess, Black Opium), fresh/citrus scents (Light Blue, Warm Cotton), fruity scents (Her, English Pear & Freesia), woody scents (Mojave Ghost, Wood Sage & Sea Salt), amber scents (Cloud, Paradoxe), and musky scents (Lazy Sunday Morning, Pure Musc). These examples describe the selection, not extra algorithmic classifications.

## Images

Every record uses `/images/perfume-placeholder.svg`, an original, generic illustration created for this project. It is not a photo or an imitation of any listed brand's bottle. No product images were downloaded, embedded, or hotlinked. Replace a path only after checking permission to use that particular image.

## Using the data in a later step

From `src/App.jsx`, the array can eventually be imported with:

```js
import { perfumes } from './data/perfumes'

// A simple lookup example, not a recommendation algorithm:
const libre = perfumes.find((perfume) => perfume.id === 'ysl-libre-edp')
```

To add a fragrance later, copy an object, give it a new ID, research the exact concentration, and update the sources and date. Use the same note spellings. Do not treat the number of notes in a source's summary as an ingredient's strength or importance.
