import { describe, it, expect, vi } from 'vitest';

// Mock the pg module
vi.mock('pg', () => {
  const mockQuery = vi.fn();
  const MockPool = vi.fn(() => ({ query: mockQuery }));
  return { default: { Pool: MockPool }, Pool: MockPool, __mockQuery: mockQuery };
});

describe('submitScore API', () => {
  it('rejects non-POST requests', async () => {
    const { default: handler } = await import('../api/submitScore.js');
    const req = { method: 'GET' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('rejects invalid username', async () => {
    const { default: handler } = await import('../api/submitScore.js');
    const req = { method: 'POST', body: { username: '', reaction_time_ms: 250 } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid reaction time', async () => {
    const { default: handler } = await import('../api/submitScore.js');
    const req = { method: 'POST', body: { username: 'TestPlayer', reaction_time_ms: -5 } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects reaction time over 10000', async () => {
    const { default: handler } = await import('../api/submitScore.js');
    const req = { method: 'POST', body: { username: 'TestPlayer', reaction_time_ms: 99999 } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('getLeaderboard API', () => {
  it('rejects non-GET requests', async () => {
    const { default: handler } = await import('../api/getLeaderboard.js');
    const req = { method: 'POST' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
});
