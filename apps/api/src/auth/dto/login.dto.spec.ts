import 'reflect-metadata';
import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  const validDto = {
    email: 'user@example.com',
    password: 'securePass123',
  };

  it('should validate a correct DTO', async () => {
    const dto = Object.assign(new LoginDto(), validDto);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid email', async () => {
    const dto = Object.assign(new LoginDto(), { ...validDto, email: 'not-an-email' });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail with empty email', async () => {
    const dto = Object.assign(new LoginDto(), { ...validDto, email: '' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThanOrEqual(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail with empty password', async () => {
    const dto = Object.assign(new LoginDto(), { ...validDto, password: '' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThanOrEqual(1);
    expect(errors[0].property).toBe('password');
  });

  it('should fail with missing email', async () => {
    const dto = Object.assign(new LoginDto(), { password: 'securePass123' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThanOrEqual(1);
    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });

  it('should fail with missing password', async () => {
    const dto = Object.assign(new LoginDto(), { email: 'user@example.com' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThanOrEqual(1);
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('should fail when password is not a string', async () => {
    const dto = Object.assign(new LoginDto(), { ...validDto, password: 12345 });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('password');
  });
});
