/*
 * 레슨 표현·기술 용어에 발음기호(미국식 IPA)를 채워 넣는다.
 *   npm run ipa            ipa 가 없는 항목만 채움
 *   npm run ipa -- --all   모두 다시 만듦
 * CMU 발음 사전(카네기멜런대, BSD)을 쓰고, 사전에 없는 약어·복합어·숫자는 아래 OVERRIDES 와 규칙으로 처리한다.
 * 사전에 없는 단어가 있으면 목록을 출력하고 실패하므로 OVERRIDES 에 추가하면 된다.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dictionary } from 'cmu-pronouncing-dictionary';

const require = createRequire(import.meta.url);
const DATA = new URL('../app/js/data.js', import.meta.url);

// 사전에 없거나, 문맥상 다른 발음을 써야 하는 단어 (IPA 직접 지정)
const OVERRIDES = {
  // 약어 (읽는 단어처럼 발음하는 것)
  iso: 'ˈaɪsoʊ', merv: 'mɜːrv', ashrae: 'ˈæʃreɪ', hvac: 'ˈeɪtʃvæk',
  // 전문 용어 · 복합어
  subcooling: 'sʌbˈkuːlɪŋ', superheat: 'ˈsuːpərhiːt', setpoint: 'ˈsetpɔɪnt', walkthrough: 'ˈwɔːkθruː',
  datasheet: 'ˈdeɪtəʃiːt', ductwork: 'ˈdʌktwɜːrk', economizer: 'ɪˈkɑːnəmaɪzər', dehumidify: 'ˌdiːhjuːˈmɪdɪfaɪ',
  diffuser: 'dɪˈfjuːzər', diffusers: 'dɪˈfjuːzərz', takeaway: 'ˈteɪkəweɪ', workaround: 'ˈwɜːrkəraʊnd',
  reroute: 'riːˈruːt', upsize: 'ˈʌpsaɪz', oversize: 'ˌoʊvərˈsaɪz', mortem: 'ˈmɔːrtəm',
  scalability: 'ˌskeɪləˈbɪləti', percentile: 'pərˈsentaɪl', outlier: 'ˈaʊtlaɪər', bottleneck: 'ˈbɑːtlnek',
  chiller: 'ˈtʃɪlər', refrigerant: 'rɪˈfrɪdʒərənt', commissioning: 'kəˈmɪʃənɪŋ', subscription: 'səbˈskrɪpʃən',
  redundant: 'rɪˈdʌndənt', redundancy: 'rɪˈdʌndənsi', mitigation: 'ˌmɪtɪˈɡeɪʃən', latency: 'ˈleɪtənsi',
  throughput: 'ˈθruːpʊt', benchmark: 'ˈbentʃmɑːrk', bandwidth: 'ˈbændwɪdθ', ventilator: 'ˈventɪleɪtər',
  ventilation: 'ˌventɪˈleɪʃən', simultaneous: 'ˌsaɪməlˈteɪniəs', evaporator: 'ɪˈvæpəreɪtər',
  condenser: 'kənˈdensər', compressor: 'kəmˈpresər', damper: 'ˈdæmpər', airflow: 'ˈerfloʊ',
  humidity: 'hjuːˈmɪdəti', dew: 'duː', postpone: 'poʊstˈpoʊn', prototype: 'ˈproʊtətaɪp',
  'o\'clock': 'əˈklɑːk', vs: 'ˈvɜːrsəs', versus: 'ˈvɜːrsəs', okay: 'oʊˈkeɪ', ppm: 'piː piː ˈem',
  'trade-off': 'ˈtreɪdɔːf', 'post-mortem': 'ˌpoʊstˈmɔːrtəm', 'short-cycle': 'ˌʃɔːrtˈsaɪkəl', 'as-built': 'ˌæzˈbɪlt',
  'part-load': 'ˌpɑːrtˈloʊd', thirty: 'ˈθɜːrti', thirteen: 'θɜːrˈtiːn', poor: 'pʊr', beyond: 'biˈjɑːnd',
  schedule: 'ˈskedʒuːl', reschedule: 'riːˈskedʒuːl',
  // 문맥에 맞는 발음 (사전 첫 번째 발음과 다른 것)
  minutes: 'ˈmɪnɪts', live: 'lɪv', project: 'ˈprɑːdʒekt', increase: 'ɪnˈkriːs', decrease: 'dɪˈkriːs',
  upgrade: 'ʌpˈɡreɪd', use: 'juːz', estimate: 'ˈestɪmeɪt', record: 'ˈrekərd', convert: 'kənˈvɜːrt',
  update: 'ˈʌpdeɪt', elaborate: 'ɪˈlæbəreɪt',
  // 축약형 (사전에 없는 것)
  "today's": 'təˈdeɪz', "who's": 'huːz', "we'd": 'wiːd', "there's": 'ðerz'
};

// 그대로 읽는 대문자 약어는 알파벳 이름으로
const LETTERS = {
  a: 'eɪ', b: 'biː', c: 'siː', d: 'diː', e: 'iː', f: 'ef', g: 'dʒiː', h: 'eɪtʃ', i: 'aɪ', j: 'dʒeɪ', k: 'keɪ', l: 'el', m: 'em',
  n: 'en', o: 'oʊ', p: 'piː', q: 'kjuː', r: 'ɑːr', s: 'es', t: 'tiː', u: 'juː', v: 'viː', w: 'ˈdʌbəljuː', x: 'eks', y: 'waɪ', z: 'ziː'
};

// 문장 속 기능어는 약하게 읽는 형태로 (사전식 단독 발음은 강형)
const WEAK = {
  a: 'ə', an: 'ən', the: 'ðə', to: 'tə', of: 'əv', and: 'ənd', for: 'fər', at: 'ət', from: 'frəm', than: 'ðən', as: 'əz',
  or: 'ər', per: 'pər', was: 'wəz'
};

const VOWELS = {
  AA: ['ɑː', 'ɑ'], AE: ['æ', 'æ'], AH: ['ʌ', 'ə'], AO: ['ɔː', 'ɔ'], AW: ['aʊ', 'aʊ'], AY: ['aɪ', 'aɪ'], EH: ['e', 'e'],
  ER: ['ɜːr', 'ər'], EY: ['eɪ', 'eɪ'], IH: ['ɪ', 'ɪ'], IY: ['iː', 'i'], OW: ['oʊ', 'oʊ'], OY: ['ɔɪ', 'ɔɪ'], UH: ['ʊ', 'ʊ'], UW: ['uː', 'uː']
};
const CONSONANTS = {
  B: 'b', CH: 'tʃ', D: 'd', DH: 'ð', F: 'f', G: 'ɡ', HH: 'h', JH: 'dʒ', K: 'k', L: 'l', M: 'm', N: 'n', NG: 'ŋ', P: 'p',
  R: 'r', S: 's', SH: 'ʃ', T: 't', TH: 'θ', V: 'v', W: 'w', Y: 'j', Z: 'z', ZH: 'ʒ'
};
// 강세 기호를 음절 앞에 붙이기 위한 영어 음절 첫소리 조합
const ONSETS = new Set(('P L,B L,K L,G L,F L,S L,P R,B R,T R,D R,K R,G R,F R,TH R,SH R,T W,D W,K W,G W,S W,TH W,' +
  'S P,S T,S K,S M,S N,S F,P Y,B Y,K Y,G Y,M Y,F Y,V Y,HH Y,S P L,S P R,S T R,S K R,S K W,S K Y,S P Y').split(','));

function legalOnset(cs) {
  if (cs.length === 0) return true;
  if (cs.length === 1) return cs[0] !== 'NG';
  return ONSETS.has(cs.join(' '));
}

/**
 * ARPAbet("K AH0 M P Y UW1 T ER0") → IPA("kəmˈpjuːtər").
 * 사전식 표기에 맞춰 정리: 한 음절 단어는 강세 표시 생략, 1강세가 여럿이면 마지막만 남김,
 * 1강세 뒤나 바로 앞 음절의 2강세는 생략 (weekend ˈwiːkend, decide dɪˈsaɪd)
 */
function arpabetToIpa(arpa) {
  const ph = arpa.split(' ');
  const vowelAt = ph.map((p, i) => (/\d$/.test(p) ? i : -1)).filter((i) => i >= 0);
  const stress = vowelAt.map((vi) => ph[vi].slice(-1));
  const lastPrimary = stress.lastIndexOf('1');
  stress.forEach((s, k) => { if (s === '1' && k !== lastPrimary) stress[k] = '2'; });
  const primary = stress.indexOf('1');
  const shown = stress.map((s, k) => {
    if (vowelAt.length < 2 || s === '0') return '';
    if (s === '2' && (primary === -1 || k > primary || k === primary - 1)) return '';
    return s === '1' ? 'ˈ' : 'ˌ';
  });
  const marks = {};
  vowelAt.forEach((vi, k) => {
    if (!shown[k]) return;
    const prev = k === 0 ? -1 : vowelAt[k - 1];
    const cluster = ph.slice(prev + 1, vi);
    let start = vi;
    if (k === 0) start = 0;
    else for (let n = cluster.length; n >= 0; n--) if (legalOnset(cluster.slice(cluster.length - n))) { start = vi - n; break; }
    marks[start] = shown[k];
  });
  const out = ph.map((p, i) => {
    const m = p.match(/^([A-Z]+)(\d)?$/);
    let sym;
    if (m[2] == null) sym = CONSONANTS[m[1]];
    else {
      const k = vowelAt.indexOf(i);
      const weak = m[2] === '0' || (m[1] === 'IY' && m[2] === '2' && !shown[k] && i === ph.length - 1);
      sym = VOWELS[m[1]][weak ? 1 : 0];
      // 첫 음절 자음 앞의 약한 iː 는 ɪ (report rɪˈpɔːrt), 그 밖에는 i (previous ˈpriːviəs, happy ˈhæpi)
      const unmarked = weak || (m[2] === '2' && !shown[k]);
      if (m[1] === 'IY' && unmarked && k === 0 && vowelAt.length > 1 && !/\d$/.test(ph[i + 1])) sym = 'ɪ';
    }
    return (marks[i] || '') + sym;
  }).join('');
  // dərˈekʃən → dəˈrekʃən
  return out.replace(/ər([ˈˌ])(?=[aeiouæɑɔəɜɪʊʌ])/g, 'ə$1r');
}

/**
 * 한국에서 많이 보는 사전(네이버·YBM) 표기에 맞춘다. CMU 사전은 약한 모음을 모두 ə 로 적어서 어색해 보인다.
 * sensible ˈsensəbəl → ˈsensəbl, person ˈpɜːrsən → ˈpɜːrsn, unit ˈjuːnət → ˈjuːnɪt, received rəˈsiːvd → rɪˈsiːvd
 */
function dictStyle(w) {
  return w
    .replace(/([^aeiouæɑɔəɜɪʊʌːˈˌ])əl(?=$|[zd])/g, '$1l')
    .replace(/([tdszʃʒ])ən(?=$|[tdz])/g, '$1n')
    .replace(/([^aeiouæɑɔəɜɪʊʌːˈˌr])ə(d|dz|z|st|t|ts)$/, '$1ɪ$2')
    .replace(/^rə(?=[^aeiouæɑɔəɜɪʊʌ]*[ˈˌ])/, 'rɪ');
}

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function intWords(n) {
  if (n < 20) return [ONES[n]];
  if (n < 100) return [TENS[Math.floor(n / 10)]].concat(n % 10 ? [ONES[n % 10]] : []);
  if (n < 1000) return [ONES[Math.floor(n / 100)], 'hundred'].concat(n % 100 ? intWords(n % 100) : []);
  if (n < 2000 && n % 100 === 0 && n % 1000 !== 0) return intWords(n / 100).concat(['hundred']); // 1,500 → fifteen hundred
  return intWords(Math.floor(n / 1000)).concat(['thousand'], n % 1000 ? intWords(n % 1000) : []);
}

/** "2,000" "0.05" "15%" "62.1" → 읽는 단어들 */
function numberWords(tok) {
  const m = tok.match(/^(\d[\d,]*)(?:\.(\d+))?(%)?$/);
  if (!m) return null;
  let words = intWords(Number(m[1].replace(/,/g, '')));
  if (m[2]) words = words.concat(['point'], m[2].split('').map((d) => ONES[Number(d)]));
  if (m[3]) words.push('percent');
  return words;
}

const unknown = new Set();

function lookup(word) {
  const w = word.toLowerCase();
  if (OVERRIDES[w]) return dictStyle(OVERRIDES[w]).replace(/ /g, '\u00a0');
  if (dictionary[w]) return dictStyle(arpabetToIpa(dictionary[w]));
  if (/'s$/.test(w) && dictionary[w.slice(0, -2)]) {
    const base = dictStyle(arpabetToIpa(dictionary[w.slice(0, -2)]));
    return base + (/[szʃʒ]$|tʃ$|dʒ$/.test(base) ? 'ɪz' : /[ptkfθ]$/.test(base) ? 's' : 'z');
  }
  unknown.add(word);
  return '?' + word;
}

function lettersIpa(letters) {
  const parts = letters.toLowerCase().split('').map((c) => LETTERS[c].replace('ˈ', ''));
  parts[parts.length - 1] = 'ˈ' + parts[parts.length - 1];
  return parts.join('\u00a0');
}

/** 한 토큰(공백으로 나눈 단위) → IPA 조각들 */
function tokenIpa(raw) {
  const tok = raw.replace(/^[("“]+|[)"”.,!?;:]+$/g, '');
  if (!tok) return [];
  if (tok === '/') return ['/'];
  const num = numberWords(tok);
  if (num) return num.map(lookup);
  if (/^(a\.m\.|a\.m)$/i.test(tok)) return [lettersIpa('am')];
  if (/^(p\.m\.|p\.m)$/i.test(tok)) return [lettersIpa('pm')];
  if (/^R-\d+[A-Z]?$/.test(tok)) return [LETTERS.r].concat(numberWords(tok.slice(2).replace(/[A-Z]$/, '')).map(lookup), /[A-Z]$/.test(tok) ? [LETTERS[tok.slice(-1).toLowerCase()]] : []);
  if (tok === 'BTU/h') return [lettersIpa('BTU'), 'pər', lookup('hour')];
  const lower = tok.toLowerCase();
  if (OVERRIDES[lower]) return [dictStyle(OVERRIDES[lower]).replace(/ /g, '\u00a0')];
  // 대문자 약어는 글자 이름으로 (CFM → siː ef ˈem). 숫자가 붙으면 숫자에 강세 (CO2 → siː oʊ ˈtuː)
  if (/^[A-Z]{2,}\d*$|^[A-Z]\d+$/.test(tok)) {
    const m = tok.match(/^([A-Z]+)(\d*)$/);
    if (!m[2]) return [lettersIpa(m[1])];
    const nums = numberWords(m[2]).map(lookup);
    if (!/[ˈˌ]/.test(nums[0])) nums[0] = 'ˈ' + nums[0];
    return [lettersIpa(m[1]).replace('ˈ', '')].concat(nums);
  }
  if (tok.includes('-')) return tok.split('-').filter(Boolean).flatMap(tokenIpa);
  return [lookup(tok)];
}

/**
 * 표현·용어 전체 → IPA (괄호 안 풀이는 빼고 읽는 부분만).
 * 영어 단어 하나에 IPA 묶음 하나가 대응하도록 단어 사이는 공백, 한 단어 안(숫자·약어)은 줄바꿈 없는 공백(U+00A0)으로 잇는다.
 */
export function toIpa(text) {
  const cleaned = String(text).replace(/\s*\([^)]*\)/g, '').trim();
  const toks = cleaned.split(/\s+/);
  const out = [];
  toks.forEach((t, i) => {
    const key = t.replace(/[^A-Za-z']/g, '').toLowerCase();
    if (toks.length > 1 && WEAK[key] && !/^[A-Z]{2,}$/.test(t)) {
      let w = WEAK[key];
      if (key === 'the' && i + 1 < toks.length && /^[aeiouæɑɔəɜɪʊʌ]/.test(tokenIpa(toks[i + 1])[0].replace(/^[ˈˌ]/, ''))) w = 'ði';
      out.push(w);
      return;
    }
    const parts = tokenIpa(t);
    if (parts.length) out.push(parts.join('\u00a0'));
  });
  return out.join(' ');
}

function main() {
  const all = process.argv.includes('--all');
  const { LESSONS } = require(DATA.pathname);
  const lines = readFileSync(DATA, 'utf8').split('\n');
  let filled = 0;
  const items = [];
  LESSONS.forEach((l) => {
    l.expressions.forEach((e) => items.push({ en: e.en, ipa: e.ipa }));
    (l.terms || []).forEach((t) => items.push({ en: t.en, ipa: t.ipa }));
  });
  const byEn = new Map(items.map((it) => [it.en, it]));
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(\s*\{ en: )("(?:[^"\\]|\\.)*")(, ipa: "(?:[^"\\]|\\.)*")?(, ko: .*)$/);
    if (!m) continue;
    const it = byEn.get(JSON.parse(m[2]));
    if (!it || (it.ipa && !all)) continue;
    lines[i] = m[1] + m[2] + ', ipa: ' + JSON.stringify(toIpa(it.en)) + m[4];
    filled++;
  }
  if (unknown.size) {
    console.error('사전에 없는 단어 — scripts/ipa.mjs 의 OVERRIDES 에 추가하세요:\n  ' + [...unknown].join(', '));
    process.exit(1);
  }
  writeFileSync(DATA, lines.join('\n'));
  console.log(`발음기호 ${filled}개를 채웠습니다.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
