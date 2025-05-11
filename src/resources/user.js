class User {
  constructor(db) {
    this.db = db; // Optional database connection
    this.users = []; // In-memory storage as fallback
    console.log('User resource initialized with database:', !!db);
  }

  // CRUD methods updated to match database schema
  async createUser(userData) {
    // Input validation
    if (!userData.username || !userData.email) {
      throw new Error('Username and email are required');
    }

    const user = {
      username: String(userData.username),
      email: String(userData.email),
      full_name: userData.full_name || '',
      role: userData.role || 'guest',
      account_created: new Date().toISOString().split('T')[0],
      password: userData.password || '', // Add password handling
      location: userData.location || '',
      phone_number: userData.phone_number || '',
      digital_literacy_level: userData.digital_literacy_level || 'beginner'
    };

    // If database is available, attempt to save
    if (this.db) {
      try {
        console.log('Attempting to create user:', user);
        const query = `
          INSERT INTO user 
          (username, email, full_name, role, account_created, 
           password, location, phone_number, digital_literacy_level) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
          RETURNING *
        `;
        const result = this.db.prepare(query).get(
          user.username, 
          user.email, 
          user.full_name, 
          user.role, 
          user.account_created,
          user.password,
          user.location,
          user.phone_number,
          user.digital_literacy_level
        );
        
        console.log('User created in database:', result);
        return result;
      } catch (error) {
        console.error('Database insert error:', error);
        console.error('Error details:', error.message, error.stack);
        throw new Error('Failed to create user: ' + error.message);
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
        console.log('Attempting to fetch all users from database');
        
        // Verify database connection
        if (!this.db.prepare) {
          console.error('Database prepare method not available');
          throw new Error('Invalid database connection');
        }

        const query = this.db.prepare('SELECT * FROM user');
        const users = query.all();
        
        console.log('Users fetched:', users);
        console.log('Number of users:', users ? users.length : 0);
        
        return users || [];
      } catch (error) {
        console.error('Database fetch error:', error);
        console.error('Error details:', error.message, error.stack);
        throw new Error('Failed to retrieve users: ' + error.message);
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

    console.log(`Attempting to find user with ID: ${userId}`);

    // If database is available, fetch from there
    if (this.db) {
      try {
        // Verify database connection
        if (!this.db.prepare) {
          console.error('Database prepare method not available');
          throw new Error('Invalid database connection');
        }

        const query = this.db.prepare('SELECT * FROM user WHERE id = ?');
        const user = query.get(userId);
        
        console.log('User found:', user);
        
        if (!user) {
          console.log(`No user found with ID: ${userId}`);
          return null;
        }
        
        return user;
      } catch (error) {
        console.error('Database find error:', error);
        console.error('Error details:', error.message, error.stack);
        throw new Error('Failed to find user: ' + error.message);
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
    if (updatedInfo.username) sanitizedUpdate.username = String(updatedInfo.username);
    if (updatedInfo.email) sanitizedUpdate.email = String(updatedInfo.email);
    if (updatedInfo.full_name) sanitizedUpdate.full_name = String(updatedInfo.full_name);
    if (updatedInfo.role) sanitizedUpdate.role = String(updatedInfo.role);
    if (updatedInfo.location) sanitizedUpdate.location = String(updatedInfo.location);
    if (updatedInfo.phone_number) sanitizedUpdate.phone_number = String(updatedInfo.phone_number);
    if (updatedInfo.digital_literacy_level) sanitizedUpdate.digital_literacy_level = String(updatedInfo.digital_literacy_level);

    // If database is available, update in database
    if (this.db) {
      try {
        const updateKeys = Object.keys(sanitizedUpdate);
        if (updateKeys.length > 0) {
          const updateQuery = updateKeys.map(key => `${key} = ?`).join(', ');
          const query = `UPDATE user SET ${updateQuery} WHERE id = ? RETURNING *`;
          const params = [...updateKeys.map(key => sanitizedUpdate[key]), userId];
          
          const updatedUser = this.db.prepare(query).get(...params);
          return updatedUser;
        }
        
        // If no updates, return the existing user
        return await this.findUserById(userId);
      } catch (error) {
        console.error('Database update error:', error);
        throw new Error('Failed to update user: ' + error.message);
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
        const deletedUser = this.db.prepare('DELETE FROM user WHERE id = ? RETURNING *').get(userId);
        return deletedUser || { id: userId };
      } catch (error) {
        console.error('Database delete error:', error);
        throw new Error('Failed to delete user: ' + error.message);
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
  async handleGet(req, res) {
    try {
      // Check if specific user ID is requested
      const userId = req.params && req.params.id ? Number(req.params.id) : null;

      console.log(`Handling GET request for user ID: ${userId || 'all users'}`);

      let users;
      if (userId) {
        // Fetch specific user
        users = await this.findUserById(userId);
        
        // If no user found, return 404
        if (!users) {
          console.log(`No user found with ID: ${userId}`);
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ 
            error: 'User not found',
            status: 404 
          }));
        }
      } else {
        // Fetch all users
        users = await this.getAllUsers();
        console.log(`Fetched ${users.length} users`);
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
          if (!userData.username || !userData.email) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ 
              error: 'Username and email are required',
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

  async handlePatch(req, res) {
    try {
      // Extract user ID from request
      const urlParts = req.url.split('/');
      const userId = urlParts.length > 2 ? Number(urlParts[2]) : null;

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

  async handleDelete(req, res) {
    try {
      // Extract user ID from request
      const urlParts = req.url.split('/');
      const userId = urlParts.length > 2 ? Number(urlParts[2]) : null;

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
