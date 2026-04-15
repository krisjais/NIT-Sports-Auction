export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateUsername(username) {
  return username && username.length >= 3 && username.length <= 20;
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validatePlayerData(data) {
  const errors = [];

  if (!data.name || !data.name.trim()) {
    errors.push('Player name is required');
  }

  if (!data.department) {
    errors.push('Department is required');
  }

  if (!data.category) {
    errors.push('Category is required');
  }

  if (data.basePrice === undefined || data.basePrice < 50) {
    errors.push('Base price must be at least 50');
  }

  return errors;
}

export function validateTeamData(data) {
  const errors = [];

  if (!data.name || !data.name.trim()) {
    errors.push('Team name is required');
  }

  if (!data.captain || !data.captain.trim()) {
    errors.push('Captain name is required');
  }

  return errors;
}
