# sergioandresgiraldoarango.com

Sitio de la marca personal de Sergio Andrés Giraldo Arango. Estático, sin framework.
Identidad y arquitectura: ver `../docs/` (ADN de marca) y `../docs/ARQUITECTURA-SITIO.md`.

## Estructura
```
index.html               Home — embudo de 10 secciones
autodiagnostico.html     Test interactivo "¿Tu operación es un sistema… o eres tú?"
manifiesto.html          Manifiesto completo
gracias.html             Confirmación post-formulario
privacidad.html          Aviso de privacidad (BORRADOR — validar con abogado)
tratamiento-de-datos.html  Política de datos, Ley 1581/2012 (BORRADOR — validar con abogado)
favicon.svg              Los 4 puntos (símbolo de marca)
robots.txt · sitemap.xml · netlify.toml
assets/
  css/styles.css         Sistema de estilos (carbón + latón; Archivo/Inter/JetBrains Mono)
  js/diagnostico.js      Lógica del autodiagnóstico (12 preguntas = BORRADOR de Sergio)
```

## Previsualizar en local
```
powershell -File ../_serve.ps1     # http://localhost:8123
```

## Desplegar (Netlify)
1. Crear repo en GitHub con el contenido de esta carpeta (`site/`) en la raíz.
2. Conectar a Netlify. Publish directory = raíz del repo (ya hay `netlify.toml`).
3. Apuntar el dominio `sergioandresgiraldoarango.com`.

## Pendientes antes/después de publicar
- **Legales:** validar `privacidad.html` y `tratamiento-de-datos.html` con abogado.
- **Captura del test:** hoy usa Netlify Forms; conectar a n8n → Notion cuando el habeas data esté validado.
- **Visual:** fotos reales (sesión anti-gurú), `assets/img/og-image.png`, self-hosting de fuentes.
- **Test:** reemplazar las 12 preguntas borrador por las 12-18 finales de Sergio.
