# Backend challenge

Para consultas estamos disponibles en [https://comunidad.belo.app](https://comunidad.belo.app)

### Consigna

Teniendo en cuenta los **order books** de Okex, implementar un servicio que:

- Se autentique en Okex
- Estime y ejecute un swap (SPOT) óptimo por volumen de los siguientes pares:
  - USDT ↔ ETH
  - USDT ↔ BTC
  - USDC ↔ AAVE
- Un endpoint para pedir estimación de precio dado un volumen y un par, con una expiración para el precio prometido
- Un endpoint para ejecutar el swap dada la estimación prometida
- Manejos de fees y spread parametrizable

### Requerimientos

- Typescript o Rust
- API Rest o Graphql
- SQL Database, preferentemente postgres (usen el ORM/query builder que más les guste)
- Integration tests

### Docs

[https://www.okex.com/](https://www.okex.com/)

[https://www.okex.com/docs-v5/en/](https://www.okex.com/docs-v5/en/)

### FAQ

_Que es un smart order router?_

Es un proceso automatizado que maneja ordenes de manera eficiente tomando ventaja de las mejores oportunidades disponibles.

_Que es un order book?_

Un order book es una lista digital de pedidos de compra y venta, normalmente utilizados en los mercados financieros.

_Que es un swap?_

Un swap es una conversion o cambio entre 1 o mas activos financieros.

_A qué nos referimos con óptimo?_

Al mejor precio posible que se le pueda ofrecer al consumidor del API.

_Que son los fees?_

Son las comisiones cobradas por el Okex al querer ejecutar una operación de compra o venta. A su vez belo también cobra una comisión operativa la cual debe ser tomada en cuenta.

_Que es el spread?_

Es la diferencia entre el mejor precio de compra y el mejor precio de venta en el order book de cada activo.

## Instalacion

Para correr este proyecto es necesario el archivo .env en la carpeta raiz del proyecto, podemos toma como ejemplo el archivo `.env.example`

#### Varibales de entorno necesarias

```bash
#DB
DB_HOST = db-okex-service
DB_PORT = 5432
DB_USERNAME = postgres
DB_PASSWORD = postgres
DB_NAME = okex

#Credentials
OK_ACCESS_KEY = your_okex_access_key
OK_ACCESS_SECRET = your_okex_secret_key
OK_ACCESS_PASSPHRASE = your_okex_passphrase
URL = https://www.okex.com
```

Tener en cuenta que necesitamos tener una cuenta DEMO de Okex para obtener las credenciales. 

```
Start API Demo Trading by the following steps:
Login OKX —> Assets —> Start Demo Trading —> Personal Center —> Demo Trading API -> Create Demo Trading V5 APIKey —> Start your Demo Trading
```

Mas info: https://www.okx.com/docs-v5/en/#overview-production-trading-services

Todos los servicios necesarios estan dockerizados en `docker-compose.yml` este mismo incluye la api, la base de datos postgres y pgAdmin para poder visualizar los datos

Para poder correr el proyecto ejecutamos el siguiente comando en la raiz del proyecto:

```bash
docker-compose up
```

## API

#### Optimal price

```http
GET /okx/optimal-price
```

Request Parameters

| Parametro | Tipo      | Descripcion                                                     |
| :-------- | :-------- | :-------------------------------------------------------------- |
| `instId`  | `string`  | **Requerido**. El par a operar `BTC-USDT` o `ETH-USDT`          |
| `volume`  | `string`  | **Requerido**. El volumen a operar                              |
| `side`    | `string ` | **Requerido**. Si la operacion es compra o venta `buy` o `sell` |

Ejemplo `GET /okx/optimal-price?instId=BTC-USDT&volume=0.00001&side=sell`

#### Place order

```http
POST /okx/place-order
```

Request body

| Parametro          | Tipo   | Descripcion                                                     |
| :----------------- | :----- | :-------------------------------------------------------------- |
| `estimatedPriceId` | `UUID` | **Requerido**. El id obtenido del endpoint `/okx/optimal-price` |

Ejemplo `POST /okx/place-order`

```http
body
{
  "estimatedPriceId": "076875c0-37a2-496f-8fa4-c77620697414"
}
```

## Test

Ejecutamos el comando `yarn test` dentro del servicio `api-okex-service`
