import { createAuthProxyHandler } from '../../../lib/member-auth';

export const config = { api: { bodyParser: { sizeLimit: '8kb' } } };

export default createAuthProxyHandler();
