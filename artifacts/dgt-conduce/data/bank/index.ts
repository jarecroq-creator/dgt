import type { Entry } from './types';
import { actualidad } from './actualidad';
import { puntos } from './puntos';
import { tema01 } from './tema01';
import { tema02 } from './tema02';
import { tema03 } from './tema03';
import { tema04 } from './tema04';
import { tema05 } from './tema05';
import { tema06 } from './tema06';
import { tema07 } from './tema07';
import { tema08 } from './tema08';
import { tema09 } from './tema09';
import { tema10 } from './tema10';
import { tema11 } from './tema11';
import { tema12 } from './tema12';
import { tema13 } from './tema13';
import { tema14 } from './tema14';
import { tema15 } from './tema15';
import { tema16 } from './tema16';
import { tema17 } from './tema17';

/** Preguntas por tema. La clave es el id de tema usado en `questions.ts`. */
export const bank: Record<string, Entry[]> = {
  actualidad,
  t01: tema01,
  t02: tema02,
  t03: tema03,
  t04: tema04,
  t05: tema05,
  t06: tema06,
  t07: tema07,
  t08: tema08,
  t09: tema09,
  t10: tema10,
  t11: tema11,
  t12: tema12,
  t13: tema13,
  t14: tema14,
  t15: tema15,
  t16: tema16,
  t17: tema17,
  puntos,
};
