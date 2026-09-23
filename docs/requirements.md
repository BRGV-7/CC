# Requirements Specification

## Functional Requirements

1. The system must allow a user to view tasks.
2. The user must be able to add a new task.
3. The user must be able to mark a task as completed.
4. The user must be able to delete a task.
5. The frontend must communicate with the backend through an API URL.
6. The backend must perform CRUD operations against DynamoDB.
7. The infrastructure must be created using AWS CloudFormation.

## Non-Functional Requirements

1. The system should be simple and easy to explain during the project review.
2. The backend should use least-privilege IAM permissions.
3. The frontend should show basic loading and error states.
4. The project should be created with clean, readable code and YAML templates.
5. The template must be easy to update and maintain.
6. The design should remain focused on demonstration rather than advanced production complexity.

## Hardware Requirements

- A normal laptop or desktop computer.
- Internet access to access AWS services.
- Local development tools such as Node.js and AWS CLI.

## Software Requirements

- Node.js
- npm
- Vite
- React
- AWS CLI
- AWS account with permission to create resources
- CloudFormation-compatible AWS region

## AWS Requirements

- Lambda support for Node.js runtime
- API Gateway REST API
- DynamoDB table
- S3 bucket for static frontend hosting
- CloudFront distribution (optional but recommended)
- IAM role for Lambda
- AWS access configured with CLI credentials
