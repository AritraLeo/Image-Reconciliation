# Image-Reconciliation

## Overview

This project is a web service designed to consolidate customer contact information from multiple orders. It identifies customers based on email and phone number and ensures that all contacts are linked appropriately, treating the oldest contact as "primary" and others as "secondary."

## Tech Stack

- **Node.js**: JavaScript runtime
- **TypeScript**: JavaScript with static typing
- **Express**: Web framework for Node.js
- **Prisma**: ORM for Node.js and TypeScript
- **PostgreSQL**: Relational database

## Prerequisites

- Node.js (v14+)
- PostgreSQL
- Prisma CLI

## Setup

### 1. Clone the Repository

```sh
git clone https://github.com/your-repo/identity-reconciliation.git
cd identity-reconciliation
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/yourdatabase"
```

### 4. Initialize Prisma

Generate Prisma client and setup the database schema:

```sh
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the Server

```sh
npm run dev
```

The server will start on `http://localhost:3000`.

## Logic and Workflow

### Identify Existing Contacts:

- Query the database for contacts with the provided email and/or phone number.

### Determine Primary and Secondary Contacts:

- Identify the primary contact from the result set.
- Identify any secondary contacts linked to the primary contact.

### Create New Contacts if Necessary:

- If no primary contact exists, create a new primary contact.
- If only one primary contact exists and new information (email or phone number) is provided, create a new secondary contact and link it to the primary contact.

### Ensure Unique Collection:

- Use Set to collect unique emails and phone numbers, ensuring no duplicates.

### Prepare and Return Response:

- Return the consolidated contact information in the specified format.

## API Endpoint

### `/identify` - POST

This endpoint receives an email and/or phone number, consolidates the contact information, and returns the consolidated contact.

## Tests

### Test 1: Initial Request

- Request with new email and phone number. Expected result: creates a new primary contact.

### Test 2: Duplicate Request

- Request with existing phone number and new email. Expected result: links new email as secondary.

### Test 3: Phone Number Only

- Request with existing phone number only. Expected result: returns existing contact information.

### Test 4: Email Only

- Request with existing email only. Expected result: returns existing contact information.

### Test 5: New Email with Existing Phone

- Request with new email and existing phone number. Expected result: links new email as secondary and updates the contact information.

## Postman Collection

You can test the API endpoints using the Postman collection provided [here](https://www.postman.com/universal-shadow-350949/workspace/publiccollectionsworkspace/collection/18667919-d6203ff8-3894-4ece-a6e4-caa4d9bdc8b1?action=share&creator=18667919). (Replace `#` with the actual link.)

## Conclusion

All necessary steps to build and run this service have been performed. The logic ensures that contacts are consolidated correctly, preventing duplication and maintaining accurate linkage between primary and secondary contacts.

Feel free to reach out if you have any questions or need further assistance.
