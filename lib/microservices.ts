import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path = require("path");
import { ITable } from "aws-cdk-lib/aws-dynamodb";

interface SwnMicroservicesProps {
    productTable: ITable;
}

export class SwnMicroservices extends Construct {

    public readonly productMicroservice: NodejsFunction;

    constructor(scope: Construct, id: string, props: SwnMicroservicesProps) {
        super(scope, id);

        const nodeJsFunctionProps: NodejsFunctionProps = {
            bundling: {
              externalModules: [
                'aws-sdk',
              ]
            },
            environment: {
              PRIMARY_KEY: 'id',
              DYNAMODB_TABLE_NAME: props.productTable.tableName
            },
            runtime: Runtime.NODEJS_18_X,
        };

        const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
            entry: path.join(__dirname, `/../src/product/index.js`),
            ...nodeJsFunctionProps,
        });

        props.productTable.grantReadWriteData(productFunction);

        this.productMicroservice = productFunction;
    }
}