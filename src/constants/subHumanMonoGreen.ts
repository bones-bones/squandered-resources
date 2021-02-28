import {Deck} from '../types';

const SNOW_FOREST = '11744'; //24x
const MARALEAF_RIDER = '414155'; //4
const HORN_BEETLE = '420253'; //4
const MECHA_GODZILLA = '428619'; //4
const GARENBRIG_PALADIN = '414122'; //4
const PACK_BALOTH = '478096'; //4
const BOREAL_RIDER = '477541'; //4
const YORVO = ''; //1
const BOAR = '229667'; //4
const SABERTOOTH = '434042'; //4
const GIGANTOSAURUS = '229691'; //3

export const theDeck: Deck = {
  keepHandCheck: (): boolean => true,
  cardMappings: {
    [SNOW_FOREST]: 'Snow-Covered Forest',
    [MARALEAF_RIDER]: 'maraleaf rider',
    [HORN_BEETLE]: 'Nessian Hornbeetle',
    [MECHA_GODZILLA]: 'mecha godzilla',
    [GARENBRIG_PALADIN]: 'garenberg palidan',
    [PACK_BALOTH]: 'Baloth Packhunter',
    [BOREAL_RIDER]: 'boreal rider',
    [YORVO]: 'Yorvo',
    [BOAR]: 'Bristling Boar',
    [SABERTOOTH]: 'sabertooth mauler',
    [GIGANTOSAURUS]: 'GIGANTASAURUS',
  },
};
