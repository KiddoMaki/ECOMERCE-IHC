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
3. Para mostrar una fotografía en lugar del icono, coloca el archivo dentro del proyecto, por ejemplo en `assets/products/`, y agrega una propiedad `image` con su ruta relativa.

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
  image: "assets/products/cuaderno-floral.webp"
}
```

Luego, junto a los otros detalles del catálogo:

```js
"cuaderno-floral": {
  description: "Cuaderno para apuntes y bocetos.",
  variants: ["A5 · rayado", "A5 · puntos"]
}
```

Usa una imagen JPG, PNG o WebP optimizada; conserva exactamente las mayúsculas/minúsculas del nombre y la ruta. Al subir el proyecto a GitHub, sube también el archivo de imagen: Pages no puede mostrar imágenes que solo estén en tu computadora. Si no defines `image`, se usa automáticamente el icono de Font Awesome.

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
