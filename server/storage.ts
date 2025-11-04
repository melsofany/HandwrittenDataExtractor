import { type ExtractedRecord } from "@shared/schema";

export interface IStorage {
  saveExtractedRecords(records: ExtractedRecord[]): Promise<void>;
  getAllRecords(): Promise<ExtractedRecord[]>;
  clearRecords(): Promise<void>;
}

export class MemStorage implements IStorage {
  private records: Map<string, ExtractedRecord>;

  constructor() {
    this.records = new Map();
  }

  async saveExtractedRecords(records: ExtractedRecord[]): Promise<void> {
    records.forEach(record => {
      this.records.set(record.id, record);
    });
  }

  async getAllRecords(): Promise<ExtractedRecord[]> {
    return Array.from(this.records.values());
  }

  async clearRecords(): Promise<void> {
    this.records.clear();
  }
}

export const storage = new MemStorage();
