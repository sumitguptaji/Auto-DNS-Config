import { NextResponse } from 'next/server';
import axios from 'axios';


export async function POST(req: Request) {
  const { apiKey, zoneId } = await req.json();

  if (!apiKey || !zoneId) {
    return NextResponse.json({ message: 'API key and Zone ID are required' }, { status: 400 });
  }

  const apiUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }
  };


  
  const dnsRecords = [
    {
        type: 'MX',
        name: '@', // Replace with your actual domain name
        content: 'ASPMX.L.GOOGLE.COM',
        priority: 1,
        ttl: 300,
        proxied: false
    },
    {
        type: 'MX',
        name: '@', // Replace with your actual domain name
        content: 'ALT1.ASPMX.L.GOOGLE.COM',
        priority: 5,
        ttl: 300,
        proxied: false
    },
    {
        type: 'MX',
        name: '@', // Replace with your actual domain name
        content: 'ALT2.ASPMX.L.GOOGLE.COM',
        priority: 5,
        ttl: 300,
        proxied: false
    },
    {
        type: 'MX',
        name: '@', // Replace with your actual domain name
        content: 'ALT3.ASPMX.L.GOOGLE.COM',
        priority: 10,
        ttl: 300,
        proxied: false
    },
    {
        type: 'MX',
        name: '@', // Replace with your actual domain name
        content: 'ALT4.ASPMX.L.GOOGLE.COM',
        priority: 10,
        ttl: 300,
        proxied: false
    },
    {
        type: 'TXT',
        name: '@', // Replace with your actual domain name
        content: 'v=spf1 include:_spf.google.com ~all',
        ttl: 300,
        proxied: false
    },
    {
        type: 'TXT',
        name: '_dmarc', // Replace with your actual domain name
        content: 'v=DMARC1; p=quarantine; sp=quarantine; adkim=s; aspf=s; rua=mailto:aggregate@seonss.com; ruf=mailto:dmarc@seonss.com; rf=afrf; pct=100; ri=86400',
        ttl: 300,
        proxied: false
    },
    {
        type: 'TXT',
        name: 'dkim._domainkey', // Replace with your actual domain name
        content: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAozgjXw08gN7I4FcrYCDaJW/TLhw8wlPXlrKaJdF1OeH9jos62g7x8ZSQj85tmFOGYKeqIbiLpwyKBe9tMY2KxftMBuPUFJlZbu93OujQBP6BzC7oBx3+cCHaP3WQ4gXtILGGbwT+MQl2k456F7JYnK2lQNgvPsN7QxPY+ONakcECbIszijxnK1efGIk7/eHDNZnF3eqIQXVvatFXB0aITZdADyZDmJXf1IGYso4XjhoQd7NbD2RhpcWJrIQJxcTDLU05GHchJb+HZ6YaFcT5ZP1V6IAhpnN4WrpJmq/wlff5gBFoGXWFE1RqxpSqLE4eEuxbBehJiILEGyn61qjxmQIDAQAB',
        ttl: 300,
        proxied: false
    },
    {
        type: 'TXT',
        name: 'fwd', // Replace with your actual domain name
        content: 'forward-domain=https://scalemyemail/email',
        ttl: 300,
        proxied: false
    },
        {
        type: 'TXT',
        name: '@', // Replace with your actual domain name
        content: '167.172.5.31',
        ttl: 300,
        proxied: false
    },
            {
        type: 'AAAA',
        name: '@', // Replace with your actual domain name
        content: '2400:6180:0:d0::e08:a001',
        ttl: 300,
        proxied: false
    },
    {
        type: 'CNAME',
        name: 'inst', // Replace with your actual domain name
        content: 'prox.itrackly.com',
        ttl: 300,
        proxied: false
    }
];


  try {
    for (let record of dnsRecords) {
      await axios.post(apiUrl, record, config);
      console.log(`DNS Record created successfully for ${record.name}`);
    }
    return NextResponse.json({ message: 'DNS records created successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error creating DNS records:', error);
    return NextResponse.json({ message: 'Error creating DNS records' }, { status: 500 });
  }
}
