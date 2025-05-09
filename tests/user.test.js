import { describe, it, expect, beforeEach } from 'bun:test';

// Mock database connection
class MockDatabase {
  constructor() {
    this.users = [];
  }

  async insert(table, user) {
    const newUser = { ...user, id: this.users.length + 1 };
    this.users.push(newUser);
    return newUser;
  }

  async select(table) {
    return this.users;
  }

  async findById(table, id) {
    return this.users.find(user => user.id === id);
  }

  async update(table, id, updateData) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { 
        ...this.users[userIndex], 
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      return this.users[userIndex];
    }
    return null;
  }

  async delete(table, id) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      return this.users.splice(userIndex, 1)[0];
    }
    return null;
  }
}

// Import the User class
import User from '../src/resources/user.js';

describe('User Resource', () => {
  let userResource;
  let mockDb;

  beforeEach(() => {
    mockDb = new MockDatabase();
    userResource = new User(mockDb);
  });

  describe('createUser', () => {
    it('should create a user with valid data', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com' };
      const user = await userResource.createUser(userData);

      expect(user).toBeDefined();
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.id).toBe(1);
      expect(user.createdAt).toBeDefined();
    });

    it('should throw an error when name or email is missing', async () => {
      await expect(userResource.createUser({})).rejects.toThrow('Name and email are required');
      await expect(userResource.createUser({ name: 'John' })).rejects.toThrow('Name and email are required');
      await expect(userResource.createUser({ email: 'john@example.com' })).rejects.toThrow('Name and email are required');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      await userResource.createUser({ name: 'John Doe', email: 'john@example.com' });
      await userResource.createUser({ name: 'Jane Doe', email: 'jane@example.com' });

      const users = await userResource.getAllUsers();
      expect(users.length).toBe(2);
      expect(users[0].name).toBe('John Doe');
      expect(users[1].name).toBe('Jane Doe');
    });
  });

  describe('findUserById', () => {
    it('should find a user by valid ID', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com' };
      const createdUser = await userResource.createUser(userData);

      const foundUser = await userResource.findUserById(createdUser.id);
      expect(foundUser).toBeDefined();
      expect(foundUser.name).toBe('John Doe');
    });

    it('should throw an error for invalid ID', async () => {
      await expect(userResource.findUserById('invalid')).rejects.toThrow('Invalid User ID');
    });

    it('should return null for non-existent user', async () => {
      const foundUser = await userResource.findUserById(999);
      expect(foundUser).toBeUndefined();
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com' };
      const createdUser = await userResource.createUser(userData);

      const updatedUser = await userResource.updateUser(createdUser.id, { 
        name: 'John Smith',
        email: 'john.smith@example.com'
      });

      expect(updatedUser.name).toBe('John Smith');
      expect(updatedUser.email).toBe('john.smith@example.com');
      expect(updatedUser.updatedAt).toBeDefined();
    });

    it('should throw an error for invalid user ID', async () => {
      await expect(userResource.updateUser('invalid', {})).rejects.toThrow('Invalid User ID');
    });

    it('should return null for non-existent user', async () => {
      const result = await userResource.updateUser(999, { name: 'Test' });
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com' };
      const createdUser = await userResource.createUser(userData);

      const deletedUser = await userResource.deleteUser(createdUser.id);
      expect(deletedUser).toBeDefined();
      expect(deletedUser.name).toBe('John Doe');

      const users = await userResource.getAllUsers();
      expect(users.length).toBe(0);
    });

    it('should throw an error for invalid user ID', async () => {
      await expect(userResource.deleteUser('invalid')).rejects.toThrow('Invalid User ID');
    });

    it('should return null for non-existent user', async () => {
      const result = await userResource.deleteUser(999);
      expect(result).toBeNull();
    });
  });
});
