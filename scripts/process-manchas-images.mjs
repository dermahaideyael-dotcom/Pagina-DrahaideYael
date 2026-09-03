// Procesa las fotos reales de la landing /melasma (carpeta "Imagenes/Manchas")
// a .webp optimizado en public/images/, siguiendo las mismas convenciones que
// las imágenes ya existentes del sitio: secciones de contenido a tamaño fijo
// (400x300 / 500x300), carrusel a 640w/1024w con aspecto 4:5 (igual que
// src/components/Gallery.jsx).
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const srcDir = path.join(root, 'Imagenes', 'Manchas')
const outDir = path.join(root, 'public', 'images')

const QUALITY = 80

async function single(srcName, outName, width, height) {
  const src = path.join(srcDir, srcName)
  const out = path.join(outDir, outName)
  await sharp(src)
    .resize(width, height, { fit: 'cover', position: 'attention' })
    .webp({ quality: QUALITY })
    .toFile(out)
  console.log(`OK  ${srcName} -> ${path.relative(root, out)} (${width}x${height})`)
}

async function responsive(srcName, outBase) {
  const src = path.join(srcDir, srcName)
  for (const w of [640, 1024]) {
    const h = Math.round((w * 5) / 4) // aspecto 4:5, igual que Gallery.jsx
    const out = path.join(outDir, `${outBase}-${w}.webp`)
    await sharp(src)
      .resize(w, h, { fit: 'cover', position: 'attention' })
      .webp({ quality: QUALITY })
      .toFile(out)
    console.log(`OK  ${srcName} -> ${path.relative(root, out)} (${w}x${h})`)
  }
}

async function main() {
  // Apartados 1-4 (imagen fija, sin srcset — igual que el resto de las
  // landings de tratamiento)
  await single('Por que salen las manchas.jpeg', 'melasma-problema.webp', 400, 300)
  await single('Manchas.jpeg', 'melasma-solucion.webp', 400, 300)
  await single('Que mancha tienes.jpeg', 'melasma-beneficios.webp', 500, 300)
  await single('Tratamiento.JPG', 'melasma-equipo.webp', 400, 300)

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
