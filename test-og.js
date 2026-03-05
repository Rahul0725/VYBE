import fetch from 'node-fetch';

async function testOg() {
  try {
    const res = await fetch('http://localhost:3000/api/og?username=testuser');
    console.log(res.status);
    if (!res.ok) {
      const text = await res.text();
      console.log(text);
    }
  } catch (e) {
    console.error(e);
  }
}
testOg();
