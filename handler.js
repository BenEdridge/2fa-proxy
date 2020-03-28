'use strict';

const AWS = require('aws-sdk');
const pgp = require('./openpgp');

module.exports.entrypoint = async (event) => {

  const publicKey = process.env.PUBLIC_KEY;

  let encryptedMessage;
  let snsPublishResult;

  console.log('>>> Starting Lambda for encrypted SMS proxying via SNS');
  console.debug(JSON.stringify(event));

  const SnsMessageId = event.Records[0].Sns.MessageId;
  const SnsPublishTime = event.Records[0].Sns.Timestamp;
  const SnsTopicArn = event.Records[0].Sns.TopicArn;
  const LambdaReceiveTime = new Date().toString();

  console.log('Trying to encrypt with provided public key');
  console.debug(SnsMessageId, SnsPublishTime, SnsTopicArn, LambdaReceiveTime);

  // Parsing SNS message
  const SnsMessage = JSON.parse(event.Records[0].Sns.Message);
  const sender = SnsMessage.originationNumber;
  const receiver = SnsMessage.destinationNumber;
  const message = SnsMessage.messageBody;

  console.debug(`Encrypted message from ${receiver} proxied via ${sender}: ${message}`);

  try {
    encryptedMessage = await pgp.encrypt(publicKey, message);
  }
  catch (err) {
    console.error(`Failed to encrypt message ${err}`);
    throw Error(err);
  }
  try {
    const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });

    const params = {
      Message: `${encryptedMessage}`,
      TopicArn: `${process.env.TOPIC_ARN}`,
    };

    snsPublishResult = await SNS.publish(params).promise();

    console.info(`Message ID: ${snsPublishResult.MessageId} published to: ${params.TopicArn}`);

  } catch (err) {
    console.error(`Failed to publish to topic ${err}`);
    throw Error(err);
  }
  return snsPublishResult.MessageId;
};
