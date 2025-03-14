import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { QueryClient, injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BackendApiService } from '../../services/backend-api.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrl: './tokens.component.css',
  imports: [InfiniteScrollDirective],
})
export default class TokensComponent {
  readonly #tokensService = inject(BackendApiService);

  readonly tokensQuery = injectQuery(() => ({
    queryKey: ['tokens'],
    queryFn: () => lastValueFrom(this.#tokensService.getKRC20Tokens$()),
  }))

  readonly queryClient = inject(QueryClient);

  private formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  private numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 });

  formatCurrency(value: number): string {
    return this.formatter.format(value ?? 0);
  }

  formatNumber(value: number): string {
    return this.numberFormatter.format(value ?? 0);
  }

  formatPercent(minted: number = 0, supply: number = 1): string {
    return this.numberFormatter.format((minted / supply * 100)) + '%';
  }

  formatTimeAgo(date: number): string {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      const diffInHours = Math.floor((now.getTime() - date) / (1000 * 60 * 60));
      if (diffInHours === 0) return 'now';
      if (diffInHours === 1) return '1 hour ago';
      return `${diffInHours} hours ago`;
    }
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  }
}
