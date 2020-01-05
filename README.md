# The concept

A number of companies in make use of mobile "2FA" which is inherently insecure. Most often there are no choices to change this.
There are a number of options:
1. Go to a better bank that has proper 2FA support via OTP or U2F or a mobile push to the app
2. Get a burner phone and hope no one finds your number and tries to port out your number
3. Set up proxy/facade mobile number that is a front for your mobile 2fa interaction

# AWS Setup 
- An external number outside (can be anywhere), this should be more difficult to port out
- Might have incompatibilities with services

# The flow
- You register your proxy number
- Proxy # resides in AWS pinpoint
- Messges received on AWS forwarded to SNS
- SNS subscriptions can forward these messages securely to their destination
- Lambda, SNS, S3, skys the limit for destinations
- Current solution makes use of encrypted SMS, Email or Signal message to end user

Assumptions are that AWS will secure your registered number and the communication between AWS and you (the end user) is secured
