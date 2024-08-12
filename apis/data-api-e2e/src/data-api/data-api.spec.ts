import axios from 'axios';

describe('GET /', () => {
  it('tests if status is okay', async () => {
    const res = await axios.get(`/`);
    expect(res.status).toBe(200);
  });
});
