import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { OKX } from './OKX';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
    metaMaskWallet,
    rainbowWallet,
    walletConnectWallet,
    coinbaseWallet,
    argentWallet,
    ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import App from './App';

const { chains, provider, webSocketProvider } = configureChains(
    [
        chain.mainnet,
        chain.polygon,
        chain.optimism,
        chain.arbitrum,
        ...(process.env.REACT_APP_ENABLE_TESTNETS === 'true' ? [chain.goerli] : []),
    ],
    [
        alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_ID }),
        publicProvider(),
    ]
);

const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [
            metaMaskWallet({ chains }),
            rainbowWallet({ chains }),
            walletConnectWallet({ chains }),
            coinbaseWallet({ chains }),
            argentWallet({ chains }),
            ledgerWallet({ chains }),
            OKX({ chains })
        ],
    },
]);

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
});

const root = ReactDOM.createRoot(
    document.getElementById('root')
);
window.Buffer = window.Buffer || require("buffer").Buffer;

root.render(
    <React.StrictMode>
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <App />
            </RainbowKitProvider>
        </WagmiConfig>
    </React.StrictMode>
);
