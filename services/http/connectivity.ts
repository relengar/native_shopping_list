import NetInfo, {NetInfoSubscription} from '@react-native-community/netinfo';

class Connectivity {
  #isConnected: boolean;
  #subscription: NetInfoSubscription;
  constructor() {
    this.#isConnected = false;
    this.#subscription = NetInfo.addEventListener(state => {
      this.#isConnected = !!state.isConnected;
    });
  }

  get connected(): boolean {
    return this.#isConnected;
  }
}

export default new Connectivity();
