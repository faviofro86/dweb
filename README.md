# dweb-frontend

Frontend Angular para EdificioControl.

## Local

```bash
npm install
npm start
```

La app local usa `src/environments/environment.ts` y consume:

```text
http://localhost:3000/api
```

## Build de produccion

```bash
npm ci
npm run build
```

La salida queda en:

```text
dist/dweb-parcial/browser
```

## Despliegue en AWS Amplify

Esta carpeta ya incluye `amplify.yml`. Amplify instalara dependencias con `npm ci`, generara `environment.production.ts` si defines una URL de API y publicara `dist/dweb-parcial/browser`.

Pasos:

1. Sube o conecta esta carpeta `front` en AWS Amplify Hosting.
2. En variables de entorno de Amplify, define una de estas:

```text
AMPLIFY_API_URL=https://TU-BACKEND.elasticbeanstalk.com/api
```

o:

```text
API_URL=https://TU-BACKEND.elasticbeanstalk.com/api
```

3. Verifica que el build use el archivo `amplify.yml` incluido.
4. Para rutas internas de Angular, agrega en Amplify una regla de rewrite:

```text
Source: </^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2)$)([^.]+$)/>
Target: /index.html
Type: 200 (Rewrite)
```

5. Cuando Amplify te entregue la URL del frontend, agregala en `CORS_ORIGIN` del backend Beanstalk.
