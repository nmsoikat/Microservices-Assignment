export const AUTH_SERVICE_RMQ = 'AUTH_SERVICE';
export const PRODUCT_SERVICE_RMQ = 'PRODUCT_SERVICE';

export const AUTH_QUEUE = 'auth_queue';
export const PRODUCT_QUEUE = 'product_queue';

export const AUTH_PATTERNS = {
    REGISTER: 'auth.register',
    LOGIN: 'auth.login',
    REFRESH_TOKEN: 'auth.refresh_token',
    LOGOUT: 'auth.logout',
};

export const PRODUCT_PATTERNS = {
    CREATE: 'product.create',
    FIND_ALL: 'product.find_all',
    FIND_ONE: 'product.find_one',
    UPDATE: 'product.update',
    DELETE: 'product.delete',
};
