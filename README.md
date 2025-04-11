# Deployment
⚠️ Warning:
We do not deploy admin on vercel as it may contain personal info.
Feel free to tweak with your google account in the source code.

# Prerequisites


Ensure you have Node.js and Yarn installed on your system. 

- Node.js can be downloaded from [https://nodejs.org/](https://nodejs.org/).
- Install Yarn by running `npm install --global yarn`.

# Setting Up the Project

## Clone the Repository

- git clone https://github.com/dna246/spa-front.git

- cd your-project-directory

# Install Dependencies
Using Yarn, install the project's dependencies: `yarn install`

## MongoDB Setup

This project requires MongoDB to store data. Ensure you have MongoDB installed and running on your system or use a MongoDB cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### MongoDB Atlas

For cloud-based MongoDB services, you can use MongoDB Atlas:

1. Sign up or log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster.
3. Once the cluster is ready, navigate to the 'Database Access' section and add a new database user with appropriate permissions.
4. Go to the 'Network Access' section and whitelist your IP address or allow access from anywhere (not recommended for production).
5. Navigate to the 'Clusters' section, click on 'Connect' and choose 'Connect your application'.
6. Copy the connection string provided and replace `<password>` with the password of the database user you created.

### Environment Variables

Add the connection string to your `.env` file:

`MONGODB_URI=your_mongodb_connection_string`

## AWS S3 Storage

This project uses Amazon S3 for file storage. You will need to set up an S3 bucket and obtain your AWS access keys.

### Create an S3 Bucket

1. Log in to the AWS Management Console and navigate to the Amazon S3 service.
2. Click on "Create bucket", provide a name for your bucket, and set the region that is closest to you or your users.
3. Follow the on-screen instructions to configure options and set permissions as needed for your application. Ensure that the bucket policy allows public reads if you're serving public content.

### Obtain AWS Access Keys

1. Navigate to the [IAM (Identity and Access Management)](https://console.aws.amazon.com/iam/) service in the AWS Console.
2. Create a new user or select an existing one.
3. Under the "Security credentials" tab, create a new access key.
4. Download the `.csv` file or copy the Access Key ID and Secret Access Key and store them securely.

### Environment Variables

Add your AWS credentials and S3 bucket information to your `.env` file:

```
AWS_ACCESS_KEY_ID=your_aws_access_key_id

AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
```

## Google Authentication Setup
Follow these steps to enable Google Authentication:

- Go to Google Cloud Console.
- Select or create a new project.
- Under "APIs & Services > Credentials", create OAuth client IDs.
- Add your project's authorized redirect URIs.
- Add the Google client ID and secret to the .env file:
```
GOOGLE_CLIENT_ID=<your_google_client_id>

GOOGLE_CLIENT_SECRET=<your_google_client_secret>
```
To launch:
`yarn dev` or with a specific port `yarn dev -p <PORT-NUMBER>` 
