# Backend

This folder contains the AWS Lambda API for the task manager.

## Local setup

```bash
npm install
```

## API behavior

- GET /tasks
- POST /tasks
- PUT /tasks/{id}
- DELETE /tasks/{id}

The Lambda function uses the `TASKS_TABLE` environment variable and writes to DynamoDB.
