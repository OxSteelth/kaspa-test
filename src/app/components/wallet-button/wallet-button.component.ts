import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-wallet-button',
  templateUrl: './wallet-button.component.html',
  styleUrl: './wallet-button.component.css',
})
export default class WalletButtonComponent {
    public kaswareInstalled = false;
    public connected = false;
    private accounts: string[] = [];
    private publicKey = '';
    private address = '';
    public balance = {
        confirmed: 0,
        unconfirmed: 0,
        total: 0,
    };
    private network = 'kaspa_testnet_10';

    private numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 });

    constructor(private readonly cdr: ChangeDetectorRef) {
        this.checkKasware().then();
    }

    formatNumber(value: number): string {
        return this.numberFormatter.format(value ?? 0);
    }

    async connect() {
        const kasware = (window as any).kasware;
        const result = await kasware.requestAccounts();
        this.handleAccountsChanged(result);
        this.cdr.detectChanges();
    }

    async disconnect() {
        const origin = window.location.origin;
        const kasware = (window as any).kasware;
        await kasware.disconnect(origin);
        this.handleAccountsChanged([]);
        this.cdr.detectChanges();
    }

    async getBasicInfo() {
        const kasware = (window as any).kasware;
        const [address] = await kasware.getAccounts();
        this.address = address;

        const publicKey = await kasware.getPublicKey();
        this.publicKey = publicKey;

        const balance = await kasware.getBalance();
        this.balance = balance;
        console.log("balance", balance);
        const krc20Balances = await kasware.getKRC20Balance();
        console.log("krc20Balances", krc20Balances);

        const network = await kasware.getNetwork();
        this.network = network;
    }

    handleAccountsChanged(_accounts: string[]) {
        this.accounts = _accounts;
        if (_accounts.length > 0) {
          this.accounts = _accounts;
          this.connected = true;

          this.address = _accounts[0];
          this.getBasicInfo();
        } else {
          this.connected = false;
        }
    }

    handleNetworkChanged(network: string) {
        console.log("network", network);
        this.network = network;
        this.getBasicInfo();
    }

    async checkKasware() {
        let kasware = (window as any).kasware;

        for (let i = 1; i < 10 && !kasware; i += 1) {
            await new Promise((resolve) => setTimeout(resolve, 100 * i));
            kasware = (window as any).kasware;
        }

        if (kasware) {
            this.kaswareInstalled = true;
        } else if (!kasware) return;

        kasware.getAccounts().then((accounts: string[]) => {
            this.handleAccountsChanged(accounts);
        });

        kasware.on("accountsChanged", (accounts: string[]) => {
            this.handleAccountsChanged(accounts);
        });
        kasware.on("networkChanged", (network: string) => {
            this.handleNetworkChanged(network);
        });
    }
}

enum TxType {
    SIGN_TX,
    SEND_KASPA,
    SIGN_KRC20_DEPLOY,
    SIGN_KRC20_MINT,
    SIGN_KRC20_TRANSFER,
}

interface BatchTransferRes {
    index?: number;
    tick?: string;
    to?: string;
    amount?: number;
    status:
      | "success"
      | "failed"
      | "preparing 20%"
      | "preparing 40%"
      | "preparing 60%"
      | "preparing 80%"
      | "preparing 100%";
  
    errorMsg?: string;
    txId?: { commitId: string; revealId: string };
}
