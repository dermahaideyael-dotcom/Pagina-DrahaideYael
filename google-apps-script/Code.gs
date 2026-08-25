const NOTIFY_EMAILS = 'derma.haideyael@gmail.com,jonatanmenriv@gmail.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Honeypot: si el campo trampa viene lleno, es un bot — aceptar sin hacer nada
    if (data.website) {
      return jsonResponse({ ok: true });
    }

    const name = (data.name || '').toString().trim();
    const phone = (data.phone || '').toString().trim();
    const email = (data.email || '').toString().trim();
    const message = (data.message || '').toString().trim();

    if (!name || !phone || !email) {
      return jsonResponse({ ok: false, error: 'missing_fields' });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([new Date(), name, phone, email, message]);

    const subject = `Nuevo contacto: ${name}`;
    const body = [
      `Nombre: ${name}`,
      `Teléfono: ${phone}`,
      `Correo: ${email}`,
      `Mensaje: ${message || '(sin mensaje)'}`,
    ].join('\n');

    MailApp.sendEmail({
      to: NOTIFY_EMAILS,
      subject: subject,
      body: body,
      replyTo: email,
    });

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
