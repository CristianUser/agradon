/* eslint-disable no-undef */
const query = require('./query');

describe('lib/query.js', () => {
  const reqQuery = {
    page: 2,
    limit: 10,
    match: ['user:name', 'age:25', 'key!:value'],
    pick: ['username', 'email'],
    omit: ['password', 'createdAt'],
    compare: ['age:>=:25', 'number:$in:[3,4,5]'],
    populate: ['user(name,email)', 'f(x,y)'],
    sort: 'name:asc'
  };

  describe('resolvePagination', () => {
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

    test('should return an object for page one', () => {
      expect(query.resolvePagination({})).toBeUndefined();
    });
  });

  describe('resolveMatch', () => {
    test('should return an key value structure', () => {
      expect(query.resolveMatch(reqQuery)).toMatchObject({
        user: 'name',
        age: '25'
      });
    });

    test('should return an key value structure', () => {
      expect(query.resolveMatch({})).toEqual({});
    });
  });

  describe('resolvePick', () => {
    test('should use the array of props to set value 1 to each prop', () => {
      expect(query.resolvePick(reqQuery)).toMatchObject({
        username: 1,
        email: 1
      });
    });
  });

  describe('resolveOmit', () => {
    test('should use the array of props to set value 1 to each prop', () => {
      expect(query.resolveOmit(reqQuery)).toMatchObject({
        password: 0,
        createdAt: 0
      });
    });
  });

  describe('resolveProjection', () => {
    test('should define which props gonna be included or excluded', () => {
      expect(query.resolveProjection(reqQuery)).toMatchObject({
        username: 1,
        email: 1,
        password: 0,
        createdAt: 0
      });
    });

    test('should return an empty object', () => {
      expect(query.resolveProjection({})).toMatchObject({});
    });
  });

  describe('resolveCompare', () => {
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

    test('should return empty object', () => {
      expect(query.resolveCompare({ compare: 'age:25' })).toEqual({});
    });

    test('should return empty object too', () => {
      expect(query.resolveCompare({})).toEqual({});
    });
  });

  describe('resolveArguments', () => {
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

    test('should return an empty object', () => {
      expect(query.resolveArguments({})).toMatchObject({});
    });
  });

  describe('getToPopulate', () => {
    test('should return populate argument', () => {
      expect(query.getToPopulate(reqQuery)).toMatchObject({
        populate: [
          {
            path: 'user',
            select: ['name', 'email']
          },
          {
            path: 'f',
            select: ['x', 'y']
          }
        ]
      });
    });
  });

  describe('getToSort', () => {
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

  describe('applyMethods', () => {
    test('should call methods in mongo query', () => {
      const mongoQuery = {
        populate: jest.fn(() => mongoQuery),
        sort: jest.fn(() => mongoQuery)
      };

      query.applyMethods(reqQuery, mongoQuery);

      expect(mongoQuery.sort.mock.calls.length).toBe(1);
      expect(mongoQuery.populate.mock.calls.length).toBe(2);
    });
  });

  describe('parseQueryMethod', () => {
    test('should return undefined', () => {
      expect(query.parseQueryMethod({}, 'populate')).toBeUndefined();
    });
  });
});
