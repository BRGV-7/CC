'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TASKS_TABLE;

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  },
  body: JSON.stringify(body)
});

const getBody = (event) => {
  if (!event.body) return {};

  try {
    return JSON.parse(event.body);
  } catch (error) {
    return {};
  }
};

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'CORS preflight OK' });
    }

    if (event.httpMethod === 'GET' && event.path === '/tasks') {
      const result = await dynamoDb.scan({ TableName: tableName }).promise();
      return createResponse(200, { tasks: result.Items || [] });
    }

    if (event.httpMethod === 'POST' && event.path === '/tasks') {
      const body = getBody(event);

      if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
        return createResponse(400, { message: 'Task title is required.' });
      }

      const task = {
        id: `${Date.now()}`,
        title: body.title.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };

      await dynamoDb.put({ TableName: tableName, Item: task }).promise();
      return createResponse(201, { task });
    }

    if (event.httpMethod === 'PUT' && event.path.startsWith('/tasks/')) {
      const id = event.path.split('/tasks/')[1];
      const body = getBody(event);

      if (!id) {
        return createResponse(400, { message: 'Task ID is required.' });
      }

      const current = await dynamoDb.get({ TableName: tableName, Key: { id } }).promise();
      if (!current.Item) {
        return createResponse(404, { message: 'Task not found.' });
      }

      const updatedTask = {
        ...current.Item,
        ...body,
        completed: body.completed !== undefined ? Boolean(body.completed) : current.Item.completed
      };

      await dynamoDb.put({ TableName: tableName, Item: updatedTask }).promise();
      return createResponse(200, { task: updatedTask });
    }

    if (event.httpMethod === 'DELETE' && event.path.startsWith('/tasks/')) {
      const id = event.path.split('/tasks/')[1];

      if (!id) {
        return createResponse(400, { message: 'Task ID is required.' });
      }

      const current = await dynamoDb.get({ TableName: tableName, Key: { id } }).promise();
      if (!current.Item) {
        return createResponse(404, { message: 'Task not found.' });
      }

      await dynamoDb.delete({ TableName: tableName, Key: { id } }).promise();
      return createResponse(200, { message: 'Task deleted successfully.' });
    }

    return createResponse(404, { message: 'Route not found.' });
  } catch (error) {
    return createResponse(500, {
      message: 'Internal server error',
      error: error.message
    });
  }
};
