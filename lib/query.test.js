'use strict';

const query = require('./query');

describe('query.js', () => {
  const reqQuery = {
    page: 2,
    limit: 10,
    match: ['user:name', 'age:25'],
    pick: ['username', 'email'],
    omit: ['password', 'createdAt'],
    compare: ['age:>=:25', 'number:$in:[3,4,5]'],
    populate: ['user(name,email)'],
    sort: 'name:asc'
  };

  test('should return an object undertandable for mongoose', () => {
    expect(query.resolvePagination(reqQuery)).toMatchObject({
      limit: reqQuery.limit,
      skip: 10
    });
  });

  test('should return an object for page one', () => {
    expect(query.resolvePagination({ limit: 10 })).toMatchObject({
      limit: reqQuery.limit,
      skip: 0
    });
  });

  test('should return an key value structure', () => {
    expect(query.resolveMatch(reqQuery)).toMatchObject({
      user: 'name',
      age: '25'
    });
  });

  test('should use the array of props to set value 1 to each prop', () => {
    expect(query.resolvePick(reqQuery)).toMatchObject({
      username: 1,
      email: 1
    });
  });

  test('should use the array of props to set value 1 to each prop', () => {
    expect(query.resolveOmit(reqQuery)).toMatchObject({
      password: 0,
      createdAt: 0
    });
  });

  test('should define which props gonna be included or excluded', () => {
    expect(query.resolveProjection(reqQuery)).toMatchObject({
      username: 1,
      email: 1,
      password: 0,
      createdAt: 0
    });
  });

  test('should add operators object', () => {
    expect(query.resolveCompare(reqQuery)).toMatchObject({
      age: {
        $gte: 25
      },
      number: {
        $in: [3, 4, 5]
      }
    });
  });

  test('should create a query object', () => {
    expect(query.resolveArguments(reqQuery)).toMatchObject({
      user: 'name',
      age: {
        $gte: 25
      },
      number: {
        $in: [3, 4, 5]
      }
    });
  });

  test('should return populate argument', () => {
    expect(query.getToPopulate(reqQuery)).toMatchObject({
      populate: [
        {
          path: 'user',
          select: ['name', 'email']
        }
      ]
    });
  });

  test('should return sort argument', () => {
    expect(query.getToSort(reqQuery)).toMatchObject({
      sort: [
        {
          name: 'asc'
        }
      ]
    });
  });
});
