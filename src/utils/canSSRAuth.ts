import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import { AuthTokenError } from './../services/errors/AuthTokenError';

export function canSSRAuth<P extends { [key: string]: any }>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies['@mscauth.token'];

    if (!token) {
      console.log("Token ausente. Redirecionando para '/'...");
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    try {
      // Executa a função original do GetServerSideProps com o token válido
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        console.log("Erro de autenticação. Redirecionando e destruindo o cookie...");
        destroyCookie(ctx, '@mscauth.token');
        ctx.res.writeHead(302, { Location: '/' });
        ctx.res.end();
        return { props: {} as P }; // Evita erro de tipo
      }

      throw err; // Lança outros erros que não sejam AuthTokenError
    }
  };
}
