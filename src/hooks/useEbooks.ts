import { sample } from 'lodash-es';

const EBOOKS = [
    'Klyzx: CV why are you streaming a green line for the entire day',
    'fizzd: banana detection',
    'SpikedJackson: First it was vegetables, now all out war',
    'Nocallia: the macarena is syncopation',
    'giacomo: ok, that\'s good news\ngiacomo: i have no idea whats going on',
    'fizzd: gamedev is like: we announce game, sleep for 1 year and then wake up and press the release button',
    'KyleLab: im trying to make fake virtual CARDS, you FOOLS',
    'fizzd: by fixed i mean "off" has been changed to "oof"',
    'ItzShaun: okay in my defense it is perfectly legal in some areas of antarctica',
    'Maddy: i only know how to make a box that says fuck in javascript but ok',
    'DNH: just use -- snap\nDNH: dont be a coward',
    'Bot: Listen I\'m busy watching someone slow dance with a tray of enchiladas',
    'okamii: i needed four different pitches of beep so i made 24 instead',
    'roninnozlo: horny anthem\nSome J Name: what>\nSome J Name: no\nSome J Name: i have never charted a horny song in my life',
    'Rikri: remembe r\nRikri: don\'t text while defibrillating',
    'MarioMak967: you all are about as competent as the RHS',
    'Sealskin: fizzd announces Rhythm Doctor 2\nSealskin: "The first one isn\'t even done." - KyleLab',
    'Kin: ah, the 🅱️iolin',
    'Szprycha: I deleted fizzd',
    'Fritzy: wait there are other video games',
    'notDonte: screw kpop in this discord we stan xeno',
    'CV35W: Then the teacher was talking about Maple Leaf Rag and said "so this is that era\'s equivalent of a slap" and I woke up again',
    'plastermaster: chat is going so fast nobody will realize I love you guys',
    'Hex4Nova: tfw no 190m tall gf\nSome_J_Name: ... 190 meters?',
    'MarioMak967: good morning everyone!\nMarioMak967: Mak\'s fun fact of the day: Burying a body vertically makes it a lot harder to find.',
    'PerefL: We are Becky.\nPerefL: We are many.',
    'DNH: Let Me Tell You About Blipblop.io',
    'AdipemDragon: time to bleed ironically',
    'lugi: lucia has been trapped in the RDCube™️\nlugi: she must atone'
];

export function useEbooks() {
    return sample(EBOOKS);
}