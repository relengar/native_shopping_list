import {Unit, UnitGroup} from '../../types/unit';

type ConversionFuncion = (amount: number) => number;

type ConversionKey = `${Unit}=>${Unit}`;

type ConversionsMap = Map<ConversionKey, ConversionFuncion>;

const conversionMap: ConversionsMap = new Map<ConversionKey, ConversionFuncion>(
  [
    // MASS
    ['MILLIGRAM=>POUND', amount => amount / 453592],
    ['MILLIGRAM=>OUNCE', amount => amount / 28350],
    ['GRAM=>POUND', amount => amount / 454],
    ['GRAM=>OUNCE', amount => amount / 28.35],
    ['KILOGRAM=>POUND', amount => amount * 2.205],
    ['KILOGRAM=>OUNCE', amount => amount * 35.274],
    ['POUND=>OUNCE', amount => amount * 16],
    ['POUND=>MILLIGRAM', amount => amount * 453592],
    ['POUND=>GRAM', amount => amount * 454],
    ['POUND=>KILOGRAM', amount => amount / 2.205],
    ['OUNCE=>POUND', amount => amount / 16],
    ['OUNCE=>MILLIGRAM', amount => amount * 28350],
    ['OUNCE=>GRAM', amount => amount * 28.35],
    ['OUNCE=>KILOGRAM', amount => amount / 35.274],
    // VOLUME
    ['MILLILITER=>CUP', amount => amount / 284], // imperial
    ['MILLILITER=>FLUID', amount => amount / 28.413],
    ['MILLILITER=>TABLESPOON', amount => amount / 17.758], // imperial
    ['MILLILITER=>TEASPOON', amount => amount / 5.919], // imperial
    ['MILLILITER=>GALLON', amount => amount / 4546], // imperial
    ['MILLILITER=>QUART', amount => amount / 1137], // imperial
    ['MILLILITER=>GILL', amount => amount / 118],
    ['MILLILITER=>PINT', amount => amount / 568], // imperial
    ['DECILITER=>CUP', amount => amount / 2.841],
    ['DECILITER=>FLUID', amount => amount * 3.52],
    ['DECILITER=>PINT', amount => amount / 5.683],
    ['DECILITER=>QUART', amount => amount / 11.365],
    ['DECILITER=>GALLON', amount => amount / 45.461],
    ['DECILITER=>TABLESPOON', amount => amount * 5.631],
    ['DECILITER=>TEASPOON', amount => amount * 16.894],
    ['DECILITER=>GILL', amount => amount / 1.183],
    ['LITER=>CUP', amount => amount * 3.52],
    ['LITER=>FLUID', amount => amount * 35.195],
    ['LITER=>TABLESPOON', amount => amount * 56.312],
    ['LITER=>TEASPOON', amount => amount * 169],
    ['LITER=>GILL', amount => amount * 8.454],
    ['LITER=>GALLON', amount => amount * 4.546],
    ['LITER=>QUART', amount => amount / 1.137],
    ['LITER=>PINT', amount => amount * 1.76],
    ['GILL=>MILLILITER', amount => amount * 118],
    ['GILL=>DECILITER', amount => amount * 12],
    ['GILL=>LITER', amount => amount / 8.454],
    ['GILL=>CUP', amount => amount / 2.402],
    ['GILL=>FLUID', amount => amount * 4.163],
    ['GILL=>TABLESPOON', amount => amount * 6.661],
    ['GILL=>TEASPOON', amount => amount * 19.984],
    ['GILL=>QUART', amount => amount / 9.608],
    ['GILL=>PINT', amount => amount / 4.804],
    ['GILL=>GALLON', amount => amount / 38.43],
    ['CUP=>MILLILITER', amount => amount * 284],
    ['CUP=>DECILITER', amount => amount * 2.841],
    ['CUP=>LITER', amount => amount / 3.52],
    ['CUP=>TEASPOON', amount => amount * 48],
    ['CUP=>TABLESPOON', amount => amount * 16],
    ['CUP=>GALLON', amount => amount / 16],
    ['CUP=>FLUID', amount => amount * 10],
    ['CUP=>PINT', amount => amount / 2],
    ['CUP=>QUART', amount => amount / 4],
    ['CUP=>GILL', amount => amount * 2.402],
    ['PINT=>MILLILITER', amount => amount * 568],
    ['PINT=>DECILITER', amount => amount * 5.683],
    ['PINT=>LITER', amount => amount / 1.76],
    ['PINT=>CUP', amount => amount * 2],
    ['PINT=>FLUID', amount => amount * 20],
    ['PINT=>GALLON', amount => amount / 8],
    ['PINT=>TABLESPOON', amount => amount * 32],
    ['PINT=>TEASPOON', amount => amount * 96],
    ['PINT=>QUART', amount => amount / 2],
    ['PINT=>GILL', amount => amount * 4.804],
    ['TABLESPOON=>MILLILITER', amount => amount * 17.758],
    ['TABLESPOON=>DECILITER', amount => amount / 5.631],
    ['TABLESPOON=>LITER', amount => amount / 56.312],
    ['TABLESPOON=>CUP', amount => amount / 16],
    ['TABLESPOON=>FLUID', amount => amount / 1.6],
    ['TABLESPOON=>GALLON', amount => amount / 256],
    ['TABLESPOON=>TEASPOON', amount => amount * 3],
    ['TABLESPOON=>GILL', amount => amount / 6.661],
    ['TABLESPOON=>QUART', amount => amount / 64],
    ['TABLESPOON=>PINT', amount => amount / 32],
    ['TEASPOON=>MILLILITER', amount => amount * 5.919],
    ['TEASPOON=>DECILITER', amount => amount / 16.894],
    ['TEASPOON=>LITER', amount => amount / 169],
    ['TEASPOON=>TABLESPOON', amount => amount / 3],
    ['TEASPOON=>CUP', amount => amount / 48],
    ['TEASPOON=>PINT', amount => amount / 96],
    ['TEASPOON=>GALLON', amount => amount / 768],
    ['TEASPOON=>GILL', amount => amount / 19.984],
    ['TEASPOON=>FLUID', amount => amount / 4.8],
    ['TEASPOON=>QUART', amount => amount / 192],
    ['GALLON=>MILLILITER', amount => amount * 4546],
    ['GALLON=>DECILITER', amount => amount * 45.461],
    ['GALLON=>LITER', amount => amount * 4.546],
    ['GALLON=>CUP', amount => amount * 16],
    ['GALLON=>FLUID', amount => amount * 160],
    ['GALLON=>TABLESPOON', amount => amount * 256],
    ['GALLON=>TEASPOON', amount => amount * 768],
    ['GALLON=>PINT', amount => amount * 8],
    ['GALLON=>QUART', amount => amount * 4.804],
    ['GALLON=>GILL', amount => amount * 38.43],
    ['QUART=>MILLILITER', amount => amount * 1137],
    ['QUART=>MILLILITER', amount => amount * 11.365],
    ['QUART=>LITER', amount => amount * 1.137],
    ['QUART=>GALLON', amount => amount / 4],
    ['QUART=>PINT', amount => amount * 2],
    ['QUART=>GILL', amount => amount * 9.608],
    ['QUART=>CUP', amount => amount * 4],
    ['QUART=>TABLESPOON', amount => amount * 64],
    ['QUART=>TEASPOON', amount => amount * 192],
    ['QUART=>FLUID', amount => amount * 40],
    ['FLUID=>MILLILITER', amount => amount * 28.413],
    ['FLUID=>DECILITER', amount => amount / 3.52],
    ['FLUID=>DECILITER', amount => amount / 35.195],
    ['FLUID=>CUP', amount => amount / 10],
    ['FLUID=>GILL', amount => amount / 4.163],
    ['FLUID=>PINT', amount => amount / 20],
    ['FLUID=>QUART', amount => amount / 40],
    ['FLUID=>GALLON', amount => amount / 160],
    ['FLUID=>TABLESPOON', amount => amount * 1.6],
    ['FLUID=>TEASPOON', amount => amount * 4.8],
    // LENGTH
    ['MILLIMETER=>INCH', amount => amount / 25.4],
    ['CENTIMETER=>INCH', amount => amount / 2.54],
    ['METER=>INCH', amount => amount * 39.37],
    ['INCH=>MILLIMETER', amount => amount * 25.4],
    ['INCH=>CENTIMETER', amount => amount * 2.54],
    ['INCH=>METER', amount => amount / 39.37],
  ],
);

const abbrevationsMap = new Map<Unit, string>([
  [Unit.GRAM, 'g'],
  [Unit.MILLIGRAM, 'mg'],
  [Unit.KILOGRAM, 'kg'],
  [Unit.POUND, 'lb'],
  [Unit.OUNCE, 'oz'],
  [Unit.MILLILITER, 'ml'],
  [Unit.DECILITER, 'dl'],
  [Unit.LITER, 'l'],
  [Unit.CUP, 'c'],
  [Unit.PINT, 'pt'],
  [Unit.QUART, 'qt'],
  [Unit.GALLON, 'gl'],
  [Unit.TEASPOON, 'tsp'],
  [Unit.TABLESPOON, 'tbs'],
  [Unit.GILL, 'gi'],
  [Unit.FLUID, 'fl oz'],
  [Unit.CENTIMETER, 'cm'],
  [Unit.MILLIMETER, 'mm'],
  [Unit.METER, 'm'],
  [Unit.INCH, 'in'],
  [Unit.ITEM, 'pc'],
]);

function convertMetric(from: Unit, to: Unit, amount: number): number {
  const baseAmount = toBaseMetric(from, amount);
  return fromBaseMetric(to, baseAmount);
}

function toBaseMetric(from: Unit, amount: number): number {
  if (from.startsWith('MILLI')) {
    return amount / 1000;
  }
  if (from.startsWith('CENTI')) {
    return amount / 100;
  }
  if (from.startsWith('DECI')) {
    return amount / 10;
  }
  if (from.startsWith('KILO')) {
    return amount * 1000;
  }
  return amount;
}

function fromBaseMetric(to: Unit, baseAmount: number): number {
  if (to.startsWith('MILLI')) {
    return baseAmount * 1000;
  }
  if (to.startsWith('CENTI')) {
    return baseAmount * 100;
  }
  if (to.startsWith('DECI')) {
    return baseAmount * 10;
  }
  if (to.startsWith('KILO')) {
    return baseAmount / 1000;
  }
  return baseAmount;
}

function canConvertMetric(from: Unit, to: Unit): boolean {
  const metricUnitSuffixes = ['GRAM', 'LITER', 'METER'];

  const isFromMetric = metricUnitSuffixes.some(suffix => from.endsWith(suffix));
  const isToMetric = metricUnitSuffixes.some(suffix => to.endsWith(suffix));

  return isFromMetric && isToMetric;
}

/**
 * translateUnit
 * @description returns a human readable representation of the Unit enum item
 */
export function translateUnit(unit: Unit): string {
  const translations = new Map<Unit, string>([[Unit.FLUID, 'Fluid ounce']]);

  const translation = translations.get(unit);
  return translation ?? `${unit[0]}${unit.slice(1).toLowerCase()}`;
}

export function getUnitAbbrevation(unit: Unit): string {
  const abbrevation = abbrevationsMap.get(unit);
  return abbrevation ?? unit;
}

export function convertUnit(amount: number, from: Unit, to: Unit): number {
  if (amount === 0) {
    return amount;
  }
  if (canConvertMetric(from, to)) {
    return convertMetric(from, to, amount);
  }

  const conversionKey: ConversionKey = `${from}=>${to}`;
  const converionsFunction = conversionMap.get(conversionKey);
  if (!converionsFunction) {
    return amount;
  }

  return converionsFunction(amount);
}

export const unitGroupsMap: Map<UnitGroup, Unit[]> = new Map([
  [UnitGroup.AMOUNT, [Unit.ITEM]],
  [
    UnitGroup.MASS,
    [Unit.MILLIGRAM, Unit.GRAM, Unit.KILOGRAM, Unit.POUND, Unit.OUNCE],
  ],
  [
    UnitGroup.VOLUME,
    [
      Unit.MILLILITER,
      Unit.DECILITER,
      Unit.LITER,
      Unit.CUP,
      Unit.PINT,
      Unit.TABLESPOON,
      Unit.TEASPOON,
      Unit.FLUID,
      Unit.QUART,
      Unit.GALLON,
      Unit.GILL,
    ],
  ],
  [UnitGroup.LENGTH, [Unit.MILLIMETER, Unit.CENTIMETER, Unit.METER, Unit.INCH]],
]);
