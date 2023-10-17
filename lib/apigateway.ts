import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface SwnApiGatewayProps {
    productMicroservice: IFunction;
    basketMicroservice: IFunction;
}

export class SwnApiGateway extends Construct {
    public readonly productApiGateway: LambdaRestApi;
    public readonly basketApiGateway: LambdaRestApi;

    constructor(scope: Construct, id: string, props: SwnApiGatewayProps) {
        super(scope, id);

        this.basketApiGateway = this.getBasketApi(props.basketMicroservice);
        this.productApiGateway = this.getProductApi(props.productMicroservice);
    }

    private getBasketApi(basketMicroservice: IFunction) {
        const apigw = new LambdaRestApi(this, 'basketApi', {
            restApiName: 'Basket Service',
            handler: basketMicroservice,
            proxy: false
        });

        const basket = apigw.root.addResource('basket');
        basket.addMethod('GET');
        basket.addMethod('POST');

        const singleBasket = basket.addResource('{userName}');
        singleBasket.addMethod('GET');
        singleBasket.addMethod('DELETE');

        const basketCheckout = basket.addResource('checkout');
        basketCheckout.addMethod('POST');

        return apigw;
    }

    private getProductApi(productMicroservice: IFunction) {
        const apigw = new LambdaRestApi(this, 'productApi', {
            restApiName: 'Product Service',
            handler: productMicroservice,
            proxy: false
          });

          const product = apigw.root.addResource('product');
          product.addMethod('GET'); //GET /product
          product.addMethod('POST');//POST /product

          const singleProduct = product.addResource('{id}'); // /product/{id}
          singleProduct.addMethod('GET');
          singleProduct.addMethod('PUT');
          singleProduct.addMethod('DELETE');

          return apigw;
    }
}