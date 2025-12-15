#!/usr/bin/env node

/**
 * Check and fix subscriber data structure
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkSubscribers() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('newsletter');
    const subscribers = db.collection('subscribers');
    
    // Get all subscribers
    const allSubscribers = await subscribers.find({}).toArray();
    
    console.log(`📊 Total subscribers: ${allSubscribers.length}\n`);
    
    // Check for missing preferredTime
    const missingPreferredTime = allSubscribers.filter(sub => !sub.preferredTime);
    
    console.log(`⚠️  Subscribers missing preferredTime: ${missingPreferredTime.length}\n`);
    
    if (missingPreferredTime.length > 0) {
      console.log('Sample subscribers missing preferredTime:');
      missingPreferredTime.slice(0, 5).forEach(sub => {
        console.log(`  - ${sub.email} (${sub.frequency}, ${sub.category})`);
      });
      
      console.log('\n🔧 Would you like to fix these? (This script will add default preferredTime)');
      console.log('   Default time: 9:00 AM (hour: 9, minute: 0)\n');
      
      // Auto-fix: Add preferredTime to all subscribers missing it
      const result = await subscribers.updateMany(
        { preferredTime: { $exists: false } },
        { 
          $set: { 
            preferredTime: { 
              hour: 9, 
              minute: 0 
            } 
          } 
        }
      );
      
      console.log(`✅ Updated ${result.modifiedCount} subscribers with default preferredTime (9:00 AM)\n`);
    }
    
    // Show updated stats
    const withPreferredTime = await subscribers.find({ 
      preferredTime: { $exists: true } 
    }).toArray();
    
    console.log('📊 Updated subscriber stats:');
    console.log(`   - With preferredTime: ${withPreferredTime.length}`);
    console.log(`   - Missing preferredTime: ${allSubscribers.length - withPreferredTime.length}\n`);
    
    // Show distribution by hour
    const hourDistribution = {};
    withPreferredTime.forEach(sub => {
      const hour = sub.preferredTime?.hour || 'unknown';
      hourDistribution[hour] = (hourDistribution[hour] || 0) + 1;
    });
    
    console.log('📊 Distribution by delivery hour:');
    Object.entries(hourDistribution)
      .sort((a, b) => a[0] - b[0])
      .forEach(([hour, count]) => {
        console.log(`   - ${hour}:00 → ${count} subscribers`);
      });
    
    console.log('\n✅ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkSubscribers().catch(console.error);
