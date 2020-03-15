'use strict';

const AWS = require('aws-sdk');

module.exports.entrypoint = async event => {

  console.log('>>> Starting Lambda for encrypted proxying via SNS');
  console.log(JSON.stringify(event));

  const SnsMessageId = event.Records[0].Sns.MessageId;
  const SnsPublishTime = event.Records[0].Sns.Timestamp;
  const SnsTopicArn = event.Records[0].Sns.TopicArn;
  const LambdaReceiveTime = new Date().toString();

  console.log('Trying to encrypt with', process.env.PUBLIC_KEY);
  console.log(SnsMessageId, SnsPublishTime, SnsTopicArn, LambdaReceiveTime);

  // Parsing SNS message
  const SnsMessage = JSON.parse(event.Records[0].Sns.Message);
  const sender = SnsMessage.originationNumber;
  const receiver = SnsMessage.destinationNumber;
  const message = SnsMessage.messageBody;

  // Create publish parameters
  const params = {
    Message: `Encrypted message from ${receiver} proxied via ${sender}: ${message}`,
    PhoneNumber: process.env.PHONE_NUMBER,
  };

  const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' })
    .publish(params)
    .promise();

  publishTextPromise.then(
    function (data) {
      console.log("MessageID is " + data.MessageId);
    }).catch(
      function (err) {
        console.error(err, err.stack);
      });
};
