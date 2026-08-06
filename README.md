# Regalo Battle — para Maite 💛

Jueguito estilo "Higher Lower" para que Maite elija su propio regalo sin darse
cuenta: aparecen dos regalos con la foto difuminada, ella elige el que más le
gusta, y así hasta que queda un ganador. Al final te llega un mail con todos
los duelos, el ganador, y si se le ocurrió algo que vos no pusiste.

## 1. Cargar los regalos

Editá [`js/gifts.js`](js/gifts.js). Cada regalo es una línea:

```js
{ id: "perfume", title: "Perfume", img: "img/perfume.jpg" },
```

- `id`: interno, no se muestra. Que sea único.
- `title`: lo que ve Maite.
- `img`: ruta a la foto dentro de `img/`.

Poné las fotos correspondientes en la carpeta `img/`. Con 4 regalos hay 3
duelos, con 8 hay 7, etc. — no hace falta que sea una cantidad redonda.

## 2. Conseguir la access key de Web3Forms (para el mail)

1. Andá a [web3forms.com](https://web3forms.com).
2. Poné tu mail (el mismo `aragonfedericojob@gmail.com` o el que prefieras).
3. Te dan una **Access Key** al instante, sin crear cuenta.
4. Pegala en [`js/email.js`](js/email.js), en `CONFIG.ACCESS_KEY`.

⚠️ Como GitHub Pages sirve el repo público, la key va a quedar visible en el
código. No pasa nada grave: como mucho alguien manda mails basura a esa
casilla, y la key se puede rotar desde Web3Forms cuando quieras.

## 3. Probar antes de publicar

Abrí `index.html` con doble clic (no hace falta servidor). Jugá una partida
completa y confirmá que llega el mail. Si algo falla en el envío, aparece un
botón "Copiar resultados" como respaldo.

## 4. Publicar en GitHub Pages (gratis)

```bash
git init
git add .
git commit -m "Regalo Battle para Maite"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/regalo-battle.git
git push -u origin main
```

Después, en GitHub: **Settings → Pages → Branch: main → Save**. En un minuto
te da la URL (tipo `https://TU-USUARIO.github.io/regalo-battle/`). Esa es la
que le mandás a Maite.

## Estructura

```
regalo-battle/
├── index.html       Las 3 pantallas del juego
├── css/styles.css
├── js/gifts.js       ← la lista de regalos (lo que más vas a tocar)
├── js/game.js        motor del juego + todos los textos (objeto TEXTS)
├── js/email.js       arma y envía el mail
└── img/              las fotos
```

Para cambiar cualquier texto de la página (el saludo, los mensajes), editá
el objeto `TEXTS` al principio de `js/game.js`.
