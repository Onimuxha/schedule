export async function login(username: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error('Login failed');

  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('userId', data.userId);
  return data;
}

export async function saveScheduleToServer(schedule: any) {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/schedule/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ schedule }),
  });

  if (!response.ok) throw new Error('Failed to save schedule');
  return response.json();
}

export async function getScheduleFromServer() {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/schedule', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch schedule');
  return response.json();
}