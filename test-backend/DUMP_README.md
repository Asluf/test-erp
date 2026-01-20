# Database Dump Functionality

This document explains how to create compressed database dumps for the billing system.

## 🔐 Security Note

The dump endpoint requires authentication. You need a valid JWT token to access this endpoint.

## 📋 Available Endpoint

### Create Compressed JSON Dump
```bash
POST /auth/api/dump/create
```
Creates a compressed .gz dump of all collections in the database.

## 🚀 Usage Methods

### Method 1: Using Yarn Script (Recommended)

1. **Get your JWT token** by logging into the system
2. **Set the token as environment variable:**
   ```bash
   export AUTH_TOKEN=your_jwt_token_here
   ```

3. **Create a compressed dump:**
   ```bash
   yarn dump:create
   ```

### Method 2: Using Node Script Directly

```bash
# Create compressed dump
AUTH_TOKEN=your_jwt_token node scripts/create-dump.js create
```

### Method 3: Using cURL

```bash
# Create compressed JSON dump
curl -X POST http://localhost:3020/auth/api/dump/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## 📁 Dump File Locations

- **Compressed Dumps**: `api/dumps/` directory (as .json.gz files)

## 🔧 Setup Instructions

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Start the server:**
   ```bash
   yarn start
   ```

3. **Get authentication token:**
   - Login to the system through the frontend
   - Copy the JWT token from browser storage or network requests

4. **Create your first compressed dump:**
   ```bash
   export AUTH_TOKEN=your_token_here
   yarn dump:create
   ```

## 📊 Dump File Structure

### MongoDB Binary Dump Structure
The dump is created as a `.gz` file using MongoDB's native `mongodump` format:

- **Format**: MongoDB binary archive (BSON)
- **Compression**: Gzip compressed
- **Compatibility**: Fully compatible with `mongorestore`
- **Collections**: All collections from the source database

## 🛡️ Security Considerations

1. **Authentication Required**: The endpoint requires valid JWT tokens
2. **File Storage**: Dumps are stored locally in the `api/dumps/` directory
3. **Access Control**: Only authenticated users can create dumps
4. **Manual Process**: For security, dumps are created manually rather than automatically

## 🔄 Automated Dump Creation (Optional)

For periodic dumps, you can create a cron job:

```bash
# Add to crontab (runs daily at 2 AM)
0 2 * * * cd /path/to/billing-app-backend && AUTH_TOKEN=your_token yarn dump:create
```

## 📝 Troubleshooting

### Common Issues:

1. **Authentication Error**: Make sure your JWT token is valid and not expired
2. **Permission Denied**: Ensure the `api/dumps/` directory is writable
3. **Server Not Running**: Ensure the backend server is running on port 3020

### Getting JWT Token:

1. Open browser developer tools
2. Go to Application/Storage tab
3. Look for localStorage or sessionStorage
4. Find the token key (usually 'token' or 'authToken')
5. Copy the token value

## 📈 Monitoring

The dump endpoint returns detailed information:
- File size (compressed)
- Number of records
- Collections included
- Creation timestamp
- File path

## 🗜️ Compression Benefits

- **Smaller File Size**: Gzip compression reduces file size significantly
- **Easy Import**: Compressed files are easier to transfer and import
- **Storage Efficient**: Takes up less disk space
- **Fast Transfer**: Smaller files transfer faster

## 📦 Import Instructions

To import the MongoDB binary dump:

### Method 1: Restore to Same Database
```bash
mongorestore --gzip --archive=billing_system_dump_YYYY-MM-DDTHH-MM-SS-sssZ.gz
```

### Method 2: Restore to Different Database
```bash
mongorestore --gzip --archive=billing_system_dump_YYYY-MM-DDTHH-MM-SS-sssZ.gz --nsFrom "billing_system.*" --nsTo "new_database.*"
```

### Method 3: Restore Specific Collections
```bash
mongorestore --gzip --archive=billing_system_dump_YYYY-MM-DDTHH-MM-SS-sssZ.gz --nsFrom "billing_system.users" --nsTo "new_database.users"
```

### Method 4: Restore with Drop (Replace Existing Data)
```bash
mongorestore --gzip --archive=billing_system_dump_YYYY-MM-DDTHH-MM-SS-sssZ.gz --drop
```

The MongoDB binary format ensures perfect compatibility with `mongorestore`!