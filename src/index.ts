import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv"
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.post('/api/identify', async (req, res) => {
    const { email, phoneNumber } = req.body;

    // Query to find contacts by email or phone number
    const contacts = await prisma.contact.findMany({
        where: {
            OR: [
                { email },
                { phoneNumber }
            ]
        }
    });

    let primaryContact = contacts.find(contact => contact.linkPrecedence === 'primary');
    const secondaryContacts = contacts.filter(contact => contact.linkPrecedence === 'secondary');

    if (!primaryContact) {
        // Create a new primary contact if none exists
        primaryContact = await prisma.contact.create({
            data: {
                email,
                phoneNumber,
                linkPrecedence: 'primary'
            }
        });
    } else if (contacts.length === 1 && (email !== primaryContact.email || phoneNumber !== primaryContact.phoneNumber)) {
        // Create a secondary contact if there's only one primary and new information is provided
        const secondaryContact = await prisma.contact.create({
            data: {
                email,
                phoneNumber,
                linkedId: primaryContact.id,
                linkPrecedence: 'secondary'
            }
        });
        secondaryContacts.push(secondaryContact);
    }

    // Use Set to ensure unique emails and phone numbers
    const emails = new Set([primaryContact.email, ...secondaryContacts.map(contact => contact.email)].filter(Boolean));
    const phoneNumbers = new Set([primaryContact.phoneNumber, ...secondaryContacts.map(contact => contact.phoneNumber)].filter(Boolean));

    // Prepare the response
    const response = {
        contact: {
            primaryContactId: primaryContact.id,
            emails: Array.from(emails),
            phoneNumbers: Array.from(phoneNumbers),
            secondaryContactIds: secondaryContacts.map(contact => contact.id)
        }
    };

    res.json(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
