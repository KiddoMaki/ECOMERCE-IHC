# PichuPaper — prototipo de e-commerce para IHC

PichuPaper es un prototipo de baja fidelidad de una tienda ecuatoriana de papelería y útiles de escritorio. El proyecto está pensado para cumplir con el reto de Interacción Humano-Computador, integrando principios de usabilidad, accesibilidad y diseño de flujo de compra en una interfaz funcional y coherente.

## Alcance del proyecto
- Catálogo de productos con búsqueda y filtros.
- 16 productos distribuidos en las categorías existentes.
- Carrito de compras y resumen de pedido.
- Checkout simulado con validación básica de datos ficticios.
- Vistas por ruta para catálogo, carrito, detalle de producto y descargas.
- Diseño responsivo y navegación con foco visible.
- Validación de usuario con mensajes claros en una demo sin backend real.

## Heurísticas aplicadas
En este prototipo se aplican 7 heurísticas de Nielsen de manera funcional y verificable. Las 3 restantes no se pueden aplicar de forma exhaustiva en una demo sin backend ni sistema real de gestión, por lo que se mantienen como criterios no implementables en este alcance.

### Heurísticas implementadas
- Visibilidad del estado del sistema.
- Relación entre el sistema y el mundo real.
- Consistencia y estándares.
- Control y libertad del usuario.
- Prevención de errores.
- Reconocimiento antes que recuerdo.
- Diseño estético y minimalista.

### Heurísticas no aplicables en esta demo
- Flexibilidad y eficiencia de uso.
- Ayuda al usuario para reconocer, diagnosticar y recuperarse de errores.
- Ayuda y documentación.

La auditoría completa está en [AUDITORIA_PICHUPAPER.md](./AUDITORIA_PICHUPAPER.md).

## Archivos incluidos
- `index.html`: estructura y contenido principal.
- `style.css`: estilos visuales y responsividad.
- `script.js`: lógica del catálogo, carrito, navegación y checkout simulado.
- `favicon.svg` y `robots.txt`: recursos del sitio.
- `server.mjs`: servidor local para ejecutar la demo.
- `package.json`: ejecución del proyecto en Node.js.

## Añadir productos e imágenes
El catálogo está definido al inicio de `script.js`, en el arreglo `products`. Para crear un producto:

1. Añade un objeto con `id` único, `name`, `category`, `price`, `rating`, `icon`, `color` y `tag`.
2. Añade su descripción y las opciones en el objeto `productDetails`, usando el mismo `id`.
3. Para mostrar fotografías, coloca los archivos en `assets/products/` con el formato `<id-del-producto>-01.webp`, `<id-del-producto>-02.webp`, etc. Agrega sus rutas, en el mismo orden, al arreglo `images`.

Ejemplo de producto con imagen:

```js
{
  id: "cuaderno-floral",
  name: "Cuaderno floral",
  category: "Cuadernos",
  price: 8.50,
  rating: "4.8",
  icon: "fa-book-open",
  color: "art-mint",
  tag: "Nuevo",
  images: [
    "assets/products/cuaderno-floral-01.webp",
    "assets/products/cuaderno-floral-02.webp",
    "assets/products/cuaderno-floral-03.webp"
  ]
}
```

Luego, junto a los otros detalles del catálogo:

```js
"cuaderno-floral": {
  description: "Cuaderno para apuntes y bocetos.",
  variants: ["A5 · rayado", "A5 · puntos"]
}
```

La primera imagen del arreglo es la foto principal y también se usa en la tarjeta y el carrito. En la ficha aparecen miniaturas que permiten cambiar entre las fotos. Puedes usar JPG, PNG o WebP optimizado; recomendamos WebP y nombres en minúsculas, sin espacios ni tildes. Conserva exactamente las mayúsculas/minúsculas de nombres y rutas. Sube las imágenes al repositorio junto con el código: Pages no puede mostrar archivos que solo estén en tu computadora. Si un producto no tiene imágenes, se usa automáticamente el icono de Font Awesome.

| Producto (`id`) | Archivos que debes subir |
|-----------------|--------------------------|
| `cuaderno-a5` | `assets/products/cuaderno-a5-01.webp`, `cuaderno-a5-02.webp` |
| `boligrafo-gel` | `assets/products/boligrafo-gel-01.webp`, `boligrafo-gel-02.webp` |

Incluí una guía de nombres y carga dentro de [assets/products/README.md](./assets/products/README.md).

## Ejecutar localmente
Necesitas Node.js 18 o posterior. En esta carpeta ejecuta:

```sh
node server.mjs
```

Después abre `http://127.0.0.1:4173`.

Puedes definir `PORT` antes de iniciar si quieres usar otro puerto.

## Preparación para GitHub
- El proyecto se mantiene sin dependencias externas.
- El sitio se publica como una demo estática en GitHub Pages desde la rama `main`.
- La navegación interna usa fragmentos (`#/cart`, `#/product/...`) para funcionar en el subdirectorio del repositorio sin backend ni redirecciones del servidor.
- El workflow `.github/workflows/pages.yml` publica automáticamente cada push a `main`.
- Se incluye un archivo `.gitignore` para evitar subir artefactos del entorno.

Para habilitar Pages en el repositorio, entra a **Settings → Pages** y selecciona **GitHub Actions** como fuente de despliegue. El enlace público aparecerá en la ejecución del workflow `Deploy static site to Pages`.

## Alcance de la tienda
El carrito y el checkout son una demostración: no se guardan datos, no se procesan pedidos ni se realizan pagos reales. Las fuentes Inter y los iconos Font Awesome se cargan desde sus CDN; sin internet, el navegador usará alternativas visuales.
