#!/usr/bin/env bash
set -euo pipefail

EMAIL="flow$(date +%s)@example.com"

REG_CODE=$(curl -s -o /tmp/flow_reg.json -w "%{http_code}" -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Flow User\",\"email\":\"$EMAIL\",\"password\":\"123456\"}")
LOGIN_CODE=$(curl -s -o /tmp/flow_login.json -w "%{http_code}" -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\",\"password\":\"123456\"}")
TOKEN=$(node -e "const fs=require('fs');const j=JSON.parse(fs.readFileSync('/tmp/flow_login.json','utf8'));process.stdout.write(j?.data?.token||'');")

ACC_POST_CODE=$(curl -s -o /tmp/flow_acc_post.json -w "%{http_code}" -X POST http://localhost:3000/api/accounts -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"currency":"INR"}')
USER_ACCOUNT_ID=$(node -e "const fs=require('fs');const j=JSON.parse(fs.readFileSync('/tmp/flow_acc_post.json','utf8'));process.stdout.write(j?.data?._id||'');")
ACC_GET_CODE=$(curl -s -o /tmp/flow_acc_get.json -w "%{http_code}" -X GET http://localhost:3000/api/accounts -H "Authorization: Bearer $TOKEN")
TXN_GET_BEFORE_CODE=$(curl -s -o /tmp/flow_txn_get_before.json -w "%{http_code}" -X GET http://localhost:3000/api/transactions -H "Authorization: Bearer $TOKEN")

SYSTEM_ACCOUNT_ID=$(node <<'NODE'
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const Account = require('./src/models/account.model');
const Transaction = require('./src/models/transaction.model');
const Ledger = require('./src/models/ledger.model');
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  let systemUser = await User.findOne({ email: 'system.bank@example.com' });
  if (!systemUser) {
    systemUser = await User.create({ name: 'System User', email: 'system.bank@example.com', password: '123456', systemUser: true });
  }
  let systemAccount = await Account.findOne({ user: systemUser._id, currency: 'INR' });
  if (!systemAccount) {
    systemAccount = await Account.create({ user: systemUser._id, currency: 'INR', status: 'active' });
  }
  const currentBalance = await systemAccount.getBalance();
  if (currentBalance < 5000) {
    const seedTx = await Transaction.create({ fromAccount: systemAccount._id, toAccount: systemAccount._id, amount: 10000, idempotencyKey: `seed-${Date.now()}`, status: 'completed' });
    await Ledger.create({ account: systemAccount._id, amount: 10000, transaction: seedTx._id, type: 'credit' });
  }
  process.stdout.write(String(systemAccount._id));
  await mongoose.disconnect();
})();
NODE
)

TXN_POST_CODE=$(curl -s -o /tmp/flow_txn_post.json -w "%{http_code}" -X POST http://localhost:3000/api/transactions -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{\"fromAccount\":\"$SYSTEM_ACCOUNT_ID\",\"toAccount\":\"$USER_ACCOUNT_ID\",\"amount\":250,\"idempotencyKey\":\"flow-txn-$(date +%s)\"}")
INIT_FUNDS_CODE=$(curl -s -o /tmp/flow_init_funds.json -w "%{http_code}" -X POST http://localhost:3000/api/transactions/system/initial-funds -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{\"fromAccount\":\"$SYSTEM_ACCOUNT_ID\",\"toAccount\":\"$USER_ACCOUNT_ID\",\"amount\":150,\"idempotencyKey\":\"flow-init-$(date +%s)\"}")
TXN_GET_AFTER_CODE=$(curl -s -o /tmp/flow_txn_get_after.json -w "%{http_code}" -X GET http://localhost:3000/api/transactions -H "Authorization: Bearer $TOKEN")

printf "REGISTER:%s\nLOGIN:%s\nACCOUNTS_POST:%s\nACCOUNTS_GET:%s\nTXN_GET_BEFORE:%s\nTXN_POST:%s\nTXN_INIT_FUNDS:%s\nTXN_GET_AFTER:%s\nSYSTEM_ACCOUNT:%s\nUSER_ACCOUNT:%s\nTEST_EMAIL:%s\n" "$REG_CODE" "$LOGIN_CODE" "$ACC_POST_CODE" "$ACC_GET_CODE" "$TXN_GET_BEFORE_CODE" "$TXN_POST_CODE" "$INIT_FUNDS_CODE" "$TXN_GET_AFTER_CODE" "$SYSTEM_ACCOUNT_ID" "$USER_ACCOUNT_ID" "$EMAIL"
