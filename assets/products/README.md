# Fotos de productos

Guarda aquí las imágenes de producto y súbelas a GitHub junto con el resto del sitio.

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
