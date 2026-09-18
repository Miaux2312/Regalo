# 💖 El regalo para la mujer más linda del mundo - Samantha

Página web interactiva y romántica especialmente optimizada para verse en celulares y lista para ser alojada de forma gratuita en **GitHub Pages**.

---

## 📂 Estructura del Proyecto

```text
Regalo.github.io/
├── index.html       <- Archivo principal (las 3 escenas, textos y estructura)
├── style.css        <- Estilos, colores románticos, diseño para celular y animaciones
├── script.js        <- Lógica interactiva, viento con hojas, música y navegación
├── images/          <- Carpeta donde pondrás tus 5 fotos
│   ├── foto1.jpg
│   ├── foto2.jpg
│   ├── foto3.jpg
│   ├── foto4.jpg
│   └── foto5.jpg
└── music/           <- Carpeta donde pondrás tus canciones en formato MP3
    ├── cancion1.mp3 (Opcional por escena)
    ├── cancion2.mp3
    └── cancion3.mp3
    (O simplemente 'cancion.mp3' para todo el sitio)
```

---

## 📸 1. ¿Cómo cargar tus 5 fotos?

1. Elige 5 fotos que quieras dedicarle a Samantha.
2. Nómbralas exactamente así:
   - `foto1.jpg`
   - `foto2.jpg`
   - `foto3.jpg`
   - `foto4.jpg`
   - `foto5.jpg`
3. Cópialas dentro de la carpeta **`images/`**.
4. ¡Listo! La página las cargará automáticamente en cada uno de los marcos polaroid. Si Samantha toca una foto en su celular, se abrirá en pantalla completa.

> **Tip:** También puedes usar formato `.png` o `.jpeg`. Si cambias la extensión, solo actualízala en [index.html](file:///d:/Proyects/Regalo.github.io/index.html) donde dice `src="images/foto1.jpg"`.

---

## 💌 2. ¿Cómo editar tu mensaje personal?

Abre el archivo [index.html](file:///d:/Proyects/Regalo.github.io/index.html) y busca la sección comentada con:

```html
<!-- ========================================================== -->
<!-- 💌 AQUÍ VA TU MENSAJE EMOTIVO Y PERSONALIZADO              -->
<!-- ========================================================== -->
<div class="letter-body" id="userCustomMessage">
  <p>Tu mensaje aquí...</p>
</div>
```

Puedes escribir o pegar lo que tú sientas. Usa párrafos `<p>Tu texto...</p>` para separar tus ideas.

---

## 🎵 3. ¿Cómo cargar tus canciones?

Puedes elegir entre dos opciones sencillas:

* **Opción A (Una sola canción para todo el sitio):**
  Guarda tu archivo MP3 en la carpeta `music/` con el nombre:
  `music/cancion.mp3`

* **Opción B (Una canción diferente para cada escena):**
  Guarda en `music/` tres archivos:
  - `music/cancion1.mp3` (Sonará en la Portada / Fotos)
  - `music/cancion2.mp3` (Sonará en la Escena de la colina)
  - `music/cancion3.mp3` (Sonará en la Carta y flores)

> **Nota para celulares:** Los navegadores móviles bloquean el sonido automático hasta que el usuario toca la pantalla. Por eso la página incluye un lindo mensaje de bienvenida: *"Toca para comenzar ✨"*, garantizando que la música suene con volumen en cuanto ella entre.

---

## 🚀 4. ¿Cómo activarlo en GitHub Pages?

1. Asegúrate de hacer commit y push de todos los archivos a tu repositorio de GitHub:
   ```bash
   git add .
   git commit -m "Regalo para Samantha con animaciones y musica"
   git push origin main
   ```
2. En GitHub, entra a tu repositorio y ve a **Settings** (Configuración) -> **Pages** (en el menú lateral izquierdo).
3. En la sección **Build and deployment**:
   - Source: Selecciona **Deploy from a branch**.
   - Branch: Elige `main` (o `master`) y la carpeta `/ (root)`.
   - Haz clic en **Save**.
4. En 1 o 2 minutos, GitHub te dará el enlace público (por ejemplo: `https://tuusuario.github.io/Regalo.github.io/`).
5. ¡Envíaselo a Samantha para que lo abra desde su teléfono! ❤️