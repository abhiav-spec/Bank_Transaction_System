require('dotenv').config();
const mongoose = require('mongoose');
const Account = require('./src/models/account.model');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('📱 Updating phone numbers for Abhinav and Rishi...\n');

    // Update kumarabhinav's account with phone number
    const abhinavResult = await Account.updateMany(
      { fullName: /abhinav/i },
      { $set: { phoneNumber: '919876543210' } },
      { new: true }
    );
    console.log(`✅ Updated Abhinav accounts: ${abhinavResult.modifiedCount}`);

    // Update rishi's account with phone number
    const rishiResult = await Account.updateMany(
      { fullName: /rishi/i },
      { $set: { phoneNumber: '919988776655' } },
      { new: true }
    );
    console.log(`✅ Updated Rishi accounts: ${rishiResult.modifiedCount}`);

    // Fetch and display updated accounts
    const abhinavAccounts = await Account.find({ fullName: /abhinav/i });
    const rishiAccounts = await Account.find({ fullName: /rishi/i });

    console.log('\n=== UPDATED ACCOUNTS ===\n');
    
    if (abhinavAccounts.length > 0) {
      console.log('👤 Abhinav Accounts:');
      abhinavAccounts.forEach(acc => {
        console.log(`   ID: ${acc._id}`);
        console.log(`   Name: ${acc.fullName}`);
        console.log(`   Phone: ${acc.phoneNumber}`);
        console.log(`   Email: ${acc.email}`);
      });
    }

    if (rishiAccounts.length > 0) {
      console.log('\n👤 Rishi Accounts:');
      rishiAccounts.forEach(acc => {
        console.log(`   ID: ${acc._id}`);
        console.log(`   Name: ${acc.fullName}`);
        console.log(`   Phone: ${acc.phoneNumber}`);
        console.log(`   Email: ${acc.email}`);
      });
    }

    // Validate phone numbers against regex
    console.log('\n=== PHONE NUMBER VALIDATION ===\n');
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    
    [...abhinavAccounts, ...rishiAccounts].forEach(acc => {
      const isValid = phoneRegex.test(acc.phoneNumber);
      console.log(`${isValid ? '✓' : '✗'} ${acc.fullName} (${acc.phoneNumber}): ${isValid ? 'VALID' : 'INVALID'}`);
    });

    console.log('\n📋 Regex Pattern: /^\\+?[1-9]\\d{1,14}$/');
    console.log('   ✓ Optional + prefix');
    console.log('   ✓ First digit 1-9 (no leading zeros)');
    console.log('   ✓ 1-14 additional digits');
    console.log('   ✓ Total: 2-15 digits (E.164 format)\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
})();
