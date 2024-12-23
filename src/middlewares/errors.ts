import { Express, Request, Response, NextFunction } from 'express';
import { ApiResponseError, ApiResponseStatus } from '@/types';
import { Log } from '@/utils/log';

const ErrorResponses: Record<number, string> = {
  [ApiResponseStatus.BAD_REQUEST]:
    'Parece que algumas informações enviadas estão incompletas ou incorretas. Por favor, revise e tente novamente',
  [ApiResponseStatus.UNAUTHORIZED]:
    'Você precisa estar autenticado para acessar. Por favor, faça autenticação e tente novamente',
  [ApiResponseStatus.FORBIDDEN]:
    'Você não tem permissão para acessar. Entre em contato se precisar de ajuda',
  [ApiResponseStatus.NOT_FOUND]:
    'Não conseguimos encontrar o que você está procurando. Verifique o endereço acessado',
  [ApiResponseStatus.METHOD_NOT_ALLOWED]:
    'Essa ação não é suportada no momento. Por favor, tente outro método',
  [ApiResponseStatus.NOT_ACCEPTABLE]:
    'Desculpe, não conseguimos processar sua solicitação no momento. Tente ajustar as opções',
  [ApiResponseStatus.PAYLOAD_TOO_LARGE]:
    'Opa! Os anexos enviados são muito grandes. Tente reduzir o tamanho antes de enviar',
  [ApiResponseStatus.URI_TOO_LONG]:
    'O endereço fornecido é muito longo para processarmos. Por favor, simplifique a URL',
  [ApiResponseStatus.INTERNAL_SERVER_ERROR]:
    'Opa! Algo deu errado no nosso sistema. Estamos trabalhando para resolver isso o mais rápido possível',
  [ApiResponseStatus.NOT_IMPLEMENTED]:
    'Este recurso ainda não está disponível, mas fique de olho, estamos trabalhando nisso',
  [ApiResponseStatus.BAD_GATEWAY]:
    'Estamos enfrentando um problema de conexão com nossos servidores. Podemos estar em manutenção nesse momento',
  [ApiResponseStatus.SERVICE_UNAVAILABLE]:
    'Nosso serviço está temporariamente indisponível para manutenção. Voltaremos em breve, obrigado pela paciência',
  [ApiResponseStatus.GATEWAY_TIMEOUT]:
    'Parece que a conexão demorou mais do que o esperado. Por favor, tente novamente em alguns instantes',
};

export const ServerMiddleware = (server: Express) => {
  return server.use(
    (
      err: Error & { status?: number },
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const status = err.status ?? ApiResponseStatus.INTERNAL_SERVER_ERROR;
      const message =
        ErrorResponses[status] ||
        'Ocorreu um erro inesperado, o serviço estará disponível em alguns minutos';
      const response: ApiResponseError = {
        status,
        data: {
          message,
        },
      };
      Log.Fatal(`SERVER ${status}`, `${req.method} ${req.url} \n ${err}`);
      res.status(status).json(response);
      next();
    },
  );
};

export const ClientMiddleware = (server: Express) => {
  return server.use((req: Request, res: Response, next: NextFunction) => {
    const status = ApiResponseStatus.NOT_FOUND;
    const response: ApiResponseError = {
      status,
      data: {
        message: ErrorResponses[status],
      },
    };
    Log.Warning(`API ${status}`, `${req.method} ${req.url}`);
    res.status(status).json(response);
    next();
  });
};
