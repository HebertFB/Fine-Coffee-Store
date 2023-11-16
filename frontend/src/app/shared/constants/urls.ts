const BASE_URL = 'http://localhost:5000';

export const PRODUCTS_URL = BASE_URL + '/api/products';
export const PRODUCT_BY_ID_URL = PRODUCTS_URL + '/';
export const PRODUCT_CREATE_URL = PRODUCTS_URL + '/create-product';
export const PRODUCT_DELETE_URL = PRODUCTS_URL + '/delete';
export const PRODUCT_UPDATE_URL = PRODUCTS_URL + '/update';
export const PRODUCTS_BY_SEARCH_URL = PRODUCTS_URL + '/search/';
export const PRODUCTS_BY_TAG_URL = PRODUCTS_URL + '/tag/';
export const PRODUCTS_TAGS_URL = PRODUCTS_URL + '/tags';

export const ORDERS_URL = BASE_URL + '/api/orders';
export const ORDER_CREATE_URL = ORDERS_URL + '/create';
export const ORDER_DELETE_BY_ID_URL = ORDERS_URL + '/delete/';
export const ORDER_DELETE_BY_UNDEFINED_TYPE_PAYMENT_URL = ORDERS_URL + '/deleteUndefinedPaymentOrders';
export const ORDER_GET_BY_ID_URL = ORDERS_URL + '/';
export const ORDER_NEW_FOR_CURRENT_USER_URL = ORDERS_URL + '/newOrderForCurrentUser';
export const ORDER_PAY_URL = ORDERS_URL + '/pay';
export const ORDER_PAY_CASH_URL = ORDERS_URL + '/payWithCash';
export const ORDER_PAYMENT_BY_ID_URL = ORDERS_URL + '/payment/';
export const ORDER_TRACK_URL = ORDERS_URL + '/track/';
export const ORDER_UPDATE_URL = ORDERS_URL + '/update';
export const ORDER_USER_ALL_ORDERS_URL = ORDERS_URL + '/allstatus';

export const USER_URL = BASE_URL + '/api/users';
export const USER_BY_ID_URL = USER_URL + '/';
export const USER_DELETE_URL = USER_URL + '/delete/';
export const USER_LOGIN_URL = USER_URL + '/login';
export const USER_NEW_ADMIN_URL = USER_URL + '/newAdmin/';
export const USER_REGISTER_URL = USER_URL + '/register';
export const USER_UPDATE_URL = USER_URL + '/update/';
