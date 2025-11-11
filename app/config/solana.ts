/**
 * Solana Configuration for Governance
 * Supports both mainnet and devnet
 */

export interface SolanaConfig {
  tokenMint: string;
  vaultAddress: string;
  programId: string;
  tokenProgram: string;
  network: "mainnet-beta" | "devnet" | "testnet";
}

// Mainnet Configuration
export const MAINNET_CONFIG: SolanaConfig = {
  tokenMint: "GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv", // GET token
  vaultAddress: "CALCULATE_AT_RUNTIME", // Will be calculated using PDA
  programId: "9F77hJsRRXs7vF9UDncZKth2r5wEPgcRkEfyoZDNQ3eK",
  tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb", // Token-2022
  network: "mainnet-beta",
};

// Devnet Configuration
export const DEVNET_CONFIG: SolanaConfig = {
  tokenMint: "HyXdVykYjcgJwgBmeMmy59QHF4HncsH1TScdH97nqJYW", // GamaEdtech-DEV token
  // Vault authority is a PDA derived from ["vault-authority"] seed
  // This is calculated from the program ID and will be the same for mainnet and devnet
  vaultAddress: "CALCULATE_AT_RUNTIME", // Will be calculated using PDA
  programId: "9F77hJsRRXs7vF9UDncZKth2r5wEPgcRkEfyoZDNQ3eK", // Same program ID
  tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb", // Token-2022
  network: "devnet",
};

/**
 * Get the appropriate configuration based on environment
 */
export function getSolanaConfig(): SolanaConfig {
  if (import.meta.client) {
    const config = useRuntimeConfig();
    const network = config.public?.solanaNetwork as string;

    if (network === "devnet") {
      return DEVNET_CONFIG;
    }
  }

  return MAINNET_CONFIG;
}

/**
 * Get token mint address for current network
 */
export function getTokenMint(): string {
  const mint = getSolanaConfig().tokenMint;

  // Fallback to mainnet token if devnet not configured yet
  if (mint.includes("REPLACE")) {
    console.warn(
      "⚠️ Token mint not configured! Using mainnet token as fallback."
    );
    console.warn(
      "Please run: node scripts/setup-devnet.js YOUR_WALLET_ADDRESS"
    );
    return MAINNET_CONFIG.tokenMint;
  }

  return mint;
}

/**
 * Get vault authority PDA address
 * This is derived from the program ID and "vault-authority" seed
 * It's the same for all networks since it only depends on the program ID
 */
export async function getVaultAddress(): Promise<string> {
  if (!import.meta.client) {
    throw new Error("getVaultAddress can only be called on client side");
  }

  const { PublicKey } = await import("@solana/web3.js");
  const programId = new PublicKey(getProgramId());

  // Calculate vault authority PDA
  const [vaultAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault-authority")],
    programId
  );

  return vaultAuthority.toBase58();
}

/**
 * Get program ID for current network
 */
export function getProgramId(): string {
  return getSolanaConfig().programId;
}

/**
 * Get Token-2022 program ID
 */
export function getTokenProgramId(): string {
  return getSolanaConfig().tokenProgram;
}

/**
 * Check if running on devnet
 */
export function isDevnet(): boolean {
  if (import.meta.client) {
    const config = useRuntimeConfig();
    return config.public?.solanaNetwork === "devnet";
  }
  return false;
}
