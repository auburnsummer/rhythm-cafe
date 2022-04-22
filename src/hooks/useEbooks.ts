import { sample } from 'lodash-es';

const EBOOKS = [
    'Klyzx: CV why are you streaming a green line for the entire day',
    'fizzd: banana detection',
    'Nocallia: the macarena is syncopation',
    'giacomo: ok, that\'s good news\ngiacomo: i have no idea whats going on',
    'fizzd: gamedev is like: we announce game, sleep for 1 year and then wake up and press the release button',
    'KyleLab: im trying to make fake virtual CARDS, you FOOLS',
    'fizzd: by fixed i mean "off" has been changed to "oof"',
    'Maddy: i only know how to make a box that says fuck in javascript but ok',
    'DNH: just use -- snap\nDNH: dont be a coward',
    'okamii: i needed four different pitches of beep so i made 24 instead',
    'roninnozlo: horny anthem\nSome J Name: what>\nSome J Name: no\nSome J Name: i have never charted a horny song in my life',
    'MarioMak967: you all are about as competent as the RHS',
    'Kin: ah, the 🅱️iolin',
    'Fritzy: wait there are other video games',
    'notDonte: screw kpop in this discord we stan xeno',
    'CV35W: Then the teacher was talking about Maple Leaf Rag and said "so this is that era\'s equivalent of a slap" and I woke up again',
    'plastermaster: chat is going so fast nobody will realize I love you guys',
    'lugi: lucia has been trapped in the RDCube™️\nlugi: she must atone'
];

export function useEbooks() {
    return sample(EBOOKS);
}