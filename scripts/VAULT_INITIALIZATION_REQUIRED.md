# Vault Initialization Guide

## Overview

The **Vault Token Account** is a critical component of the governance staking system. It holds all staked $GET tokens from users. This account must be initialized **ONCE** before users can stake tokens.

## Why is this needed?

When users stake tokens, they transfer their tokens to a vault (a Token-2022 account owned by a PDA). This vault must exist before any staking operations can occur.

## When to run this script?

### ✅ You MUST run this script:

1. **Before deploying to mainnet** - First time setup
2. **After deploying smart contract to a new network** (devnet, testnet, mainnet)
3. **If you see this error**: "Vault token account does not exist"

### ❌ You DON'T need to run this if:

- The vault is already initialized (script will tell you)
- You're just updating frontend code
- You're just updating the smart contract (unless vault PDA changed)

## Prerequisites

### 1. Authority Keypair
You need a keypair with sufficient SOL to pay for account creation (~0.002 SOL + transaction fees).

**For mainnet**: Use a secure keypair (hardware wallet recommended)
**For devnet**: You can use your development keypair

### 2. Environment Variables
Make sure your `.env` file has:

```env
# Network (devnet or mainnet-beta)
NUXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# RPC URLs
NUXT_PUBLIC_SOLANA_RPC_MAINNET=https://api.mainnet-beta.solana.com
NUXT_PUBLIC_SOLANA_RPC_DEVNET=https://api.devnet.solana.com

# Token Mint Address (your $GET token)
NUXT_PUBLIC_SOLANA_TOKEN_MINT=YOUR_TOKEN_MINT_ADDRESS

# Program ID (your deployed smart contract)
NUXT_PUBLIC_SOLANA_PROGRAM_ID=9F77hJsRRXs7vF9UDncZKth2r5wEPgcRkEfyoZDNQ3eK
```

### 3. Node.js Dependencies
Make sure you have installed dependencies:

```bash
npm install
```

## How to Run

### Step 1: Prepare your keypair

**Option A: Use Solana CLI keypair**
```bash
# Default location
node scripts/initialize-vault.mjs ~/.config/solana/id.json
```

**Option B: Use custom keypair**
```bash
node scripts/initialize-vault.mjs /path/to/your/keypair.json
```

### Step 2: Verify the output

The script will:
1. ✅ Load your environment configuration
2. ✅ Check your authority balance
3. ✅ Derive the vault authority PDA
4. ✅ Calculate the vault token account address
5. ✅ Check if vault already exists
6. ✅ Create the vault token account (if needed)
7. ✅ Verify creation on-chain

### Step 3: Save the output

**IMPORTANT**: Save the vault token account address from the output. You'll need it for verification.

Example output:
```
✅ Vault initialization complete!

📋 Summary:
   Network: mainnet-beta
   Vault Authority: ABC...XYZ
   Vault Token Account: DEF...UVW
   Transaction: 5x7...9z2

🎉 Users can now stake tokens!
```

## For Mainnet Deployment

### Security Checklist

- [ ] Use a secure keypair (hardware wallet recommended)
- [ ] Verify token mint address is correct
- [ ] Verify program ID is correct
- [ ] Test on devnet first
- [ ] Have at least 0.01 SOL in authority wallet
- [ ] Backup the vault token account address
- [ ] Verify transaction on Solana Explorer

### Mainnet Steps

1. **Set environment to mainnet**:
   ```bash
   export NUXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   ```

2. **Run the script**:
   ```bash
   node scripts/initialize-vault.mjs /path/to/secure-keypair.json
   ```

3. **Verify on Solana Explorer**:
   - Go to https://explorer.solana.com
   - Search for the vault token account address
   - Verify it's owned by your vault authority PDA
   - Verify it's a Token-2022 account for your $GET token

4. **Test staking**:
   - Try staking a small amount first
   - Verify tokens are transferred to vault
   - Verify you can unstake and claim

## Troubleshooting

### Error: "Insufficient funds"
**Solution**: Add more SOL to your authority wallet (at least 0.01 SOL)

### Error: "Invalid token mint"
**Solution**: Check `NUXT_PUBLIC_SOLANA_TOKEN_MINT` in your `.env` file

### Error: "Program not found"
**Solution**: Check `NUXT_PUBLIC_SOLANA_PROGRAM_ID` in your `.env` file

### Error: "Account already exists"
**Solution**: Vault is already initialized! No action needed.

### Error: "Network request failed"
**Solution**: Check your RPC URL and internet connection

## Verification

After initialization, you can verify the vault:

```bash
# Using Solana CLI
solana account <VAULT_TOKEN_ACCOUNT_ADDRESS> --url mainnet-beta

# Check owner is your vault authority PDA
# Check mint is your $GET token address
# Check it's a Token-2022 account
```

## Important Notes

⚠️ **DO NOT**:
- Delete or close the vault token account
- Transfer ownership of the vault
- Run this script multiple times (it will skip if already exists)

✅ **DO**:
- Backup the vault token account address
- Test on devnet before mainnet
- Verify everything works before announcing to users
- Keep your authority keypair secure

## Support

If you encounter issues:
1. Check the error message carefully
2. Verify all environment variables
3. Check Solana Explorer for transaction details
4. Review the script logs

## Technical Details

### Vault Authority PDA
- Seeds: `["vault-authority"]`
- Program: Your governance program ID
- This PDA owns the vault token account

### Vault Token Account
- Type: Associated Token Account (Token-2022)
- Owner: Vault Authority PDA
- Mint: Your $GET token
- Purpose: Holds all staked tokens

### Why Token-2022?
Token-2022 is the new token standard with additional features. Make sure your $GET token is a Token-2022 token.

## Related Files

- `scripts/initialize-vault.mjs` - The initialization script
- `app/composables/useGovernance.ts` - Governance logic
- `app/components/governance/Stake.vue` - Staking UI
- `app/idl/gamaedtech_program.json` - Smart contract IDL

---

**Last Updated**: 2024
**Version**: 1.0.0
