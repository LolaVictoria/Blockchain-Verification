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
        type: 'checking' | 'connected' | 'disconnected' | 'unauthorized' | 'error';
    }>({
        message: 'Checking blockchain connection...',
        type: 'checking'
    });

    // Validate environment variables
    const validateEnvironment = useCallback(() => {
        const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
        const chainId = import.meta.env.VITE_CHAIN_ID;

        if (!contractAddress) {
            console.error('CONTRACT_ADDRESS not found in environment variables');
            setConnectionStatus({
                message: 'Contract address not configured',
                type: 'error'
            });
            return false;
        }

        if (!chainId) {
            console.error('CHAIN_ID not found in environment variables');
            setConnectionStatus({
                message: 'Chain ID not configured',
                type: 'error'
            });
            return false;
        }

        return true;
    }, []);

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
        // First validate environment
        if (!validateEnvironment()) {
            return;
        }

        if (typeof window.ethereum !== 'undefined') {
            try {
                const web3 = new Web3(window.ethereum);
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });

                if (accounts.length > 0) {
                    const account = accounts[0];
                    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
                    
                    // Double-check contract address before creating contract
                    if (!contractAddress) {
                        throw new Error('Contract address is not defined');
                    }

                    const contract = new web3.eth.Contract(
                        AunthenticationContract,
                        contractAddress
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
                    message: `Error connecting to wallet: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    type: 'error'
                });
            }
        } else {
            setConnectionStatus({
                message: 'MetaMask not installed',
                type: 'disconnected'
            });
        }
    }, [checkManufacturerAuthorization, validateEnvironment]);

    const connectWallet = useCallback(async () => {
        if (!validateEnvironment()) {
            return {
                success: false,
                message: 'Environment not properly configured'
            };
        }

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
    }, [checkWalletConnection, validateEnvironment]);

    const switchToSepolia = useCallback(async () => {
        if (!window.ethereum) return { success: false, message: 'MetaMask not installed' };

        const chainId = import.meta.env.VITE_CHAIN_ID;
        if (!chainId) {
            return { success: false, message: 'Chain ID not configured' };
        }

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }],
            });
            return { success: true, message: 'Switched to Sepolia network' };
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: `0x${parseInt(chainId).toString(16)}`,
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