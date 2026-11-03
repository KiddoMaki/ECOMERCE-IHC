BEGIN;

INSERT INTO categories (name, slug) VALUES
  ('Cuadernos', 'cuadernos'),
  ('Bolígrafos', 'boligrafos'),
  ('Escritorio', 'escritorio'),
  ('Arte', 'arte')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO products
  (category_id, slug, name, description, price, original_price)
SELECT c.category_id, p.slug, p.name, p.description, p.price, p.original_price
FROM (VALUES
  ('cuaderno-a5','Cuadernos','Cuaderno A5 Botánica','Un cuaderno ligero para apuntes, listas y bocetos cotidianos. Papel de buen cuerpo y una portada botánica que alegra el escritorio.',8.50,10.00,4.9,'fa-book-open','art-mint','Favorito'),
  ('cuaderno-rayas','Cuadernos','Libreta Rayas del día','Una libreta sencilla para llevar ideas a todas partes, con hojas rayadas y encuadernación flexible.',6.25,NULL,4.8,'fa-book','art-sky','A5 · 80 hojas'),
  ('boligrafo-gel','Bolígrafos','Bolígrafo gel punta fina','Trazo fluido de punta fina para escribir con precisión en tus apuntes y listas.',2.40,NULL,4.7,'fa-pen','art-sky','3 colores · 0.5 mm'),
  ('set-resaltadores','Bolígrafos','Set de resaltadores pastel','Cuatro tonos suaves para subrayar sin perder de vista lo importante.',5.30,5.90,4.9,'fa-highlighter','art-navy','Set x 4'),
  ('organizador','Escritorio','Organizador de escritorio','Un espacio práctico para tener a mano tus herramientas favoritas y despejar la mesa.',12.75,NULL,4.8,'fa-box-open','art-white','Orden bonito'),
  ('notas-adhesivas','Escritorio','Notas adhesivas color','Notas adhesivas en cinco colores para recordatorios, marcadores y pequeñas ideas.',3.60,NULL,4.6,'fa-note-sticky','art-mint','Set x 5'),
  ('lapices-color','Arte','Lápices de color · 12 tonos','Doce tonos versátiles para colorear, sombrear y dar vida a tus dibujos.',7.80,NULL,4.9,'fa-palette','art-sky','12 colores'),
  ('marcadores-arte','Arte','Marcadores para ilustrar','Marcadores de doble punta para trazos expresivos, lettering e ilustración.',9.40,NULL,4.8,'fa-paintbrush','art-navy','Doble punta'),
  ('planificador-semanal','Cuadernos','Planificador semanal A5','Planificador compacto para ordenar tareas, citas y prioridades durante la semana.',11.50,NULL,4.9,'fa-calendar-days','art-mint','Organiza tu semana'),
  ('bloc-listas','Cuadernos','Bloc de listas desprendibles','Bloc desprendible para listas de compras, pendientes y recordatorios del día.',4.25,NULL,4.7,'fa-list-check','art-white','50 hojas'),
  ('boligrafo-retractil','Bolígrafos','Bolígrafo retráctil negro','Bolígrafo retráctil de tinta negra para notas y escritura cotidiana.',1.80,NULL,4.6,'fa-pen','art-navy','Trazo 0.7 mm'),
  ('set-boligrafos-color','Bolígrafos','Set de bolígrafos de colores','Seis colores vivos para organizar apuntes y destacar ideas importantes.',6.20,NULL,4.8,'fa-marker','art-sky','Set x 6'),
  ('portalapices','Escritorio','Portalápices de escritorio','Portalápices compacto para mantener tus herramientas de escritura al alcance.',8.95,NULL,4.7,'fa-pen-ruler','art-mint','Orden práctico'),
  ('cinta-decorativa','Escritorio','Cinta decorativa washi','Cintas de papel decorativas para personalizar cuadernos, tarjetas y proyectos creativos.',3.40,NULL,4.8,'fa-tape','art-sky','Set x 3'),
  ('acuarelas','Arte','Set de acuarelas compactas','Set compacto de acuarelas para practicar mezclas y crear ilustraciones en cualquier lugar.',10.75,NULL,4.9,'fa-droplet','art-white','12 colores'),
  ('cuaderno-dibujo','Arte','Cuaderno para dibujo A4','Cuaderno con papel de mayor gramaje, ideal para bocetos, lápiz y técnicas secas.',9.95,NULL,4.8,'fa-pencil','art-navy','Papel grueso')
) AS p(slug, category_name, name, description, price, original_price, rating, icon, visual_class, tag)
JOIN categories c ON c.name = p.category_name
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  updated_at = NOW();

INSERT INTO product_variants (product_id, name, sku)
SELECT p.product_id, v.name, code.sku
FROM (VALUES
  ('cuaderno-a5',1,'A5 · rayado'),('cuaderno-a5',2,'A5 · puntos'),('cuaderno-a5',3,'A4 · rayado'),
  ('cuaderno-rayas',1,'A5 · 80 hojas'),('cuaderno-rayas',2,'A6 · 80 hojas'),
  ('boligrafo-gel',1,'Azul · 0.5 mm'),('boligrafo-gel',2,'Negro · 0.5 mm'),('boligrafo-gel',3,'Verde · 0.5 mm'),
  ('set-resaltadores',1,'Set pastel · 4 tonos'),
  ('organizador',1,'Natural · compacto'),('organizador',2,'Natural · ampliado'),
  ('notas-adhesivas',1,'Set x 5 · cuadradas'),
  ('lapices-color',1,'12 tonos · estándar'),
  ('marcadores-arte',1,'Set x 6 · surtidos'),('marcadores-arte',2,'Set x 12 · surtidos'),
  ('planificador-semanal',1,'A5 · semana vista'),('planificador-semanal',2,'A4 · semana vista'),
  ('bloc-listas',1,'50 hojas · liso'),
  ('boligrafo-retractil',1,'Negro · 0.7 mm'),
  ('set-boligrafos-color',1,'Set x 6 · surtidos'),
  ('portalapices',1,'Verde salvia'),('portalapices',2,'Azul cielo'),
  ('cinta-decorativa',1,'Set x 3 · estampados surtidos'),
  ('acuarelas',1,'12 colores · incluye pincel'),
  ('cuaderno-dibujo',1,'A4 · 30 hojas')
) AS v(slug, variant_number, name)
JOIN products p ON p.slug = v.slug
CROSS JOIN LATERAL (SELECT p.slug || '-v' || v.variant_number::text AS sku) code
ON CONFLICT (sku) DO UPDATE SET
  product_id = EXCLUDED.product_id,
  name = EXCLUDED.name,
  active = TRUE;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
SELECT p.product_id, i.image_url, 'Fotografía de ' || p.name, i.sort_order
FROM (VALUES
  ('cuaderno-a5','assets/products/cuaderno-a5-01.png',1),('cuaderno-a5','assets/products/cuaderno-a5-02.png',2),('cuaderno-a5','assets/products/cuaderno-a5-03.png',3),
  ('cuaderno-rayas','assets/products/libreta-rayas-del-dia-01.png',1),('cuaderno-rayas','assets/products/libreta-rayas-del-dia-02.png',2),('cuaderno-rayas','assets/products/libreta-rayas-del-dia-03.png',3),
  ('boligrafo-gel','assets/products/boligrafo-gel-punta-fina-azul-01.png',1),('boligrafo-gel','assets/products/boligrafo-gel-punta-fina-negrop-01.png',2),('boligrafo-gel','assets/products/boligrafo-gel-punta-fina-verde-01.png',3),
  ('set-resaltadores','assets/products/set-resaltadores-pastel-01.png',1),('set-resaltadores','assets/products/set-resaltadores-pastel-02.png',2),
  ('organizador','assets/products/organizador-escritorio-compacto-01.png',1),('organizador','assets/products/organizador-escritorio-compacto-02.png',2),('organizador','assets/products/organizador-escritorio-ampliado-01.png',3),('organizador','assets/products/organizador-escritorio-ampliado-02.png',4),
  ('notas-adhesivas','assets/products/notas-adhesivas-colores-01.png',1),('notas-adhesivas','assets/products/notas-adhesivas-colores-02.png',2),('notas-adhesivas','assets/products/notas-adhesivas-colores-03.png',3),
  ('lapices-color','assets/products/set-lapices-12-colores-01.png',1),('lapices-color','assets/products/set-lapices-12-colores-02.png',2),
  ('marcadores-arte','assets/products/marcadores-ilustrar-6-01.png',1),('marcadores-arte','assets/products/marcadores-ilustrar-12-01.png',2),
  ('planificador-semanal','assets/products/planificador-semanal-a5-01.png',1),('planificador-semanal','assets/products/planificador-semanal-a5-02.png',2),
  ('bloc-listas','assets/products/bloc-listas-desprendibles-01.png',1),('bloc-listas','assets/products/bloc-listas-desprendibles-02.png',2),
  ('boligrafo-retractil','assets/products/boligrafo-retractil-negro-01.png',1),('boligrafo-retractil','assets/products/boligrafo-retractil-negro-02.png',2),
  ('set-boligrafos-color','assets/products/set-boligrafos-colores-01.png',1),('set-boligrafos-color','assets/products/set-boligrafos-colores-02.png',2),
  ('portalapices','assets/products/portalapices-verde-01.png',1),('portalapices','assets/products/portalapices-verde-02.png',2),('portalapices','assets/products/portalapices-azul-01.png',3),('portalapices','assets/products/portalapices-azul-02.png',4),
  ('cinta-decorativa','assets/products/citas-decorativas-washi-01.png',1),('cinta-decorativa','assets/products/citas-decorativas-washi.02.png',2),
  ('acuarelas','assets/products/set-acuarelas-compactas-01.png',1),('acuarelas','assets/products/set-acuarelas-compactas-02.png',2),
  ('cuaderno-dibujo','assets/products/cuaderno-A4-dibujo-01.png',1),('cuaderno-dibujo','assets/products/cuaderno-A4-dibujo-02.png',2)
) AS i(slug, image_url, sort_order)
JOIN products p ON p.slug = i.slug
ON CONFLICT (product_id, image_url) DO UPDATE SET
  alt_text = EXCLUDED.alt_text,
  sort_order = EXCLUDED.sort_order;

INSERT INTO variant_images (product_id, variant_id, image_id, sort_order)
SELECT p.product_id, v.variant_id, i.image_id, i.sort_order
FROM product_variants v
JOIN products p ON p.product_id = v.product_id
JOIN product_images i ON i.product_id = p.product_id
WHERE p.slug NOT IN ('boligrafo-gel','organizador','marcadores-arte','portalapices')
ON CONFLICT (variant_id, image_id) DO UPDATE SET sort_order = EXCLUDED.sort_order;

INSERT INTO variant_images (product_id, variant_id, image_id, sort_order)
SELECT p.product_id, v.variant_id, i.image_id, m.sort_order
FROM (VALUES
  ('boligrafo-gel-v1','assets/products/boligrafo-gel-punta-fina-azul-01.png',1),
  ('boligrafo-gel-v2','assets/products/boligrafo-gel-punta-fina-negrop-01.png',1),
  ('boligrafo-gel-v3','assets/products/boligrafo-gel-punta-fina-verde-01.png',1),
  ('organizador-v1','assets/products/organizador-escritorio-compacto-01.png',1),
  ('organizador-v1','assets/products/organizador-escritorio-compacto-02.png',2),
  ('organizador-v2','assets/products/organizador-escritorio-ampliado-01.png',1),
  ('organizador-v2','assets/products/organizador-escritorio-ampliado-02.png',2),
  ('marcadores-arte-v1','assets/products/marcadores-ilustrar-6-01.png',1),
  ('marcadores-arte-v2','assets/products/marcadores-ilustrar-12-01.png',1),
  ('portalapices-v1','assets/products/portalapices-verde-01.png',1),
  ('portalapices-v1','assets/products/portalapices-verde-02.png',2),
  ('portalapices-v2','assets/products/portalapices-azul-01.png',1),
  ('portalapices-v2','assets/products/portalapices-azul-02.png',2)
) AS m(sku, image_url, sort_order)
JOIN product_variants v ON v.sku = m.sku
JOIN products p ON p.product_id = v.product_id
JOIN product_images i ON i.product_id = v.product_id AND i.image_url = m.image_url
ON CONFLICT (variant_id, image_id) DO UPDATE SET sort_order = EXCLUDED.sort_order;

COMMIT;
