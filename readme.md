# Agradon

Express Middleware for automatic generation of the models, controllers, and routes with MongoDB.

## Getting started

### How to install

Install the package

```bash
npm install agradon
```

Initialize **Agradon**

Set `MONGODB_URI` environment variable and import `agradon` in your app index.

```javascript
import express from 'express';
import * as agradon from 'agradon';
const app = express();

agradon.init(app);

app.listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}`));

export default app;
```

> Hint: If you are using `ES6 or higher` with `BABEL` you should add this plugin [babel-plugin-add-module-exports](https://www.npmjs.com/package/babel-plugin-add-module-exports).

## Entities

Agrandon entities are composed by three different files. Entities by default are located in entities folder, Example: `entities/<entitity-name>/schema.yml` You can also change this setting path in `ENTITIES_PATH` environment variable.

-schema.yml (Required)
-model.js (Optional)
-controller.js (Optional)

### schema.yml \*

Schema file defines documents structure as `Mongoose.Schema` .

```yaml
_schema:
  name:
    first:
      type: String
      default: John
    last: String
  phone: String
  age:
    type: Number
    required: true
_options:
  timestamps: true
```

### model.js

Model file used to set `virtual`, `hooks` and schema methods. You also can register middlewares to default routes or to be used in controller file.

```javascript
export const schema = schema => {
  // Code live here
  return schema;
};

export const middleware = [];
```

### controller.js

Controller file is used to create custom endpoints or add middlewares to the default endpoints.

```javascript
export default (router, model, middleware) => {
  router.get('/', (req, res) => {
    return model.find({}).then(result => {
      res.send(result);
    });
  });
  return router;
};
```

## Routing

Agradon creates the routes based in the entity name.

- `GET`: /collection
- `GET`: /collection/:id
- `POST`: /collection/
- `PUT`: /collection/:id
- `DELETE`: /collection/:id

You can set a prefix as `/api` in the config object
Example:

```javascript
agradon.init({
  app,
  rootPath: '/api'
});
```

## Query System

Agradon includes a powerful query system for `GET` requests

- Match
- Compare
- Pick
- Omit
- Pagination
- Limit
- Populate

Those Matchers are passed as query in get request, example `/user?match=name:john`

## Authentication Module

Authetication module alows you to setup your own strategies in init object
```javascript
agradon.init({
  app,
  rootPath: '/api',
  strategies: ...
});
```

By default we set `/auth/local` with a local strategy

### Match

Match filter the results matching key:value in documents.
**Use**: `match=key:value`

### Compare

Compare documents with.
**Use**: `compare=key:operator:value`
In case of multiple matching can be send it as array.
Operators:

- ==
- \>
- <
- \>=
- <=
- !=

### Pick

Select which fields you need from each document.
**Use**: `pick=field1,field2,field4.field4A` or `pick=field1&pick=field2&pick=field3`
Can be a string separated by comma or an array.

### Omit

Omit is the oposite of `pick`.
**Use**: `omit=field1,field2,field4.field4A` or `omit=field1&omit=field2`
Can be a string separated by comma or an array.

### Limit

You are able to limit the results.
**Use**: `limit=20`

### Pagination

We also included pagination
**Use**: `page=1&perPage=10`

> Hint: `perPage` is an alias for `limit`.

### Populate

If you have some experience with MongoDB maybe you know about populate, if not read [this](https://mongoosejs.com/docs/populate.html).
**Use**: `populate=field1(subField1,subField1)`
**Example**: `populate=user(name,lastname)`
