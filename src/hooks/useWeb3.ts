// hooks/useWeb3.ts
import { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import type { Web3State, BlockchainConfig } from '../../types/dashboard';
import AunthenticationContract from '../../contract/ElectronicsAuthentication-frontend.json'
declare global {
    interface Window {
        ethereum?: any;
        CONFIG: BlockchainConfig;
    }
}

export const useWeb3 = () => {
    const [web3State, setWeb3State] = useState<Web3State>({
        isConnected: false,
        account: null,
        web3: null,
        contract: null,
        isAuthorized: false
    });

    const [connectionStatus, setConnectionStatus] = useState<{
        message: string;
        type: 'checking' | 'connected' | 'disconnected' | 'unauthorized';
    }>({
        message: 'Checking blockchain connection...',
        type: 'checking'
    });

    // Helper function to check manufacturer authorization
    const checkManufacturerAuthorization = useCallback(async (contract: any, account: string): Promise<boolean> => {
        try {
            const isAuthorized = await contract.methods.isManufacturerAuthorized(account).call();
            return Boolean(isAuthorized);
        } catch (error) {
            console.error('Error checking manufacturer authorization:', error);
            return false;
        }
    }, []);

    const checkWalletConnection = useCallback(async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const web3 = new Web3(window.ethereum);
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });

                if (accounts.length > 0) {
                    const account = accounts[0];
                    const contract = new web3.eth.Contract(
                        AunthenticationContract,
                        import.meta.env.CONTRACT_ADDRESS
                    );

                    // Check authorization status
                    const isAuthorized = await checkManufacturerAuthorization(contract, account);

                    setWeb3State({
                        isConnected: true,
                        account,
                        web3,
                        contract,
                        isAuthorized
                    });

                    if (isAuthorized) {
                        setConnectionStatus({
                            message: `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`,
                            type: 'connected'
                        });
                    } else {
                        setConnectionStatus({
                            message: 'Connected but not authorized as manufacturer',
                            type: 'unauthorized'
                        });
                    }
                } else {
                    setWeb3State({
                        isConnected: false,
                        account: null,
                        web3: null,
                        contract: null,
                        isAuthorized: false
                    });
                    setConnectionStatus({
                        message: 'Not Connected - Please connect MetaMask',
                        type: 'disconnected'
                    });
                }
            } catch (error) {
                console.error('Error checking wallet:', error);
                setConnectionStatus({
                    message: 'Error connecting to wallet',
                    type: 'disconnected'
                });
            }
        } else {
            setConnectionStatus({
                message: 'MetaMask not installed',
                type: 'disconnected'
            });
        }
    }, [checkManufacturerAuthorization]);

    const connectWallet = useCallback(async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });

                if (accounts.length > 0) {
                    await checkWalletConnection();
                    return { success: true, message: 'Wallet connected successfully!' };
                }
            } catch (error: any) {
                console.error('Error connecting wallet:', error);
                return {
                    success: false,
                    message: error.message || 'Failed to connect wallet'
                };
            }
        } else {
            return {
                success: false,
                message: 'Please install MetaMask!'
            };
        }
    }, [checkWalletConnection]);

    const switchToSepolia = useCallback(async () => {
        if (!window.ethereum) return { success: false, message: 'MetaMask not installed' };

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${import.meta.env.CHAIN_ID.toString(16)}` }],
            });
            return { success: true, message: 'Switched to Sepolia network' };
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: `0x${import.meta.env.CHAIN_ID.toString(16)}`,
                            chainName: 'Sepolia Test Network',
                            nativeCurrency: {
                                name: 'ETH',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            rpcUrls: ['https://sepolia.infura.io/v3/'],
                            blockExplorerUrls: ['https://sepolia.etherscan.io/']
                        }]
                    });
                    return { success: true, message: 'Sepolia network added and switched' };
                } catch (addError: any) {
                    return { success: false, message: 'Failed to add Sepolia network' };
                }
            } else {
                return { success: false, message: 'Failed to switch to Sepolia network' };
            }
        }
    }, []);

    // Function to manually recheck authorization (useful after granting permissions)
    const recheckAuthorization = useCallback(async () => {
        if (web3State.contract && web3State.account) {
            const isAuthorized = await checkManufacturerAuthorization(web3State.contract, web3State.account);
            setWeb3State(prev => ({
                ...prev,
                isAuthorized
            }));

            setConnectionStatus(prev => ({
                ...prev,
                message: isAuthorized 
                    ? `Connected: ${web3State.account!.slice(0, 6)}...${web3State.account!.slice(-4)}`
                    : 'Connected but not authorized as manufacturer',
                type: isAuthorized ? 'connected' : 'unauthorized'
            }));

            return isAuthorized;
        }
        return false;
    }, [web3State.contract, web3State.account, checkManufacturerAuthorization]);

    useEffect(() => {
        checkWalletConnection();

        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                    setWeb3State({
                        isConnected: false,
                        account: null,
                        web3: null,
                        contract: null,
                        isAuthorized: false
                    });
                    setConnectionStatus({
                        message: 'Wallet disconnected',
                        type: 'disconnected'
                    });
                } else {
                    checkWalletConnection();
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
            }
        };
    }, [checkWalletConnection]);

    return {
        ...web3State,
        connectionStatus,
        connectWallet,
        switchToSepolia,
        checkWalletConnection,
        recheckAuthorization
    };
};