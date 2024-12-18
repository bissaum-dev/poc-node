import { RequestHandler } from 'express';

export type LogMutedTypes = (label: string, message: string) => void;

export type LogInfoTypes = (label: string, message: string) => void;

export type LogSuccessTypes = (label: string, message: string) => void;

export type LogWarningTypes = (label: string, message: string) => void;

export type LogFatalTypes = (label: string, message: string) => void;

export type LogTypes = {
  Muted: LogMutedTypes;
  Info: LogInfoTypes;
  Success: LogSuccessTypes;
  Warning: LogWarningTypes;
  Fatal: LogFatalTypes;
};

export type ApiValue = string | number | boolean | ApiObject | ApiArray | null;

export type ApiObject = {
  [key: string]: ApiValue;
};

export interface ApiArray extends Array<ApiValue> {}

export type ApiMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiEndpoints = Record<string, RequestHandler>;

export type ApiStatus =
  | 100
  | 101
  | 102
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 300
  | 301
  | 302
  | 303
  | 304
  | 307
  | 308
  | 400
  | 401
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505;

export enum ApiResponseStatus {
  'CONTINUE' = 100,
  'SWITCHING_PROTOCOLS' = 101,
  'PROCESSING' = 102,
  'OK' = 200,
  'CREATED' = 201,
  'ACCEPTED' = 202,
  'NON_AUTHORITATIVE_INFORMATION' = 203,
  'NO_CONTENT' = 204,
  'RESET_CONTENT' = 205,
  'PARTIAL_CONTENT' = 206,
  'MULTIPLE_CHOICES' = 300,
  'MOVED_PERMANENTLY' = 301,
  'FOUND' = 302,
  'SEE_OTHER' = 303,
  'NOT_MODIFIED' = 304,
  'TEMPORARY_REDIRECT' = 307,
  'PERMANENT_REDIRECT' = 308,
  'BAD_REQUEST' = 400,
  'UNAUTHORIZED' = 401,
  'FORBIDDEN' = 403,
  'NOT_FOUND' = 404,
  'METHOD_NOT_ALLOWED' = 405,
  'NOT_ACCEPTABLE' = 406,
  'PROXY_AUTHENTICATION_REQUIRED' = 407,
  'REQUEST_TIMEOUT' = 408,
  'CONFLICT' = 409,
  'GONE' = 410,
  'LENGTH_REQUIRED' = 411,
  'PRECONDITION_FAILED' = 412,
  'PAYLOAD_TOO_LARGE' = 413,
  'URI_TOO_LONG' = 414,
  'UNSUPPORTED_MEDIA_TYPE' = 415,
  'RANGE_NOT_SATISFIABLE' = 416,
  'EXPECTATION_FAILED' = 417,
  'IM_A_TEAPOT' = 418,
  'INTERNAL_SERVER_ERROR' = 500,
  'NOT_IMPLEMENTED' = 501,
  'BAD_GATEWAY' = 502,
  'SERVICE_UNAVAILABLE' = 503,
  'GATEWAY_TIMEOUT' = 504,
  'HTTP_VERSION_NOT_SUPPORTED' = 505,
}

export type ApiResponseMeta = {
  nextPage: string;
};

export type ApiResponseMessage = {
  message: string | string[];
};

export type ApiResponseSuccess<T> = {
  meta?: ApiResponseMeta;
  status: ApiResponseStatus;
  data: T;
};

export type ApiResponseError = {
  status: ApiResponseStatus;
  data: ApiResponseMessage;
};
