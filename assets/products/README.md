# Fotos de productos

Guarda aquí las imágenes de producto y súbelas a GitHub junto con el resto del sitio.

## Imágenes ya conectadas

Las siguientes fotos ya están asociadas al catálogo en `script.js`:

- `cuaderno-a5`: `cuaderno-a5-01.png`, `cuaderno-a5-02.png`, `cuaderno-a5-03.png`
- `cuaderno-rayas`: `libreta-rayas-del-dia-01.png`, `libreta-rayas-del-dia-02.png`, `libreta-rayas-del-dia-03.png`
- `boligrafo-gel`: `boligrafo-gel-punta-fina-azul-01.png`, `boligrafo-gel-punta-fina-negrop-01.png`, `boligrafo-gel-punta-fina-verde-01.png` (Azul, Negro y Verde; cada imagen corresponde a su variante)
- `boligrafo-retractil`: `boligrafo-retractil-negro-01.png`, `boligrafo-retractil-negro-02.png`
- `set-boligrafos-color`: `set-boligrafos-colores-01.png`, `set-boligrafos-colores-02.png`
- `organizador`: `organizador-escritorio-compacto-01.png`, `organizador-escritorio-compacto-02.png`, `organizador-escritorio-ampliado-01.png`, `organizador-escritorio-ampliado-02.png` (dos imágenes por opción)
- `notas-adhesivas`: `notas-adhesivas-colores-01.png`, `notas-adhesivas-colores-02.png`, `notas-adhesivas-colores-03.png`
- `portalapices`: `portalapices-verde-01.png`, `portalapices-verde-02.png`, `portalapices-azul-01.png`, `portalapices-azul-02.png` (dos imágenes por color)
- `cinta-decorativa`: `citas-decorativas-washi-01.png`, `citas-decorativas-washi.02.png`
- `lapices-color`: `set-lapices-12-colores-01.png`, `set-lapices-12-colores-02.png`
- `marcadores-arte`: `marcadores-ilustrar-6-01.png`, `marcadores-ilustrar-12-01.png` (una foto por set)
- `acuarelas`: `set-acuarelas-compactas-01.png`, `set-acuarelas-compactas-02.png`
- `cuaderno-dibujo`: `cuaderno-A4-dibujo-01.png`, `cuaderno-A4-dibujo-02.png`
- `set-resaltadores`: `set-resaltadores-pastel-01.png`, `set-resaltadores-pastel-02.png`
- `planificador-semanal`: `planificador-semanal-a5-01.png`, `planificador-semanal-a5-02.png`
- `bloc-listas`: `bloc-listas-desprendibles-01.png`, `bloc-listas-desprendibles-02.png`

## Convención de nombres

Usa el `id` del producto definido en `script.js`, seguido por un guion y un número de dos cifras:

```text
<id-del-producto>-01.webp
<id-del-producto>-02.webp
<id-del-producto>-03.webp
```

Ejemplo para `cuaderno-a5`:

```text
assets/products/cuaderno-a5-01.webp
assets/products/cuaderno-a5-02.webp
assets/products/cuaderno-a5-03.webp
```

Usa minúsculas, sin espacios ni tildes. Se recomienda WebP optimizado; también se aceptan `.jpg`, `.jpeg` y `.png`, siempre que la extensión escrita en `script.js` coincida exactamente con el archivo.

## Conectar las imágenes

En el arreglo `products` de `script.js`, agrega las rutas en la propiedad `images`. El orden importa: `-01` será la foto principal y aparecerá también en catálogo y carrito; las demás se mostrarán como miniaturas seleccionables en la ficha.

```js
{
  id: "cuaderno-a5",
  name: "Cuaderno A5 Botánica",
  category: "Cuadernos",
  price: 8.50,
  rating: "4.9",
  icon: "fa-book-open",
  color: "art-mint",
  tag: "Favorito",
  images: [
    "assets/products/cuaderno-a5-01.webp",
    "assets/products/cuaderno-a5-02.webp",
    "assets/products/cuaderno-a5-03.webp"
  ]
}
```

Después de guardar los archivos y editar el arreglo, confirma los cambios y súbelos al repositorio. GitHub Pages solo podrá servir las fotos que también se hayan subido. Si `images` falta o está vacío, se muestra el icono de Font Awesome.
