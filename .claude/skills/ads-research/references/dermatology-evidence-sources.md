# Rúbrica de `respaldo_medico`

Para cada `trending_topic` encontrado, clasifica `respaldo_medico` según la
naturaleza de la fuente que sustenta la afirmación médica/dermatológica —
no según qué tan popular o viral sea el tema.

## `alto`
- Sociedad o academia médica oficial (ej. Academia Mexicana de
  Dermatología, American Academy of Dermatology, Colegio Ibero-Latino-
  Americano de Dermatología — CILAD).
- Revista científica indexada / peer-reviewed.
- Guía clínica publicada por una institución de salud reconocida.

## `medio`
- Medio de salud generalista (no especializado en dermatología) que cita
  a un dermatólogo o fuente médica identificable por nombre, pero no es
  la fuente primaria en sí.
- Sitio de una clínica o consultorio dermatológico real (no un
  competidor a analizar, sino contenido educativo de terceros) que cita
  estudios sin ser el estudio mismo.

## `bajo`
- Blog de wellness/belleza sin autoría médica verificable.
- Foro (Reddit, grupos de Facebook) o red social (TikTok, Instagram) —
  estas son señal de **interés de búsqueda**, nunca de respaldo médico
  por sí solas.
- Cualquier fuente donde no se pueda identificar quién escribió la
  afirmación ni su credencial.

## No confundir tendencia con respaldo

Un tema puede tener `confianza_tendencia: alta` (mucha gente lo está
buscando/comentando ahora) y `respaldo_medico: bajo` al mismo tiempo — por
ejemplo, una moda de skincare viral en TikTok sin base científica. Ambos
campos son independientes: reportar el tema igual, con ambos valores
honestos, en vez de omitirlo o inflar el respaldo para que el hallazgo
"se vea mejor".
