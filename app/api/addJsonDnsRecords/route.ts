import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  const { apiKey, zoneId , dnsRecords } = await req.json();

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
