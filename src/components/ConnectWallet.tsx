import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks
} from "@airgap/beacon-sdk";

type ButtonProps = {
  Tezos: TezosToolkit;
  setContract: Dispatch<SetStateAction<any>>;
  setTokenContract: Dispatch<SetStateAction<any>>;
  setWallet: Dispatch<SetStateAction<any>>;
  setUserAddress: Dispatch<SetStateAction<string>>;
  setUserBalance: Dispatch<SetStateAction<number>>;
  setStorage: Dispatch<SetStateAction<number>>;
  setTokenStorage: Dispatch<SetStateAction<any>>;
  contractAddress: string;
  tokenContractAddress: string;
  setBeaconConnection: Dispatch<SetStateAction<boolean>>;
  setPublicToken: Dispatch<SetStateAction<string | null>>;
  wallet: BeaconWallet;
};

const ConnectButton = ({
  Tezos,
  setContract,
  setTokenContract,
  setWallet,
  setUserAddress,
  setUserBalance,
  setStorage,
  setTokenStorage,
  contractAddress,
  tokenContractAddress,
  setBeaconConnection,
  setPublicToken,
  wallet
}: ButtonProps): JSX.Element => {
  const [loadingNano, setLoadingNano] = useState<boolean>(false);

  const setup = async (userAddress: string): Promise<void> => {
    setUserAddress(userAddress);
    // updates balance
    const balance = await Tezos.tz.getBalance(userAddress);
    setUserBalance(balance.toNumber());
    // creates contract instance
    // const contract = await Tezos.wallet.at(contractAddress);
    // const tokenContract = await Tezos.wallet.at(tokenContractAddress, tzip12);
    // const storageTemp: any = await contract.storage();
    // const tokenStorage : any = await tokenContract.storage();
    // const tokenCount:number = tokenStorage.all_tokens.c[0];
    // let tempMetadata:any = [];
    // for(let i=0;i<tokenCount;i++){
    //   tempMetadata[i]=(await tokenContract.tzip12().getTokenMetadata(i));
    // }
    // let storage:any = [];
    // type token ={
    //   decimal:number;
    //   description:string;
    //   name:string;
    //   image:string;
    //   token_id:string;
    //   symbol:string;
    //   sale?:boolean;
    //   amount?:number;
    //   owner?:string;
    // }
    // let tokenMetadata:Array<token> = [];
    // tempMetadata.forEach(function(element:any){
    //   tokenMetadata.push({decimal:element.decimal,description:element.description, name:element.name,image:element.image,token_id:element.token_id,symbol:element.symbol})
    // });

    // let x:number = 0;
    // storageTemp.saleMap.valueMap.forEach(function(element:any, key:number){
    //   // console.log(element);
    //   tokenMetadata[x].sale=element.sale;
    //   tokenMetadata[x].amount = element.amount.c[0] / 1000000;
    //   tokenMetadata[x].owner = element.owner;
    //   x++;
    // });

    // setContract(contract);
    // setTokenContract(tokenContract);
    // setStorage(storage);
    // setTokenStorage(tokenMetadata);
  };

  const connectWallet = async (): Promise<void> => {
    try {
      await wallet.requestPermissions({
        network: {
          type: NetworkType.GRANADANET,
          rpcUrl: "https://granadanet.smartpy.io/"
        }
      });
      // gets user's address
      const userAddress = await wallet.getPKH();
      await setup(userAddress);
      setBeaconConnection(true);
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    (async () => {
      // creates a wallet instance
      const wallet = new BeaconWallet({
        name: "Tez Bytes",
        preferredNetwork: NetworkType.GRANADANET,
        disableDefaultEvents: true, // Disable all events / UI. This also disables the pairing alert.
        eventHandlers: {
          // To keep the pairing alert, we have to add the following default event handlers back
          [BeaconEvent.PAIR_INIT]: {
            handler: defaultEventCallbacks.PAIR_INIT
          },
          [BeaconEvent.PAIR_SUCCESS]: {
            handler: data => setPublicToken(data.publicKey)
          }
        }
      });
      Tezos.setWalletProvider(wallet);
      setWallet(wallet);
      // checks if wallet was connected before
      const activeAccount = await wallet.client.getActiveAccount();
      if (activeAccount) {
        const userAddress = await wallet.getPKH();
        await setup(userAddress);
        setBeaconConnection(true);
      }
    })();
  }, []);

  return (

    <div className="item right aligned">
      <button className="ui basic button" onClick={() => connectWallet()}>
        Connect Wallet
      </button>
    </div>

    // <div className="buttons">
    //   <button className="button" onClick={connectWallet}>
    //     <span>
    //       <i className="fas fa-wallet"></i>&nbsp; Connect with wallet
    //     </span>
    //   </button>
    //   <button className="button" disabled={loadingNano} onClick={connectNano}>
    //     {loadingNano ? (
    //       <span>
    //         <i className="fas fa-spinner fa-spin"></i>&nbsp; Loading, please
    //         wait
    //       </span>
    //     ) : (
    //       <span>
    //         <i className="fab fa-usb"></i>&nbsp; Connect with Ledger Nano
    //       </span>
    //     )}
    //   </button>
    // </div>
  );
};

export default ConnectButton;
