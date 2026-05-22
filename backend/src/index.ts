import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { BusinessCaseResponse } from './types';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data endpoint
app.get('/api/hello', (req, res) => {
  try {
    const dataPath = path.join(process.cwd(), '../data/data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const jsonData: BusinessCaseResponse = JSON.parse(rawData);

    const dataRows = jsonData.data.slice(0, 10).map((item: any) => ({
      id: item.id,
      name: item.name,
      code: item.code,
      type: item._entityName
    }));

    res.json({
      message: 'Hello World from Raynet API!',
      timestamp: new Date().toISOString(),
      status: 'ok',
      dataRows
    });
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({
      message: 'Error reading data',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/persons', (req, res) => {
  try {
    const dataPath = path.join(process.cwd(), '../data/data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const jsonData: BusinessCaseResponse = JSON.parse(rawData);

    const persons = jsonData.data
      .filter((item: any) => item.person !== null)
      .map((item: any) => ({
        id: item.person.id,
        firstName: item.person.firstName,
        lastName: item.person.lastName,
        fullName: item.person.fullName,
        email: item.person['contactInfo.email'],
        phone: item.person['contactInfo.tel1'],
        gender: item.person.gender,
      }));

    res.json({
      totalCount: persons.length,
      data: persons
    });
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({
      message: 'Error reading data',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});


// GET /api/persons/stats/monthly?month=2026-06
app.get('/api/persons/stats/monthly', (req, res) => {
  try {
    const { month } = req.query;

    if (!month || typeof month !== 'string' || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        message: 'Zadej parametr month ve formátu YYYY-MM, např. ?month=2026-06',
      });
    }

    const dataPath = path.join(process.cwd(), '../data/data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const jsonData: BusinessCaseResponse = JSON.parse(rawData);

    const statsMap: Record<number, any> = {};

    for (const item of jsonData.data) {
      const owner = (item as any).owner;
      if (!owner) continue;

      const itemMonth = ((item as any).validFrom ?? '').slice(0, 7);
      if (itemMonth !== month) continue;

      const id = owner.id;
      if (!statsMap[id]) {
        statsMap[id] = {
          id,
          fullName: owner.fullName,
          email: owner['contactInfo.email'] ?? null,
          photo: owner.photo ? {
            fileName: owner.photo.fileName,
            uuid: owner.photo.uuid,
            iconSmallUuid: owner.photo.iconSmallUuid,
            iconMediumUuid: owner.photo.iconMediumUuid,
            contentType: owner.photo.contentType,
          } : null,
          totalDeals: 0,
          wonDeals: 0,
          lostDeals: 0,
          activeDeals: 0,
          totalAmountCZK: 0,
          wonAmountCZK: 0,
          totalProfit: 0,
        };
      }

      const stat = statsMap[id];
      stat.totalDeals++;
      stat.totalAmountCZK += (item as any).totalAmountInDefaultCurrency ?? 0;
      stat.totalProfit += (item as any).tradingProfit ?? 0;

      const status = (item as any).status;
      if (status === 'E_WIN') {
        stat.wonDeals++;
        stat.wonAmountCZK += (item as any).totalAmountInDefaultCurrency ?? 0;
      } else if (status === 'F_LOST') {
        stat.lostDeals++;
      } else {
        stat.activeDeals++;
      }
    }

    const result = Object.values(statsMap).sort(
      (a, b) => b.wonAmountCZK - a.wonAmountCZK
    );

    res.json({ month, totalOwners: result.length, data: result });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: String(error) });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server běží na http://localhost:${PORT}`);
  console.log(`📋 API dostupné na http://localhost:${PORT}/api/hello`);
});

export default app;
