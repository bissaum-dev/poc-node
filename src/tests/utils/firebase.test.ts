import admin from 'firebase-admin';

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  firestore: jest.fn(),
}));

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('Firebase Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load environment variables in non-production environment', () => {
    process.env.NODE_ENV = 'development';
    process.env.RAILWAY_SERVICE_ACCOUNT_KEY = JSON.stringify({
      project_id: 'test',
    });
    require('@/utils/firebase');
    expect(require('dotenv').config).toHaveBeenCalled();
    expect(admin.initializeApp).toHaveBeenCalled();
    expect(admin.credential.cert).toHaveBeenCalledWith({ project_id: 'test' });
  });

  it('should not load environment variables in production', () => {
    process.env.NODE_ENV = 'production';
    require('@/utils/firebase');
    expect(require('dotenv').config).not.toHaveBeenCalled();
  });

  it('should initialize Firestore correctly', () => {
    process.env.NODE_ENV = 'development';
    process.env.RAILWAY_SERVICE_ACCOUNT_KEY = JSON.stringify({
      project_id: 'test',
    });
    require('@/utils/firebase');
    expect(admin.firestore).not.toHaveBeenCalled();
  });
});
