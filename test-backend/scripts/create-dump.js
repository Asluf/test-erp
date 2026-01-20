#!/usr/bin/env node

const axios = require('axios');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3020';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'Bearer ';

if (!AUTH_TOKEN) {
  console.error('❌ Error: AUTH_TOKEN environment variable is required');
  console.log('Usage: AUTH_TOKEN=your_jwt_token node scripts/create-dump.js');
  process.exit(1);
}

async function createDump() {
  try {
    console.log('🔄 Creating compressed database dump...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/api/dump/create`, {}, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      console.log('✅ MongoDB binary dump created successfully!');
      console.log(`📁 Filename: ${response.data.filename}`);
      console.log(`💾 Size: ${(response.data.size / 1024).toFixed(2)} KB`);
      console.log(`📍 Path: ${response.data.path}`);
      console.log(`📋 Format: ${response.data.format}`);
      console.log('');
      console.log('📦 The dump is in MongoDB binary format (.gz) for easy importing!');
      console.log('🔄 Use: mongorestore --gzip --archive=filename.gz');
    } else {
      console.error('❌ Failed to create dump:', response.data.message);
    }

  } catch (error) {
    console.error('❌ Error creating dump:', error.response?.data?.message || error.message);
  }
}

// Main execution
const command = process.argv[2];

if (command === 'create') {
  createDump();
} else {
  console.log('📖 Usage:');
  console.log('  node scripts/create-dump.js create  - Create a compressed .gz dump');
  console.log('');
  console.log('🔐 Authentication:');
  console.log('  Set AUTH_TOKEN environment variable with your JWT token');
  console.log('  Example: AUTH_TOKEN=your_jwt_token node scripts/create-dump.js create');
  console.log('');
  console.log('📦 The dump will be created as a compressed .gz file for easy importing!');
}