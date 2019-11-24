# ForgetMeNot @ DurHack 2019

Our project was to build a tool to help people with dementia remember things, this is implemented in various ways, as described below.

## Capital One

For this, we used the Capital One API to model new transactions coming in and checking if repeat payments are being made. This is done by checking the location and cost of the payment against the previous payments. The reason why this would be useful is that for people with dementia they may forget that they have already bought things, and so buy it again, wasting money. This will allow them to save money by giving them a guess as to if they have already bought that item

## Twilio

We use Twilio to notify the person about important things they should remember. We simplified this process by creating a one-line solution to sending a message through Twilio to any phone number.

## MongoDB hosted on the Google Cloud

We store user account data on the Google Cloud and authenticate users with Auth0. The database also stores information about each user, such as their hobbies and interests, to help them retain their sense of self despite memory loss.
