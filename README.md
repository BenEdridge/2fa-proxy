# The Concept

A number of companies in make use of mobile "2FA" which is inherently insecure and easily bypassed by porting out of mobile numbers or sim swap attacks. 

There are a number of options to prevent this:
1. Go to a better Bank that has more secure 2FA support via OTP, U2F or a mobile push to the app
2. Get a burner phone and hope no one finds your number and tries a sim attack
3. Use this tool which sets up proxy mobile number and stack in AWS for your mobile 2FA interaction

## Get Started
```
npm install
npm test

# Login to AWS and make sure aws cli is installed

npm run generate:keys
npm run deploy

# Save the ./keys/private.pem to your device and use it to decrypt communications
```

# The Flow

- Register your proxy number via AWS Pinpoint
- Proxy number resides in AWS pinpoint
- Messages received on AWS forwarded to SNS
- SNS subscriptions can forward these messages securely to their destination
- Lambda, SNS, S3 or your choice of forwarding!
- Current solution makes use of encrypted SMS or Email other options could be Signal, Slack or Telegram

# Assumptions

- AWS will secure your registered number and porting out or control of this number will not give visibility of 2FA codes
- The communication within AWS is secure and much more difficult to break if your AWS account is secure

# Deployment

- Makes use of the serverless framework however some manual setup is still required
- Setup a AWS Pinpoint proxy number setup
- Get AWS credentials
- Run `AWS_PROFILE=<your-profile> npm run deploy`
- Check output from deploy and test using your registered number