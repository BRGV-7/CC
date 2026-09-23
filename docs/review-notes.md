# Review Notes and Likely Viva Questions

## Q1. What problem does your project solve?
This project demonstrates how a simple web application can be built on AWS using serverless services and Infrastructure as Code. It helps explain cloud architecture in a practical way.

## Q2. What is Infrastructure as Code?
Infrastructure as Code means writing infrastructure resources such as databases, networking, APIs, and compute in code instead of creating them manually in the AWS console.

## Q3. Why did you choose AWS CloudFormation?
CloudFormation is a native AWS service that allows infrastructure to be created in a repeatable and version-controlled way using YAML templates.

## Q4. Why not manually create AWS resources?
Manual creation is time-consuming, error-prone, and hard to reproduce. CloudFormation gives consistency and automation.

## Q5. Why Lambda?
Lambda allows backend logic to run without managing servers. It is suitable for a simple API in a serverless design.

## Q6. Why DynamoDB?
DynamoDB is a fast, scalable NoSQL database that is easy to use with serverless applications.

## Q7. Why API Gateway?
API Gateway exposes the backend API securely and connects client requests to Lambda.

## Q8. Why S3 for the frontend?
S3 is suitable for hosting static frontend content and is simple to deploy for a React app.

## Q9. What happens when the CloudFormation stack is deployed?
CloudFormation creates the resources defined in the template, such as the API Gateway, Lambda, IAM role, DynamoDB table, and S3 bucket. The outputs also provide important values like API URL and bucket name.

## Q10. What happens if the stack is deleted?
The resources created by the CloudFormation stack are removed as part of stack deletion. This is one of the benefits of Infrastructure as Code.

## Q11. How are resources connected?
The frontend calls the API Gateway endpoint. API Gateway invokes Lambda, and Lambda interacts with DynamoDB to manage tasks.

## Q12. How does the frontend communicate with the backend?
The frontend reads the API URL from an environment variable and sends requests to the API endpoint.

## Q13. What is the role of IAM?
IAM gives the Lambda function the minimum required permissions to access DynamoDB and write logs. This follows least-privilege security.

## Q14. What makes this project Infrastructure as Code?
The AWS architecture is defined in a CloudFormation template. The resources are created from code, not manually, and can be updated or deleted through the stack.

## Q15. What are the future enhancements?
Possible future improvements include authentication, CloudWatch monitoring, Route 53 custom domains, CI/CD automation, and a more polished frontend.
