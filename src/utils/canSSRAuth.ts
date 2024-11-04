import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies } from 'nookies';
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
        // Deleta o cookie de forma nativa usando setHeader
        ctx.res.setHeader('Set-Cookie', '@mscauth.token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }

      throw err; // Lança outros erros que não sejam AuthTokenError
    }
  };
}
