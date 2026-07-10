import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  telegramLink: string;
  youtubeLink: string;
  xLink: string;
  instagramLink: string;
  telegramStats: string;
  youtubeStats: string;
  xStats: string;
  instagramStats: string;
  marqueeBrands: string;
}

const SettingsSchema: Schema = new Schema(
  {
    telegramLink: { type: String, default: '#' },
    youtubeLink: { type: String, default: '#' },
    xLink: { type: String, default: '#' },
    instagramLink: { type: String, default: '#' },
    telegramStats: { type: String, default: '15K' },
    youtubeStats: { type: String, default: '128K' },
    xStats: { type: String, default: '42K' },
    instagramStats: { type: String, default: '86K' },
    marqueeBrands: { type: String, default: 'Binance, TradingView, MetaTrader 5, Bybit, OKX, Coinbase, Bitget' },
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);
