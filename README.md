[![Twitter Follow](https://img.shields.io/twitter/follow/espadrine.svg?style=social&label=Follow)](https://twitter.com/s_scarduzio)

# CryptoLambda
This is a Serverless app (for AWS Lambda) that runs periodically every day and buys ETH and BTC from bitstamp.
The credentials are encrypted using AWS Key Management Service (KMS).

## Credentials encryption
We will use the encryption/decryption API of AWS KMS to generate a file containing the encrypted version of our Bitstamp credentials. 

After you [installed Serverless framework](https://serverless.com/framework/docs/providers/aws/guide/installation/), and cloned the project, proceed with the following steps.

1. You need to create a KMS key in AWS console (look under IAM)
2. Copy the KMS key ARN identifier (something like: arn:aws:kms:eu-west-1:123456789012:key/xxxxxxxxxxx-xxxx-xxxxxxxxxxxx) in `serverless.yml`
3. Create a string with your Bitstamp API credentials, in this form: `client_id,key,secret`
4. Encrypt the string using aws command line, or this simple npm based tool called [kms-cli](https://github.com/ddffx/kms-cli)
5. Dump the encrypted string to a file called `encrypted-secret` in the main dir
6. Configure the amounts to buy daily and your base FIAT currency in the serverless.yml
7. Everything is ready, `serverless deploy -v`

You can test the lambda function from AWS Console, if it all works, tonight at midnight you'll have some crypto in your Bitstamp balance :)


