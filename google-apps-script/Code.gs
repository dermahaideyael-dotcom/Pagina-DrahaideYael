const NOTIFY_EMAILS = 'derma.haideyael@gmail.com,jonatanmenriv@gmail.com,gridseldahermenegildo8@gmail.com';

// Encabezados que el script espera en la fila 1 de la primera pestaña.
// Si faltan (por ejemplo, la primera vez que corre esta versión sobre una hoja
// que solo tenía las 5 columnas originales), se agregan automáticamente al final
// sin tocar el orden ni los datos de las columnas existentes.
const EXPECTED_HEADERS = [
  'Fecha',
  'Nombre',
  'Teléfono',
  'Correo',
  'Mensaje',
  'first_touch_source',
  'first_touch_medium',
  'first_touch_campaign',
  'first_touch_content',
  'first_touch_term',
  'first_touch_gclid',
  'first_touch_fbclid',
  'first_touch_landing_page',
  'first_touch_timestamp',
  'last_touch_source',
  'last_touch_medium',
  'last_touch_campaign',
  'last_touch_content',
  'last_touch_term',
  'last_touch_gclid',
  'last_touch_fbclid',
  'last_touch_landing_page',
  'last_touch_timestamp',
  'current_page',
  'referrer',
];

const REVIEW_HEADERS = ['Fecha', 'Nombre', 'Tratamiento', 'Calificación', 'Comentario'];

// Pestaña de seguimiento para recepción: id_lead...fecha_actualizacion se
// autocompletan al llegar el lead; el resto (fecha_cita en adelante) lo llena
// recepción a mano según avanza el caso. No sustituye la pestaña de leads
// crudos de arriba — es la vista operativa para trabajar cada lead.
const TRACKING_SHEET_NAME = 'Seguimiento';
const TRACKING_HEADERS = [
  'id_lead',
  'fecha',
  'nombre',
  'telefono',
  'servicio',
  'origen',
  'utm_campana',
  'gclid',
  'estado',
  'fecha_cita',
  'importe_consulta',
  'observaciones',
  'motivo_no_conversion',
  'fecha_actualizacion',
];
const TRACKING_ESTADOS = [
  'nuevo',
  'contactado',
  'calificado',
  'cita agendada',
  'asistió',
  'paciente',
  'no interesado',
  'no respondió',
];
const TRACKING_SERVICIOS = ['Caída de cabello', 'Acné', 'Melasma', 'Rejuvenecimiento', 'Otro'];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Honeypot: si el campo trampa viene lleno, es un bot — aceptar sin hacer nada
    if (data.website) {
      return jsonResponse({ ok: true });
    }

    if (data.type === 'review') {
      return handleReview(data);
    }

    const name = (data.name || '').toString().trim();
    const phone = (data.phone || '').toString().trim();
    const email = (data.email || '').toString().trim();
    const message = (data.message || '').toString().trim();

    if (!name || !phone || !email) {
      return jsonResponse({ ok: false, error: 'missing_fields' });
    }

    const lead = {
      'Fecha': new Date(),
      'Nombre': name,
      'Teléfono': phone,
      'Correo': email,
      'Mensaje': message,
      'first_touch_source': data.first_touch_source || '',
      'first_touch_medium': data.first_touch_medium || '',
      'first_touch_campaign': data.first_touch_campaign || '',
      'first_touch_content': data.first_touch_content || '',
      'first_touch_term': data.first_touch_term || '',
      'first_touch_gclid': data.first_touch_gclid || '',
      'first_touch_fbclid': data.first_touch_fbclid || '',
      'first_touch_landing_page': data.first_touch_landing_page || '',
      'first_touch_timestamp': data.first_touch_timestamp || '',
      'last_touch_source': data.last_touch_source || '',
      'last_touch_medium': data.last_touch_medium || '',
      'last_touch_campaign': data.last_touch_campaign || '',
      'last_touch_content': data.last_touch_content || '',
      'last_touch_term': data.last_touch_term || '',
      'last_touch_gclid': data.last_touch_gclid || '',
      'last_touch_fbclid': data.last_touch_fbclid || '',
      'last_touch_landing_page': data.last_touch_landing_page || '',
      'last_touch_timestamp': data.last_touch_timestamp || '',
      'current_page': data.current_page || '',
      'referrer': data.referrer || '',
    };

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const headers = ensureHeaders(sheet);
    sheet.appendRow(buildRowValues(headers, lead));

    appendTrackingRow(lead);

    const bodyLines = [
      `Nombre: ${name}`,
      `Teléfono: ${phone}`,
      `Correo: ${email}`,
      `Mensaje: ${message || '(sin mensaje)'}`,
    ];

    if (lead['last_touch_source'] || lead['last_touch_campaign']) {
      bodyLines.push('');
      bodyLines.push(
        `Campaña: ${lead['last_touch_source'] || '(directo)'} / ${lead['last_touch_medium'] || '-'} / ${lead['last_touch_campaign'] || '-'}`
      );
    }

    MailApp.sendEmail({
      to: NOTIFY_EMAILS,
      subject: `Nuevo contacto: ${name}`,
      body: bodyLines.join('\n'),
      replyTo: email,
    });

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function handleReview(data) {
  const name = (data.name || '').toString().trim();
  const comment = (data.comment || '').toString().trim();

  if (!name || !comment) {
    return jsonResponse({ ok: false, error: 'missing_fields' });
  }

  const treatment = (data.treatment || '').toString().trim();
  const rating = Number(data.rating) || '';

  const sheet = getOrCreateSheet('Reseñas', REVIEW_HEADERS);
  sheet.appendRow([new Date(), name, treatment, rating, comment]);

  MailApp.sendEmail({
    to: NOTIFY_EMAILS,
    subject: `Nueva reseña de paciente: ${name}`,
    body: [
      `Nombre: ${name}`,
      `Tratamiento: ${treatment || '(no especificado)'}`,
      `Calificación: ${rating || '-'} / 5`,
      `Comentario: ${comment}`,
      '',
      'Revisa la reseña antes de publicarla en la página.',
    ].join('\n'),
  });

  return jsonResponse({ ok: true });
}

/** Devuelve la pestaña con ese nombre, creándola con encabezados si no existe. */
function getOrCreateSheet(sheetName, headers) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  return sheet;
}

/**
 * Verifica que la fila 1 tenga todos los EXPECTED_HEADERS. Si la hoja está vacía,
 * los escribe todos. Si ya tiene encabezados pero faltan algunos (columnas nuevas
 * de esta versión), los agrega al final sin mover los existentes. Devuelve la
 * lista final de encabezados, en el orden real de las columnas de la hoja.
 */
function ensureHeaders(sheet) {
  const lastCol = sheet.getLastColumn();
  const existingHeaders = lastCol > 0
    ? sheet.getRange(1, 1, 1, lastCol).getValues()[0]
    : [];

  if (existingHeaders.length === 0) {
    sheet.getRange(1, 1, 1, EXPECTED_HEADERS.length).setValues([EXPECTED_HEADERS]);
    return EXPECTED_HEADERS;
  }

  const missing = EXPECTED_HEADERS.filter((h) => existingHeaders.indexOf(h) === -1);
  if (missing.length > 0) {
    sheet.getRange(1, existingHeaders.length + 1, 1, missing.length).setValues([missing]);
    return existingHeaders.concat(missing);
  }

  return existingHeaders;
}

/** Mapea el objeto lead (por nombre de encabezado) al orden real de columnas de la hoja. */
function buildRowValues(headers, lead) {
  return headers.map((header) => {
    const value = lead[header];
    return value === undefined || value === null ? '' : value;
  });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Crea (si no existe) la pestaña "Seguimiento" con encabezados y validación de
 * datos en las columnas de lista cerrada (estado, servicio). No toca la
 * pestaña de leads crudos ni "Reseñas".
 */
function getOrCreateTrackingSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(TRACKING_SHEET_NAME);
  if (sheet) return sheet;

  sheet = spreadsheet.insertSheet(TRACKING_SHEET_NAME);
  sheet.getRange(1, 1, 1, TRACKING_HEADERS.length).setValues([TRACKING_HEADERS]);

  const servicioCol = TRACKING_HEADERS.indexOf('servicio') + 1;
  const estadoCol = TRACKING_HEADERS.indexOf('estado') + 1;
  const servicioRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(TRACKING_SERVICIOS, true)
    .setAllowInvalid(true)
    .build();
  const estadoRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(TRACKING_ESTADOS, true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange(2, servicioCol, 500).setDataValidation(servicioRule);
  sheet.getRange(2, estadoCol, 500).setDataValidation(estadoRule);

  return sheet;
}

/**
 * Adivina el servicio a partir de la página de entrada/actual. Es una
 * inferencia, no un dato confirmado — recepción debe corregirlo si no
 * corresponde (ej. alguien llegó por /caida-cabello pero pregunta por acné).
 */
function inferServicio(lead) {
  const page = String(lead['last_touch_landing_page'] || lead['current_page'] || '');
  if (page.indexOf('caida-cabello') !== -1) return 'Caída de cabello';
  if (page.indexOf('acne') !== -1) return 'Acné';
  if (page.indexOf('melasma') !== -1) return 'Melasma';
  if (page.indexOf('rejuvenecimiento') !== -1) return 'Rejuvenecimiento';
  return 'Otro';
}

/**
 * Agrega una fila a "Seguimiento" con los campos que se pueden saber al
 * momento del envío del formulario. Las columnas posteriores a "estado"
 * (fecha_cita, importe_consulta, observaciones, motivo_no_conversion) quedan
 * vacías: eso lo llena recepción a mano conforme avanza el caso, porque hoy
 * no existe ninguna integración de calendario/CRM que lo pueda saber solo.
 * Nunca debe romper el guardado del lead principal si algo falla aquí.
 */
function appendTrackingRow(lead) {
  try {
    const sheet = getOrCreateTrackingSheet();
    const idLead = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd') +
      '-' + ('000' + sheet.getLastRow()).slice(-3);

    const row = {
      id_lead: idLead,
      fecha: lead['Fecha'],
      nombre: lead['Nombre'],
      telefono: lead['Teléfono'],
      servicio: inferServicio(lead),
      origen: lead['last_touch_source'] || lead['first_touch_source'] || 'directo',
      utm_campana: lead['last_touch_campaign'] || lead['first_touch_campaign'] || '',
      gclid: lead['last_touch_gclid'] || lead['first_touch_gclid'] || '',
      estado: 'nuevo',
      fecha_cita: '',
      importe_consulta: '',
      observaciones: '',
      motivo_no_conversion: '',
      fecha_actualizacion: new Date(),
    };

    sheet.appendRow(TRACKING_HEADERS.map((h) => row[h]));
  } catch (err) {
    // El seguimiento nunca debe impedir que se guarde/notifique el lead principal.
  }
}
