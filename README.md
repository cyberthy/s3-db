# S3 DB

very early stages of an s3-db client for aws, stay tuned for more news, everything is subject to change.  
At the moment we are treating the client as a collection mapper that saves documents in s3 based off the properties of the Collection class.

<br />

# Getting started
```bash
npm install --save @cyberty/s3-db
```
<br />
<br />

## Create a collection
collections / product.ts
```javascript
import { Collection, field } from '@cyberthy/s3-db';

export type IProduct = {
  id: string;
  name: string;
};

export class Product extends Collection<IProduct> {
  @field()
  id: string;

  @field()
  name: string;
}

```

<br />

## Use your collection
product.ts
```javascript
const product = new Product({
  id: 'welcome',
  name: 'this is the name',
});

console.log(product.toJSON());
```


<br />

# Mocks
Coming Soon