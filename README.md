# S3 DB

At the moment we are treating the client as a collection mapper that saves documents in s3 based off the properties of the Collection class.

<br />

# Getting started
## Install
```bash
npm install --save @cyberty/s3-db
```
<br />

## AWS S3 Setup  
for the methods to work correctly you will need to make sure your IAM user (that is tied to your aws credentials being passed to the s3-db client) has the appropriate permissions, the minimal permissions for your s3 db user needs to be 

```
- ListObject
- PutObject
- GetObject
- DeleteObject
```

Here is an example IAM policy to all all s3 actions to a given bucket.
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::${ACCOUNT_ID}:user/${IAM_USERNAME}"
            },
            "Action": "*",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
``` 


## Setup connection details
You have a choice here when it comes to setting your connection config, you can either use environment variables like this please replace $*** with your own values  
```env
S3_BUCKET_NAME=$bucket-name
S3_ACCESS_KEY=$access-key
S3_SECRET_KEY=$secret-key
S3_DEFAULT_REGION=$region
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
  connect({ s3Config: { awsAccessKey: '${ACCESS_KEY}', awsSecretKey: '${SECRET_KEY}', region: '${REGION}', dbBucket: '${BUCKET_NAME}' } });
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

## How to use Collections

### create product

product.ts
```typescript
const product = new Product({
  id: 'welcome',
  name: 'this is the name',
});

await product.save();

console.log(product.toJSON());
```

<br />

### List products

```typescript
const product = new Product();
const list = await product.list();

console.log(list);

return list;
```

<br />


### Get a single product

```typescript
const {id} = req.params;
const product = new Product({ id });
const singleProduct = await product.find();

console.log(singleProduct);

return singleProduct;
```

<br />

### Update an existing product

```typescript
const {id} = req.params;
const product = new Product({id})

// this updates the product instance under the hood
await product.find();

// this should include the found product
console.log(product.toJSON())

// update the instance with the data you want to save to the collection
product.set(req.body);

// save the product to the db
await product.save();


// return your product with updated values
return product.toJSON()
```


### Delete a product
```typescript
const { id } = req.params;

// create a new instance of the production collection
const md = new Product({ id });

// run the delete method
// if you run the get product you should find its been removed
await md.delete();
```

# Mocks
Coming Soon