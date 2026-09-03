// Procesa las fotos reales de la landing /melasma (carpeta "Imagenes/Manchas")
// a .webp optimizado en public/images/. Son gráficos tipo post de Instagram
// con logo y texto ya compuestos en la imagen -- por eso TODO acá usa
// fit:'inside' (redimensiona sin recortar nunca, conserva el encuadre
// original completo). La primera versión usaba fit:'cover' con recorte a
// tamaño fijo y cortaba texto/logo en varias imágenes -- no repetir eso.
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const srcDir = path.join(root, 'Imagenes', 'Manchas')
const outDir = path.join(root, 'public', 'images')

const QUALITY = 82

async function single(srcName, outName, maxWidth, maxHeight) {
  const src = path.join(srcDir, srcName)
  const out = path.join(outDir, outName)
  await sharp(src)
    .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out)
  const meta = await sharp(out).metadata()
  console.log(`OK  ${srcName} -> ${path.relative(root, out)} (${meta.width}x${meta.height}, sin recorte)`)
}

async function responsive(srcName, outBase) {
  const src = path.join(srcDir, srcName)
  for (const w of [640, 1024]) {
    const out = path.join(outDir, `${outBase}-${w}.webp`)
    await sharp(src)
      .resize(w, w * 2, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(out)
    const meta = await sharp(out).metadata()
    console.log(`OK  ${srcName} -> ${path.relative(root, out)} (${meta.width}x${meta.height}, sin recorte)`)
  }
}

async function main() {
  // Apartados 1-4 (imagen fija, sin srcset — igual que el resto de las
  // landings de tratamiento)
  await single('Por que salen las manchas.jpeg', 'melasma-problema.webp', 600, 800)
  await single('Manchas.jpeg', 'melasma-solucion.webp', 600, 800)
  await single('Que mancha tienes.jpeg', 'melasma-beneficios.webp', 700, 800)
  await single('Tratamiento.JPG', 'melasma-equipo.webp', 600, 800)

  // Apartado 5 — carrusel (reemplaza "Galería Inspiradora"), 5 slides en
  // orden: carrusel 1-4 primero, "Daño solar acumulado" al final
  await responsive('carrusel 1.jpeg', 'melasma-carrusel-1')
  await responsive('carrusel 2.jpeg', 'melasma-carrusel-2')
  await responsive('carrusel 3.jpeg', 'melasma-carrusel-3')
  await responsive('carrusel 4.jpeg', 'melasma-carrusel-4')
  await responsive('Daño solar acumulado.jpeg', 'melasma-carrusel-5')

  console.log('\nListo.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
