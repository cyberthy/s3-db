# S3 DB - (CONSTRUCTION IN PROGRESS)

very early stages of an s3-db client for aws, stay tuned for more news, everything is subject to change.  
At the moment we are treating the client as a collection mapper that saves documents in s3 based off the properties of the Collection class.

<br />

# Getting started
## Install
```bash
npm install --save @cyberty/s3-db
```
<br />

## Setup connection details
You have a choice here when it comes to setting your connection config, you can either use environment variables like this please replace $*** with your own values  
```env
S3_BUCKET_NAME=$bucket-name
S3_ACCESS_KEY=$access-key
S3_SECRET_KEY=$secret-key
```
Then in your index.ts
```typescript
connect();
```

<br />
Or you can connect via the connect method like this 

<br />

index.ts
```typescript
  connect({ s3Config: { awsAccessKey: '${AWS_ACCESS_KEY}', awsSecretKey: '${AWS_SECRET_KEY}' } });
```

## Create a collection
collections / product.ts
```typescript
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
```typescript
const product = new Product({
  id: 'welcome',
  name: 'this is the name',
});

console.log(product.toJSON());
```


<br />

# Mocks
Coming Soon