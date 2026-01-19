// D-ID Agent Configuration
// Lätt att byta agent - bara ändra activeAgent eller lägg till nya i agents-objektet

export const didAgents = {
  // Agent 1 - Första agenten
  agent1: {
    id: 'agt_MZHS35Ro',
    name: 'DG97 Assistent',
    url: 'https://studio.d-id.com/agents/share?id=agt_MZHS35Ro&utm_source=copy&key=WjI5dloyeGxMVzloZFhSb01ud3hNVFV5TnpnMU56UXpORE0yTnpFMU9UUTVPRFU2VkZGclUxSTNTVU54V0hwdFpIZzNOSGxOVkhKMA==',
    description: 'Vår virtuella receptionist',
  },

  // Agent 2 - Andra agenten
  agent2: {
    id: 'agt_h5geNb9N',
    name: 'DG97 Guide',
    url: 'https://studio.d-id.com/agents/share?id=agt_h5geNb9N&utm_source=copy&key=WjI5dloyeGxMVzloZFhSb01ud3hNVFV5TnpnMU56UXpORE0yTnpFMU9UUTVPRFU2VkZGclUxSTNTVU54V0hwdFpIZzNOSGxOVkhKMA==',
    description: 'Kontorsvisning och information',
  },

  // Lägg till fler agenter här när du vill testa nya
  // agent3: {
  //   id: 'agt_XXXXX',
  //   name: 'Ny Agent',
  //   url: 'https://studio.d-id.com/agents/share?id=...',
  //   description: 'Beskrivning',
  // },
};

// Ändra denna för att byta aktiv agent
export const activeAgent = 'agent2'; // Byt till 'agent1' eller annan nyckel för att byta agent

// Hämta aktiv agent
export const getActiveAgent = () => {
  return didAgents[activeAgent] || didAgents.agent1;
};

// Agent inställningar
export const agentSettings = {
  // Visa avatar på desktop
  showOnDesktop: true,

  // Visa avatar på mobil
  showOnMobile: false,

  // Auto-öppna efter X sekunder (0 = aldrig)
  autoOpenDelay: 0,

  // Position och storlek
  position: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  variant: 'panel', // 'panel', 'bubble', 'fullscreen'

  // Storlekar
  sizes: {
    panel: { width: '360px', height: '560px' },
    bubble: { width: '280px', height: '280px' },
    fullscreen: { width: '100vw', height: '100vh' },
  },

  // Styling
  glassmorphism: true,
  shadow: true,
  rounded: true,
};
