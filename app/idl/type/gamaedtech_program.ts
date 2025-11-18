/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/gamaedtech_program.json`.
 */
export type GamaedtechProgram = {
  address: '9F77hJsRRXs7vF9UDncZKth2r5wEPgcRkEfyoZDNQ3eK'
  metadata: {
    name: 'gamaedtechProgram'
    version: '0.1.2'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'calimUnstack'
      discriminator: [
        44,
        224,
        60,
        155,
        188,
        78,
        162,
        222,
      ]
      accounts: [
        {
          name: 'user'
          writable: true
          signer: true
        },
        {
          name: 'userTokenAccount'
          writable: true
        },
        {
          name: 'vaultTokenAccount'
          writable: true
        },
        {
          name: 'vaultAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  118,
                  97,
                  117,
                  108,
                  116,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
            ]
          }
        },
        {
          name: 'mint'
          writable: true
        },
        {
          name: 'stakeAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  97,
                  107,
                  101,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ]
              },
              {
                kind: 'account'
                path: 'user'
              },
            ]
          }
        },
        {
          name: 'stats'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  97,
                  116,
                  115,
                ]
              },
            ]
          }
        },
        {
          name: 'tokenProgram'
        },
      ]
      args: []
    },
    {
      name: 'createProposal'
      discriminator: [
        132,
        116,
        68,
        174,
        216,
        160,
        198,
        22,
      ]
      accounts: [
        {
          name: 'userState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
              {
                kind: 'account'
                path: 'user'
              },
            ]
          }
        },
        {
          name: 'proposal'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108,
                ]
              },
              {
                kind: 'account'
                path: 'user'
              },
              {
                kind: 'account'
                path: 'user_state.proposal_count'
                account: 'userState'
              },
            ]
          }
        },
        {
          name: 'user'
          writable: true
          signer: true
        },
        {
          name: 'stakeAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  97,
                  107,
                  101,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ]
              },
              {
                kind: 'account'
                path: 'user'
              },
            ]
          }
        },
        {
          name: 'stats'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  97,
                  116,
                  115,
                ]
              },
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'title'
          type: 'string'
        },
        {
          name: 'brief'
          type: 'string'
        },
        {
          name: 'cate'
          type: 'string'
        },
        {
          name: 'reference'
          type: 'string'
        },
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
    {
      name: 'deleteProposal'
      discriminator: [
        195,
        115,
        85,
        157,
        254,
        15,
        175,
        201,
      ]
      accounts: [
        {
          name: 'proposal'
          writable: true
        },
        {
          name: 'user'
          writable: true
        },
      ]
      args: []
    },
    {
      name: 'initStats'
      discriminator: [
        203,
        189,
        229,
        174,
        240,
        190,
        158,
        110,
      ]
      accounts: [
        {
          name: 'stats'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  97,
                  116,
                  115,
                ]
              },
            ]
          }
        },
        {
          name: 'authority'
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: []
    },
    {
      name: 'requestFund'
      discriminator: [
        129,
        55,
        16,
        138,
        75,
        141,
        102,
        217,
      ]
      accounts: [
        {
          name: 'proposal'
          writable: true
        },
        {
          name: 'multisig'
        },
        {
          name: 'transaction'
          writable: true
        },
        {
          name: 'creator'
          docs: [
            'The wallet (user) paying for rent and signing',
          ]
          writable: true
          signer: true
        },
        {
          name: 'rentPayer'
          docs: [
            'The wallet (user) paying for rent',
          ]
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
          docs: [
            'Squads program (generic type works for CPI)',
          ]
          address: '11111111111111111111111111111111'
        },
      ]
      args: []
    },
    {
      name: 'stack'
      discriminator: [
        251,
        29,
        17,
        7,
        249,
        153,
        78,
        255,
      ]
      accounts: [
        {
          name: 'user'
          docs: [
            'The user performing the stake',
          ]
          writable: true
          signer: true
        },
        {
          name: 'userTokenAccount'
          docs: [
            'User\'s Token-2022 or legacy SPL token account',
          ]
          writable: true
        },
        {
          name: 'vaultTokenAccount'
          docs: [
            'Vault Token-2022 or legacy SPL token account (where tokens are staked)',
          ]
          writable: true
        },
        {
          name: 'mint'
          docs: [
            'Token mint (Token-2022 or legacy SPL)',
          ]
          writable: true
        },
        {
          name: 'stakeAccount'
          docs: [
            'Custom stake account to track user\'s stake',
          ]
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  97,
                  107,
                  101,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ]
              },
              {
                kind: 'account'
                path: 'user'
              },
            ]
          }
        },
        {
          name: 'stats'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  97,
                  116,
                  115,
                ]
              },
            ]
          }
        },
        {
          name: 'tokenProgram'
          docs: [
            'The token program (can be Token-2022 or legacy SPL)',
          ]
        },
        {
          name: 'systemProgram'
          docs: [
            'System program (for paying rent, etc.)',
          ]
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
    {
      name: 'unstack'
      discriminator: [
        224,
        133,
        160,
        144,
        1,
        187,
        195,
        130,
      ]
      accounts: [
        {
          name: 'stakeAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  97,
                  107,
                  101,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ]
              },
              {
                kind: 'account'
                path: 'user'
              },
            ]
          }
        },
        {
          name: 'stats'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  97,
                  116,
                  115,
                ]
              },
            ]
          }
        },
        {
          name: 'user'
          signer: true
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
    {
      name: 'vote'
      discriminator: [
        227,
        110,
        155,
        23,
        136,
        126,
        172,
        25,
      ]
      accounts: [
        {
          name: 'proposal'
          writable: true
        },
        {
          name: 'voter'
          writable: true
          signer: true
        },
        {
          name: 'voteRecord'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  118,
                  111,
                  116,
                  101,
                  45,
                  114,
                  101,
                  99,
                  111,
                  114,
                  100,
                ]
              },
              {
                kind: 'account'
                path: 'proposal'
              },
              {
                kind: 'account'
                path: 'voter'
              },
            ]
          }
        },
        {
          name: 'stakeAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  97,
                  107,
                  101,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ]
              },
              {
                kind: 'account'
                path: 'voter'
              },
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'agree'
          type: 'bool'
        },
      ]
    },
  ]
  accounts: [
    {
      name: 'proposal'
      discriminator: [
        26,
        94,
        189,
        187,
        116,
        136,
        53,
        33,
      ]
    },
    {
      name: 'stakeAccount'
      discriminator: [
        80,
        158,
        67,
        124,
        50,
        189,
        192,
        255,
      ]
    },
    {
      name: 'stats'
      discriminator: [
        190,
        125,
        51,
        63,
        169,
        197,
        36,
        238,
      ]
    },
    {
      name: 'userState'
      discriminator: [
        72,
        177,
        85,
        249,
        76,
        167,
        186,
        126,
      ]
    },
    {
      name: 'voteRecord'
      discriminator: [
        112,
        9,
        123,
        165,
        234,
        9,
        157,
        167,
      ]
    },
  ]
  errors: [
    {
      code: 6000
      name: 'unauthorized'
      msg: 'Unauthorized to Action'
    },
    {
      code: 6001
      name: 'alreadyVoted'
      msg: 'Already voted!'
    },
    {
      code: 6002
      name: 'expiredProposal'
      msg: 'The Proposal Has Already Expired'
    },
    {
      code: 6003
      name: 'alreadyRequested'
      msg: 'Funds already requested for this proposal.'
    },
    {
      code: 6004
      name: 'proposalNotPassed'
      msg: 'Proposal has not passed yet.'
    },
    {
      code: 6005
      name: 'votingStillActive'
      msg: 'Proposal voting still active'
    },
    {
      code: 6006
      name: 'proposalRejected'
      msg: 'Proposal Regected'
    },
    {
      code: 6007
      name: 'insufficientStake'
      msg: 'Insufficient Stake'
    },
    {
      code: 6008
      name: 'noStakePower'
      msg: 'No Stake Power'
    },
    {
      code: 6009
      name: 'invalidTokenMint'
      msg: 'You can only stake the allowed token.'
    },
    {
      code: 6010
      name: 'cooldownActive'
      msg: 'Cooldown period still active.'
    },
    {
      code: 6011
      name: 'nothingToClaim'
      msg: 'Nothing to claim.'
    },
  ]
  types: [
    {
      name: 'proposal'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'owner'
            type: 'pubkey'
          },
          {
            name: 'title'
            type: 'string'
          },
          {
            name: 'brief'
            type: 'string'
          },
          {
            name: 'cate'
            type: 'string'
          },
          {
            name: 'reference'
            type: 'string'
          },
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'agreeVotes'
            type: 'u64'
          },
          {
            name: 'disagreeVotes'
            type: 'u64'
          },
          {
            name: 'createdAt'
            type: 'i64'
          },
          {
            name: 'expiresAt'
            type: 'i64'
          },
          {
            name: 'isFundRequested'
            type: 'bool'
          },
        ]
      }
    },
    {
      name: 'stakeAccount'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'owner'
            type: 'pubkey'
          },
          {
            name: 'stakedAmount'
            type: 'u64'
          },
          {
            name: 'lastStakeTime'
            type: 'i64'
          },
          {
            name: 'pendingUnstake'
            type: 'u64'
          },
          {
            name: 'unstakeRequestedAt'
            type: 'i64'
          },
        ]
      }
    },
    {
      name: 'stats'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'totalProposals'
            type: 'u64'
          },
          {
            name: 'activeVoters'
            type: 'u64'
          },
          {
            name: 'proposalsPassed'
            type: 'u64'
          },
          {
            name: 'treasuryBalance'
            type: 'u64'
          },
          {
            name: 'totalStaked'
            type: 'u64'
          },
          {
            name: 'bump'
            type: 'u8'
          },
        ]
      }
    },
    {
      name: 'userState'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'user'
            type: 'pubkey'
          },
          {
            name: 'proposalCount'
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'voteRecord'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'proposalId'
            type: 'pubkey'
          },
          {
            name: 'voter'
            type: 'pubkey'
          },
          {
            name: 'hasVoted'
            type: 'bool'
          },
          {
            name: 'vote'
            type: 'string'
          },
          {
            name: 'votePower'
            type: 'u64'
          },
        ]
      }
    },
  ]
}
