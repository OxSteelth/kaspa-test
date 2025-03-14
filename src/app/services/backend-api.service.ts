import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
export interface KRC20Token {
  _id: string;
  ticker: string;
  creationDate: number;
  totalSupply: number;
  totalMinted: number;
  totalMints: number;
  totalMintedPercent: number;
  totalHolders: number;
  preMintedSupply: number;
  state: string;
  marketCap: number;
  volumeUsd?: number;
  volumeKas?: number;
  price: number;
  rank: number;
  mintLimit: number;
  metadata: {
    logo: string | null;
  };
  logoUrl: string | null;
  history: {
    total_holders: number;
    total_mints: number;
    price?: number;
    market_cap?: number;
    volume_usd?: number;
    timeInterval: string;
  };
  changeTotalMints: number;
  changeTotalHolders: number;
  changeMarketCap: number | null;
  changeVolumeUsd: number | null;
  changePrice: number | null;
}
 
@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  private readonly API_URL = '/api';
  readonly #http = inject(HttpClient);
 
  constructor() {}
 
  /**
   * Fetch KRC20 tokens with pagination support
   * @param limit Maximum number of tokens to return
   * @param skip Number of items to skip for pagination
   * @param timeInterval Time interval for the data
   * @returns Observable with KRC20Token array
   */
  getKRC20Tokens$(limit: number = 30, skip: number = 0, timeInterval: string = '1d'): Observable<KRC20Token[]> {
    const url = `${this.API_URL}/krc20?skip=${skip}&limit=${limit}&timeInterval=${timeInterval}`;
    return this.#http.get<KRC20Token[]>(url);
  }
}
