import * as cdk from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { SwnDatabase } from './database';
import { SwnMicroservices } from './microservices';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new SwnDatabase(this, 'Database');
    const microservices = new SwnMicroservices(this, 'Microservices', {
      productTable: database.productTable,
    });

    const apigw = new LambdaRestApi(this, 'productApi', {
      restApiName: 'Product Service',
      handler: microservices.productMicroservice,
      proxy: false
    });

    const product = apigw.root.addResource('product');
    product.addMethod('GET'); //GET /product
    product.addMethod('POST');//POST /product

    const singleProduct = product.addResource('{id}'); // /product/{id}
    singleProduct.addMethod('GET');
    singleProduct.addMethod('PUT');
    singleProduct.addMethod('DELETE');
  }
}
