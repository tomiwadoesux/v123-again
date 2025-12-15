#!/usr/bin/env node

/**
 * Test script for debugging Vercel cron email issues
 * Run with: node test-cron.js
 */

const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://v123.ayotomcs.me';

async function testCronEndpoint() {
  console.log('🧪 Testing Vercel Cron Email System\n');
  console.log('='.repeat(50));
  
  // Test 1: Check environment variables
  console.log('\n📋 Test 1: Environment Variables');
  console.log('-'.repeat(50));
  const requiredEnvVars = [
    'RESEND_API_KEY',
    'NEWSAPI_KEY',
    'HUGGINGFACE_API_KEY',
    'GIPHY_API_KEY',
    'MONGODB_URI',
    'RESEND_FROM_EMAIL'
  ];
  
  let missingVars = [];
  requiredEnvVars.forEach(varName => {
    const exists = !!process.env[varName];
    console.log(`${exists ? '✅' : '❌'} ${varName}: ${exists ? 'Set' : 'MISSING'}`);
    if (!exists) missingVars.push(varName);
  });
  
  if (missingVars.length > 0) {
    console.log(`\n⚠️  Missing environment variables: ${missingVars.join(', ')}`);
    console.log('Please set these in your .env.local file or Vercel dashboard\n');
  }
  
  // Test 2: Test the schedule endpoint with daily frequency
  console.log('\n📋 Test 2: Testing /api/news/schedule?frequency=daily');
  console.log('-'.repeat(50));
  
  try {
    console.log(`Making request to: ${BASE_URL}/api/news/schedule?frequency=daily`);
    const response = await axios.get(`${BASE_URL}/api/news/schedule?frequency=daily`, {
      timeout: 30000
    });
    
    console.log('✅ Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Response Status:', error.response.status);
      console.log('Response Data:', error.response.data);
    }
  }
  
  // Test 3: Test the schedule endpoint with scheduled frequency
  console.log('\n📋 Test 3: Testing /api/news/schedule?frequency=scheduled');
  console.log('-'.repeat(50));
  
  try {
    console.log(`Making request to: ${BASE_URL}/api/news/schedule?frequency=scheduled`);
    const response = await axios.get(`${BASE_URL}/api/news/schedule?frequency=scheduled`, {
      timeout: 30000
    });
    
    console.log('✅ Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Response Status:', error.response.status);
      console.log('Response Data:', error.response.data);
    }
  }
  
  // Test 4: Test with a specific email (if provided)
  const testEmail = process.argv[2];
  if (testEmail) {
    console.log(`\n📋 Test 4: Testing with specific email: ${testEmail}`);
    console.log('-'.repeat(50));
    
    try {
      console.log(`Making request to: ${BASE_URL}/api/news/schedule?frequency=daily&test=${testEmail}`);
      const response = await axios.get(`${BASE_URL}/api/news/schedule?frequency=daily&test=${testEmail}`, {
        timeout: 60000 // Longer timeout for email sending
      });
      
      console.log('✅ Response Status:', response.status);
      console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('❌ Error:', error.message);
      if (error.response) {
        console.log('Response Status:', error.response.status);
        console.log('Response Data:', error.response.data);
      }
    }
  } else {
    console.log('\n💡 Tip: Run with an email to test specific subscriber:');
    console.log('   node test-cron.js your-email@example.com\n');
  }
  
  // Test 5: Check MongoDB connection
  console.log('\n📋 Test 5: Testing MongoDB Connection');
  console.log('-'.repeat(50));
  
  try {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ MongoDB connection successful');
    
    const db = client.db('newsletter');
    const subscribers = db.collection('subscribers');
    
    const dailyCount = await subscribers.countDocuments({ frequency: 'daily' });
    const weeklyCount = await subscribers.countDocuments({ frequency: 'weekly' });
    const totalCount = await subscribers.countDocuments({});
    
    console.log(`📊 Subscriber counts:`);
    console.log(`   - Daily: ${dailyCount}`);
    console.log(`   - Weekly: ${weeklyCount}`);
    console.log(`   - Total: ${totalCount}`);
    
    if (totalCount > 0) {
      console.log('\n📧 Sample subscriber:');
      const sample = await subscribers.findOne({});
      console.log(JSON.stringify({
        email: sample.email,
        category: sample.category,
        frequency: sample.frequency,
        preferredTime: sample.preferredTime,
        subscribedAt: sample.subscribedAt
      }, null, 2));
    } else {
      console.log('\n⚠️  No subscribers found in database!');
    }
    
    await client.close();
  } catch (error) {
    console.log('❌ MongoDB Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 Testing Complete\n');
}

// Run the tests
testCronEndpoint().catch(console.error);
