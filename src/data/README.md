# Local demo perfume data

`perfumes.js` exports one ordinary JavaScript array with 25 fictional display perfumes. It needs no database server, API, or extra packages.

The names, brands, retailers, and NOK prices shown in Scentory are synthetic demo data. Fragrance families and note names are generic scent descriptors used only for the app's local recommendation exercise.

## Fields

| Field | Meaning |
| --- | --- |
| `id` | Stable internal identifier used by localStorage. |
| `brand`, `name` | Fictional display brand and perfume name. |
| `concentration` | Demo concentration label, such as EDP, EDT, or Cologne. |
| `fragranceFamily` | Lowercase fragrance-family descriptor used for matching. |
| `topNotes`, `heartNotes`, `baseNotes`, `otherNotes` | Generic note descriptors used for matching. |
| `priceNok` | Fictional NOK price for the listed demo bottle size. |
| `bottleSizeMl` | Demo bottle size stored as a number. |
| `priceRetailer` | Fictional catalogue label displayed with the price. |
| `imagePath` | Original local Scentory placeholder illustration. |

Empty arrays (`[]`) and empty text mean that the demo does not provide information for that field. They do not represent a real product claim.

## Using the data

```js
import { perfumes } from './data/perfumes'

const firstPerfume = perfumes[0]
```

The app stores only a perfume `id`, category, and optional rating in browser localStorage. Display information always comes from this file.
