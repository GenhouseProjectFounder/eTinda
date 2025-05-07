async function getUserData() {
  try {
    const response = await fetch('https://localhost:3000');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('User data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// Example usage (optional, can be removed if not needed)
// getUserData();
