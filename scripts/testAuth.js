(async () => {
  try {
    const res = await fetch('http://localhost:8888/.netlify/functions/auth-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@teste.com', password: 'Teste123!@#' })
    });
    console.log('status', res.status);
    const text = await res.text();
    console.log('body-length', text.length);
    console.log('body:', text);
  } catch (err) {
    console.error('request error', err);
    process.exit(1);
  }
})();
