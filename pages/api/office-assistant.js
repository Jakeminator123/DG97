import { createAssistantHandler } from '../../lib/office-assistant-server';

export const config = { api: { bodyParser: { sizeLimit: '12kb' } }, maxDuration: 30 };
export default createAssistantHandler();
