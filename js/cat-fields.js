const CAT_FIELDS = {
  whiskey: [
    { key: 'distillery', label: 'Distillery', type: 'text', placeholder: 'e.g. Buffalo Trace' },
    { key: 'mashbill', label: 'Mashbill / Recipe', type: 'text', placeholder: 'e.g. High Rye, OESK' },
    { key: 'age', label: 'Age Statement', type: 'text', placeholder: 'e.g. 12 Years, NAS' },
    { key: 'proof', label: 'Proof', type: 'number', placeholder: 'e.g. 93', step: '0.1' },
    { key: 'abv', label: 'ABV %', type: 'number', placeholder: 'e.g. 46.5', step: '0.1' },
    { key: 'batch', label: 'Batch Number', type: 'text', placeholder: 'e.g. B-142, 23A' },
    { key: 'barrel_no', label: 'Barrel Number', type: 'text', placeholder: 'e.g. 512' },
    { key: 'barrel_type', label: 'Barrel Type', type: 'select', options: ['New Charred Oak', 'Ex-Bourbon', 'Ex-Sherry', 'Ex-Wine', 'Ex-Rum', 'Ex-Port', 'Toasted', 'Double Oaked', 'Other'] },
    { key: 'finish', label: 'Finish', type: 'text', placeholder: 'e.g. Port Cask, Toasted Barrel' },
    { key: 'selector', label: 'Single Barrel Selector', type: 'text', placeholder: 'e.g. Total Wine, Store Pick' },
    { key: 'size', label: 'Bottle Size', type: 'select', options: ['50ml', '200ml', '375ml', '700ml', '750ml', '1L', '1.75L'] },
    { key: 'rarity', label: 'Rarity', type: 'select', options: ['Common', 'Uncommon', 'Rare', 'Ultra-Rare', 'Unicorn'] },
    { key: 'msrp', label: 'MSRP', type: 'number', placeholder: '0.00', step: '0.01' },
  ],

  wine: [
    { key: 'winery', label: 'Winery', type: 'text', placeholder: 'e.g. Chateau Margaux' },
    { key: 'vintage', label: 'Vintage', type: 'number', placeholder: 'e.g. 2019' },
    { key: 'varietal', label: 'Varietal / Blend', type: 'text', placeholder: 'e.g. Cabernet Sauvignon' },
    { key: 'appellation', label: 'Appellation', type: 'text', placeholder: 'e.g. Napa Valley' },
    { key: 'region', label: 'Region / Country', type: 'text', placeholder: 'e.g. Bordeaux, France' },
    { key: 'abv', label: 'ABV %', type: 'number', placeholder: 'e.g. 14.5', step: '0.1' },
    { key: 'closure', label: 'Closure', type: 'select', options: ['Natural Cork', 'Synthetic Cork', 'Screw Cap', 'Crown Cap', 'Glass Stopper'] },
    { key: 'size', label: 'Bottle Size', type: 'select', options: ['375ml', '500ml', '750ml', '1L', '1.5L Magnum', '3L Jeroboam'] },
    { key: 'drink_from', label: 'Drink From', type: 'number', placeholder: 'e.g. 2025' },
    { key: 'drink_to', label: 'Drink To', type: 'number', placeholder: 'e.g. 2035' },
    { key: 'critic_score', label: 'Critic Score', type: 'number', placeholder: 'e.g. 95', min: '0', max: '100' },
    { key: 'critic_source', label: 'Critic Source', type: 'text', placeholder: 'e.g. Parker, Suckling' },
  ],

  beer: [
    { key: 'brewery', label: 'Brewery', type: 'text', placeholder: 'e.g. Tree House Brewing' },
    { key: 'style', label: 'Style', type: 'select', options: ['IPA', 'DIPA / Imperial IPA', 'NEIPA / Hazy IPA', 'Pale Ale', 'Stout', 'Imperial Stout', 'Porter', 'Pilsner', 'Lager', 'Wheat', 'Sour', 'Saison', 'Belgian', 'Amber / Red', 'Brown Ale', 'Barleywine', 'Gose', 'Kolsch', 'Mead', 'Cider', 'Other'] },
    { key: 'abv', label: 'ABV %', type: 'number', placeholder: 'e.g. 6.5', step: '0.1' },
    { key: 'ibu', label: 'IBU', type: 'number', placeholder: 'e.g. 65' },
    { key: 'format', label: 'Format', type: 'select', options: ['Draft', '12oz Can', '16oz Can', '19.2oz Can', '12oz Bottle', '22oz Bomber', '750ml Bottle', 'Crowler', 'Growler'] },
    { key: 'seasonal', label: 'Release Type', type: 'select', options: ['Year Round', 'Seasonal', 'Limited Release', 'One-Off', 'Collaboration'] },
    { key: 'brew_date', label: 'Brew / Can Date', type: 'text', placeholder: 'e.g. 03/15/2025' },
  ],

  cigar: [
    { key: 'manufacturer', label: 'Manufacturer', type: 'text', placeholder: 'e.g. Padron, Arturo Fuente' },
    { key: 'line', label: 'Line / Blend', type: 'text', placeholder: 'e.g. 1964 Anniversary' },
    { key: 'vitola', label: 'Vitola / Shape', type: 'text', placeholder: 'e.g. Robusto, Toro, Churchill' },
    { key: 'length', label: 'Length (inches)', type: 'number', placeholder: 'e.g. 5.5', step: '0.25' },
    { key: 'ring_gauge', label: 'Ring Gauge', type: 'number', placeholder: 'e.g. 52' },
    { key: 'wrapper', label: 'Wrapper', type: 'text', placeholder: 'e.g. Habano, Maduro, Connecticut' },
    { key: 'binder', label: 'Binder', type: 'text', placeholder: 'e.g. Nicaraguan' },
    { key: 'filler', label: 'Filler', type: 'text', placeholder: 'e.g. Nicaraguan, Dominican' },
    { key: 'strength', label: 'Strength', type: 'select', options: ['Mild', 'Mild-Medium', 'Medium', 'Medium-Full', 'Full'] },
    { key: 'quantity', label: 'Quantity', type: 'number', placeholder: 'e.g. 5' },
    { key: 'box_date', label: 'Box Date / Code', type: 'text', placeholder: 'e.g. EML MAR 25' },
    { key: 'humidor', label: 'Humidor', type: 'text', placeholder: 'e.g. Main Humidor, Tupperdor' },
    { key: 'msrp', label: 'MSRP (per stick)', type: 'number', placeholder: '0.00', step: '0.01' },
  ],

  pipe_tobacco: [
    { key: 'blender', label: 'Blender / Brand', type: 'text', placeholder: 'e.g. G.L. Pease, C&D' },
    { key: 'blend_type', label: 'Blend Type', type: 'select', options: ['English', 'Balkan', 'Virginia', 'VaPer', 'Virginia/Burley', 'Aromatic', 'English/Oriental', 'Burley', 'Kentucky', 'Other'] },
    { key: 'components', label: 'Components', type: 'text', placeholder: 'e.g. Virginia, Latakia, Oriental' },
    { key: 'cut', label: 'Cut', type: 'select', options: ['Ribbon', 'Flake', 'Broken Flake', 'Crumble Cake', 'Plug', 'Rope', 'Cube Cut', 'Shag'] },
    { key: 'tin_date', label: 'Tin Date', type: 'text', placeholder: 'e.g. 2020, Mar 2023' },
    { key: 'opened_date', label: 'Opened Date', type: 'text', placeholder: 'e.g. Jan 2025' },
    { key: 'container', label: 'Container', type: 'select', options: ['Sealed Tin', 'Open Tin', 'Mason Jar', 'Bag', 'Bulk', 'Pouch'] },
    { key: 'weight', label: 'Weight (oz)', type: 'number', placeholder: 'e.g. 2', step: '0.1' },
    { key: 'quantity', label: 'Quantity (tins)', type: 'number', placeholder: 'e.g. 3' },
    { key: 'nicotine', label: 'Nicotine', type: 'select', options: ['Low', 'Low-Medium', 'Medium', 'Medium-High', 'High'] },
  ],

  pipe: [
    { key: 'maker', label: 'Maker / Brand', type: 'text', placeholder: 'e.g. Peterson, Dunhill' },
    { key: 'country', label: 'Country of Origin', type: 'text', placeholder: 'e.g. Italy, Denmark' },
    { key: 'shape', label: 'Shape', type: 'select', options: ['Billiard', 'Dublin', 'Bulldog', 'Poker', 'Apple', 'Author', 'Bent', 'Churchwarden', 'Freehand', 'Lovat', 'Prince', 'Rhodesian', 'Zulu', 'Canadian', 'Calabash', 'Oom Paul', 'Tomato', 'Volcano', 'Other'] },
    { key: 'material', label: 'Material', type: 'select', options: ['Briar', 'Meerschaum', 'Corn Cob', 'Clay', 'Morta / Bog Oak', 'Cherry', 'Olive', 'Pear', 'Other'] },
    { key: 'stem', label: 'Stem Material', type: 'select', options: ['Vulcanite', 'Lucite / Acrylic', 'Cumberland', 'Amber', 'Bone', 'Horn', 'Other'] },
    { key: 'finish_type', label: 'Finish', type: 'select', options: ['Smooth', 'Sandblast', 'Rusticated', 'Carved', 'Partially Rusticated', 'Natural'] },
    { key: 'filter', label: 'Filter', type: 'select', options: ['None', '6mm', '9mm', 'Stinger', 'Other'] },
    { key: 'chamber_dia', label: 'Chamber Diameter (mm)', type: 'number', placeholder: 'e.g. 20', step: '0.5' },
    { key: 'chamber_depth', label: 'Chamber Depth (mm)', type: 'number', placeholder: 'e.g. 38', step: '0.5' },
    { key: 'weight_g', label: 'Weight (grams)', type: 'number', placeholder: 'e.g. 45' },
    { key: 'year', label: 'Year Made', type: 'number', placeholder: 'e.g. 2020' },
  ],

  hat: [
    { key: 'hat_brand', label: 'Brand', type: 'select', options: ['New Era', "'47", 'Mitchell & Ness', 'Stetson', 'Nike', 'Adidas', 'Titleist', 'Patagonia', 'Carhartt', 'Kangol', 'Brixton', 'Goorin Bros', 'Other'] },
    { key: 'silhouette', label: 'Style / Silhouette', type: 'select', options: ['Fitted', 'Snapback', 'Strapback', 'Dad Hat', 'Trucker', 'Bucket', 'Beanie', 'Visor', 'Fedora', 'Cowboy / Western', 'Flat Cap', 'Newsboy', 'Golf', 'Performance', 'Other'] },
    { key: 'hat_size', label: 'Size', type: 'text', placeholder: 'e.g. 7 3/8, S/M, OSFA' },
    { key: 'team', label: 'Team / Logo', type: 'text', placeholder: 'e.g. NY Yankees, Boston Red Sox' },
    { key: 'colorway', label: 'Primary Color', type: 'text', placeholder: 'e.g. Navy, Black' },
    { key: 'secondary_color', label: 'Secondary Color', type: 'text', placeholder: 'e.g. Red, White' },
    { key: 'undervisor', label: 'Under-Visor Color', type: 'text', placeholder: 'e.g. Gray, Green' },
    { key: 'hat_material', label: 'Material', type: 'text', placeholder: 'e.g. Wool, Polyester, Cotton' },
    { key: 'patch', label: 'Patch / Collab', type: 'text', placeholder: 'e.g. World Series 1999' },
    { key: 'edition', label: 'Edition', type: 'select', options: ['General Release', 'Exclusive', 'Limited', '1-of-1', 'Sample', 'Prototype'] },
    { key: 'wear_count', label: 'Times Worn', type: 'number', placeholder: '0' },
  ],

  other: []
};

function renderCatFields(category, data) {
  const fields = CAT_FIELDS[category] || [];
  if (!fields.length) return '';

  return fields.map(f => {
    const val = data ? (data[f.key] || '') : '';

    if (f.type === 'select') {
      const opts = (f.options || []).map(o =>
        `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`
      ).join('');
      return `<div class="field"><label class="field-label">${f.label}</label>
        <select class="field-input cat-field" data-field="${f.key}">
          <option value="">Select...</option>${opts}
        </select></div>`;
    }

    const attrs = [];
    if (f.step) attrs.push(`step="${f.step}"`);
    if (f.min) attrs.push(`min="${f.min}"`);
    if (f.max) attrs.push(`max="${f.max}"`);

    return `<div class="field"><label class="field-label">${f.label}</label>
      <input type="${f.type}" class="field-input cat-field" data-field="${f.key}"
        value="${val}" placeholder="${f.placeholder || ''}" ${attrs.join(' ')}></div>`;
  }).join('');
}

function collectCatFields() {
  const data = {};
  document.querySelectorAll('.cat-field').forEach(el => {
    const val = el.value.trim();
    if (val) data[el.dataset.field] = val;
  });
  return data;
}

function renderDetailCatFields(category, item) {
  const fields = CAT_FIELDS[category] || [];
  if (!fields.length) return '';

  const icons = {
    distillery: 'fa-industry', mashbill: 'fa-wheat-awn', age: 'fa-hourglass-half',
    proof: 'fa-fire', abv: 'fa-percent', batch: 'fa-hashtag', barrel_no: 'fa-hashtag',
    barrel_type: 'fa-database', finish: 'fa-glass-water', selector: 'fa-store',
    size: 'fa-ruler', rarity: 'fa-gem', msrp: 'fa-tag',
    winery: 'fa-industry', vintage: 'fa-calendar', varietal: 'fa-seedling',
    appellation: 'fa-map-pin', region: 'fa-earth-americas', closure: 'fa-bottle-water',
    drink_from: 'fa-calendar-check', drink_to: 'fa-calendar-xmark',
    critic_score: 'fa-star', critic_source: 'fa-newspaper',
    brewery: 'fa-industry', style: 'fa-beer-mug-empty', ibu: 'fa-gauge-high',
    format: 'fa-box', seasonal: 'fa-snowflake', brew_date: 'fa-calendar',
    manufacturer: 'fa-industry', line: 'fa-tag', vitola: 'fa-ruler',
    length: 'fa-ruler-vertical', ring_gauge: 'fa-circle', wrapper: 'fa-leaf',
    binder: 'fa-leaf', filler: 'fa-leaf', strength: 'fa-gauge',
    quantity: 'fa-cubes', box_date: 'fa-barcode', humidor: 'fa-box-archive',
    blender: 'fa-industry', blend_type: 'fa-flask', components: 'fa-leaf',
    cut: 'fa-scissors', tin_date: 'fa-calendar', opened_date: 'fa-calendar-check',
    container: 'fa-jar', weight: 'fa-weight-scale', nicotine: 'fa-gauge',
    maker: 'fa-industry', country: 'fa-flag', shape: 'fa-shapes',
    material: 'fa-tree', stem: 'fa-grip-lines', finish_type: 'fa-paintbrush',
    filter: 'fa-filter', chamber_dia: 'fa-circle', chamber_depth: 'fa-ruler-vertical',
    weight_g: 'fa-weight-scale', year: 'fa-calendar',
    hat_brand: 'fa-tag', silhouette: 'fa-hat-cowboy', hat_size: 'fa-ruler',
    team: 'fa-shield', colorway: 'fa-palette', secondary_color: 'fa-palette',
    undervisor: 'fa-eye', hat_material: 'fa-shirt', patch: 'fa-certificate',
    edition: 'fa-gem', wear_count: 'fa-person-walking',
  };

  const rows = fields.filter(f => item[f.key]).map(f => {
    const icon = icons[f.key] || 'fa-circle-info';
    return `<div class="detail-row">
      <div class="detail-row-icon"><i class="fa-solid ${icon}"></i></div>
      <div class="detail-row-body">
        <div class="detail-row-label">${f.label}</div>
        <div class="detail-row-value">${item[f.key]}</div>
      </div>
    </div>`;
  }).join('');

  return rows;
}
