import { bank } from './bank';
import type { Entry } from './bank/types';

export type Topic = {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: string;
  color: 'green' | 'amber' | 'blue' | 'red';
};

export type Question = {
  id: string;
  topicId: string;
  prompt: string;
  options: [string, string, string];
  correctIndex: number;
  explanation: string;
  manualTopic: string;
};

const SOURCE = 'Manual DGT Permiso B';

type TopicDef = Topic & { source: string };

const defs: TopicDef[] = [
  { id: 'actualidad', title: 'Novedades de circulación 2026', shortTitle: 'Novedades 2026', subtitle: 'Cambios vigentes desde octubre y fechas transitorias', icon: 'refresh-cw', color: 'amber', source: 'Real Decreto 518/2026 · DGT' },
  { id: 't01', title: 'Definiciones', shortTitle: 'Definiciones', subtitle: 'Tipos de vehículos y de personas', icon: 'book', color: 'green', source: `Tema 1 · Definiciones · ${SOURCE}` },
  { id: 't02', title: 'Documentación', shortTitle: 'Documentación', subtitle: 'Permisos, ITV y seguro obligatorio', icon: 'file-text', color: 'blue', source: `Tema 2 · Documentación · ${SOURCE}` },
  { id: 't03', title: 'El estado del conductor', shortTitle: 'Estado del conductor', subtitle: 'Alcohol, drogas, fatiga y distracciones', icon: 'activity', color: 'red', source: `Tema 3 · El estado del conductor · ${SOURCE}` },
  { id: 't04', title: 'Obligaciones de conductores y peatones', shortTitle: 'Obligaciones', subtitle: 'Normas básicas para todos los usuarios', icon: 'users', color: 'green', source: `Tema 4 · Obligaciones de conductores y peatones · ${SOURCE}` },
  { id: 't05', title: 'Dispositivos de seguridad en el vehículo', shortTitle: 'Seguridad del vehículo', subtitle: 'Frenos, neumáticos, cinturón, airbag y casco', icon: 'shield', color: 'blue', source: `Tema 5 · Dispositivos de seguridad · ${SOURCE}` },
  { id: 't06', title: 'Elementos del vehículo y normas para usarlos', shortTitle: 'Mandos y visibilidad', subtitle: 'Mandos, retrovisores, postura y ayudas a la conducción', icon: 'settings', color: 'amber', source: `Tema 6 · Elementos del vehículo · ${SOURCE}` },
  { id: 't07', title: 'Sistema de luces de los vehículos', shortTitle: 'Luces', subtitle: 'Cuándo y cómo usar cada luz', icon: 'sun', color: 'amber', source: `Tema 7 · Sistema de luces · ${SOURCE}` },
  { id: 't08', title: 'Señales de circulación', shortTitle: 'Señales', subtitle: 'Agentes, semáforos, señales verticales y marcas viales', icon: 'alert-triangle', color: 'red', source: `Tema 8 · Señales de circulación · ${SOURCE}` },
  { id: 't09', title: 'La vía', shortTitle: 'La vía', subtitle: 'Calzada, carriles, arcén y autopistas', icon: 'map', color: 'green', source: `Tema 9 · La vía · ${SOURCE}` },
  { id: 't10', title: 'Velocidad y distancias', shortTitle: 'Velocidad', subtitle: 'Límites, distancia de reacción, frenado y seguridad', icon: 'fast-forward', color: 'blue', source: `Tema 10 · Velocidad y distancias · ${SOURCE}` },
  { id: 't11', title: 'Maniobras', shortTitle: 'Maniobras', subtitle: 'Adelantar, girar, parar y estacionar', icon: 'repeat', color: 'green', source: `Tema 11 · Maniobras · ${SOURCE}` },
  { id: 't12', title: 'Normas de preferencia para circular', shortTitle: 'Preferencia', subtitle: 'Cruces, rotondas, túneles y pasos a nivel', icon: 'git-merge', color: 'amber', source: `Tema 12 · Normas de preferencia · ${SOURCE}` },
  { id: 't13', title: 'Transportar personas y cargas', shortTitle: 'Cargas y pasajeros', subtitle: 'Medidas permitidas, carga y placas', icon: 'package', color: 'blue', source: `Tema 13 · Transportar personas y cargas · ${SOURCE}` },
  { id: 't14', title: 'Conducir de forma segura', shortTitle: 'Conducción segura', subtitle: 'Curvas, noche, lluvia, nieve, niebla y viento', icon: 'cloud-rain', color: 'red', source: `Tema 14 · Conducir de forma segura · ${SOURCE}` },
  { id: 't15', title: 'Mecánica y mantenimiento del vehículo', shortTitle: 'Mecánica', subtitle: 'Sistemas del vehículo y revisión de ruedas', icon: 'tool', color: 'blue', source: `Tema 15 · Mecánica y mantenimiento · ${SOURCE}` },
  { id: 't16', title: 'Accidentes de tráfico', shortTitle: 'Accidentes', subtitle: 'Prevención, regla PAS y primeros auxilios', icon: 'life-buoy', color: 'red', source: `Tema 16 · Accidentes de tráfico · ${SOURCE}` },
  { id: 't17', title: 'Conducción preventiva y eficiente', shortTitle: 'Preventiva y eficiente', subtitle: 'Anticipación, espacio, ahorro y distintivos ambientales', icon: 'eye', color: 'green', source: `Tema 17 · Conducción preventiva y eficiente · ${SOURCE}` },
  { id: 'puntos', title: 'Permiso de conducir por puntos', shortTitle: 'Puntos', subtitle: 'Cuántos puntos tienes y qué faltas los quitan', icon: 'award', color: 'amber', source: `Anexo · Permiso por puntos · ${SOURCE}` },
];

export const topics: Topic[] = defs.map(({ source: _source, ...topic }) => topic);

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Cada entrada lleva la respuesta correcta primero; aquí se coloca de forma estable y repartida. */
function build(def: TopicDef, entries: Entry[]): Question[] {
  return entries.map(([prompt, correct, wrong1, wrong2, explanation], index) => {
    const id = `${def.id}-${String(index + 1).padStart(2, '0')}`;
    const h = hash(id);
    const correctIndex = h % 3;
    const wrong = (h >>> 5) & 1 ? [wrong2, wrong1] : [wrong1, wrong2];
    const options = [...wrong];
    options.splice(correctIndex, 0, correct);
    return { id, topicId: def.id, prompt, options: options as [string, string, string], correctIndex, explanation, manualTopic: def.source };
  });
}

export const questions: Question[] = defs.flatMap((def) => build(def, bank[def.id] ?? []));
