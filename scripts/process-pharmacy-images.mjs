// Procesa las fotos de producto de las 4 categorías de la Farmacia
// (carpeta "Imagenes/Productos") a .webp optimizado en public/images/.
// Son fotos de producto tipo estudio, centradas, sin texto cerca del
// borde -- por eso se puede usar fit:'cover' sin riesgo de recortar algo
// importante (a diferencia de process-manchas-images.mjs, que usa
// fit:'inside' porque esas son gráficas con texto compuesto).
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const srcDir = path.join(root, 'Imagenes', 'Productos')
const outDir = path.join(root, 'public', 'images')

const QUALITY = 82
const SIZE = 480

async function single(srcName, outName) {
  const src = path.join(srcDir, srcName)
  const out = path.join(outDir, outName)
  await sharp(src)
    .resize(SIZE, SIZE, { fit: 'cover' })
    .webp({ quality: QUALITY })
    .toFile(out)
  const meta = await sharp(out).metadata()
  console.log(`OK  ${srcName} -> ${path.relative(root, out)} (${meta.width}x${meta.height})`)
}

async function main() {
  await single('protectores_solares_dermatologicos.png', 'farmacia-protectores-solares.webp')
  await single('tratamientos_para_acne.png', 'farmacia-tratamientos-acne.webp')
  await single('cremas_hidratantes_especializadas.png', 'farmacia-cremas-hidratantes.webp')
  await single('productos_antiedad_piel_sensible.png', 'farmacia-productos-antiedad.webp')
  console.log('\nListo.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
