class User {
  constructor(db) {
    this.db = db; // Optional database connection
    this.users = []; // In-memory storage as fallback
  }

  // Existing CRUD methods remain the same, with slight modifications for type safety
  async createUser(userData) {
    // Input validation
    if (!userData.name || !userData.email) {
      throw new Error('Name and email are required');
    }

    const user = {
      id: this.users.length + 1, // Simple ID generation
      name: String(userData.name),
      email: String(userData.email),
      createdAt: new Date().toISOString()
    };

    // If database is available, attempt to save
    if (this.db) {
      try {
        const savedUser = await this.db.insert('users', user);
        return savedUser;
      } catch (error) {
        console.error('Database insert error:', error);
        throw new Error('Failed to create user');
      }
    }

    // Fallback to in-memory storage
    this.users.push(user);
    return user;
  }

  async getAllUsers() {
    // If database is available, fetch from there
    if (this.db) {
      try {
        return await this.db.select('users');
      } catch (error) {
        console.error('Database fetch error:', error);
        throw new Error('Failed to retrieve users');
      }
    }

    // Fallback to in-memory storage
    return this.users;
  }

  async findUserById(id) {
    // Validate and convert input
    const userId = Number(id);
    if (isNaN(userId)) {
      throw new Error('Invalid User ID');
    }

    // If database is available, fetch from there
    if (this.db) {
      try {
        return await this.db.findById('users', userId);
      } catch (error) {
        console.error('Database find error:', error);
        throw new Error('Failed to find user');
      }
    }

    // Fallback to in-memory storage
    return this.users.find(user => user.id === userId);
  }

  async updateUser(id, updatedInfo) {
    // Validate and convert input
    const userId = Number(id);
    if (isNaN(userId)) {
      throw new Error('Invalid User ID');
    }

    // Sanitize update data
    const sanitizedUpdate = {};
    if (updatedInfo.name) sanitizedUpdate.name = String(updatedInfo.name);
    if (updatedInfo.email) sanitizedUpdate.email = String(updatedInfo.email);

    // If database is available, update in database
    if (this.db) {
      try {
        return await this.db.update('users', userId, sanitizedUpdate);
      } catch (error) {
        console.error('Database update error:', error);
        throw new Error('Failed to update user');
      }
    }

    // Fallback to in-memory storage
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { 
        ...this.users[userIndex], 
        ...sanitizedUpdate,
        updatedAt: new Date().toISOString()
      };
      return this.users[userIndex];
    }
    return null;
  }

  async deleteUser(id) {
    // Validate and convert input
    const userId = Number(id);
    if (isNaN(userId)) {
      throw new Error('Invalid User ID');
    }

    // If database is available, delete from database
    if (this.db) {
      try {
        return await this.db.delete('users', userId);
      } catch (error) {
        console.error('Database delete error:', error);
        throw new Error('Failed to delete user');
      }
    }

    // Fallback to in-memory storage
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      return this.users.splice(userIndex, 1)[0];
    }
    return null;
  }

  // HTTP Handler Methods
  /**
   * Handle GET request for users
   * @param {Object} req - HTTP request object
   * @param {Object} res - HTTP response object
   */
  async handleGet(req, res) {
    try {
      // Check if specific user ID is requested
      const userId = req.params && req.params.id ? Number(req.params.id) : null;

      let users;
      if (userId) {
        // Fetch specific user
        users = await this.findUserById(userId);
        
        // If no user found, return 404
        if (!users) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ 
            error: 'User not found',
            status: 404 
          }));
        }
      } else {
        // Fetch all users
        users = await this.getAllUsers();
      }

      // Successful response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'success',
        data: users
      }));
    } catch (error) {
      // Error handling
      console.error('GET request error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Internal server error',
        status: 500,
        message: error.message 
      }));
    }
  }

  /**
   * Handle POST request to create a user
   * @param {Object} req - HTTP request object
   * @param {Object} res - HTTP response object
   */
  async handlePost(req, res) {
    try {
      // Collect request body
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const userData = JSON.parse(body);

          // Validate required fields
          if (!userData.name || !userData.email) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ 
              error: 'Name and email are required',
              status: 400 
            }));
          }

          // Create user using existing method
          const newUser = await this.createUser(userData);

          // Successful response
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'success',
            data: newUser
          }));
        } catch (parseError) {
          // JSON parsing or validation error
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Invalid input',
            status: 400,
            message: parseError.message 
          }));
        }
      });
    } catch (error) {
      // Error handling
      console.error('POST request error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Internal server error',
        status: 500,
        message: error.message 
      }));
    }
  }

  /**
   * Handle PATCH request to update a user
   * @param {Object} req - HTTP request object
   * @param {Object} res - HTTP response object
   */
  async handlePatch(req, res) {
    try {
      // Extract user ID from request
      const userId = req.params && req.params.id ? Number(req.params.id) : null;

      // Validate user ID
      if (!userId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
          error: 'User ID is required',
          status: 400 
        }));
      }

      // Collect request body
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const updateData = JSON.parse(body);

          // Prevent updating ID
          if (updateData.id) {
            delete updateData.id;
          }

          // Update user using existing method
          const updatedUser = await this.updateUser(userId, updateData);

          // Check if user was found and updated
          if (!updatedUser) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ 
              error: 'User not found',
              status: 404 
            }));
          }

          // Successful response
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'success',
            data: updatedUser
          }));
        } catch (parseError) {
          // JSON parsing or validation error
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Invalid input',
            status: 400,
            message: parseError.message 
          }));
        }
      });
    } catch (error) {
      // Error handling
      console.error('PATCH request error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Internal server error',
        status: 500,
        message: error.message 
      }));
    }
  }

  /**
   * Handle DELETE request to remove a user
   * @param {Object} req - HTTP request object
   * @param {Object} res - HTTP response object
   */
  async handleDelete(req, res) {
    try {
      // Extract user ID from request
      const userId = req.params && req.params.id ? Number(req.params.id) : null;

      // Validate user ID
      if (!userId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
          error: 'User ID is required',
          status: 400 
        }));
      }

      // Delete user using existing method
      const deletedUser = await this.deleteUser(userId);

      // Check if user was found and deleted
      if (!deletedUser) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
          error: 'User not found',
          status: 404 
        }));
      }

      // Successful response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'success',
        data: deletedUser
      }));
    } catch (error) {
      // Error handling
      console.error('DELETE request error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Internal server error',
        status: 500,
        message: error.message 
      }));
    }
  }
}

// Export the User resource
module.exports = User;
