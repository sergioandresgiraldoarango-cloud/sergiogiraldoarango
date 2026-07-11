/* ============================================================
   Autodiagnóstico — "¿Tu operación es un sistema… o eres tú?"
   Capa 1 del sistema (D17). Dos tests (A: eventos · B: negocios),
   5 dimensiones, reglas de consistencia, lead-score interno.
   ⚠️ Preguntas = borrador fuerte; Sergio las afina.
   ============================================================ */

/* Sector de entrada → enruta al test A o B + dato para calificar */
const SECTORES = [
  { id: 'eventos',     label: 'Producción de eventos, venue, bar o discoteca', test: 'A' },
  { id: 'hospitality', label: 'Hotel, hospedaje o turismo',                    test: 'A' },
  { id: 'pyme',        label: 'Emprendimiento o pyme',                          test: 'B' },
  { id: 'empresa',     label: 'Empresa, marca o institución',                  test: 'B' },
];

const DIMS = ['procesos', 'numeros', 'demanda', 'dependencia', 'apalancamiento'];
const DIM_NOMBRE = { procesos: 'Procesos', numeros: 'Números', demanda: 'Demanda', dependencia: 'Dependencia', apalancamiento: 'Apalancamiento' };

/* Textos de resultado por dimensión (compartidos A/B) */
const DIAG = {
  procesos: {
    fortaleza: 'Tu operación está escrita, no solo en tu cabeza. Eso te deja delegar y crecer.',
    hueco: 'Tu operación vive en tu cabeza, no en un sistema.',
    accion: 'Escribe UN proceso clave como checklist esta semana. La prueba: que alguien más pueda ejecutarlo sin ti.',
    desbloquea: 'Poder delegar y que las cosas salgan igual de bien sin ti encima.',
    riesgo: 'Mientras todo esté en tu cabeza, no puedes delegar ni crecer sin romperte.',
  },
  numeros: {
    fortaleza: 'Conoces tus números reales. Decides con datos, no con corazonadas.',
    hueco: 'No conoces tu margen real. Es el clásico "clientes felices, finanzas en rojo".',
    accion: 'Saca el número real de tu último trabajo: ingresos menos TODOS los costos, sin redondear a tu favor.',
    desbloquea: 'Saber cuánto ganas de verdad y poder subir precios con base.',
    riesgo: 'Sin saber tu margen, puedes estar trabajando muchísimo para ganar poco (o perder).',
  },
  demanda: {
    fortaleza: 'Los clientes te llegan por un canal que puedes repetir, no por suerte.',
    hueco: 'Tus clientes llegan por suerte, no por un canal que puedas repetir.',
    accion: 'Lista de dónde salió cada cliente del último trimestre. El canal que más se repita es el que debes sistematizar.',
    desbloquea: 'Dejar de depender del boca a boca y prender la llave de clientes cuando quieras.',
    riesgo: 'Si los clientes llegan por suerte, un mal mes te agarra sin plan B.',
  },
  dependencia: {
    fortaleza: 'La operación existe sin ti. Puedes descansar y escalar.',
    hueco: 'La operación no existe sin ti: eres el cuello de botella.',
    accion: 'Elige la tarea que solo tú haces y más se repite. Documéntala para poder delegarla.',
    desbloquea: 'Tomarte una semana sin que todo se caiga — y crecer sin clonarte.',
    riesgo: 'Si todo depende de ti, tu negocio no vale sin ti — y tú no puedes parar.',
  },
  apalancamiento: {
    fortaleza: 'Ya usas herramientas para ganar tiempo. Estás listo para apalancar con IA.',
    hueco: 'Corres tu operación a pulso, sin herramientas que te den tiempo.',
    accion: 'Toma la tarea repetitiva que más te quita tiempo y móntale una plantilla o automatización simple.',
    desbloquea: 'Recuperar horas cada semana y que la IA por fin te sirva (porque ya hay un sistema debajo).',
    riesgo: 'Cada tarea a pulso es tiempo que no recuperas y un techo de cuánto puedes atender.',
  },
};

/* Bancos de preguntas. 5 dimensiones × 3 = 15. Keyed en positivo (Sí = mejor). */
const PREGUNTAS_TEST = {
  A: {
    procesos: [
      '¿Podrías entregarle un evento a alguien nuevo con tus documentos, sin explicárselo todo de viva voz?',
      '¿Tus tareas de cada evento (montaje, proveedores, cronograma, cierre) están escritas como checklist o plantilla?',
      'Cuando algo sale mal en un evento, ¿queda registrado para que no se repita?',
    ],
    numeros: [
      '¿Sabes cuánto te dejó, en limpio, tu último evento —después de TODOS los costos?',
      '¿Calculas los costos reales (proveedores, personal, imprevistos) antes de cotizar?',
      '¿Tienes separadas las cuentas del negocio de las tuyas personales?',
    ],
    demanda: [
      '¿Sabes de dónde salió tu último cliente y podrías repetir ese camino a voluntad?',
      '¿Tienes una forma constante de conseguir eventos, en vez de esperar a que lleguen?',
      '¿Le haces seguimiento a quien pidió cotización y no cerró?',
    ],
    dependencia: [
      'Si te enfermas el día de un evento, ¿tu equipo lo saca adelante sin ti?',
      '¿Hay decisiones del día a día que tu equipo toma sin consultarte?',
      'Si un proveedor clave te falla, ¿tienes con quién reemplazarlo rápido?',
    ],
    apalancamiento: [
      '¿Usas herramientas (más allá de WhatsApp y hojas sueltas) para coordinar tu operación?',
      '¿Tienes tareas repetitivas (cotizaciones, cronogramas, mensajes) con plantillas o automatizadas?',
      '¿Usas los datos de eventos pasados para decidir mejor los próximos?',
    ],
  },
  B: {
    procesos: [
      '¿Podrías entregarle la operación de tu negocio a alguien nuevo con tus documentos, sin explicárselo todo de viva voz?',
      '¿Tus tareas que se repiten (ventas, entrega, cobro, atención) están escritas como procesos o plantillas?',
      'Cuando algo sale mal, ¿queda registrado para que no se repita?',
    ],
    numeros: [
      '¿Sabes cuál es tu margen real por producto o servicio —después de TODOS los costos?',
      '¿Calculas tus costos reales antes de fijar un precio?',
      '¿Tienes separadas las cuentas del negocio de las tuyas personales?',
    ],
    demanda: [
      '¿Sabes de dónde salió tu último cliente y podrías repetir ese camino a voluntad?',
      '¿Tienes una forma constante de conseguir prospectos, en vez de esperar a que lleguen?',
      '¿Le haces seguimiento a los interesados que no compraron de una?',
    ],
    dependencia: [
      'Si te enfermas mañana, ¿tu negocio sigue operando sin ti?',
      '¿Hay decisiones del día a día que tu equipo toma sin consultarte?',
      'Si perdieras tu cliente o canal más grande, ¿el negocio seguiría en pie?',
    ],
    apalancamiento: [
      '¿Usas herramientas (CRM, automatizaciones, más allá de WhatsApp y Excel suelto) para operar?',
      '¿Tienes tareas repetitivas automatizadas o con plantillas, en vez de hacerlas a mano cada vez?',
      '¿Aprovechas tus datos (ventas, clientes) para tomar mejores decisiones?',
    ],
  },
};

const RESPUESTAS = [
  { label: 'No / casi nunca', valor: 0 },
  { label: 'A veces', valor: 50 },
  { label: 'Sí / casi siempre', valor: 100 },
];

const NIVELES = [
  { min: 0,  max: 40,  titulo: 'Todo depende de ti.',      texto: 'Tu operación funciona por tu esfuerzo, no por un sistema. Tiene techo — y ese techo eres tú.' },
  { min: 41, max: 70,  titulo: 'Sistema a medias.',        texto: 'Ya montaste piezas, pero quedan huecos que te cuestan tiempo, margen o clientes.' },
  { min: 71, max: 100, titulo: 'Operación sistematizada.', texto: 'Vas bien. La conversación aquí es cómo escalar y apalancar con IA sin romper lo que ya funciona.' },
];

/* Reglas de consistencia (idea robada de RADAR, en la voz de Sergio).
   Se disparan según el patrón de puntajes por dimensión. Se muestran máx. 2. */
const REGLAS = [
  { si: d => d.demanda >= 60 && d.numeros <= 40, texto: 'Consigues clientes pero no sabes si ganas con ellos. Es el camino más rápido a "clientes felices, finanzas en rojo".' },
  { si: d => d.procesos >= 60 && d.apalancamiento <= 40, texto: 'Tienes el sistema, pero lo corres a mano. Justo ahí es donde la IA te multiplicaría.' },
  { si: d => d.demanda >= 60 && d.dependencia <= 40, texto: 'Entre más clientes consigues, más te ahogas: estás creciendo hacia un cuello de botella.' },
  { si: d => d.apalancamiento >= 60 && d.procesos <= 40, texto: 'Estás automatizando sobre un proceso que aún no está definido. Primero el sistema, después la IA.' },
  { si: d => d.numeros <= 40 && d.dependencia <= 40, texto: 'Ni conoces tu margen ni la operación corre sin ti. Es el combo que quema a los que tienen talento pero no estructura.' },
];

/* -------- Estado -------- */
const estado = { sector: null, test: 'A', respuestas: {}, paso: 0, urgencia: null };
const app = document.getElementById('app');

function el(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
function progreso(pct) { return `<div class="progress" aria-hidden="true"><span style="width:${pct}%"></span></div>`; }

/* Preguntas planas del test elegido */
function preguntasPlanas() {
  const banco = PREGUNTAS_TEST[estado.test];
  const out = [];
  DIMS.forEach(dim => banco[dim].forEach((p, i) => out.push({ dim, texto: p, key: `${dim}_${i}` })));
  return out;
}

/* -------- Pantalla 1: sector -------- */
function pantallaIntro() {
  app.innerHTML = '';
  const c = el(`<div class="paso">
    <span class="eyebrow">Autodiagnóstico</span>
    <h1>¿Tu operación es un sistema… o eres tú?</h1>
    <p class="sub">Quince preguntas, cuatro minutos. Al final: tu puntaje por área, tus huecos y una acción concreta por cada uno. Sin humo.</p>
    <p class="q-label">Para empezar — ¿qué describe mejor lo tuyo?</p>
    <div class="opciones" id="segs"></div>
  </div>`);
  app.appendChild(c);
  const segs = c.querySelector('#segs');
  SECTORES.forEach(s => {
    const b = el(`<button class="opcion" type="button">${s.label}</button>`);
    b.addEventListener('click', () => { estado.sector = s.id; estado.test = s.test; estado.paso = 0; estado.respuestas = {}; pantallaPregunta(); });
    segs.appendChild(b);
  });
}

/* -------- Pantalla 2: preguntas -------- */
function pantallaPregunta() {
  const preguntas = preguntasPlanas();
  const q = preguntas[estado.paso];
  const total = preguntas.length;
  const pct = Math.round((estado.paso / (total + 1)) * 100);
  app.innerHTML = '';
  const c = el(`<div class="paso">
    ${progreso(pct)}
    <p class="mono contador">Pregunta ${estado.paso + 1} / ${total}</p>
    <p class="q-label grande">${q.texto}</p>
    <div class="opciones" id="ops"></div>
    ${estado.paso > 0 ? '<button class="volver" type="button">← Anterior</button>' : ''}
  </div>`);
  app.appendChild(c);
  const ops = c.querySelector('#ops');
  RESPUESTAS.forEach(r => {
    const sel = estado.respuestas[q.key] === r.valor ? ' sel' : '';
    const b = el(`<button class="opcion${sel}" type="button">${r.label}</button>`);
    b.addEventListener('click', () => {
      estado.respuestas[q.key] = r.valor;
      if (estado.paso < total - 1) { estado.paso++; pantallaPregunta(); }
      else { pantallaUrgencia(); }
    });
    ops.appendChild(b);
  });
  const volver = c.querySelector('.volver');
  if (volver) volver.addEventListener('click', () => { estado.paso--; pantallaPregunta(); });
}

/* -------- Pantalla 3: urgencia (no puntúa madurez; alimenta el lead-score) -------- */
function pantallaUrgencia() {
  app.innerHTML = '';
  const c = el(`<div class="paso">
    ${progreso(94)}
    <p class="mono contador">Última</p>
    <p class="q-label grande">Para cerrar: ¿qué tan urgente es para ti resolver esto?</p>
    <div class="opciones" id="urg"></div>
    <button class="volver" type="button">← Anterior</button>
  </div>`);
  app.appendChild(c);
  const opts = [
    { label: 'Por ahora solo tengo curiosidad', v: 25 },
    { label: 'Me gustaría resolverlo este año', v: 50 },
    { label: 'Lo necesito este trimestre', v: 100 },
  ];
  const urg = c.querySelector('#urg');
  opts.forEach(o => {
    const b = el(`<button class="opcion" type="button">${o.label}</button>`);
    b.addEventListener('click', () => { estado.urgencia = o.v; pantallaResultado(); });
    urg.appendChild(b);
  });
  c.querySelector('.volver').addEventListener('click', () => { estado.paso = preguntasPlanas().length - 1; pantallaPregunta(); });
}

/* -------- Cálculo -------- */
function calcular() {
  const banco = PREGUNTAS_TEST[estado.test];
  const dim = {};
  DIMS.forEach(d => {
    const vals = banco[d].map((_, i) => estado.respuestas[`${d}_${i}`] ?? 0);
    dim[d] = Math.round(vals.reduce((a, v) => a + v, 0) / vals.length);
  });
  const total = Math.round(DIMS.reduce((a, d) => a + dim[d], 0) / DIMS.length);
  // oportunidad = brecha promedio en las 2 dimensiones más débiles
  const ordenadas = [...DIMS].sort((a, b) => dim[a] - dim[b]);
  const oportunidad = Math.round(ordenadas.slice(0, 2).reduce((a, d) => a + (100 - dim[d]), 0) / 2);
  return { dim, total, oportunidad, ordenadas };
}

/* -------- Pantalla 4: resultado -------- */
function pantallaResultado() {
  const { dim, total, oportunidad, ordenadas } = calcular();
  const nivel = NIVELES.find(n => total >= n.min && total <= n.max);
  const fuerte = [...DIMS].sort((a, b) => dim[b] - dim[a])[0];
  const huecos = ordenadas.slice(0, 3);
  const alertas = REGLAS.filter(r => r.si(dim)).slice(0, 2);
  const riesgo = DIAG[huecos[0]].riesgo;

  app.innerHTML = '';
  const c = el(`<div class="paso resultado">
    <span class="eyebrow">Tu resultado</span>
    <div class="score"><span class="score-num mono">${total}</span><span class="score-max mono">/100</span></div>
    <h1>${nivel.titulo}</h1>
    <p class="sub">${nivel.texto}</p>

    <div class="dims" id="dims"></div>

    <div class="bloque-res" id="fortaleza"></div>
    <h2 class="huecos-titulo">Tus focos por mejorar</h2>
    <div class="huecos" id="huecos"></div>
    <div id="alertas"></div>
    <div class="riesgo-box"><span class="mono riesgo-lbl">El riesgo si no lo tocas</span><p>${riesgo}</p></div>

    <div class="captura" id="captura"></div>
  </div>`);
  app.appendChild(c);

  // barras por dimensión
  const dd = c.querySelector('#dims');
  DIMS.forEach(d => {
    dd.appendChild(el(`<div class="dim-row"><span class="dim-name">${DIM_NOMBRE[d]}</span><span class="dim-bar"><span style="width:${dim[d]}%"></span></span><span class="dim-val mono">${dim[d]}</span></div>`));
  });

  // fortaleza
  c.querySelector('#fortaleza').appendChild(el(`<div class="fortaleza"><span class="mono f-lbl">Tu fortaleza · ${DIM_NOMBRE[fuerte]}</span><p>${DIAG[fuerte].fortaleza}</p></div>`));

  // huecos
  const cont = c.querySelector('#huecos');
  huecos.forEach((d, i) => {
    cont.appendChild(el(`<div class="hueco">
      <div class="hueco-top"><span class="mono hueco-n">${String(i + 1).padStart(2, '0')}</span><span class="hueco-nombre">${DIM_NOMBRE[d]} · <span class="mono hueco-pts">${dim[d]}/100</span></span></div>
      <p class="hueco-desc">${DIAG[d].hueco}</p>
      <p class="hueco-accion"><span class="acento">Tu acción:</span> ${DIAG[d].accion}</p>
      <p class="hueco-desbloquea"><span class="acento">Te desbloquea:</span> ${DIAG[d].desbloquea}</p>
    </div>`));
  });

  // alertas de consistencia
  if (alertas.length) {
    const ab = c.querySelector('#alertas');
    ab.appendChild(el(`<h2 class="huecos-titulo">Lo que veo en el cruce</h2>`));
    alertas.forEach(a => ab.appendChild(el(`<div class="alerta"><p>${a.texto}</p></div>`)));
  }

  c.querySelector('#captura').appendChild(pantallaCaptura(total, dim, oportunidad));
}

/* -------- Captura (Modo B) + lead-score interno --------
   Habeas data: casilla NO premarcada + enlaces a políticas. */
function pantallaCaptura(total, dim, oportunidad) {
  const dimsStr = DIMS.map(d => `${d}:${dim[d]}`).join(',');
  const box = el(`<div class="captura-box">
    <h2>Recibe tu informe + la plantilla real de producción</h2>
    <p class="sub">Te envío tu diagnóstico ampliado y la plantilla que uso para producir. Valor puro, cero venta.</p>
    <form name="autodiagnostico" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/gracias.html" class="form">
      <input type="hidden" name="form-name" value="autodiagnostico">
      <input type="hidden" name="sector" value="${estado.sector || ''}">
      <input type="hidden" name="test" value="${estado.test}">
      <input type="hidden" name="puntaje" value="${total}">
      <input type="hidden" name="oportunidad" value="${oportunidad}">
      <input type="hidden" name="urgencia" value="${estado.urgencia || ''}">
      <input type="hidden" name="dimensiones" value="${dimsStr}">
      <input type="hidden" name="lead_score" id="lead_score" value="">
      <p class="hp"><label>No llenar: <input name="bot-field"></label></p>
      <div class="campo"><label for="nombre">Nombre</label><input id="nombre" name="nombre" type="text" required></div>
      <div class="campo"><label for="correo">Correo</label><input id="correo" name="correo" type="email" required></div>
      <div class="campo"><label for="whatsapp">WhatsApp</label><input id="whatsapp" name="whatsapp" type="tel" required></div>
      <div class="campo"><label for="rol">Tu rol</label>
        <select id="rol" name="rol" required>
          <option value="">Elige…</option>
          <option value="dueno">Dueño, socio o fundador</option>
          <option value="gerente">Gerente o director</option>
          <option value="coordinador">Coordinador o equipo</option>
        </select>
      </div>
      <div class="campo"><label for="tamano">Tamaño (nº eventos/año o facturación aprox.)</label><input id="tamano" name="tamano" type="text"></div>
      <label class="check"><input type="checkbox" name="autorizacion" required> Autorizo el tratamiento de mis datos según la <a href="/tratamiento-de-datos.html" target="_blank" rel="noopener">política de tratamiento</a> y el <a href="/privacidad.html" target="_blank" rel="noopener">aviso de privacidad</a>.</label>
      <button class="btn btn--laton" type="submit">Enviar mi informe</button>
    </form>
    <div class="cta-diag">
      <p>¿Quieres que revisemos tus huecos juntos?</p>
      <a class="btn btn--line" href="/#contacto">Diagnóstico de Operación →</a>
    </div>
  </div>`);

  // lead-score al enviar: Autoridad × Urgencia × Oportunidad (uso interno, no se muestra)
  const form = box.querySelector('form');
  form.addEventListener('submit', () => {
    const autoridadMap = { dueno: 100, gerente: 70, coordinador: 40 };
    const autoridad = autoridadMap[form.rol.value] || 40;
    const urg = estado.urgencia || 50;
    const lead = Math.round(autoridad * 0.4 + urg * 0.35 + oportunidad * 0.25);
    box.querySelector('#lead_score').value = lead;
  });
  return box;
}

/* -------- Arranque -------- */
pantallaIntro();
