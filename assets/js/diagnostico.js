/* ============================================================
   Autodiagnóstico — "¿Tu operación es un sistema… o eres tú?"
   Base: IMAN-DE-CAPTURA.md · v1
   ⚠️ BORRADOR de preguntas — Sergio redacta las 12-18 finales
      (son su criterio de diagnóstico). La mecánica ya es la definitiva.
   ============================================================ */

const SEGMENTOS = [
  { id: 'eventos', label: 'Productor · venue · hotel' },
  { id: 'pyme',    label: 'Emprendedor · pyme' },
  { id: 'marca',   label: 'Marca · institución' },
];

/* 4 bloques × 4 preguntas = 16. Respuestas puntúan 0 · 50 · 100.
   Todas keyed en positivo: "Sí / casi siempre" = más sistematizada. */
const BLOQUES = [
  {
    id: 'procesos', nombre: 'Procesos',
    hueco: 'Tu operación vive en tu cabeza, no en un sistema.',
    accion: 'Escribe UN proceso clave como checklist esta semana —por ejemplo, el cierre de un evento—. La prueba: que alguien más pueda ejecutarlo sin ti.',
    preguntas: [
      '¿Podrías entregarle tu operación a alguien nuevo con documentos, sin explicárselo todo de viva voz?',
      '¿Tus tareas que se repiten (montaje, proveedores, cierre) están escritas como checklist o plantilla?',
      '¿Cada proyecto nuevo se apoya en lo aprendido en el anterior, en vez de empezar de cero?',
      'Cuando algo sale mal, ¿queda registrado para que no se vuelva a repetir?',
    ],
  },
  {
    id: 'numeros', nombre: 'Números',
    hueco: 'No conoces tu margen real. Es el clásico "clientes felices, finanzas en rojo".',
    accion: 'Toma tu último trabajo y saca el número real: ingresos menos TODOS los costos. Sin redondear a tu favor.',
    preguntas: [
      '¿Sabes cuánto te dejó, en limpio, tu último evento o proyecto —después de TODOS los costos—?',
      '¿Calculas tus costos reales antes de pasar un precio o una cotización?',
      '¿Puedes decir hoy, sin adivinar, si este mes vas ganando o perdiendo?',
      '¿Tienes separadas las cuentas del negocio de las tuyas personales?',
    ],
  },
  {
    id: 'demanda', nombre: 'Demanda',
    hueco: 'Tus clientes llegan por suerte, no por un canal que puedas repetir.',
    accion: 'Lista de dónde salió cada cliente del último trimestre. El canal que más se repita es el que debes sistematizar.',
    preguntas: [
      '¿Sabes de dónde salió tu último cliente y podrías repetir ese camino a voluntad?',
      '¿Tienes una forma constante de conseguir prospectos, en vez de esperar a que lleguen?',
      '¿Le haces seguimiento a los interesados que no cerraron de una?',
      '¿Puedes predecir, más o menos, cuántos clientes vas a tener el próximo mes?',
    ],
  },
  {
    id: 'dependencia', nombre: 'Dependencia',
    hueco: 'La operación no existe sin ti: eres el cuello de botella.',
    accion: 'Elige la tarea que solo tú haces y más se repite. Documéntala para poder delegarla.',
    preguntas: [
      'Si te enfermas mañana, ¿tu operación sigue funcionando sin ti?',
      '¿Hay decisiones del día a día que tu equipo puede tomar sin consultarte?',
      '¿Podrías tomarte una semana por fuera sin que todo se detenga?',
      'Si un proveedor o persona clave te falla, ¿tienes con quién reemplazarlo rápido?',
    ],
  },
];

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

/* -------- Estado -------- */
const estado = { segmento: null, respuestas: {}, paso: 0 };
const app = document.getElementById('app');

/* -------- Utilidades -------- */
function el(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
function progreso(pct) { return `<div class="progress" aria-hidden="true"><span style="width:${pct}%"></span></div>`; }

/* -------- Pantalla 1: intro + segmento -------- */
function pantallaIntro() {
  app.innerHTML = '';
  const c = el(`<div class="paso">
    <span class="eyebrow">Autodiagnóstico</span>
    <h1>¿Tu operación es un sistema… o eres tú?</h1>
    <p class="sub">Dieciséis preguntas, cuatro minutos. Al final: tu puntaje, tus 3 huecos y una acción concreta por hueco. Sin humo.</p>
    <p class="q-label">Para empezar — ¿qué describe mejor lo tuyo?</p>
    <div class="opciones" id="segs"></div>
  </div>`);
  app.appendChild(c);
  const segs = c.querySelector('#segs');
  SEGMENTOS.forEach(s => {
    const b = el(`<button class="opcion" type="button">${s.label}</button>`);
    b.addEventListener('click', () => { estado.segmento = s.id; estado.paso = 0; pantallaPregunta(); });
    segs.appendChild(b);
  });
}

/* -------- Lista plana de preguntas -------- */
const PREGUNTAS = BLOQUES.flatMap(b => b.preguntas.map((p, i) => ({ bloque: b.id, texto: p, key: `${b.id}_${i}` })));

/* -------- Pantalla 2: preguntas -------- */
function pantallaPregunta() {
  const q = PREGUNTAS[estado.paso];
  const total = PREGUNTAS.length;
  const pct = Math.round((estado.paso / total) * 100);
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
      else { pantallaResultado(); }
    });
    ops.appendChild(b);
  });
  const volver = c.querySelector('.volver');
  if (volver) volver.addEventListener('click', () => { estado.paso--; pantallaPregunta(); });
}

/* -------- Cálculo -------- */
function calcular() {
  const porBloque = {};
  BLOQUES.forEach(b => {
    const vals = b.preguntas.map((_, i) => estado.respuestas[`${b.id}_${i}`] ?? 0);
    porBloque[b.id] = Math.round(vals.reduce((a, v) => a + v, 0) / vals.length);
  });
  const total = Math.round(Object.values(porBloque).reduce((a, v) => a + v, 0) / BLOQUES.length);
  return { porBloque, total };
}

/* -------- Pantalla 3: resultado -------- */
function pantallaResultado() {
  const { porBloque, total } = calcular();
  const nivel = NIVELES.find(n => total >= n.min && total <= n.max);
  // 3 huecos = los 3 bloques con menor puntaje
  const huecos = [...BLOQUES].sort((a, b) => porBloque[a.id] - porBloque[b.id]).slice(0, 3);

  app.innerHTML = '';
  const c = el(`<div class="paso resultado">
    <span class="eyebrow">Tu resultado</span>
    <div class="score"><span class="score-num mono">${total}</span><span class="score-max mono">/100</span></div>
    <h1>${nivel.titulo}</h1>
    <p class="sub">${nivel.texto}</p>

    <h2 class="huecos-titulo">Tus 3 huecos principales</h2>
    <div class="huecos" id="huecos"></div>

    <div class="captura" id="captura"></div>
  </div>`);
  app.appendChild(c);

  const cont = c.querySelector('#huecos');
  huecos.forEach((b, i) => {
    cont.appendChild(el(`<div class="hueco">
      <div class="hueco-top"><span class="mono hueco-n">${String(i + 1).padStart(2, '0')}</span><span class="hueco-nombre">${b.nombre} · <span class="mono hueco-pts">${porBloque[b.id]}/100</span></span></div>
      <p class="hueco-desc">${b.hueco}</p>
      <p class="hueco-accion"><span class="acento">Tu acción:</span> ${b.accion}</p>
    </div>`));
  });

  c.querySelector('#captura').appendChild(pantallaCaptura(total, porBloque));
}

/* -------- Captura (Modo B) --------
   Habeas data: casilla NO premarcada + enlaces a políticas.
   ⚠️ Revisar con abogado antes de recolectar datos reales en producción. */
function pantallaCaptura(total, porBloque) {
  const box = el(`<div class="captura-box">
    <h2>Recibe tu informe + la plantilla real de producción</h2>
    <p class="sub">Te envío tu diagnóstico ampliado y la plantilla que uso para producir. Valor puro, cero venta.</p>
    <form name="autodiagnostico" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/gracias.html" class="form">
      <input type="hidden" name="form-name" value="autodiagnostico">
      <input type="hidden" name="puntaje" value="${total}">
      <input type="hidden" name="segmento" value="${estado.segmento || ''}">
      <p class="hp"><label>No llenar: <input name="bot-field"></label></p>
      <div class="campo"><label for="nombre">Nombre</label><input id="nombre" name="nombre" type="text" required></div>
      <div class="campo"><label for="correo">Correo</label><input id="correo" name="correo" type="email" required></div>
      <div class="campo"><label for="whatsapp">WhatsApp</label><input id="whatsapp" name="whatsapp" type="tel" required></div>
      <div class="campo"><label for="negocio">Tipo de negocio</label><input id="negocio" name="negocio" type="text" placeholder="Productora, hotel, agencia…"></div>
      <div class="campo"><label for="tamano">Tamaño (nº eventos/año o facturación aprox.)</label><input id="tamano" name="tamano" type="text"></div>
      <label class="check"><input type="checkbox" name="autorizacion" required> Autorizo el tratamiento de mis datos según la <a href="/tratamiento-de-datos.html" target="_blank" rel="noopener">política de tratamiento</a> y el <a href="/privacidad.html" target="_blank" rel="noopener">aviso de privacidad</a>.</label>
      <button class="btn btn--laton" type="submit">Enviar mi informe</button>
    </form>
    <div class="cta-diag">
      <p>¿Quieres que revisemos tus 3 huecos juntos?</p>
      <a class="btn btn--line" href="/#contacto">Diagnóstico de Operación →</a>
    </div>
  </div>`);
  return box;
}

/* -------- Arranque -------- */
pantallaIntro();
